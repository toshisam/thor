import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
const app = modules.get('app/thor/services', []);
app.service('$docs', function ($window, Promise) {

  function generateId() {
    const date = new Date();
    return _.uniqueId(`${date.getTime()}-`);
  }

  function localFetch() {
    return new Promise((resolve, reject) => {
      try {
        resolve(angular.fromJson($window.localStorage.getItem('thorDoc')) || {});
      } catch (e) {
        reject(e);
      }
    });
  }

  function localSave(doc) {
    return new Promise((resolve, reject) => {
      try {
        resolve($window.localStorage.setItem('thorDoc', angular.toJson(doc)));
      } catch (e) {
        reject(e);
      }
    });
  }

  function remoteFetch() {

  }

  function remoteSave(doc) {

  }

  function createEmptyDoc() {
    return {
      name: null,
      indexPattern: null,
      queries: [{ id: generateId(), query: '*', color: 'green'}],
      visualizations: []
    };
  }

  function copy(src, dest) {
    angular.copy(src, dest);
    dest.indexPattern = src.indexPattern.title;
  }

  return {
    local: { fetch: localFetch, save: localSave },
    remote: { fetch: remoteFetch, save: remoteSave },
    create: createEmptyDoc,
    copy,
    generateId
  };

});
