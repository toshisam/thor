import 'ui/autoload/all';
import chrome from 'ui/chrome';
import modules from 'ui/modules';
import 'kibana-executor-service';
import '@elastic/rhythm-visualizations/css/main.css';
import 'react-grid-layout/css/styles.css';
import 'react-select/dist/react-select.css';

import './services/store';
import './services/history';
import './directives/react';
import './less/main.less';

import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment-timezone';
import React from 'react';
import { render } from 'react-dom';
import appContainer from './templates/app_container.html';
import Routes from './routes';
import { changeTimerange } from './actions/app';
import defaultTimefilterSettings from './lib/default_timefilter_settings';

modules.get('kibana/global_state').config(($injector, $provide) => {
  // Completely disable global state so it doesn't interfer with the app routing
  // by injecting query params.
  $provide.service('globalState', () => {
    return { getQueryParamName() { } };
  });

});

modules.get('kibana').run((uiSettings) => {
  const timeValue = JSON.stringify(defaultTimefilterSettings.time);
  const refreshIntervalValue = JSON.stringify(defaultTimefilterSettings.refreshInterval);
  _.set(uiSettings, 'defaults.timepicker:timeDefaults.value', timeValue);
  _.set(uiSettings, 'defaults.timepicker:refreshIntervalDefaults.value', refreshIntervalValue);
});

chrome
  .setRootTemplate(appContainer)
  // .setRootController((globalState, $scope, $history, $store, $executor,
  //                     docTitle, config, timefilter) => {
  .setRootController((docTitle, $store, $history, $scope) => {
    docTitle.change('Thor');
    // Mount the React app
    const el = document.getElementById('thor');
    render(<Routes store={ $store } history={ $history }/>, el);

    // Initalized the loading spinner thingy
    $scope.loading = false;

    // Subscribe to changes to the $store. If the server or servers objects
    // are fetching then we need to set the loading indicator to display.
    $store.subscribe(() => {
      const state = $store.getState();
      const time = _.get(state, 'app.globalState.value.time', {});
      const loading = _.get(state, 'dashboard.request.isFetching', false)
        || _.get(state, 'fields.request.isFetching', false)
        || _.get(state, 'visData.request.isFetching', false);

      $scope.$evalAsync(() => {
        // Change loading to the current value
        $scope.loading = loading;
      });
    });

  });
