import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/buckets/bucket.html';

import 'plugins/thor/directives/buckets/simple/simple';
import 'plugins/thor/directives/buckets/calculation/calculation';
import 'plugins/thor/directives/buckets/derivative/derivative';
import 'plugins/thor/directives/buckets/std_dev/std_dev';
import 'plugins/thor/directives/buckets/moving_average/moving_average';

const app = modules.get('app/thor/directives', []);

app.directive('bucket', ($docs, $indexPatterns) => {
  return {
    restrict: 'E',
    template: template,
    scope: {
      addBucket: '=',
      removeBucket: '=',
      bucket: '=',
      indexPattern: '=',
      buckets: '='
    },
    link: ($scope) => {

      $scope.types = [
        { id: 'count', name: 'Count', simple: true},
        { id: 'avg', name: 'Average', simple: true},
        { id: 'max', name: 'Max', simple: true},
        { id: 'min', name: 'Min', simple: true},
        { id: 'sum', name: 'Sum', simple: true},
        { id: 'std_dev', name: 'Standard Deviation', simple: true },
        { id: 'sum_of_squares', name: 'Sum of Squares', simple: true },
        { id: 'variance', name: 'Variance', simple: true },
        { id: 'cardinality', name: 'Cardinality', simple: true },
        { id: 'value_count', name: 'Value Count', simple: true },
        { id: 'derivative', name: 'Derivative', simple: false },
        { id: 'moving_average', name: 'Moving Average', simple: false, },
        { id: 'calculation', name: 'Calculation', simple: false }
      ];

      $scope.fields = $indexPatterns.getNumericFields($scope.indexPattern);

      $scope.model = {
        field: {},
        type: $scope.types.find(type => type.id === $scope.bucket.type),
        options: {}
      };

      function rehash() {
        if (!$scope.bucket) return;
        if (!$scope.model.field) return;
        $scope.bucket.label = '';
        if ($scope.model.type.id === 'derivative') {
          $scope.bucket.label = `Derivative of ${$scope.model.field.label}`;
        } else {
          $scope.bucket.label += $scope.model.type.name;
          if ($scope.model.field && $scope.model.field.name) {
            $scope.bucket.label += ` of ${$scope.model.field.name}`;
          }
        }
        if ($scope.model.options.alias) {
          $scope.bucket.label = $scope.model.options.alias;
        }
        if ($scope.model.type.id === 'calculation') {
          $scope.bucket.options = {
            script: $scope.model.options.script,
            vars: $scope.model.options.vars.reduce((acc, val) => {
              if (val.metric) {
                acc[val.name] = val.metric.id;
              }
              return acc;
            }, {})
          };
        }
      }

      $scope.$watch('model.type', function (newVal, oldVal) {
        if (newVal) {
          $scope.bucket.type = newVal.id;
          if (newVal.id === 'count') {
            $scope.model.field = {};
          }

          if (newVal.id === 'calculation') {
            $scope.model.options.vars = [{}];
          } else if (oldVal.id === 'calculation') {
            delete $scope.model.options.vars;
            delete $scope.model.options.script;
          }

          rehash();
        }
      });


      $scope.$watch('model.field', function (newVal, oldVal) {
        if (newVal) {
          $scope.bucket.field = newVal.id || newVal.name;
        } else {
          $scope.bucket.field = null;
        }
        rehash();
      });

      $scope.$watch('model.options', (newVal) => {
        rehash();
      }, true);

      $scope.$on('$destroy', $scope.$on('buckets:rehash', rehash));

      $scope.toggleHide = () => {
        $scope.bucket.hide = !$scope.bucket.hide;
      };

      function isReady(bucket) {
        switch (bucket.type) {
          case 'count':
            return true;
          default:
            if (bucket.field || bucket.type === 'calculation') return true;
            return false;
        }
      }

      function getAncestors(arr, item) {
        const ancestors = [item.id];
        arr.forEach((i) => {
          if (_.contains(ancestors, i.field)) {
            ancestors.push(i.id);
          }
        });
        return ancestors;
      }

      $scope.without = (arr, item) => {
        const ancestors = getAncestors(arr, item);
        return arr
          .filter(isReady)
          .filter((i) => !_.contains(ancestors, i.id));
      };

    }
  };
});


