import _ from 'lodash';
import React from 'react';
import DashboardHeader from './dashboard_header';
import DashboardBody from './dashboard_body';
import { fetchVisData } from '../../actions/vis_data';

export default React.createClass({

  fetch() {
    const { dashboard, dispatch } = this.props;
    const options = { includeDashboard: true };
    if (dashboard.panelToEdit) {
      options.panels = [dashboard.panelToEdit];
    }
    dispatch(fetchVisData(options));
  },

  render() {
    const { dashboard, location } = this.props;
    const margin = Number(dashboard.doc.panel_margin) || 0;
    const fullScreen = Boolean(location.query.fullScreen) ||
      this.props.fullScreen;
    return (
      <div className="dashboard">
        <DashboardHeader
          viewOnly={true}
          onFullScreen={ this.handleFullScreen }
          {...this.props}/>
        <DashboardBody
          viewOnly={true}
          margin={[margin, margin]}
          fullScreen={fullScreen}
          {...this.props}/>
      </div>
    );
  }
});

