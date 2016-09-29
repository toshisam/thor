import moment from 'moment';
export default {
  app: {
    timerange: {
      min: moment.utc().subtract(1, 'hour'),
      max: moment.utc()
    },
    timefilter: {
      mode: 'relative',
      unit: 'h',
      value: 1
    },
    refresh: {
      paused: false,
      interval: 10000
    }
  },
  routing: {},
  visData: {
    request: {
      isFetching: false
    },
    panels: {
    }
  },
  fields: {
    request: {
      isFetching: false
    },
    data: []
  },
  dashboard: {
    request: {},
    panelToEdit: false,
    showPanelModal: false,
    doc: {
      title: 'New Dashboard',
      varibles: {},
      filters: [],
      panels: [ ]
    }
  }
};
