import moment from 'moment';
import chrome from 'ui/chrome';
import routes from 'ui/routes';
import modules from 'ui/modules';
// import 'ui/autoload/all';
import 'kibana-executor-service';
import 'plugins/thor/less/main.less';
import 'plugins/thor/directives';
import 'plugins/thor/services/colors';
import 'plugins/thor/services/docs';

chrome.setNavBackground('#222222').setTabs([]);

var app = modules.get('app/thor', ['kibana/executor']);

routes.enable();

routes.when('/', {
  template: require('plugins/thor/templates/index.html'),
  resolve: {
    doc: ($docs) => {
      return $docs.local.fetch();
    }
  }
});



app.controller('thorHelloWorld', function ($executor, timefilter, $scope, $route, $docs) {

  $scope.doc = $route.current.locals.doc || $docs.create();

  const unsubDocWatch = $scope.$watch('doc', $docs.local.save, true);
  $scope.$on('$destroy', unsubDocWatch);

  $scope.save = () => {
    if ($scope.doc.title) {
      $docs.remove.save($scope.doc);
    }
  };

  $scope.new = () => {
    $scope.doc = $docs.create();
  };

  timefilter.enabled = true;
});
