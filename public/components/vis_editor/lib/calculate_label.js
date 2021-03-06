import _ from 'lodash';
import lookup from './agg_lookup';
const paths = [
  'cumulative_sum',
  'derivative',
  'moving_average',
  'avg_bucket',
  'sum_bucket',
  'min_bucket',
  'max_bucket',
  'std_deviation_bucket',
  'variance_bucket',
  'sum_of_squares_bucket'
];
export default function calculateLabel(metric, metrics) {
  if (!metric) return 'Unknown';
  if (metric.alias) return metric.alias;

  if (metric.type === 'count') return 'Count';
  if (metric.type === 'calculation') return 'Calculation';

  if (~paths.indexOf(metric.type)) {
    const targetMetric = _.find(metrics, { id: metric.field });
    const targetLabel = calculateLabel(targetMetric, metrics);
    return `${lookup[metric.type]} of ${targetLabel}`;
  }

  return `${lookup[metric.type]} of ${metric.field}`;
};

