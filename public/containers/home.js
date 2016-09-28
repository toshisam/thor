import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  updateQueryAndFetch,
  fetchServerListingMetrics,
  updateSortAndFetch,
  updatePageAndFetch
} from '../actions/servers';
import HostDetails from '../components/host_details';
import Pagination from '../components/pagination';
let prevLength;

class Home extends Component {
  constructor(props) {
    super(props);
  }

  fetch() {
    const { dispatch } = this.props;
    dispatch(fetchServerListingMetrics());
  }

  submitQuery(query) {
    const { dispatch } = this.props;
    dispatch(updateQueryAndFetch(query));
  }

  changeSort(sort) {
    const { dispatch } = this.props;
    dispatch(updateSortAndFetch(sort));
  }

  componentWillReceiveProps(props) {
    if (props.app.shouldFetch) {
      this.fetch();
    }
  }

  createRow(server) {
    return (<HostDetails
      key={ server.hostname }
      app={ this.props.app }
      { ...server }/>);
  }

  emptyRow() {
    if (this.props.query !== '*') {
      return (
        <tr>
          <td className="data-alert" style={{paddingTop: 20}}>
            <div className="data-alert_title">Your query did not return any results</div>
            <div className="data-alert_note">Change your query and try again.</div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td className="data-alert" style={{paddingTop: 20}}>
            <div className="data-alert_title">Where are my servers?</div>
            <div className="data-alert_note">Check your hosts to make sure Metricbeat is configured properly.<br/>
              Keep in mind it might take a minute or so for new servers to show up.</div>
          </td>
        </tr>
      );
    }
  }

  render() {
    const { size, totalCount, data, page } = this.props;
    const rows = data.length ? data.map(row => this.createRow(row)) : this.emptyRow();
    const totals = (!totalCount) ? null : (
      <Pagination displayTotal={data.length} {...this.props}/>
    );
    return (
      <div className="page__content">
        <table className="servers">
          <tbody>
            { rows }
          </tbody>
        </table>
        { totals }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { routing, app, servers } = state;
  const fields = [
    'sort',
    'totalCount',
    'query',
    'isFetching',
    'data',
    'page',
    'size',
    'error'
  ];
  return _.assign(
    { app },
    _.pick(servers, fields)
  );
}

export default connect(mapStateToProps)(Home);
