import moment from 'moment';
export default (req) => {
  const { server } = req;
  const { callWithRequest } = server.plugins.elasticsearch;
  const config = server.config();

  const doc = req.payload;
  doc['@update'] = moment.utc().toISOString();

  const params = {
    index: config.get('thor.index'),
    type: 'dashboards',
    id: req.params.id,
    body: doc
  };

  return callWithRequest(req, 'index', params);
};
