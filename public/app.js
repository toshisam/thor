import angular from 'angular';
import moment from 'moment';
import chrome from 'ui/chrome';
import routes from 'ui/routes';
import modules from 'ui/modules';
// import 'ui/autoload/all';
import 'kibana-executor-service';
import 'angular-modal';
import 'ui/autoload/all';
import 'plugins/thor/less/main.less';
import 'plugins/thor/directives';
import 'plugins/thor/services/colors';
import 'plugins/thor/services/docs';
import 'plugins/thor/services/index_patterns';
import 'plugins/thor/services/metrics';
import 'plugins/thor/services/timezone';

// chrome.setNavBackground('#222222').setTabs([]);

var app = modules.get('app/thor', ['kibana/executor']);

routes.enable();

routes.when('/', {
  template: require('plugins/thor/templates/index.html'),
  resolve: {
    doc: ($docs) => {
      return $docs.local.fetch();
    },
    indexPatterns: ($indexPatterns) => {
      return $indexPatterns.fetch();
    }
  }
});


app.controller('thorWorkspace', function ($executor, timefilter, $scope, $route, $docs, $modal) {

  $scope.doc = $route.current.locals.doc;
  $scope.indexPatterns = $route.current.locals.indexPatterns;

  const unsubDocWatch = $scope.$watch('doc', $docs.local.save, true);
  $scope.$on('$destroy', unsubDocWatch);

  $scope.save = () => {
    if ($scope.doc.title) {
      $docs.remote.save($scope.doc);
    }
  };

  $scope.new = () => {
    $modal.show('newWorkspace');
    $scope.doc = $docs.create();
  };

  $scope.newVisualization = () => {
    $modal.show('newVisualization');
  };

  timefilter.enabled = true;
  if (!$scope.doc.indexPattern) $scope.new();
});
