const getTimeSeries = require('../../lib/get_time_series');
module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/api/thor/v1/metric/time_series',
    handler: function (req, reply) {
      getTimeSeries(req).then((data) => {
        reply(data);
      });
    }
  });

};
