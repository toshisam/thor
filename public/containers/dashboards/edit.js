import React from 'react';
import { connect } from 'react-redux';
import scheduler from '../../lib/scheduler';
import DashboardEditor from '../../components/dashboard_editor/dashboard_editor';
import { fetchVisData } from '../../actions/vis_data';

const Create = React.createClass({
  render() {
    return (<DashboardEditor {...this.props}/>);
  }
});

function fetch(dispatch, getState) {
  const { dashboard } = getState();
  const options = { includeDashboard: true };
  if (dashboard.panelToEdit) {
    options.panels = [dashboard.panelToEdit];
  }
  dispatch(fetchVisData(options));
}

function mapStateToProps(state) {
  return {
    app: state.app,
    dashboard: state.dashboard,
    fields: state.fields.data,
    visData: state.visData.panels
  };
}

export default scheduler(fetch)(connect(mapStateToProps)(Create));


