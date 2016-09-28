import React from 'react';
import { connect } from 'react-redux';
import DashboardEditor from '../../components/dashboard_editor/dashboard_editor';
import { fetchVisData } from '../../actions/vis_data';

const Create = React.createClass({
  fetch() {
    const { dashboard, dispatch } = this.props;
    const options = { includeDashboard: true };
    if (dashboard.panelToEdit) {
      options.panels = [dashboard.panelToEdit];
    }
    dispatch(fetchVisData(options));
  },

  componentWillReceiveProps(props) {
    // Only fetch if the timerange changed
    const { shouldFetch } = props.app;
    if (shouldFetch) {
      this.fetch();
    }
  },

  render() {
    return (
      <DashboardEditor {...this.props}/>
    );
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

export default connect(mapStateToProps)(Create);


