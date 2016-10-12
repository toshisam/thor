import React from 'react';
import { connect } from 'react-redux';
import scheduler from '../../lib/scheduler';
import DashboardView from '../../components/dashboard_editor/dashboard_view';
import fetch from './fetch';

const View = React.createClass({
  render() {
    return (<DashboardView {...this.props}/>);
  }
});

function mapStateToProps(state) {
  return {
    app: state.app,
    dashboard: state.dashboard,
    fields: state.fields.data,
    visData: state.visData.panels
  };
}

export default scheduler(fetch)(connect(mapStateToProps)(View));


