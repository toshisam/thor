import fetch from 'isomorphic-fetch';
export const DASHBOARDS_REQUEST = 'DASHBOARDS_REQUEST';
export const DASHBOARDS_RESPONSE = 'DASHBOARDS_RESPONSE';
export const DASHBOARDS_ERROR = 'DASHBOARDS_ERROR';
import handleResponse from '../lib/handle_response';

export function dashboardsRequest() {
  return { type: DASHBOARDS_REQUEST };
};

export function dashboardsResponse(json) {
  return { type: DASHBOARDS_RESPONSE, json };
};

export function dashboardsError(error) {
  return { type: DASHBOARDS_ERROR, error };
};

export function fetchDashboards() {
  return (dispatch, getState) => {
    const { app } = getState();
    const params = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': app.kbnVersion
      }
    };
    dispatch(dashboardsRequest());
    return fetch(`../api/thor/dashboards`, params)
    .then(handleResponse)
    .then(json => dispatch(dashboardsResponse(json)))
    .catch(e => dispatch(dashboardsError(e)));
  };
};
