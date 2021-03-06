import _ from 'lodash';
import React from 'react';
import DashboardHeader from './dashboard_header';
import DashboardBody from './dashboard_body';
import { updateDashboard, saveDashboard } from '../../actions/dashboard';
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

  componentWillMount() {
    const { dispatch } = this.props;
    this.save = _.debounce((dashboard) => {
      dispatch(saveDashboard(dashboard));
    }, 1000, { leading: false, trailing: true });
  },

  handleChange(part) {
    const { dispatch } = this.props;
    const doc = _.get(this, 'props.dashboard.doc');
    const newDoc = _.assign({}, doc, part);
    if (!_.isEqual(newDoc, doc)) {
      dispatch(updateDashboard(newDoc));
      this.fetch();
      this.save(newDoc);
    }
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
    const { dashboard, location } = this.props;
    const margin = Number(dashboard.doc.panel_margin) || 0;
    const fullScreen = Boolean(location.query.fullScreen) ||
      this.props.fullScreen;
    return (
      <div className="dashboard">
        <DashboardHeader
          onFullScreen={ this.handleFullScreen }
          onChange={ this.handleChange }
          {...this.props}/>
        <DashboardBody
          margin={[margin, margin]}
          fullScreen={fullScreen}
          onLayoutChange={ this.handleLayoutChange }
          onChange={ this.handleChange }
          {...this.props}/>
      </div>
    );
  }
});
