import React from 'react';
import _ from 'lodash';

import timeseries from './vis/timeseries';
import metric from './vis/metric';
import Error from './vis/error';

const types = {
  timeseries,
  metric
};

export default React.createClass({

  getDefaultProps() {
    return { className: 'thor__visualization' };
  },

  render() {
    const { visData, model } = this.props;

    // Show the error panel
    const error = _.get(visData, `${model.id}.error`);
    if (error) {
      return (
        <div className={this.props.className}>
          <Error error={error}/>
        </div>
      );
    }

    const component = types[model.type];
    if (component) {
      return React.createElement(component, this.props);
    }
    return (<div className={this.props.className}></div>);
  }
});
