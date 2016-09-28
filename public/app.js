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
import Header from './containers/header';
import SearchBar from './containers/search_bar';
import StatusLink from './containers/status_link';
import Breadcrumbs from './containers/breadcrumbs';
import defaultTimefilterSettings from './lib/default_timefilter_settings';

modules.get('kibana').run(function (uiSettings) {
  const timeValue = JSON.stringify(defaultTimefilterSettings.time);
  const refreshIntervalValue = JSON.stringify(defaultTimefilterSettings.refreshInterval);
  _.set(uiSettings, 'defaults.timepicker:timeDefaults.value', timeValue);
  _.set(uiSettings, 'defaults.timepicker:refreshIntervalDefaults.value', refreshIntervalValue);
});

chrome
  .setRootTemplate(appContainer)
  .setRootController((globalState, $scope, $history, $store, $executor,
                      docTitle, config, timefilter) => {

    // Setup the default timezony stuffs...
    function setDefaultTimezone() {
      moment.tz.setDefault(config.get('dateFormat:tz'));
    }
    $scope.$on('init:config', setDefaultTimezone);
    $scope.$on('change:config.dateFormat:tz', setDefaultTimezone);

    // Set the doc title
    docTitle.change('Thor');

    function setTimerange(timefilter, $store) {
      const bounds = timefilter.getBounds();
      const paused = timefilter.refreshInterval.pause;
      const interval = timefilter.refreshInterval.value;
      const range = {
        min: moment.utc(bounds.min.valueOf()),
        max: moment.utc(bounds.max.valueOf())
      };
      $store.dispatch(changeTimerange(range));
    }

    // Enable the timefilter
    timefilter.enabled = true;

    // Initialize the timepicker and set the timezone
    timefilter.init();

    // Before you do anything you need to set the timerange so when
    // the first requests fire they will have access to the timerange
    setTimerange(timefilter, $store);

    // Mount the React app
    const el = document.getElementById('thor');
    render(<Routes store={ $store } history={ $history }/>, el);

    // Register the executor to set the timerange. The containers
    // (home, details, etc) are setup to fetch new data when the
    // app.timerange updates.
    $executor.register({
      execute: () => {
        setTimerange(timefilter, $store);
        return Promise.resolve();
      }
    });

    // Start the execture, this will run the execute method above
    // based on the timefilter settings
    $executor.start();

    // Clean stuffs up... probably not necessary but it's there for
    // good measure.
    $scope.$watch('$destroy', () => $executor.destroy);

    // We are ready... show the things!
    $scope.ready = true;

    // Initalized the loading spinner thingy
    $scope.loading = false;

    // Set the containers that are controlled outside the React app inside
    // the `kbn-top-nav` (where the time picker is injected via Angular).
    // It's a very careful ballet... don't fall.
    //
    // BTW, these use the `react` directive like
    // `<react container="Header"/>` which will automatically get
    // provided with `$store` and `$history`. These components need to be
    // created with the `connect()` method from react-redux.
    $scope.Header = Header;
    $scope.Breadcrumbs = Breadcrumbs;
    $scope.StatusLink = StatusLink;

    // Subscribe to changes to the $store. If the server or servers objects
    // are fetching then we need to set the loading indicator to display.
    $store.subscribe(() => {
      const state = $store.getState();
      const time = _.get(state, 'app.globalState.value.time', {});
      const loading = _.get(state, 'server.isFetching', false)
        || _.get(state, 'servers.isFetching', false)
        || _.get(state, 'fields.request.isFetching', false)
        || _.get(state, 'visData.request.isFetching', false);

      $scope.$evalAsync(() => {
        // Change loading to the current value
        $scope.loading = loading;
      });
    });

    // $scope.topNavMenu = [{
    //   key: 'Options',
    //   description: 'Options',
    //   template: '<p>options here</p>'
    // }];
  });
