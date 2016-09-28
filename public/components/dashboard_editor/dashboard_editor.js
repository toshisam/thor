import _ from 'lodash';
import React from 'react';
import DashboardHeader from './dashboard_header';
import DashboardBody from './dashboard_body';
import { updateDashboard } from '../../actions/dashboard';
import { fetchVisData } from '../../actions/vis_data';
const fields = ['x','y','w','h'];

export default React.createClass({

  fetch() {
    const { dashboard, dispatch } = this.props;
    const options = { includeDashboard: true };
    if (dashboard.panelToEdit) {
      options.panels = [dashboard.panelToEdit];
    }
    dispatch(fetchVisData(options));
  },

  handleChange(part) {
    const { dispatch } = this.props;
    const doc = _.get(this, 'props.dashboard.doc');
    dispatch(updateDashboard(_.assign({}, doc, part)));
    this.fetch();
  },

  handleLayoutChange(layout) {
    const { dashboard } = this.props;
    const part = {
      panels: dashboard.doc.panels.map(panel => {
        const item = layout.find(row => row.i === panel.i);
        return _.assign({}, panel, _.pick(item, fields));
      })
    };
    this.handleChange(part);
  },

  render() {
    return (
      <div className="dashboard">
        <DashboardHeader
          onChange={ this.handleChange }
          {...this.props}/>
        <DashboardBody
          onLayoutChange={ this.handleLayoutChange }
          onChange={ this.handleChange }
          {...this.props}/>
      </div>
    );
  }
});
