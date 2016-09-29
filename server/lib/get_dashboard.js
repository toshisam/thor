export default (req) => {
  const { server } = req;
  const { callWithRequest } = server.plugins.elasticsearch;
  const config = server.config();

  const params = {
    index: config.get('thor.index'),
    type: 'dashboards',
    id: req.params.id
  };

  return callWithRequest(req, 'get', params)
    .then(resp => resp._source);

};
