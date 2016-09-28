import _ from 'lodash';
import {
  VIS_DATA_ERROR,
  VIS_DATA_REQUEST,
  VIS_DATA_RESPONSE
} from '../actions/vis_data';

export default (state = {}, action) => {
  switch (action.type) {
    case VIS_DATA_RESPONSE:
      return _.assign({}, state, {
        panels: action.json,
        request: { isFetching: false }
      });
    case VIS_DATA_REQUEST:
      return _.assign({}, state, {
        request: { isFetching: true }
      });
    case VIS_DATA_ERROR:
      return _.assign({}, state, {
        request: { isFetching: false },
        error: action.error
      });
    default:
      return state;
  }
};

