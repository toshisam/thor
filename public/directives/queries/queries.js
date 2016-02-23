import _ from 'lodash';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/queries/queries.html';
const app = modules.get('app/thor/directives', []);

app.directive('queries', (timefilter, $colors, $docs) => {
  return {
    restrict: 'E',
    scope: {
      doc: '='
    },
    template: template,
    link: ($scope, $el, $attrs) => {

      function createNewQuery(value = '*') {
        const currentColors = _.pluck($scope.doc.queries, 'color');
        return { value, color: $colors.pick(currentColors) };
      }

      if (!$scope.doc.queries || !$scope.doc.queries.length) {
        $scope.doc.queries = [
          createNewQuery()
        ];
      }

      $scope.addQuery = () => {
        $scope.doc.queries.push(createNewQuery());
      };

      // $scope.$watch('doc.queries', () => {
      //   $docs.local.save($scope.doc);
      // }, true);

      $scope.removeQuery = (query) => {
        if ($scope.doc.queries.length > 1) {
          $scope.doc.queries = $scope.doc.queries.filter((q) => {
            return q !== query;
          });
        }
      };

    }
  };
});
