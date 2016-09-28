import _ from 'lodash';
import extendStatsTypes from './extended_stats_types';
export default (row, metric) => {
  // Extended Stats
  if (_.includes(extendStatsTypes, metric.type)) {
    const isStdDeviation = /^std_deviation/.test(metric.type);
    const modeIsBounds = ~['upper','lower'].indexOf(metric.mode);
    if (isStdDeviation && modeIsBounds) {
      return _.get(row, `${metric.id}.std_deviation_bounds.${metric.mode}`);
    }
    return _.get(row, `${metric.id}.${metric.type}`);
  }

  // Percentiles
  if (metric.type === 'percentile') {
    let percentileKey = `${metric.percent}`;
    if (!/\./.test(`${metric.percent}`)) {
      percentileKey = `${metric.percent}.0`;
    }
    return row[metric.id].values[percentileKey];
  }

  // Derivatives
  const normalizedValue = _.get(row, `${metric.id}.normalized_value`, 0);

  // Everything else
  const value = _.get(row, `${metric.id}.value`, 0);
  return normalizedValue || value;

};
