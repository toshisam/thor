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
  mixins: [ PureRenderMixin ],

  getDefaultProps() {
    return {
      className: 'layout',
      rowHeight: 100,
      draggableHandle: '.dashboard__panel-control-move'
    };
  },

  createElement(el) {
    var i = el.add ? '+' : el.i;
    const { dashboard } = this.props;
    const editLocation = {
      pathname: `/dashboards/edit/${dashboard.doc.id}/panel/${el.id}`
    };
    return (
      <div key={i} data-grid={el} className="dashboard__panel">
        <div className="dashboard__panel-content">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-header-title">
              {el.title}
            </div>
            <div className="dashboard__panel-header-controls">
              <div className="dashboard__panel-control-edit">
                <Link to={editLocation}><i className="fa fa-pencil"></i></Link>
              </div>
              <div className="dashboard__panel-control-move">
                <i className="fa fa-arrows"></i>
              </div>
              <div className="dashboard__panel-control-remove">
                <i className="fa fa-times" onClick={ this.handleRemove(el.id) }></i>
              </div>
            </div>
          </div>
          <div className="dashboard__panel-body">
            <Visualization
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
    return (
      <div className="dashboard__body">
        <GridLayout
          onLayoutChange={this.onLayoutChange}
          margin={[5,5]}
          {...this.props}>
          {items}
        </GridLayout>
      </div>
    );
  }
});
