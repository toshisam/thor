import _ from 'lodash';
import {
  FIELDS_RESPONSE,
  FIELDS_REQUEST,
  FIELDS_ERROR,
} from '../actions/fields';
export default (state = {}, action) => {
  switch (action.type) {
    case FIELDS_REQUEST:
      return _.assign({}, state, {
        request: {
          isFetching: true
        }
      });
    case FIELDS_RESPONSE:
      return _.assign({}, state, {
        request: {
          isFetching: false,
        },
        data: action.json
      });
    case FIELDS_ERROR:
      return _.assign({}, state, {
        request: {
          isFetching: false,
        },
        error: action.error
      });
    default:
      return state;
  }
};


