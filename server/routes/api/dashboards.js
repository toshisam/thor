import Boom from 'boom';
import saveDashboard from '../../lib/save_dashboard';
import getDashboard from '../../lib/get_dashboard';
import getDashboards from '../../lib/get_dashboards';
import deleteDashboard from '../../lib/delete_dashboard';

export default (server) => {

  server.route({
    method: 'PUT',
    path: '/api/thor/dashboards/{id}',
    handler: (req, reply) => {
      return saveDashboard(req)
        .then(resp => {
          return reply(req.payload);
        })
        .catch(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/api/thor/dashboards',
    handler: (req, reply) => {
      return getDashboards(req).then(reply).catch(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/api/thor/dashboards/{id}',
    handler: (req, reply) => {
      return getDashboard(req).then(reply).catch(e => {
        if (e.status === 404) {
          return reply(Boom.notFound());
        }
        console.log(e);
        reply(e);
      });
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/thor/dashboards/{id}',
    handler: (req, reply) => {
      return deleteDashboard(req).then(reply).catch(reply);
    }
  });

};
