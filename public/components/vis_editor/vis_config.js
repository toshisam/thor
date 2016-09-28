import React from 'react';
import Timeseries from './vis_config/timeseries';

const types = {
  timeseries: Timeseries
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
