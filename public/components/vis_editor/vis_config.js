import React from 'react';
import timeseries from './vis_config/timeseries';
import metric from './vis_config/metric';

const types = {
  timeseries,
  metric
};

export default React.createClass({
  render() {
    const { model } = this.props;
    const component = types[model.type];
    if (component) {
      return React.createElement(component, this.props);
    }
    return (<div>Missing Vis Config for {model.type}</div>);
  }
});
