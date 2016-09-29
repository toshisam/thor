import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import storeShape from 'react-redux/lib/utils/storeShape';
import { changeTimerange } from '../actions/app';
export default function scheduler(fetch) {
  return (WrappedComponent) => {
    function mapStateToProps(state) {
      const { app } = state;
      return { app };
    }

    class Scheduler extends Component {

      constructor(props, context) {
        super(props, context);
      }

      componentWillReceiveProps(props) {
        // Only fetch if the timerange changed
        const { shouldFetch, refresh, timefilter } = props.app;
        const currentRefresh = this.props.app.refresh;
        const currentTimefilter = this.props.app.timefilter;

        const pausedChanged = currentRefresh.paused !== refresh.paused;
        const intervalChanged = currentRefresh.interval !== refresh.interval;
        const timefilterChanged = !_.isEqual(currentTimefilter, timefilter);

        if (shouldFetch && _.isFunction(fetch)) {
          const { dispatch, getState } = this.context.store;
          fetch(dispatch, getState);
        }

        if (pausedChanged && refresh.paused) {
          this.stop();
        }

        if (!refresh.paused && (intervalChanged || pausedChanged || timefilterChanged)) {
          this.stop();
          this.start(timefilter);
        }
      }

      componentDidMount() {
        this.start();
      }

      componentWillUnmount() {
        this.stop();
      }

      start(timefilter) {
        const { dispatch, app } = this.props;
        const range = {};
        const { timerange } = app;
        const _timefilter = timefilter || app.timefilter;

        if (_timefilter.mode === 'relative') {
          range.min = moment.utc()
            .subtract(_timefilter.value, _timefilter.unit);
          range.max = moment.utc();
        } else {
          _.assign(range, timerange);
        }

        dispatch(changeTimerange(range));

        if (_.isFunction(fetch) && !app.refresh.paused) {
          this.timerId = setTimeout(() => this.start(), app.refresh.interval);
        }
      }

      stop() {
        clearTimeout(this.timerId);
      }

      render() {
        return (<WrappedComponent {...this.props}/>);
      }
    }

    Scheduler.contextTypes = {
      store: storeShape
    };

    return connect(mapStateToProps)(Scheduler);
  };
};
