import { fetchFields } from '../actions/fields';
import uuid from 'node-uuid';
import { fetchDashboards } from '../actions/dashboards';
export default (store, history) => {
  return (req, replace, callback) => {
    const { dispatch, getState } = store;
    const id = req.params.id;
    const listingDispatcher = fetchDashboards();
    Promise.all([
      listingDispatcher(dispatch, getState)
    ]).then(() => {
      callback();
    }).catch(callback);
  };
};


