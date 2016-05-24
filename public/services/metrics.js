import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
const app = modules.get('app/thor/services', []);

app.service('$metrics', ($timezone, $http, $indexPatterns, timefilter) => {

  function fetchPanel(doc) {
    const timeBounds = timefilter.getBounds();
    var body = {
      indexPattern: doc.indexPattern,
      timerange: {
        min: timeBounds.min.toISOString(),
        max: timeBounds.max.toISOString(),
        field: $indexPatterns.getTimeField(doc.indexPattern),
        timezone: $timezone.resolve()
      },
      metrics: angular.copy(doc.metrics)
    };
    return $http.post(`../api/thor/v1/metric/${doc.type}`, body)
      .then((resp) => {
        return resp.data;
      });
  }

  return {
    fetchPanel
  };

});
