import uuid from 'node-uuid';
import initialState from '../lib/initial_state';
import _ from 'lodash';
import handleResponse from '../lib/handle_response';

export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD';
export const RESET_DASHBOARD_DOC = 'RESET_DASHBOARD_DOC ';
export const PANEL_TO_EDIT = 'PANEL_TO_EDIT';
export const TOGGLE_PANEL_MODAL = 'TOGGLE_PANEL_MODAL';

export const SAVE_DASHBOARD_RESPONSE = 'SAVE_DASHBOARD_RESPONSE';
export const SAVE_DASHBOARD_REQUEST = 'SAVE_DASHBOARD_REQUEST';
export const SAVE_DASHBOARD_ERROR = 'SAVE_DASHBOARD_ERROR';

export const GET_DASHBOARD_REQUEST = 'GET_DASHBOARD_REQUEST';
export const GET_DASHBOARD_RESPONSE = 'GET_DASHBOARD_RESPONSE';
export const GET_DASHBOARD_ERROR = 'GET_DASHBOARD_ERROR';

export function updateDashboard(doc) {
  return {
    type: UPDATE_DASHBOARD,
    doc
  };
};

export function resetDashboardDoc(id) {
  return { type: RESET_DASHBOARD_DOC, id };
};

export function panelToEdit(panel) {
  return { type: PANEL_TO_EDIT, panel };
}

export function showPanelModal() {
  return { type: TOGGLE_PANEL_MODAL, value: true };
}
export function hidePanelModal() {
  return { type: TOGGLE_PANEL_MODAL, value: false };
}

export function saveDashboardRequest() {
  return { type: SAVE_DASHBOARD_REQUEST };
}

export function saveDashboardResponse(json) {
  return { type: SAVE_DASHBOARD_RESPONSE, json };
}

export function saveDashboardError(error) {
  return { type: SAVE_DASHBOARD_ERROR, error };
}

export function saveDashboard(dashboard) {
  return (dispatch, getState) => {
    const { app } = getState();
    const params = {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': app.kbnVersion
      },
      body: JSON.stringify(dashboard)
    };
    dispatch(saveDashboardRequest());
    return fetch(`../api/thor/dashboards/${dashboard.id}`, params)
    .then(handleResponse)
    .then(json => dispatch(saveDashboardResponse(json)))
    .catch(e => dispatch(saveDashboardError(e)));
  };
}

export function createNewDashboard() {
  return (dispatch, getState) => {
    const id = uuid.v1();
    const dashboard = _.assign({}, initialState.dashboard.doc, { id });
    return dispatch(saveDashboard(dashboard));
  };
}

export function getDashboardRequest() {
  return { type: GET_DASHBOARD_REQUEST };
}

export function getDashboardResponse(json) {
  return { type: GET_DASHBOARD_RESPONSE, json };
}

export function getDashboardError(error) {
  return { type: GET_DASHBOARD_ERROR, error };
}

export function getDashboard(id) {
  return (dispatch, getState) => {
    const { app } = getState();
    const params = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': app.kbnVersion
      },
    };
    dispatch(getDashboardRequest());
    return fetch(`../api/thor/dashboards/${id}`, params)
    .then(handleResponse)
    .then(json => dispatch(getDashboardResponse(json)))
    .catch(e => dispatch(getDashboardError(e)));
  };
}

