import { fetchFields } from '../actions/fields';
import uuid from 'node-uuid';
import { getDashboard, panelToEdit } from '../actions/dashboard';
export default (store, history) => {
  return (req, replace, callback) => {
    const { dispatch, getState } = store;
    const state = getState();
    const id = req.params.id;
    const panelId = req.params.panelId;
    const setPanelToEdit = (dashboard) => {
      const { doc } = dashboard;
      const _panelToEdit = dashboard.panelToEdit;
      if (!(_panelToEdit && _panelToEdit.id === panelId)) {
        const panel = doc.panels.find(p => p.id === panelId);
        dispatch(panelToEdit(panel));
      }
    };
    if (state.dashboard.doc.id !== id) {
      console.log('Fetching dashboard');
      const fieldDispatcher = fetchFields();
      const getDashboardDispatcher = getDashboard(id);
      Promise.all([
        fieldDispatcher(dispatch, getState),
        getDashboardDispatcher(dispatch, getState)
      ])
      .then(() => getState().dashboard)
      .then(setPanelToEdit)
      .then(() => callback()).catch(callback);
    } else {
      setPanelToEdit(state.dashboard);
      callback();
    }
  };
};

