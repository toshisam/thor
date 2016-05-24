var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
module.exports = function (req, pattern, timefield, start, end) {
  var server = req.server;
  var callWithRequest = server.plugins.elasticsearch.callWithRequest;
  var options = {
    index: pattern,
    level: 'indices',
    meta: 'calculate_indices',
    ignoreUnavailable: true,
    body: { index_constraints: { } }
  };
  options.body.fields = [timefield];
  options.body.index_constraints[timefield] = {
    max_value: { gte: moment.utc(start).toISOString() },
    min_value: { lte: moment.utc(end).toISOString() }
  };
  return callWithRequest(req, 'fieldStats', options)
    .then(function (resp) {
      var indices = _.map(resp.indices, function (info, index) {
        return index;
      });
      if (indices.length === 0) return ['.kibana-devnull'];
      return indices;
    });
};

