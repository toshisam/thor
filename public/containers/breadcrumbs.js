import { Link } from 'react-router';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
  }

  getCrumbs() {
    const { history } = this.props;
    const serversLink = history.createHref({
      pathname: '/servers',
      query: { _g: this.props.app.globalState.rison }
    });
    const urlPath = this.props.routing.locationBeforeTransitions.pathname;
    if (/^\/servers/.test(urlPath)) {
      return (
        <span className="crumbs">
          <span className="crumb">Servers</span>
        </span>
      );
    }
    if (/^\/detail/.test(urlPath) && this.props.hostname) {
      return (
        <span className="crumbs">
          <span className="crumb">
            <a href={ serversLink }>Servers</a>
          </span>
          <span className="divider">/</span>
          <span className="crumb">{ this.props.hostname }</span>
        </span>
      );
    }
    if (/^\/status/.test(urlPath)) {
      return (
        <span className="crumbs">
          <span className="crumb">
            <a href={ serversLink }>Back to Servers</a>
          </span>
        </span>
      );
    }
  }

  render() {
    const crumbs = this.getCrumbs();
    return (
      <div className="kibana-nav-info">
        <span className="kibana-nav-info-title">
          Rhythm
        </span>
        { crumbs }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    routing: _.get(state, 'routing'),
    app: _.get(state, 'app'),
    hostname: _.get(state, 'server.details.hostname')
  };
}

export default connect(mapStateToProps)(Breadcrumbs);

