import numeral from 'numeral';
import _ from 'lodash';

const formatLookup = {
  'bytes': '0.0b',
  'number': '0,0.[00]',
  'percent': '0.[00]%'
};

export default (format = '0,0.[00]') => {
  return (val) => {
    const formatString = formatLookup[format] || format;
    if (!_.isNumber(val)) return '0';
    try {
      return numeral(val).format(formatString);
    } catch (e) {
      return val;
    }
  };
};


