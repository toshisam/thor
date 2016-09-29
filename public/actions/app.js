import _ from 'lodash';
import handleResponse from '../lib/handle_response';
export const CHANGE_TIMERANGE = 'CHANGE_TIMERANGE';
export const SET_TIMEFILTER = 'SET_TIMEFILTER';
export const SET_REFRESH = 'SET_REFRESH';

export function changeTimerange(timerange) {
  return { type: CHANGE_TIMERANGE, timerange };
}

export function setRefresh(refresh) {
  return { type: SET_REFRESH, refresh };
}

export function setTimefilter(timefilter) {
  return { type: SET_TIMEFILTER, timefilter };
}
