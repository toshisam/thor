var getIndexPatterns = require('../../lib/get_index_patterns');
module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/api/thor/v1/index_patterns',
    handler: function (req, reply) {
      getIndexPatterns(req)
        .then(reply)
        .catch(reply);
    }
  });

};
