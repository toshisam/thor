import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import getTimerange from '../lib/get_timerange';
import {
  fetchServerMetrics
} from '../actions/server';
import State from '../components/state';
import Tags from '../components/tags';
import Sections from '../components/sections';
import Nav from '../components/nav';
import { Link } from 'react-router';

class Detail extends Component {
  constructor(props) {
    super(props);
  }

  fetch() {
    const { dispatch } = this.props;
    dispatch(fetchServerMetrics());
  }

  componentWillReceiveProps(props) {
    if (props.app.shouldFetch) {
      this.fetch();
    }
  }

  componentDidMount() {
    this.fetch();
  }

  scrollToTop(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div></div>
      );
    }
    const { metrics, details } = this.props;
    const backToTop = e => this.scrollToTop(e);
    return (
      <div className="page__content detail">
        <div className="details">
          <div className="header">
            <h1>{ details.hostname }</h1>
            <div className={ ['state', details.state].join(' ') }>{ details.state }</div>
          </div>
          <Sections {...this.props}/>
        </div>
        <div className="side-nav">
          <div className="floating-nav">
            <div className="heading">Sections</div>
            <Nav {...this.props}/>
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state, ownProps) {
  const { app, server } = state;
  const fields = [
    'crosshair',
    'isFetching',
    'error',
    'request',
    'metrics',
    'sections',
    'details',
    'id'
  ];
  return _.assign(
    { app, loaded: !!server.details },
    _.pick(server, fields)
 );
}

export default connect(mapStateToProps)(Detail);
