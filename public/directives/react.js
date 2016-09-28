import _ from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import modules from 'ui/modules';
const app = modules.get('apps/rhythm');
app.directive('react', ($store, $history) => {
  return {
    restrict: 'E',
    scope: {
      container: '=',
    },
    link: ($scope, $el, $attrs) => {
      const Container = $scope.container;
      render(
        <Provider store={$store}>
          <Container history={$history}/>
        </Provider>
      , $el[0]);
    }
  };
});
