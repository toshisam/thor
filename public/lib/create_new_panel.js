import newSeriesFn from '../components/vis_editor/lib/new_series_fn';
import uuid from 'node-uuid';
export default () => {
  const id = uuid.v1();
  return {
    id,
    type: 'timeseries',
    series: [
      newSeriesFn()
    ],
    title: 'New Visualization',
    time_field: '@timestamp',
    index_pattern: '*',
    interval: 'auto',
    axis_position: 'left',
    axis_formatter: 'number',
    show_legend: 1
  };
};
