import numeral from 'numeral';
import _ from 'lodash';
import mustache from 'mustache';

const formatLookup = {
  'bytes': '0.0b',
  'number': '0,0.[00]',
  'percent': '0.[00]%'
};

export default (format = '0,0.[00]', template = '{{value}}') => {
  return (val) => {
    const formatString = formatLookup[format] || format;
    let value;
    if (!_.isNumber(val)) {
      value = 0;
    } else {
      try {
        value = numeral(val).format(formatString);
      } catch (e) {
        value = val;
      }
    }
    try {
      return mustache.render(template, { value });
    } catch (e) {
      return value;
    }
  };
};
