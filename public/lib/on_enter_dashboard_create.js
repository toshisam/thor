import { fetchFields } from '../actions/fields';
import { createNewDashboard } from '../actions/dashboard';
export default (store, history) => {
  return (req, replace, callback) => {
    console.log('On Enter Create');
    const { dispatch, getState } = store;
    const dispatcher = createNewDashboard();
    dispatcher(dispatch, getState)
      .then(() => {
        const { dashboard } = getState();
        replace(`/dashboards/edit/${dashboard.doc.id}`);
        callback();
      })
    .catch(callback);
  };
};
