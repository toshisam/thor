import React from 'react';
import _ from 'lodash';
import Timepicker from '../timepicker/picker';
import TimepickerConfig from '../timepicker/config';
import SearchBox from '../search_box';
import replaceVars from '../../lib/replace_vars';
import uuid from 'node-uuid';
import Modal from 'react-modal';
import PanelEditor from './panel_editor';
import createNewPanel from '../../lib/create_new_panel';
import DashboardSettings from './dashboard_settings';
import ConfigPanel from '../config_panel';
import { Link } from 'react-router';
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
    const { dispatch, dashboard, location } = this.props;
    const panel = createNewPanel();
    dispatch(panelToEdit(panel));
    const link = {
      pathname: `/dashboards/edit/${dashboard.doc.id}/panel/${panel.id}`,
      query: _.assign({}, location.query)
    };
    dispatch(push(link));
  },

  render() {
    const { viewOnly, location, dashboard, app } = this.props;
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
      settings = (<DashboardSettings {...this.props}/>);
    }
    const dashboardsLink = {
      pathname: `/dashboards`
    };
    const viewType = viewOnly ? 'view' : 'edit';
    const fullScreenLink = {
      pathname: `/dashboards/${viewType}/${dashboard.doc.id}`,
      query: _.assign({}, location.query, {
        fullScreen: true
      })
    };
    const editLink = {
      pathname: `/dashboards/edit/${dashboard.doc.id}`,
      query: _.assign({}, location.query)
    };
    const title = replaceVars(doc.title, app.args);
    return (
      <div>
        <Header config={settings} onConfigClose={this.handleSettingsClose}>
          <div className="header__breadcrumbs">
            <Link to={dashboardsLink}>Thor Dashboards</Link>
            <span>/</span>
            <span><strong>{ title }</strong></span>
          </div>
          <div className="dashboard__header-links">
            { !viewOnly ? (
              <a className="dashboard__header-link"
                onClick={this.addPanel}>
                <i className="fa fa-plus"></i>
                &nbsp;Add Panel
              </a>
            ) : ''}
            { !viewOnly ? (
             <a className="dashboard__header-link"
                onClick={this.handleSettingsOpen}>
                <i className="fa fa-cog"></i>
                &nbsp;Dashboard Settings
              </a>
            ) : ''}
            { viewOnly ? (
            <Link to={editLink}
              onClick={this.handleFullScreen}
              className="dashboard__header-link">
              <i className="fa fa-pencil"></i>
              &nbsp;Edit Dashboard
            </Link>
            ) : ''}
            <Link to={fullScreenLink}
              onClick={this.handleFullScreen}
              className="dashboard__header-link">
              <i className="fa fa-arrows-alt"></i>
              &nbsp;Full Screen
            </Link>
          </div>
        </Header>
      </div>
    );
  }

});
