import React from 'react';
import _ from 'lodash';

import timeseries from './vis/timeseries';
import Error from './vis/error';

const types = {
  timeseries
};

export default React.createClass({

  getDefaultProps() {
    return { className: 'vis_editor__visualization' };
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
      const vis = React.createElement(component, this.props);
      return (
        <div className={this.props.className}>
          {vis}
        </div>
      );
    }
    return (<div className={this.props.className}></div>);
  }
});
