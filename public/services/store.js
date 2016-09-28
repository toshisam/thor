import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import modules from 'ui/modules';
import globalStateMiddleware from '../lib/global_state_middleware';

import initialState from '../lib/initial_state';
import reducers from '../reducers';

const app = modules.get('apps/rhythm');
app.service('$store', ($history, $rootScope, timefilter, kbnVersion, basePath) => {

  initialState.app.kbnVersion = kbnVersion;
  initialState.app.basePath = basePath;
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(thunk),
      applyMiddleware(routerMiddleware($history)),
      applyMiddleware(globalStateMiddleware($rootScope, timefilter)),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  syncHistoryWithStore($history, store);
  return store;
});
