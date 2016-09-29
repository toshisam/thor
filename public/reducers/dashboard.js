import _ from 'lodash';
import initialState from '../lib/initial_state';
import {
  UPDATE_DASHBOARD,
  RESET_DASHBOARD_DOC,
  PANEL_TO_EDIT,
  TOGGLE_PANEL_MODAL,
  SAVE_DASHBOARD_ERROR,
  SAVE_DASHBOARD_RESPONSE,
  SAVE_DASHBOARD_REQUEST,
  GET_DASHBOARD_ERROR,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_RESPONSE
} from '../actions/dashboard';
export default (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_PANEL_MODAL:
      return _.assign({}, state, {
        showPanelModal: action.value
      });
    case PANEL_TO_EDIT:
      return _.assign({}, state, {
        panelToEdit: action.panel
      });
    case RESET_DASHBOARD_DOC:
      return _.assign({}, state, {
        doc: _.assign({}, initialState.dashboard.doc, { id: action.id })
      });
    case UPDATE_DASHBOARD:
      return _.assign({}, state, {
        doc: action.doc
      });
    case SAVE_DASHBOARD_REQUEST:
    case GET_DASHBOARD_REQUEST:
      return _.assign({}, state, {
        request: { isFetching: true },
      });
    case SAVE_DASHBOARD_RESPONSE:
    case GET_DASHBOARD_RESPONSE:
      return _.assign({}, state, {
        request: { isFetching: false },
        doc: action.json
      });
    case SAVE_DASHBOARD_ERROR:
    case GET_DASHBOARD_ERROR:
      return _.assign({}, state, {
        request: { isFetching: false },
        error: action.error
      });
    default:
      return state;
  }
};


