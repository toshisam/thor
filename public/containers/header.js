import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SearchBar from '../containers/search_bar';
import DetailHeader from '../components/detail_header';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { details, routing } = this.props;
    const urlPath = routing.locationBeforeTransitions.pathname;
    if (/^\/servers/.test(urlPath)) {
      return (<SearchBar {...this.props}/>);
    }
    return (<div></div>);
  }
}

function mapStateToProps(state) {
  return {
    routing: _.get(state, 'routing'),
    app: _.get(state, 'app'),
    details: _.get(state, 'server.details', {})
  };
}

export default connect(mapStateToProps)(Header);

