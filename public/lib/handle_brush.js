import { setGlobalStateTime } from '../actions/app';
import moment from 'moment';
import { events } from '@elastic/rhythm-visualizations';
import rison from 'rison-node';
export default dispatch => range => {
  const time = {
    from: moment(range.xaxis.from),
    to: moment(range.xaxis.to),
    mode: 'absolute'
  };
  dispatch(setGlobalStateTime(time));
};
