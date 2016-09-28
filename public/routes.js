import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import onEnterDashboardCreate from './lib/on_enter_dashboard_create';
import {
  Router,
  Route,
  IndexRoute,
  IndexRedirect
} from 'react-router';
import App from './containers/app';
import Dashboards from './containers/dashboards';


export default (props) => {
  // Setup an event listener on the hashchange to catch global state changes
  const { store, history } = props;

  return (
    <Provider store={ store }>
      <Router history={ history }>
        <Route
          path="/"
          component={ App }>
          <IndexRedirect to="/dashboards/list"/>
          <Route
            path="/dashboards">
            <IndexRedirect to="list"/>
            <Route
              path="list"
              component={ Dashboards.List }/>
            <Route
              path="create"
              onEnter={ onEnterDashboardCreate(store, history) }
              component={ Dashboards.Create }/>
          </Route>
        </Route>
      </Router>
    </Provider>
  );
};
