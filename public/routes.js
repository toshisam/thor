import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import onEnterDashboardEdit from './lib/on_enter_dashboard_edit';
import onEnterDashboardEditPanel from './lib/on_enter_dashboard_edit_panel';
import onEnterDashboardList from './lib/on_enter_dashboard_list';
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
              onEnter={onEnterDashboardList(store, history)}
              component={ Dashboards.List }/>
            <Route
              path="edit/:id"
              onEnter={ onEnterDashboardEdit(store, history) }
              component={ Dashboards.Edit }/>
            <Route
              path="view/:id"
              onEnter={ onEnterDashboardEdit(store, history) }
              component={ Dashboards.View }/>
            <Route
              path="edit/:id/panel/:panelId"
              onEnter={ onEnterDashboardEditPanel(store, history) }
              component={ Dashboards.EditPanel }/>
          </Route>
        </Route>
      </Router>
    </Provider>
  );
};
