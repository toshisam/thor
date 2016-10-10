import React from 'react';
import timeseries from './series_config/timeseries';
import metric from './series_config/metric';

const types = {
  timeseries,
  metric
};

export default React.createClass({

  getInitialState() {
    return { show: false };
  },

  handleClick() {
    this.setState({ show: !this.state.show });
  },

  render() {
    const { panelType } = this.props;
    const Component = types[panelType];

    let className = 'fa fa-caret-right';
    let message = 'Show Options';
    if (this.state.show) {
      message = 'Hide Options';
      className = 'fa fa-caret-down';
    }

    if (Component) {
      return (
        <div>
          <div onClick={this.handleClick} className="vis_editor__subhead">
            <i className={className}></i>
            <span> {message}</span>
          </div>
          { this.state.show ? (<Component {...this.props}/>) :
            (<div style={{display: 'none'}}/>) }
        </div>
      );
    }
    return (<div>Missing Series Config for {panelType}</div>);
  }
});

