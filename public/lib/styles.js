import _ from 'lodash';
import colors from './colors';
export default {

  inputs(style = {}) {
    return _.assign({
      padding: '6px 10px',
      borderRadius: '4px',
      border: `1px solid ${colors.grayLight}`
    }, style);
  },

  formLabels(style = {}) {
    return _.assign({
      color: colors.gray,
      fontSize: '14px'
    }, style);
  },

  aggLabel(style = {}) {
    return _.assign({
      color: colors.gray,
      fontSize: '12px',
      marginBottom: '5px'
    }, style);
  },

  aggItem(style = {}) {
    return _.assign({
      flexGrow: 1,
      marginRight: '10px'
    }, style);
  },

  baseFullFlex(style = {}) {
    return _.assign({
      display: 'flex',
      flexDirection: 'column',
      flex: '1 0 auto'
    }, style);
  }

};
