import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/metric/metric.html';

const app = modules.get('app/thor/directives', []);

app.directive('metric', ($docs) => {
  return {
    restrict: 'E',
    template: template,
    scope: { indexPattern: '=', metric: '=' },
    link: ($scope) => {

      $scope.addBucket = () => {
        $scope.metric.buckets.push({
          type: 'count',
          hide: false,
          label: 'Count',
          id: $docs.generateId(),
          options: {}
        });
      };

      $scope.toggleHide = () => {
        $scope.metric.hide = !($scope.metric.hide);
      };

      $scope.removeBucket = (bucket) => {
        if ($scope.metric.buckets.length === 1) return;
        $scope.metric.buckets = $scope.metric.buckets.filter((item) => {
          return bucket !== item;
        });
        $scope.$broadcast('buckets:rehash');
      };
    }
  };
});

