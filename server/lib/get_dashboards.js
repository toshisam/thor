import _ from 'lodash';
export default (req) => {
  const { server } = req;
  const { callWithRequest } = server.plugins.elasticsearch;
  const config = server.config();

  const params = {
    index: config.get('thor.index'),
    type: 'dashboards',
    body: {
      sort: [
        { '@timestamp': { order: 'desc'} }
      ]
    }
  };

  return callWithRequest(req, 'search', params)
    .then(resp => {
      return _.get(resp, 'hits.hits', []).map((hit) => {
        return hit._source;
      });
    });

};
