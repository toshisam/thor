import React, { Component, PropTypes } from 'react';
import Tooltip from '../../components/tooltip';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchDashboards } from '../../actions/dashboards';
import { saveDashboard, createNewDashboard, deleteDashboard } from '../../actions/dashboard';
import replaceVars from '../../lib/replace_vars';
import uuid from 'node-uuid';
import moment from 'moment';
import Header from '../header';
import _ from 'lodash';

const List = React.createClass({

  createDashboard() {
    const { dispatch } = this.props;
    const id = uuid.v1();
    dispatch(createNewDashboard(id));
    dispatch(push(`/dashboards/edit/${id}`));
  },

  deleteDashboard(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const { dispatch } = this.props;
      dispatch(deleteDashboard(id));
    }
  },

  cloneDashboard(row) {
    const { dispatch } = this.props;
    const newDashboard = _.cloneDeep(row);
    newDashboard.id = uuid.v1();
    newDashboard.title += ' Copy';
    newDashboard['@timestamp'] = moment.utc().toISOString();
    newDashboard['@update'] = moment.utc().toISOString();
    const dispatcher = saveDashboard(newDashboard);
    dispatch((dispatch, getState) => {
      return dispatcher(dispatch, getState)
        .then(() => dispatch(fetchDashboards()));
    });
  },

  renderRow(row) {
    const { app } = this.props;
    const editLink = { pathname: `/dashboards/edit/${row.id}` };
    const viewLink = { pathname: `/dashboards/view/${row.id}` };
    const owner = 'Public';
    const title = replaceVars(row.title, app.args);
    return (
      <tr key={row.id}>
        <td className="dashboard_list__name">
          <Link to={viewLink}>{title}</Link>
        </td>
        <td className="dashboard_list__modified">{moment(row['@update']).format('lll')}</td>
        <td className="dashboard_list__owner">{ owner }</td>
        <td className="dashboard_list__controls">
          <Tooltip text="Clone">
            <a className="btn btn-default btn-xs"
              onClick={ () => this.cloneDashboard(row, title)}>
              <i className="fa fa-files-o"></i>
            </a>
          </Tooltip>
          <Tooltip text="Edit">
            <Link to={editLink} className="btn btn-default btn-xs">
              <i className="fa fa-pencil"></i>
            </Link>
          </Tooltip>
          <Tooltip text="Delete">
            <a className="btn btn-danger btn-xs"
              onClick={ () => this.deleteDashboard(row.id, title)}>
              <i className="fa fa-trash-o"></i>
            </a>
          </Tooltip>
        </td>
      </tr>
    );
  },

  render() {
    const { dashboards } = this.props;
    let rows = dashboards.data.map(this.renderRow);
    if (!rows) {
      rows = (
        <div className="dashboards_row">
          No dashboards
        </div>
      );
    }
    return (
      <div className="dashboard_list">
        <Header>
          <div className="header__breadcrumbs">
            <span><strong>Thor Dashboards</strong></span>
          </div>
        </Header>
        <div className="dashboard_list__body">
          <table className="table dashboard_list__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Modified On</th>
                <th>Owner</th>
                <th>
                  <a className="btn btn-default btn-xs" onClick={this.createDashboard}><i className="fa fa-plus"></i> Add New Dashboard</a>
                </th>
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

});


function mapStateToProps(state) {
  return {
    app: state.app,
    dashboards: state.dashboards
  };
}

export default connect(mapStateToProps)(List);

