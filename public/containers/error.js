import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
const combos = [
  ['fa-hand-rock-o', 'fa-hand-scissors-o'],
  ['fa-hand-paper-o', 'fa-hand-rock-o'],
  ['fa-hand-scissors-o', 'fa-hand-paper-o'],
];
class Error extends Component {
  constructor(props) {
    super(props);
    const combo = _.sample(combos);
    this.state = this.swap();
  }

  swap() {
    const combo = _.sample(combos);
    return { winner: combo[0], loser: combo[1] };
  }

  componentWillMount() {
    // Redirect Unauthorized requests back to the login page
    const { error, basePath } = this.props;
    const { location } = window;
    if (error.status === 401) {
      // Strip off the base path if it exists
      const pathname = location.pathname.replace(basePath, '');
      window.location = '../login?next=' + encodeURIComponent(`${pathname}?${location.hash}`);
    }
  }

  render() {
    console.error(this.props.error.stack);
    const winnerClasses = ['fa', this.state.winner].join(' ');
    const loserClasses = ['fa', this.state.loser].join(' ');
    return (
      <div className="rhythm-error">
        <div>
          <h1>
            <i className={ winnerClasses }></i>
            <span>vs</span>
            <i className={ loserClasses }></i>
            <span>=</span>
            <i className="fa fa-frown-o"></i>
          </h1>
          <h2>
            <span className="message">{ this.props.error.message }</span>
          </h2>
          <p>
            <Link to="/" className="btn btn-default">Go Home</Link>
          </p>
          <p>
            or try and <strong>refresh</strong> this page.
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { app } = state;
  return { basePath: app.basePath, error: app.error };
}

export default connect(mapStateToProps)(Error);
