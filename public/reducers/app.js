import {
  VIS_DATA_ERROR,
  VIS_DATA_REQUEST,
  VIS_DATA_RESPONSE
} from '../actions/vis_data';

import {
  SET_REFRESH,
  SET_TIMEFILTER,
  CHANGE_TIMERANGE,
} from '../actions/app';

import {
  GET_DASHBOARD_ERROR
} from '../actions/dashboard';

import rison from 'rison-node';
import { LOCATION_CHANGE } from 'react-router-redux';
import _ from 'lodash';
export default (state = {}, action) => {
  let shouldFetch = false;
  switch (action.type) {
    case SET_TIMEFILTER:
      return _.assign({}, state, {
        timefilter: action.timefilter
      });
    case SET_REFRESH:
      return _.assign({}, state, {
        refresh: action.refresh
      });
    case CHANGE_TIMERANGE:
      const { timerange } = action;
      if (!state.shouldFetch && (state.timerange.max && state.timerange.min)) {
        if (!timerange.max.isSame(state.timerange.max)) {
          shouldFetch = true;
        }
        if (!timerange.min.isSame(state.timerange.min)) {
          shouldFetch = true;
        }
      }
      if (state.error) {
        shouldFetch = false;
      }
      return _.assign({}, state, {
        timerange: action.timerange,
        shouldFetch
      });
    case VIS_DATA_REQUEST:
    case VIS_DATA_ERROR:
      return _.assign({}, state, {
        shouldFetch: false
      });
    case GET_DASHBOARD_ERROR:
      return _.assign({}, state, {
        shouldFetch: false,
        error: action.error
      });
    case LOCATION_CHANGE:
      return _.assign({}, state, {
        error: null
      });
    default:
      return state;
  }
};
