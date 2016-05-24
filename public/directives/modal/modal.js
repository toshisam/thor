import modules from 'ui/modules';
import template from 'plugins/thor/directives/modal/modal.html';
const app = modules.get('app/thor/directives', []);

app.service('$modal', ($rootScope) => {
  let current = null;
  function show(name) {
    if (name) {
      current = name;
      $rootScope.$broadcast(`modal:show:${current}`);
    }
    return current;
  }

  function hide() {
    $rootScope.$broadcast(`modal:hide:${current}`);
    current = null;
  }

  return { show, hide };
});

app.directive('modal', ($modal) => {
  return {
    restrict: 'E',
    transclude: true,
    template: template,
    // replace: true,
    link: (scope, el, attr) => {
      function watchFn() {
        return $modal.show();
      }
      let unsub = scope.$watch(watchFn, (name) => {
        let display = 'none';
        if (name === attr.name) {
          display = 'flex';
        }
        el.css('display', display);
      });
      scope.$on('$destroy', unsub);
    }
  };
});

