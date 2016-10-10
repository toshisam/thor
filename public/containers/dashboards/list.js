import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createNewDashboard } from '../../actions/dashboard';
import uuid from 'node-uuid';

const List = React.createClass({

  createDashboard() {
    const { dispatch } = this.props;
    const id = uuid.v1();
    dispatch(createNewDashboard(id));
    dispatch(push(`/dashboards/edit/${id}`));
  },

  renderRow(row) {
    const editLink = { pathname: `/dashboards/edit/${row.id}` };
    return (
      <div className="dashboards__row">
        <div className="dashboards__title">{row.title}</div>
        <Link to={editLink}>Edit</Link>
      </div>
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
      <div>
        <h1>Dashboards</h1>
        <a onClick={this.createDashboard}>New Dashboard</a>
        { rows }
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

