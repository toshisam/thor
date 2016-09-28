import _ from 'lodash';
import mustache from 'mustache';
export default function replaceVars(str, location = { query: {} }, vars = {}) {
  const query = _.get(location, 'query', {});
  try {
    return mustache.render(str, _.assign({}, vars, { args: query }));
  } catch(e) {
    return str;
  }
};
