import getFields from '../../lib/get_fields';
import Promise from 'bluebird';
export default (server) => {

  server.route({
    path: '/api/thor/fields',
    method: 'GET',
    handler: (req, reply) => {
      return Promise.try(getFields(req))
        .then(reply)
        .catch(err => reply([]));
    }
  });

};

