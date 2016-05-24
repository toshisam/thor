import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/new_workspace/new_workspace.html';
const app = modules.get('app/thor/directives', []);

app.directive('newWorkspace', ($docs, $modal) => {
  return {
    restrict: 'E',
    template: template,
    replace: true,
    scope: {
      doc: '=',
      indexPatterns: '='
    },
    link: ($scope) => {
      $scope.newDoc = $docs.create();

      $scope.create = (form) => {
        if (form.$valid) {
          $docs.copy($scope.newDoc, $scope.doc);
          $scope.newDoc = $docs.create();
          form.$setPristine();
          $modal.hide();
        }
      };

    }
  };
});

