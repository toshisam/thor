import fetch from 'isomorphic-fetch';
import handleResponse from '../lib/handle_response';
export const FIELDS_REQUEST = 'FIELDS_REQUEST';
export const FIELDS_RESPONSE = 'FIELDS_RESPONSE';
export const FIELDS_ERROR = 'FIELDS_ERROR';

export function fieldsRequest() {
  return { type: FIELDS_REQUEST };
}

export function fieldsResponse(json) {
  return { type: FIELDS_RESPONSE, json };
};

export function fieldsError(error) {
  return { type: FIELDS_ERROR, error };
}

export function fetchFields(index = '*') {
  return (dispatch, getState) => {
    const { app, fields } = getState();
    if (fields.request.isFetching) return Promise.resolve();
    const params = {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'kbn-version': app.kbnVersion
      }
    };
    dispatch(fieldsRequest());
    return fetch(`../api/thor/fields?index=${index}`, params)
    .then(handleResponse)
    .then(json => dispatch(fieldsResponse(json)))
    .catch(e => dispatch(fieldsError(e)));
  };
};
