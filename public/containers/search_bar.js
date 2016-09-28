import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SearchBox from '../components/search_box';
import SortBox from '../components/sort_box';

class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  submitQuery(query) {
    const { history, routing } = this.props;
    const location = routing.locationBeforeTransitions;
    history.push({
      pathname: location.pathname,
      query: _.assign({}, location.query, { query })
    });
  }

  changeSort(sort) {
    const { history, routing } = this.props;
    const location = routing.locationBeforeTransitions;
    history.push({
      pathname: location.pathname,
      query: _.assign({}, location.query, {
        sort: `${sort.field}:${sort.direction}`
      })
    });
  }

  render() {
    return (
      <form role="form" className="fill inline-form" >
        <div className="search-bar">
          <SearchBox
            action={ query => this.submitQuery(query) }
            query={ this.props.query }/>
          <SortBox
            action={ sort => this.changeSort(sort) }
            sort={ this.props.sort }/>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const { servers } = state;
  const fields = [
    'sort',
    'query'
  ];
  return _.assign(
    _.pick(servers, fields)
  );
}

export default connect(mapStateToProps)(SearchBar);
