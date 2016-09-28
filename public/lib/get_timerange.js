import moment from 'moment';
export default () => {
  const min = moment.utc()
    .subtract(15, 'minutes').valueOf();
  const max = moment.utc().valueOf();
  return {
    min: moment.utc(min),
    max: moment.utc(max)
  };
};

