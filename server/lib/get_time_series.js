const _ = require('lodash');
const moment = require('moment');
const calulateAuto = require('./calculate_auto');
const calculateIndices = require('./calculate_indices');
const bucketTransform = require('./bucket_transform');
module.exports = (req) => {
  const callWithRequest = req.server.plugins.elasticsearch.callWithRequest;
  const indexPattern = req.payload.indexPattern;
  const min = moment.utc(req.payload.timerange.min).valueOf();
  const max = moment.utc(req.payload.timerange.max).valueOf();
  const timefield = req.payload.timerange.field;
  const timezone = req.payload.timerange.timezone;
  const duration = moment.duration(max - min, 'ms');
  const metrics = req.payload.metrics;
  let bucketSize = calulateAuto.near(100, duration).asSeconds();
  if (bucketSize < 1) bucketSize = 1;


  return calculateIndices(req, indexPattern, timefield, min, max)
  .then((indices) => {

    const aggs = {};
    const rangeFilter = {};
    rangeFilter[timefield] = { gte: min, lte: max, format: 'epoch_millis' };
    const params = {
      index: indices,
      body: {
        aggs: aggs,
        query: { range: rangeFilter }
      }
    };

    metrics.forEach((metric) => {
      const buckets = {};
      aggs[metric.id] = {
        filter: { query_string: { query: metric.query, analyze_wildcard: true } },
        aggs: {
          series: {
            date_histogram: {
              field: timefield,
              interval: bucketSize + 's',
              min_doc_count: 0,
              time_zone: timezone,
              extended_bounds: {
                min: min,
                max: max
              }
            },
            aggs: buckets
          }
        }
      };
      metric.buckets.forEach((bucket) => {
        // if (_.contains(['count'], bucket.type)) return;
        const transform = bucketTransform[bucket.type];
        buckets[bucket.id] = transform(bucket);
      });
    });

    return callWithRequest(req, 'search', params).then((resp) => {
      var results = { bucketSize: bucketSize };
      metrics.forEach((metric) => {
        const buckets = {};
        results[metric.id] = buckets;
        metric.buckets.forEach((bucket) => {
          buckets[bucket.id] = [];
        });
        resp.aggregations[metric.id].series.buckets.forEach((row) => {
          const timestamp = row.key;
          metric.buckets.forEach((bucket) => {
            let value = null;
            if (row[bucket.id]) {
              value = row[bucket.id].normalize_value || row[bucket.id].value;
            }
            buckets[bucket.id].push([timestamp, value]);
          });
        });
      });
      return results;
    });
  });

};
