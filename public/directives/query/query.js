import modules from 'ui/modules';
import template from 'plugins/thor/directives/query/query.html';
const app = modules.get('app/thor/directives', []);

app.directive('query', (timefilter) => {
  return {
    restrict: 'E',
    scope: {
      query: '=',
      add: '=',
      remove: '=',
      showRemove: '='
    },
    template: template,
    replace: true,
    link: ($scope, $el, $attrs) => {
      $scope.edit = () => {
        $scope.$$edit = $scope.$$edit ? false : true;
      };
    }
  };
});

