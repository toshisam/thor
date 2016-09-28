import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class List extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Dashboards</h1>
        { this.props.children }
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    app: state.app,
    dashboards: state.dashboards
  };
}

export default connect(mapStateToProps)(List);

