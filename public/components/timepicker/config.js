import React from 'react';
import _ from 'lodash';
import quickRanges from './quick_ranges';
export default React.createClass({

  getInitialState() {
    return { panel: 'quick', mode: 'relative' };
  },

  renderRelative() {
    return (
      <div className="timepicker__relative">
      </div>
    );
  },

  renderAbsolute() {
    return (
      <div className="timepicker__absolute">
      </div>
    );
  },

  setRange(from, to) {
    this.setState({ from, to });
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange({
        from,
        to,
        mode: this.state.mode
      });
    }
  },

  renderQuick() {
    const pick = (from, to) => e => this.setRange(from, to);
    const renderItem = (row, i) => {
      return (
        <a
          key={`timepicker-item-${row.section}-${i}`}
          className="timepicker__quick-item"
          onClick={pick(row.from, row.to)}>{ row.display }</a>
      );
    };
    const bySection = section => row => row.section === section;
    const renderColumn = section => {
      return (
        <div key={`timepicker-section-${section}`}
          className="timepicker__quick-column">
          { quickRanges.filter(bySection(section)).map(renderItem) }
        </div>
      );
    };
    return (
      <div className="timepicker__quick">
        { _.times(4).map(renderColumn) }
      </div>
    );
  },

  switchTo(panel) {
    this.setState({ panel });
  },

  render() {
    let panel;
    let quickClassName = 'timepicker__switcher-option';
    let relativeClassName = 'timepicker__switcher-option';
    let absoluteClassName = 'timepicker__switcher-option';
    switch (this.state.panel) {
      case 'absolute':
        panel = this.renderAbsolute();
        absoluteClassName += ' active';
        break;
      case 'relative':
        panel = this.renderRelative();
        relativeClassName += ' active';
        break;
      default:
        panel = this.renderQuick();
        quickClassName += ' active';
    }
    return (
      <div className="timepicker__picker">
        <div className="timepicker__switcher">
          <a className={quickClassName}
            onClick={ e => this.switchTo('quick') }>Quick</a>
          <a className={relativeClassName}
            onClick={ e => this.switchTo('relative') }>Relative</a>
          <a className={absoluteClassName}
            onClick={ e => this.switchTo('absolute') }>Absolute</a>
       </div>
        <div className="timepicker__active_panel">{ panel }</div>
      </div>
    );
  }
});

