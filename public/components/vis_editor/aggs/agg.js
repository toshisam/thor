import React from 'react';
import StdAgg from './std_agg';
import aggToComponent from '../lib/agg_to_component';
export default React.createClass({
  render() {
    const { model } = this.props;
    const component = aggToComponent[model.type];
    if (component) {
      return React.createElement(component, {
        ...this.props
      });
    }
    return (<StdAgg {...this.props}/>);
  }
});
