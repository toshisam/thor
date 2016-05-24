import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/new_visualization/new_visualization.html';
const app = modules.get('app/thor/directives', []);

app.directive('newVisualization', ($docs, $modal, $metrics) => {
  return {
    restrict: 'E',
    template: template,
    replace: true,
    scope: {
      doc: '='
    },
    link: ($scope) => {

      function createNewDoc() {
        return {
          indexPattern: $scope.doc.indexPattern,
          type: 'time_series',
          metrics: angular.copy($scope.doc.queries).map((query) => {
            query.buckets = [
              {
                type: 'count',
                hide: false,
                label: 'Count',
                id: $docs.generateId()
              }
            ];
            query.hide = false;
            return query;
          }),
          options: {},
          panel: {}
        };
      }

      $scope.$on('modal:show:newVisualization', () => {
        $scope.visdoc = createNewDoc();
        $scope.refreshChart();
      });

      $scope.close = () => {
        $scope.visdoc = createNewDoc();
        $modal.hide();
      };

      $scope.chart = [];

      $scope.search = () => {
        $scope.refreshChart();
      };

      $scope.refreshChart = () => {
        if (!$scope.visdoc) return;
        $metrics.fetchPanel($scope.visdoc).then((data) => {
          const chart = [];
          $scope.visdoc.metrics.forEach((metric) => {
            metric.buckets.forEach((bucket) => {
              if (bucket.hide) return;
              const series = {
                label: bucket.label,
                data: data[metric.id][bucket.id]
              };
              chart.push(series);
            });
          });
          $scope.chart = chart;
        });
      };
    }
  };
});


