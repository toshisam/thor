import React from 'react';
import _ from 'lodash';
import Timepicker from '../timepicker/picker';
import TimepickerConfig from '../timepicker/config';
import EditableText from '../editable_text';
import SearchBox from '../search_box';
import replaceVars from '../../lib/replace_vars';
import uuid from 'node-uuid';
import Modal from 'react-modal';
import PanelEditor from './panel_editor';
import createNewPanel from '../../lib/create_new_panel';
import ConfigPanel from '../config_panel';
import {
  hidePanelModal,
  showPanelModal,
  panelToEdit
} from '../../actions/dashboard';
import { push } from 'react-router-redux';
import Header from '../../containers/header';
export default React.createClass({

  getInitialState() {
    return { showSettings: false };
  },

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

  handleSettingsClose() {
    this.setState({ showSettings: false });
  },

  handleSettingsOpen() {
    this.setState({ showSettings: !this.state.showSettings });
  },

  addPanel() {
    const { dispatch, dashboard } = this.props;
    const panel = createNewPanel();
    dispatch(panelToEdit(panel));
    dispatch(push(`/dashboards/edit/${dashboard.doc.id}/panel/${panel.id}`));
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
    let settings;
    if (this.state.showSettings) {
      settings = (<div>Dashboard settings</div>);
    }
    return (
      <div>
        <Header config={settings} onConfigClose={this.handleSettingsClose}>
          <EditableText
            className="dashboard__header-title"
            onChange={this.createHandler('title')}
            format={ str => replaceVars(str, this.props.location) }
            value={doc.title}/>
          <div className="dashboard__header-links">
            <a className="dashboard__header-link"
              onClick={this.addPanel}>
              <i className="fa fa-plus"></i>
              &nbsp;Add Panel
            </a>
            <a className="dashboard__header-link"
              onClick={this.handleSettingsOpen}>
              <i className="fa fa-cog"></i>
              &nbsp;Dashboard Settings
            </a>
          </div>
        </Header>
      </div>
    );
  }

});
