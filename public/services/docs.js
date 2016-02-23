import _ from 'lodash';
import angular from 'angular';
import modules from 'ui/modules';
const app = modules.get('app/thor/directives', []);
app.service('$docs', function ($window, Promise) {

  function localFetch() {
    return new Promise((resolve, reject) => {
      try {
        resolve(angular.fromJson($window.localStorage.getItem('thorDoc')));
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
      queries: [{ value: '*', color: 'green'}]
    };
  }

  return {
    local: { fetch: localFetch, save: localSave },
    remote: { fetch: remoteFetch, save: remoteSave },
    create: createEmptyDoc
  };

});
