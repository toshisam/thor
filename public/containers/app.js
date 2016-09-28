import React, { Component, PropTypes } from 'react';
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
    return (
      <div className="page">
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { app } = state;
  return { error: app.error };
}

export default connect(mapStateToProps)(App);
