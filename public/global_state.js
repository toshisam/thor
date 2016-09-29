import modules from 'ui/modules';
modules.get('kibana/global_state').config(($injector, $provide) => {
  // Completely disable global state so it doesn't interfer with the app routing
  // by injecting query params.
  $provide.service('globalState', () => {
    return { getQueryParamName() { } };
  });

});
