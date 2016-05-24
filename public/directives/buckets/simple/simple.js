import angular from 'angular';
import modules from 'ui/modules';
import template from 'plugins/thor/directives/buckets/simple/simple.html';
const app = modules.get('app/thor/directives', []);

app.directive('simple', () => {
  return {
    template: template
  };
});
