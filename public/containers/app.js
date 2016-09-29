import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Error from '../containers/error';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.error) {
      return (<Error/>);
    }
    let spinner;
    if (this.props.showSpinner) {
      spinner = (<div className="spinner"/>);
    }
    return (
      <div className="page">
        { spinner }
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { app } = state;
  const showSpinner = _.get(state, 'dashboard.request.isFetching', false)
    || _.get(state, 'fields.request.isFetching', false)
    || _.get(state, 'visData.request.isFetching', false);

  return {
    error: app.error,
    showSpinner
  };
}

export default connect(mapStateToProps)(App);
