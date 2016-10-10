import moment from 'moment';
export default {
  app: {
    timerange: {
      min: moment.utc().subtract(1, 'hour'),
      max: moment.utc()
    },
    timefilter: {
      mode: 'relative',
      from: 'now-1h',
      to: 'now'
    },
    refresh: {
      paused: false,
      unit: 's',
      value: 10
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
  dashboards: {
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
