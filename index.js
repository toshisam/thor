import apiFieldsRoutes from './server/routes/api/fields';
import apiVisRoutes from './server/routes/api/vis';
import apiDashboardsRoutes from './server/routes/api/dashboards';
import ensureIndex from './server/lib/ensure_index';

import Promise from 'bluebird';
export default function (kibana) {
  return new kibana.Plugin({
    require: ['kibana','elasticsearch'],

    uiExports: {

      app: {
        title: 'Thor',
        description: 'A Metrics UI',
        main: 'plugins/thor/app',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion'),
            basePath: config.get('server.basePath')
          };
        }
      }
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        index: Joi.string().default('.thor'),
        chartResolution: Joi.number().default(150),
        minimumBucketSize: Joi.number().default(10)
      }).default();
    },


    init(server, options) {
      const config = server.config();
      const { status } = server.plugins.elasticsearch;

      apiFieldsRoutes(server);
      apiVisRoutes(server);
      apiDashboardsRoutes(server);

      if (status) {
        status.on('green', () => {
          Promise.try(ensureIndex(server))
          .then(() => { });
        });
      }

    }


  });
};
