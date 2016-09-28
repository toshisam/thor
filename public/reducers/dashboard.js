import _ from 'lodash';
import initialState from '../lib/initial_state';
import {
  UPDATE_DASHBOARD,
  RESET_DASHBOARD_DOC,
  PANEL_TO_EDIT,
  TOGGLE_PANEL_MODAL
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
        doc: initialState.dashboard.doc
      });
    case UPDATE_DASHBOARD:
      return _.assign({}, state, {
        doc: action.doc
      });
    default:
      return state;
  }
};


