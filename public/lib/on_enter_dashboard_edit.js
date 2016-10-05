import { fetchFields } from '../actions/fields';
import uuid from 'node-uuid';
import { panelToEdit, getDashboard } from '../actions/dashboard';
export default (store, history) => {
  return (req, replace, callback) => {
    const { dispatch, getState } = store;
    const id = req.params.id;
    const fieldDispatcher = fetchFields();
    const getDashboardDispatcher = getDashboard(id);
    Promise.all([
      fieldDispatcher(dispatch, getState),
      getDashboardDispatcher(dispatch, getState)
    ]).then(() => {
      callback();
      dispatch(panelToEdit(false));
    }).catch(callback);
  };
};

