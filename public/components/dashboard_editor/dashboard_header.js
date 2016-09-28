import React from 'react';
import _ from 'lodash';
import EditableText from '../editable_text';
import SearchBox from '../search_box';
import replaceVars from '../../lib/replace_vars';
import uuid from 'node-uuid';
import Modal from 'react-modal';
import PanelEditor from './panel_editor';
import createNewPanel from '../../lib/create_new_panel';
import { hidePanelModal, showPanelModal, panelToEdit } from '../../actions/dashboard';
export default React.createClass({

  createHandler(name) {
    return (value) => {
      const doc = {};
      doc[name] = value;
      this.props.onChange(doc);
    };
  },

  handleSearch(query) {
    console.log('Search', query);
  },

  openSettings() {
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
          h: 2
        })
      ];
    }
    this.props.onChange(part);
    this.resetPanelEditor();
  },

  resetPanelEditor() {
    const { dispatch } = this.props;
    dispatch(hidePanelModal());
    dispatch(panelToEdit(false));
  },

  handlePanelCancel() {
    this.resetPanelEditor();
  },

  addPanel() {
    const { dispatch } = this.props;
    dispatch(panelToEdit(createNewPanel()));
    dispatch(showPanelModal());
  },

  render() {
    const { dashboard } = this.props;
    const { showPanelModal, panelToEdit, doc } = dashboard;
    const modalStyle = {
      overlay: {
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.75)'
      },
      content: {
        display: 'flex',
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
      }
    };
    return (
      <div className="dashboard__header">
        <div className="dashboard__header-title-row">
          <EditableText
            className="dashboard__header-title"
            onChange={this.createHandler('title')}
            format={ str => replaceVars(str, this.props.location) }
            value={doc.title}/>
          <a className="btn btn-default btn-xs"
            onClick={this.addPanel}>
            <i className="fa fa-plus"></i>
            &nbsp;Add Widget
          </a>
          <a className="btn btn-default btn-xs"
            onClick={this.openSettings}>
            <i className="fa fa-cog"></i>
            &nbsp;Dashboard Settings
          </a>
        </div>
        <SearchBox
          className="dashboard__header-searchbox"
          placeholder="Search results to overlay..."
          action={ this.handleSearch }/>
        <Modal style={ modalStyle } isOpen={ showPanelModal }>
          <PanelEditor
            onSave={this.handlePanelSave}
            onCancel={this.handlePanelCancel}
            model={panelToEdit}
            {...this.props}/>
        </Modal>
      </div>
    );
  }

});
