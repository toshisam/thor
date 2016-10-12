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

  componentWillReceiveProps(props) {
    // Trigger a resize if we are transitioning
    // between fullScreen states
    if (props.fullScreen !== this.props.fullScreen) {
      _.defer(() => {
        const event = new Event('resize');
        window.dispatchEvent(event);
      });
    }
  },

  createElement(el) {
    const { dashboard, location, viewOnly } = this.props;
    const { doc } = dashboard;
    const editLocation = {
      pathname: `/dashboards/edit/${dashboard.doc.id}/panel/${el.id}`,
      query: _.assign({}, location.query)
    };
    const backgroundColor = doc.default_panel_color || doc.background_color;
    const grid = _.assign({}, el, {
      static: !!viewOnly
    });
    const panelClass = viewOnly ? 'dashboard__panel-viewOnly' : 'dashboard__panel';
    return (
      <div key={el.id} data-grid={grid} className={panelClass}>
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
              backgroundColor={backgroundColor}
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
    if (this.props.fullScreen) {
      style.position = 'fixed';
      style.top = 0;
      style.right = 0;
      style.bottom = 0;
      style.left = 0;
    }
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
