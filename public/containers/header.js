import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import replaceVars from '../lib/replace_vars';
import Timepicker from '../components/timepicker/picker';
import TimepickerConfig from '../components/timepicker/config';
import ConfigPanel from '../components/config_panel';
import EditableText from '../components/editable_text';
import {
  setRefresh,
  setTimefilter
} from '../actions/app';

const Header = React.createClass({
  getInitialState() {
    return {
      showTimepicker: false,
      showInterval: false
    };
  },

  componentWillReceiveProps(props) {
    if (props.config) {
      this.setState({
        showTimepicker: false,
        showInterval: false
      });
    }
  },

  handleConfigClose() {
    this.setState({
      showTimepicker: false,
      showInterval: false
    });
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
  },

  handleTimepickerClick() {
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showTimepicker: !this.state.showTimepicker });
  },

  handleTimepickerChange(timefilter) {
    const { dispatch } = this.props;
    dispatch(setTimefilter(timefilter));
    this.setState({ showTimepicker: !this.state.showTimepicker });

  },

  handleIntervalClick() {
    if (_.isFunction(this.props.onConfigClose)) {
      this.props.onConfigClose();
    }
    this.setState({ showInterval: !this.state.showInterval });
  },


  handleTimepickerPause(paused) {
    const { dispatch, app } = this.props;
    const nextRefresh = _.assign({}, app.refresh, { paused });
    dispatch(setRefresh(nextRefresh));
  },


  render() {
    const { details, routing } = this.props;
    const urlPath = routing.locationBeforeTransitions.pathname;
    if (/^\/servers/.test(urlPath)) {
      return (<SearchBar {...this.props}/>);
    }
    let config;
    if (this.props.config) {
      config = this.props.config;
    } else if (this.state.showTimepicker) {
      config = (<TimepickerConfig onChange={this.handleTimepickerChange}/>);
    }
    return (
      <div className="header">
        <div className="header__content">
          { this.props.children }
          <Timepicker
            refresh={this.props.app.refresh}
            timefilter={this.props.app.timefilter}
            onPause={ this.handleTimepickerPause }
            onIntervalClick={ this.handleIntervalClick }
            onPickerClick={ this.handleTimepickerClick }/>
        </div>
        <ConfigPanel show={config ? true : false} onClose={this.handleConfigClose}>
          { config }
        </ConfigPanel>
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    routing: _.get(state, 'routing'),
    app: _.get(state, 'app'),
    details: _.get(state, 'server.details', {})
  };
}

export default connect(mapStateToProps)(Header);

