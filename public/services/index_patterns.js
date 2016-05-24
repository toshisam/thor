import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
const app = modules.get('app/thor/services', []);
app.service('$indexPatterns', ($http) => {

  var indexPatterns;

  function fetch() {
    return $http.get('../api/thor/v1/index_patterns')
      .then((resp) => {
        indexPatterns = resp.data;
        return indexPatterns;
      });
  }

  function getNumericFields(indexPattern) {
    const pattern = indexPatterns.find(pattern => pattern.title === indexPattern);
    if (!pattern) return [];
    return _.sortBy(pattern.fields.filter((field) => {
      return field.type === 'number';
    }), 'name');
  }

  function getTermFields(indexPattern) {
    const pattern = indexPatterns.find(pattern => pattern.title === indexPattern);
    if (!pattern) return [];
    return _.sortBy(pattern.fields.filter((field) => {
      return field.type === 'string' && field.analyzed === false;
    }), 'name');
  }

  function getTimeField(indexPattern) {
    const pattern = indexPatterns.find(pattern => pattern.title === indexPattern);
    return pattern.timeFieldName;

  }

  return {
    fetch,
    getNumericFields,
    getTermFields,
    getTimeField
  };

});
