module.exports = function (server) {

  server.route({
    path: '/thor/api/example',
    method: 'GET',
    handler: function (req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

};
