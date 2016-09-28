import {
  VIS_DATA_ERROR,
  VIS_DATA_REQUEST,
  VIS_DATA_RESPONSE
} from '../actions/vis_data';

import {
  SET_GLOBAL_STATE,
  SET_TIMEFILTER,
  CHANGE_TIMERANGE,
} from '../actions/app';

import rison from 'rison-node';
import { LOCATION_CHANGE } from 'react-router-redux';
import _ from 'lodash';
export default (state = {}, action) => {
  let shouldFetch = false;
  switch (action.type) {
    case SET_TIMEFILTER:
      return _.assign({}, state, {
        globalState: _.assign({}, state.globalState, {
          value: _.assign({}, state.globalState.value, {
            time: action.time
          })
        })
      });
    case SET_GLOBAL_STATE:
      const rawGlobalState = action.globalState || '()';
      return _.assign({}, state, {
        globalState: {
          value: rison.decode(rawGlobalState),
          rison: rawGlobalState
        }
      });
    // This is being called by the Rhythm controller in Angular
    // using the Kibana Executor service. When it executes, it calls
    // the dispatch for the changeTimerange action and updates.
    // all the interval/pause/updates are handle there
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
    // case RECEIVE_SERVER_METRICS_ERROR:
    // case RECEIVE_SERVER_DETAILS_ERROR:
    // case RECEIVE_METRICBEAT_METRICS_ERROR:
    //   return _.assign({}, state, {
    //     shouldFetch: false,
    //     error: action.error
    //   });
    case LOCATION_CHANGE:
      return _.assign({}, state, {
        error: null
      });
    default:
      return state;
  }
};
