import _ from 'lodash';
import modules from 'ui/modules';
import template from './color_picker.html';
const app = modules.get('app/thor/directives', []);
app.directive('colorPicker', ($colors) => {
  return {
    restrict: 'E',
    scope: {
      model: '=ngModel'
    },
    template: template,
    transclude: true,
    link: ($scope, $el, $attr) => {
      // $scope.colors = $colors.names.concat([]);
      // $scope.colors.splice(0, 9);
      $scope.colors = _.keys($colors.lookup);
      $scope.change = (color) => {
        $scope.model = color;
      };
    }
  };
});
