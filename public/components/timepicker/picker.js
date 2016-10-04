import React from 'react';
import _ from 'lodash';
import ConfigPanel from '../config_panel';
import prettyDurration from './pretty_durration';
import prettyInterval from './pretty_interval';

export default React.createClass({
  handlePauseClick() {
    const { refresh } = this.props;
    if (_.isFunction(this.props.onPause)) {
      this.props.onPause(!refresh.paused);
    }
  },

  handlePickerClick() {
    if (_.isFunction(this.props.onPickerClick)) {
      this.props.onPickerClick();
    }
  },

  handleIntervalClick() {
    if (_.isFunction(this.props.onIntervalClick)) {
      this.props.onIntervalClick();
    }
  },

  render() {
    const { refresh, timefilter } = this.props;
    const pauseClass = refresh.paused ? 'fa fa-play' : 'fa fa-pause';
    const timefilterLabel = prettyDurration(timefilter.from, timefilter.to);
    const intervalLabel = prettyInterval(refresh);
    return (
      <div className="timepicker">
        <div className="timepicker__refresh">
          <i className={pauseClass} onClick={this.handlePauseClick}></i>
          <div className="timepicker__refresh-label" onClick={this.handleIntervalClick}>{ intervalLabel }</div>
        </div>
        <div className="timepicker__pick">
          <i className="fa fa-clock-o"></i>
          <div className="timepicker__pick-label" onClick={this.handlePickerClick}>{ timefilterLabel }</div>
        </div>
      </div>
    );
  }
});
