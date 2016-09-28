import _ from 'lodash';
import handleResponse from '../lib/handle_response';
export const CHANGE_TIMERANGE = 'CHANGE_TIMERANGE';
export const SET_GLOBAL_STATE = 'SET_GLOBAL_STATE';
export const SET_GLOBAL_STATE_TIME = 'SET_GLOBAL_STATE_TIME';
export const SET_TIMEFILTER = 'SET_TIMEFILTER';

export function setGlobalStateTime(time) {
  return {
    type: SET_GLOBAL_STATE_TIME,
    time
  };
}

export function changeTimerange(timerange) {
  return {
    type: CHANGE_TIMERANGE,
    timerange
  };
}

export function setTimefilter(time) {
  return {
    type: SET_TIMEFILTER,
    time
  };
}

export function setGlobalState(globalState) {
  return {
    type: SET_GLOBAL_STATE,
    globalState: globalState
  };
}

