import tickFormatter from '../../../lib/tick_formatter';
import _ from 'lodash';
import { Timeseries } from '@elastic/rhythm-visualizations';
import React from 'react';

function hasSeperateAxis(row) {
  return row.seperate_axis;
}

const formatLookup = {
  'bytes': '0.0b',
  'number': '0,0.[00]',
  'percent': '0.[00]%'
};

export default React.createClass({
  render() {
    const { model, visData } = this.props;
    const series = _.get(visData, `${model.id}.series`, []);
    const formatter = tickFormatter(model.axis_formatter);

    const mainAxis = {
      position: model.axis_position,
      tickFormatter: formatter,
      axis_formatter: model.axis_formatter
    };

    if (model.axis_min) mainAxis.min = model.axis_min;
    if (model.axis_max) mainAxis.max = model.axis_max;

    let yaxes = [mainAxis];

    let axisCount = 1;
    if (model.series.length > 1 && model.series.some(hasSeperateAxis)) {
      model.series.forEach((row) => {
        if (row.seperate_axis) {
          axisCount++;

          const formatter = tickFormatter(row.axis_formatter);

          const yaxis = {
            alignTicksWithAxis: 1,
            position: row.axis_position,
            tickFormatter: formatter,
            axis_formatter: row.axis_formatter
          };

          if (row.axis_min != null) yaxis.min = row.axis_min;
          if (row.axis_max != null) yaxis.max = row.axis_max;

          yaxes.push(yaxis);

          // Adding formattter
          series.forEach(r => r.tickFormatter = formatter);

          // Assign axis to each series
          series
            .filter(r => _.startsWith(r.id, row.id))
            .forEach(r => r.yaxis = axisCount);
        }
      });
    }

    const props = {
      tickFormatter: formatter,
      series,
      yaxes,
      legend: Boolean(model.show_legend)
    };
    return (
      <Timeseries {...props}/>
    );
  }
});
