import _ from 'lodash';
import React from 'react';
import numeral from 'numeral';
import getLastValue from '../../lib/get_last_value';
function formatValue(format = '0.00%', value) {
  if (_.isFunction(format)) {
    return format(value);
  }
  return numeral(value).format(format);
}
const Metric = (props) => {
  const value = getLastValue(props.metrics);
  const titleFontSize = props.height * 0.3;
  const valueFontSize = props.height * 0.6;
  return (
    <div className="metricVis">
      <div
        style={{ fontSize: titleFontSize }}
        className="title">{ props.title }</div>
      <div
        style={{ fontSize: valueFontSize }}
        className="value">{ formatValue(props.format, value) }</div>
    </div>
  );
};

export default Metric;
