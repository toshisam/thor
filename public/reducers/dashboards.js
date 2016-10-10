import _ from 'lodash';
import {
  DASHBOARDS_ERROR,
  DASHBOARDS_RESPONSE,
  DASHBOARDS_REQUEST
} from '../actions/dashboards';
export default (state = {}, action) => {
  switch (action.type) {
    case DASHBOARDS_REQUEST:
      return _.assign({}, state, {
        request: { isFetching: true }
      });
    case DASHBOARDS_RESPONSE:
      return _.assign({}, state, {
        request: { isFetching: false },
        data: action.json
      });
    case DASHBOARDS_ERROR:
      return _.assign({}, state, {
        request: { isFetching: false },
        error: action.error
      });
    default:
      return state;
  }
  return state;
};
