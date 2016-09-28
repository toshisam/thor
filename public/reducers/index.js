import _ from 'lodash';
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import app from './app';
import dashboard from './dashboard';
import fields from './fields';
import visData from './vis_data';

export default combineReducers({
  routing: routerReducer,
  app,
  dashboard,
  fields,
  visData
});
