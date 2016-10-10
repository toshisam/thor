import _ from 'lodash';
import calculateAuto from '@elastic/thor-visualizations/dist/calculate_auto';
import bucketTransform from './bucket_transform';
import moment from 'moment';
import calculateLabel from '../../public/components/vis_editor/lib/calculate_label';
import extendStatsTypes from './extended_stats_types';
import getAggValue from './get_agg_value';
import getSiblingAggValue from './get_sibling_agg_value';
import Color from 'color';
import unitToSeconds from './unit_to_seconds';

function onlySiblingBuckets(row) {
  return /_bucket$/.test(row.type);
}

function withoutSiblingBuckets(row) {
  return !/_bucket$/.test(row.type);
}


export default (req) => {
  const { server } = req;
  const { callWithRequest } = server.plugins.elasticsearch;
  const config = server.config();

  return (panel) => {
    const { index_pattern, time_field, interval } = panel;
    const from = moment.utc(req.payload.timerange.min);
    const to = moment.utc(req.payload.timerange.max);
    let duration = moment.duration(to.valueOf() - from.valueOf(), 'ms');
    let bucketSize = calculateAuto.near(100, duration).asSeconds();
    let intervalString = `${bucketSize}s`;

    const matches = interval && interval.match(/^([\d]+)([smdwMy]|ms)$/);
    if (matches) {
      bucketSize = Number(matches[1]) * unitToSeconds(matches[2]);
      intervalString = interval;
    }

    const params = {
      index: index_pattern,
      ignore: [404],
      ignoreUnavailable: true,
      body: {
        size: 0,
        query: {
          bool: {
            must: [],
            should: [],
            must_not: []
          }
        },
        aggs: {}
      }
    };

    const timerange = { range: {} };
    timerange.range[time_field] = {
      gte: from.valueOf(),
      lte: to.valueOf() - (bucketSize * 1000),
      format: 'epoch_millis',
    };
    params.body.query.bool.must.push(timerange);

    if (panel.include_query) {
      params.body.query.bool.must.push({
        query_string: {
          query: panel.include_query,
          analyze_wildcard: true
        }
      });
    }

    if (panel.exclude_query) {
      params.body.query.bool.must_not.push({
        query_string: {
          query: panel.exclude_query,
          analyze_wildcard: true
        }
      });
    }

    const aggs = params.body.aggs;

    panel.series.forEach(series => {
      aggs[series.id] = {};
      const seriesAgg = aggs[series.id];

      if (series.split_mode === 'filter' && series.filter) {
        seriesAgg.filter = {
          query_string: {
            query: series.filter,
            analyze_wildcard: true
          }
        };
      } else if (series.split_mode === 'terms' && series.terms_field && series.terms_order_by) {
        const metric = series.metrics.find(item => item.id === series.terms_order_by);
        if (metric) {
          seriesAgg.terms = {
            field: series.terms_field,
            size: parseInt(series.terms_size, 10) || 10,
          };
          if (metric.type !== 'count') {
            const sortAggKey = `${series.terms_order_by}-SORT`;
            const fn = bucketTransform[metric.type];
            seriesAgg.terms.order = {};
            seriesAgg.terms.order[`${sortAggKey} > SORT`] = 'desc';
            seriesAgg.aggs = {};
            seriesAgg.aggs[sortAggKey] = {
              filter: { range: {} },
              aggs: { SORT: fn(metric) }
            };
            seriesAgg.aggs[sortAggKey].filter.range[time_field] = {
              gte: from.valueOf() - (bucketSize * 2000),
              lte: to.valueOf() - (bucketSize * 1000),
              format: 'epoch_millis',
            };
          }
        } else {
          seriesAgg.filter = { match_all: {} };
        }
      } else {
        seriesAgg.filter = { match_all: {} };
      }

      let metricAggs;
      let siblingAggs;
      // if (panel.type === 'timeseries') {
      if (panel.type) {
        seriesAgg.aggs = _.assign({}, seriesAgg.aggs || {}, {
          timeseries: {
            date_histogram: {
              field: time_field,
              interval: intervalString,
              min_doc_count: 0,
              extended_bounds: {
                min: from.valueOf(),
                max: to.valueOf() - (bucketSize * 1000)
              }
            },
            aggs: {}
          }
        });

        siblingAggs = seriesAgg.aggs;
        metricAggs = seriesAgg.aggs.timeseries.aggs;

      }

      series.metrics
        .filter(withoutSiblingBuckets)
        .forEach(metric => {
          const fn = bucketTransform[metric.type];
          if (fn) {
            try {
              metricAggs[metric.id] = fn(metric, series.metrics, intervalString);
            } catch (e) {
              console.log(`Couldn't find transformer for ${metric.type}`);
              console.log(e.stack);
              // meh
            }
          }
        });

      series.metrics
        .filter(onlySiblingBuckets)
        .forEach(metric => {
          const fn = bucketTransform[metric.type];
          if (fn) {
            try {
              siblingAggs[metric.id] = fn(metric, series.metrics, bucketSize);
            } catch (e) {
              console.log(`Couldn't find tranformer for ${metric.type}`);
              console.log(e.stack);
              // meh
            }
          }
        });

    });

    return callWithRequest(req, 'search', params)
    .then(resp => {
      const aggs = _.get(resp, 'aggregations');
      const result = {};
      result[panel.id] = { series: [] };


      panel.series.forEach((series, index) => {
        // if (panel.type === 'timeseries') {
        if (panel.type) {
          const metric = _.last(series.metrics);
          const mapBucket = metric => bucket => [ bucket.key, getAggValue(bucket, metric)];

          const pointSize = series.point_size != null ? Number(series.point_size) : Number(series.line_width);
          const decoration = {
            stack: Boolean(series.stacked),
            lines: {
              show: series.chart_type === 'line' && series.line_width !== 0,
              fill: Number(series.fill),
              lineWidth: Number(series.line_width)
            },
            points: {
              show: series.chart_type === 'line' && pointSize !== 0,
              radius: 1,
              lineWidth: pointSize
            },
            bars: {
              show: series.chart_type === 'bar',
              fill: Number(series.fill),
              lineWidth: Number(series.line_width)
            }
          };


          // Handle buckets with a terms agg
          if (_.has(aggs, `${series.id}.buckets`)) {
            const terms = _.get(aggs, `${series.id}.buckets`);
            const color = new Color(series.color);
            terms.forEach(term => {
              if (metric.type === 'std_deviation' && metric.mode === 'band') {
                const upper = term.timeseries.buckets.map(mapBucket(_.assign({}, metric, { mode: 'upper'})));
                const lower = term.timeseries.buckets.map(mapBucket(_.assign({}, metric, { mode: 'lower'})));
                result[panel.id].series.push({
                  id: `${series.id}:${term.key}:upper`,
                  label: term.key,
                  color: color.hexString(),
                  lines: { show: true, fill: 0.5, lineWidth: 0 },
                  points: { show: false },
                  fillBetween: `${series.id}:${term.key}:lower`,
                  data: upper
                });
                result[panel.id].series.push({
                  id: `${series.id}:${term.key}:lower`,
                  color: color.hexString(),
                  lines: { show: true, fill: false, lineWidth: 0 },
                  points: { show: false },
                  data: lower
                });
              } else if (metric.type === 'percentile') {
                metric.percentiles.forEach(percentile => {
                  const deco = {};
                  const label = (term.key) + ` (${percentile.value})`;
                  const data = term.timeseries.buckets.map(bucket => {
                    const m = _.assign({}, metric, { percent: percentile.value });
                    return [bucket.key, getAggValue(bucket, m)];
                  });
                  if (percentile.mode === 'band') {
                    const fillData = term.timeseries.buckets.map(bucket => {
                      const m = _.assign({}, metric, { percent: percentile.percentile});
                      return [bucket.key, getAggValue(bucket, m)];
                    });
                    result[panel.id].series.push({
                      id: `${percentile.id}:${term.key}`,
                      color: color.hexString(),
                      label,
                      data,
                      lines: { show: true, fill: percentile.shade, lineWidth: 0 },
                      points: { show: false },
                      legend: false,
                      fillBetween: `${percentile.id}:${term.key}:${percentile.percentile}`
                    });
                    result[panel.id].series.push({
                      id: `${percentile.id}:${term.key}:${percentile.percentile}`,
                      color: color.hexString(),
                      label,
                      data: fillData,
                      lines: { show: true, fill: false, lineWidth: 0 },
                      legend: false,
                      points: { show: false }
                    });
                  } else {
                    result[panel.id].series.push({
                      id: `${percentile.id}:${term.key}`,
                      color: color.hexString(),
                      label,
                      data,
                      ...decoration
                    });
                  }
                });
              } else {
                const data = term.timeseries.buckets.map(mapBucket(metric));
                result[panel.id].series.push({
                  id: `${series.id}:${term.key}`,
                  label: term.key,
                  color: color.hexString(),
                  data,
                  ...decoration
                });
              }
              color.darken(0.1);
            });

          //handle without group buckets
          } else {
            const buckets = _.get(aggs, `${series.id}.timeseries.buckets`);
            if (/_bucket$/.test(metric.type)) {
              if (metric.type === 'std_deviation_bucket' && metric.mode === 'band') {
                function mapBucketByMode(mode) {
                  return bucket => {
                    const sibBucket = _.get(aggs, `${series.id}`);
                    return [bucket.key, getSiblingAggValue(sibBucket, _.assign({}, metric, { mode }))];
                  };
                }
                const upperData = buckets.map(mapBucketByMode('upper'));
                const lowerData = buckets.map(mapBucketByMode('lower'));
                result[panel.id].series.push({
                  id: `${series.id}:lower`,
                  lines: { show: true, fill: false, lineWidth: 0 },
                  points: { show: false },
                  color: series.color,
                  data: lowerData
                });
                result[panel.id].series.push({
                  id: `${series.id}:upper`,
                  label: series.label || calculateLabel(metric, series.metrics),
                  color: series.color,
                  lines: { show: true, fill: 0.5, lineWidth: 0 },
                  points: { show: false },
                  fillBetween: `${series.id}:lower`,
                  data: upperData
                });
              } else {
                const data = buckets.map(bucket => {
                  const sibBucket = _.get(aggs, `${series.id}`);
                  return [bucket.key, getSiblingAggValue(sibBucket, metric)];
                });
                result[panel.id].series.push({
                  id: series.id,
                  label: series.label || calculateLabel(metric, series.metrics),
                  color: series.color,
                  data,
                  ...decoration
                });
              }
            } else if (metric.type === 'std_deviation' && metric.mode === 'band') {
              const upper = buckets.map(mapBucket(_.assign({}, metric, { mode: 'upper'})));
              const lower = buckets.map(mapBucket(_.assign({}, metric, { mode: 'lower'})));
              result[panel.id].series.push({
                id: `${series.id}:upper`,
                label: series.label || calculateLabel(metric, series.metrics),
                color: series.color,
                lines: { show: true, fill: 0.5, lineWidth: 0 },
                points: { show: false },
                fillBetween: `${series.id}:lower`,
                data: upper
              });
              result[panel.id].series.push({
                id: `${series.id}:lower`,
                color: series.color,
                lines: { show: true, fill: false, lineWidth: 0 },
                points: { show: false },
                data: lower
              });
            } else if (metric.type === 'percentile') {
              metric.percentiles.forEach(percentile => {
                const deco = {};
                const label = (series.label || calculateLabel(metric, series.metrics)) + ` (${percentile.value})`;
                const data = buckets.map(bucket => {
                  const m = _.assign({}, metric, { percent: percentile.value });
                  return [bucket.key, getAggValue(bucket, m)];
                });
                if (percentile.mode === 'band') {
                  const fillData = buckets.map(bucket => {
                    const m = _.assign({}, metric, { percent: percentile.percentile});
                    return [bucket.key, getAggValue(bucket, m)];
                  });
                  result[panel.id].series.push({
                    id: percentile.id,
                    color: series.color,
                    data,
                    label,
                    legend: false,
                    lines: { show: true, fill: percentile.shade, lineWidth: 0 },
                    points: { show: false },
                    fillBetween: `${percentile.id}:${percentile.percentile}`
                  });
                  result[panel.id].series.push({
                    id: `${percentile.id}:${percentile.percentile}`,
                    color: series.color,
                    label,
                    legend: false,
                    data: fillData,
                    lines: { show: true, fill: false, lineWidth: 0 },
                    points: { show: false }
                  });
                } else {
                  result[panel.id].series.push({
                    id: percentile.id,
                    color: series.color,
                    label,
                    data,
                    ...decoration
                  });
                }
              });
            } else {
              const data = buckets.map(mapBucket(metric));
              result[panel.id].series.push({
                id: series.id,
                label: series.label || calculateLabel(metric, series.metrics),
                color: series.color,
                data,
                ...decoration
              });
            }
          }
        }
      });

      return result;
    }).catch(e => {
      const result = {};
      let errorResponse;
      try {
        errorResponse = JSON.parse(e.response);
      } catch (error) {
        errorResponse = e.response;
      }
      result[panel.id] = {
        id: panel.id,
        statusCode: e.statusCode,
        error: errorResponse,
        series: []
      };
      return result;
    });
  };
};

