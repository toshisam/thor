// Sigh... So this puppy show is all about integrating with the global
// state and wiring up the time picker to react to change from brushes
// or changes from the global state for all sorts of unknown places.
// Everything is mostly working in here so beware of the dragons!
import rison from 'rison-node';
import _ from 'lodash';
import { replace } from 'react-router-redux';
import { SET_GLOBAL_STATE_TIME, SET_GLOBAL_STATE } from '../actions/app';
export default ($rootScope, timefilter) => store => next => action => {
  let { globalState } = store.getState().app;
  if (action.type === SET_GLOBAL_STATE_TIME) {
    $rootScope.$evalAsync(() => {
      _.assign(timefilter.time, action.time);
    });
  }
  if (action.type === SET_GLOBAL_STATE && action.globalState) {
    globalState = rison.decode(action.globalState);
    $rootScope.$evalAsync(() => {
      if (globalState.time) _.assign(timefilter.time, globalState.time);
    });
  }
  if (action.type === '@@router/LOCATION_CHANGE' && /&/.test(action.payload.pathname)) {
    const parts = action.payload.pathname.split(/&/);
    const query = parts.reduce((qs, part) => {
      const pieces = part.split(/=/);
      if (pieces.length === 2) {
        qs[pieces[0]] = pieces[1];
      }
      return qs;
    }, {});
    const location = {
      pathname: parts[0],
      query: _.assign({}, action.payload.query, query)
    };
    action.payload = _.assign({}, action.payload, location);
  }
  return next(action);
};
