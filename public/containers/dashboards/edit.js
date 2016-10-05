import React from 'react';
import { connect } from 'react-redux';
import scheduler from '../../lib/scheduler';
import DashboardEditor from '../../components/dashboard_editor/dashboard_editor';
import fetch from './fetch';

const Create = React.createClass({
  render() {
    return (<DashboardEditor {...this.props}/>);
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

export default scheduler(fetch)(connect(mapStateToProps)(Create));


