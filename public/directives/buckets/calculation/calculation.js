import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/buckets/calculation/calculation.html';
const app = modules.get('app/thor/directives', []);

app.directive('calculation', () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
      model: '=',
      bucket: '=',
      buckets: '=',
      without: '='
    },
    link: ($scope) => {
      $scope.addVar = () => {
        $scope.model.options.vars.push({});
      };

      $scope.removeVar = (item) => {
        if ($scope.model.options.vars.length === 1) return;
        $scope.model.options.vars = $scope.model.options.vars.filter((_item) => {
          return item !== _item;
        });
      };

    }
  };
});
