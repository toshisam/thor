export default (req) => {
  const { server } = req;
  const { callWithRequest } = server.plugins.elasticsearch;
  const config = server.config();

  const params = {
    index: config.get('thor.index'),
    type: 'dashboards',
    id: req.params.id,
    refresh: true
  };

  return callWithRequest(req, 'delete', params);

};

