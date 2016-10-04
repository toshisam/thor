import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import dateMath from '@elastic/datemath';
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
        const intervalChanged = !_.isEqual(currentRefresh, refresh);
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
          // defer till the next event loop so we get the
          // actual update from the props
          _.defer(() => this.start());
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
          range.min = dateMath.parse(_timefilter.from);
          range.max = dateMath.parse(_timefilter.to);
        } else {
          _.assign(range, timerange);
        }

        dispatch(changeTimerange(range));

        if (_.isFunction(fetch) && !app.refresh.paused) {
          const { refresh } = app;
          const interval = moment.duration(refresh.value, refresh.unit).as('millisecond');
          this.timerId = setTimeout(() => this.start(), interval);
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
