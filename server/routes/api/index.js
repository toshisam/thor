module.exports = function (server) {
  require('./index_patterns')(server);
  require('./metrics')(server);
};
