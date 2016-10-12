import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import scheduler from '../../lib/scheduler';
import { updateDashboard, saveDashboard } from '../../actions/dashboard';
import PanelEditor from '../../components/dashboard_editor/panel_editor';
import fetch from './fetch';

const EditPanel = React.createClass({

  save(dashboard) {
    const { dispatch } = this.props;
    dispatch(saveDashboard(dashboard));
  },

  handleChange(part) {
    const { dispatch, location } = this.props;
    const doc = _.get(this, 'props.dashboard.doc');
    const newDoc = _.assign({}, doc, part);
    dispatch(updateDashboard(newDoc));
    this.save(newDoc);
    const link = {
      pathname: `/dashboards/edit/${doc.id}`,
      query: _.assign({}, location.query)
    };
    dispatch(push(link));
  },

  handlePanelSave(panel) {
    const { dashboard } = this.props;
    const { doc } = dashboard;
    const maxY = _.max(doc.panels
      .map(panel => panel.y)) || 0;
    const current = doc.panels.find(doc => doc.id === panel.id);
    const part = {};
    if (current) {
      part.panels = doc.panels.map(doc => {
        if (doc.id === panel.id) return panel;
        return doc;
      });
    } else {
      part.panels = [
        ...dashboard.doc.panels,
        _.assign({}, panel, {
          i: panel.id,
          x: 0,
          y: maxY && maxY + 1 || 0, // puts it at the bottom
          w: 12,
          h: 4
        })
      ];
    }
    this.handleChange(part);
    // this.resetPanelEditor();
  },

  render() {
    const { panelToEdit } = this.props.dashboard;
    return (<PanelEditor
      model={panelToEdit}
      onSave={this.handlePanelSave}
      onCancel={this.handleCancel}
      {...this.props}/>);
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

export default scheduler(fetch)(connect(mapStateToProps)(EditPanel));

