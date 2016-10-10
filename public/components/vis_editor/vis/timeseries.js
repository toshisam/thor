import tickFormatter from '../../../lib/tick_formatter';
import _ from 'lodash';
import { Timeseries } from '@elastic/rhythm-visualizations';
import React from 'react';
import color from 'color';

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
    const { backgroundColor, model, visData } = this.props;
    const series = _.get(visData, `${model.id}.series`, []);
    const formatter = tickFormatter(model.axis_formatter, model.axis_value_template);

    const mainAxis = {
      position: model.axis_position,
      tickFormatter: formatter,
      axis_formatter: model.axis_formatter,
    };

    if (model.axis_min) mainAxis.min = model.axis_min;
    if (model.axis_max) mainAxis.max = model.axis_max;

    let yaxes = [mainAxis];

    let axisCount = 1;
    if (model.series.length > 1 && model.series.some(hasSeperateAxis)) {
      model.series.forEach((row) => {
        if (row.seperate_axis) {
          axisCount++;

          const formatter = tickFormatter(row.axis_formatter, row.axis_value_template);

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
    const style = { };
    const panelBackgroundColor = model.background_color || backgroundColor;
    if (panelBackgroundColor) {
      style.backgroundColor = panelBackgroundColor;
      props.reversed = color(panelBackgroundColor).luminosity() < 0.45;
    }
    let header;
    if (model.title) {
      let className = 'dashboard__visualization-title';
      if (props.reversed) className += ' reversed';
      header = (
        <div className={className}>
          {model.title}
        </div>
      );
    }
    return (
      <div className="dashboard__visualization" style={style}>
        {header}
        <Timeseries {...props}/>
      </div>
    );
  }
});
