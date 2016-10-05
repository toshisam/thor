import handleResponse from '../lib/handle_response';
import _ from 'lodash';
export const VIS_DATA_REQUEST = 'VIS_DATA_REQUEST';
export const VIS_DATA_RESPONSE = 'VIS_DATA_RESPONSE';
export const VIS_DATA_ERROR = 'VIS_DATA_ERROR';

export function visDataRequest() {
  return { type: VIS_DATA_REQUEST };
};

export function visDataResponse(json) {
  return { type: VIS_DATA_RESPONSE, json };
};

export function visDataError(error) {
  return { type: VIS_DATA_ERROR, error };
};

export function fetchVisData(options) {
  options = _.assign({}, {
    panels: [],
    filters: [],
    includeDashboard: true
  }, options);

  return (dispatch, getState) => {
    const { filters, panels, includeDashboard } = options;
    const { app, visData, dashboard } = getState();
    if (visData.request.isFetching) return Promise.resolve();
    const dashPanels = dashboard.doc.panels
      .filter(panel => {
        const exists = panels.find(p => p && panel && p.id === panel.id);
        return exists ? false : true;
      })
      .filter(panel => {
        if (!dashboard.panelToEdit) return true;
        return dashboard.panelToEdit.id !== panel.id;
      });
    const params = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': app.kbnVersion
      },
      body: JSON.stringify({
        timerange: app.timerange,
        filters: includeDashboard ? filters.concat(dashboard.doc.filters) : filters,
        panels: includeDashboard ? panels.concat(dashPanels) : panels
      })
    };
    dispatch(visDataRequest());
    return fetch('../api/thor/vis/data', params)
    .then(handleResponse)
    .then(json => dispatch(visDataResponse(json)))
    .catch(e => dispatch(visDataError(e)));
  };

};
