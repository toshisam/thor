/* eslint new-cap:0 */
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { showPanelModal, panelToEdit } from '../../actions/dashboard';
import Visualization from '../vis_editor/visualization';
const GridLayout = WidthProvider(ReactGridLayout);

export default React.createClass({
  // mixins: [ PureRenderMixin ],

  getDefaultProps() {
    return {
      margin: [0,0],
      rowHeight: 50,
      measureBeforeMount: true,
      useCSSTransforms: false,
      draggableHandle: '.dashboard__panel-controls'
    };
  },

  createElement(el) {
    const { dashboard } = this.props;
    const editLocation = {
      pathname: `/dashboards/edit/${dashboard.doc.id}/panel/${el.id}`
    };
    return (
      <div key={el.id} data-grid={el} className="dashboard__panel">
        <div className="dashboard__panel-content">
          <div className="dashboard__panel-controls">
            <div className="dashboard__panel-control-edit">
              <Link to={editLocation}><i className="fa fa-pencil"></i>&nbsp;</Link>
            </div>
            <div className="dashboard__panel-control-move">
              <i className="fa fa-arrows"></i>&nbsp;
            </div>
            <div className="dashboard__panel-control-remove">
              <i className="fa fa-times" onClick={ this.handleRemove(el.id) }></i>&nbsp;
            </div>
          </div>
          <div className="dashboard__panel-body">
            <Visualization
              backgroundColor={dashboard.doc.background_color}
              className="dashboard__visualization"
              model={el}
              visData={this.props.visData}/>
          </div>
        </div>
      </div>
    );
  },

  handleRemove(id) {
    return (e) => {
      if (!confirm('Are you sure you want to remove this widget?')) return;
      if (this.props.onChange) {
        const { dashboard } = this.props;
        const { doc } = dashboard;
        const part = {
          panels: _.reject(doc.panels, { id })
        };
        this.props.onChange(part);
      }
    };
  },

  onLayoutChange(layout) {
    if (this.props.onLayoutChange) this.props.onLayoutChange(layout);
  },

  render() {
    const { dashboard } = this.props;
    const { doc } = dashboard;
    const items = _.map(doc.panels, this.createElement);
    const style = {};
    if (doc.background_color) {
      style.backgroundColor = doc.background_color;
    }
    return (
      <div className="dashboard__body" style={style}>
        <GridLayout
          onLayoutChange={this.onLayoutChange}
          {...this.props}>
          {items}
        </GridLayout>
      </div>
    );
  }
});
