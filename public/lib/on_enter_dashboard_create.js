import { fetchFields } from '../actions/fields';
import { resetDashboardDoc } from '../actions/dashboard';
export default (store, history) => {
  return (req, replace, callback) => {
    const { dispatch, getState } = store;
    const dispatcher = fetchFields();
    dispatch(resetDashboardDoc());
    dispatcher(dispatch, getState)
    .then(() => callback())
    .catch(callback);
  };
};
