import React from 'react';
import _ from 'lodash';
import Select from 'react-select';
import calculateSiblings from '../lib/calculate_siblings';
import calculateLabel from '../lib/calculate_label';

function createTypeFilter(restrict) {
  return (metric) => {
    switch (restrict) {
      case 'basic':
        return _.includes([
          'count',
          'avg',
          'max',
          'min',
          'sum'
        ], metric.type);
      default:
        return true;
    }
  };
}

export default React.createClass({

  getDefaultProps() {
    return {
      metric: {},
      restrict: 'none',
      style: {}
    };
  },

  render() {
    const {
      restrict,
      metric,
      onChange,
      value
    } = this.props;

    const metrics = this.props.metrics
      .filter(createTypeFilter(restrict));

    const options = calculateSiblings(metrics, metric)
      .filter(row => !/_bucket$/.test(row.type))
      .map(row => {
        const label = calculateLabel(row, metrics);
        return { value: row.id, label };
      });

    return (
      <Select
        placeholder="Select metric..."
        options={options}
        value={value}
        onChange={onChange}/>
    );
  }
});
