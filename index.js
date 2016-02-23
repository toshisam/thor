var exampleRoute = require('./server/routes/example');
module.exports = function (kibana) {
  return new kibana.Plugin({

    id: 'thor',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'Thor',
        // listed: false,
        description: 'When 3 and 4 have a baby it\'s THOR',
        icon: 'plugins/thor/assets/thor.svg',
        main: 'plugins/thor/app',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion')
          };
        }
      }
      // links: [
      //   {
      //     title: 'Thor',
      //     url: '/app/thor',
      //     description: 'When 3 and 4 have a baby it\'s THOR',
      //     icon: 'plugins/thor/assets/thor.svg'
      //   }
      // ]
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init: function (server, options) {
      // Add server routes and initalize the plugin here
      exampleRoute(server);
    }

  });
};

