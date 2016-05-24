module.exports = (req) => {
  var config = req.server.config();
  var callWithRequest = req.server.plugins.elasticsearch.callWithRequest;
  var kbnIndex = config.get('kibana.index');
  var params = {
    index: kbnIndex,
    type: 'index-pattern'
  };

  return callWithRequest(req, 'search', params)
    .then((resp) => {
      if (!resp.hits.total) return [];
      return resp.hits.hits.map((row) => {
        var data = row._source;
        if (data.fields) data.fields = JSON.parse(data.fields);
        if (data.fieldFormatMap) data.fieldFormatMap = JSON.parse(data.fieldFormatMap);
        return data;
      });
    });

};
