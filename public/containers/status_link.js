import { Link } from 'react-router';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class StatusLink extends Component {

  constructor(props) {
    super(props);
  }

  getStatusLink() {
    const { history, app } = this.props;
    return history.createHref({
      pathname: '/status',
      query: { _g: app.globalState.rison }
    });
  }

  render() {
    return (
      <div className="rhythm-status">
        <a href={ this.getStatusLink() }>
          <i className="fa fa-heart"></i>
        </a>
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

export default connect(mapStateToProps)(StatusLink);

