import React from 'react';

const VisPickerItem = React.createClass({
  render() {
    const { label, icon, type } = this.props;
    let itemClassName = 'vis_editor__vis_picker-item';
    let iconClassName = 'vis_editor__vis_picker-icon';
    let labelClassName = 'vis_editor__vis_picker-label';
    if (this.props.selected) {
      itemClassName += ' selected';
      iconClassName += ' selected';
      labelClassName += ' selected';
    }
    return (
      <div className={itemClassName} onClick={e => this.props.onClick(type)}>
        <div className={iconClassName}>
          <i className={`fa ${icon}`}></i>
        </div>
        <div className={labelClassName}>
          { label }
        </div>
      </div>
    );
  }
});

export default React.createClass({

  handleChange(type) {
    this.props.onChange({ type });
  },

  render() {
    const { model } = this.props;
    const icons = [
      { type: 'timeseries', icon: 'fa-line-chart', label: 'Time Series'},
      { type: 'metric', icon: 'fa-superscript', label: 'Metric'},
      { type: 'top_n', icon: 'fa-bar-chart fa-rotate-90', label: 'Top N'},
      { type: 'gauge', icon: 'fa-circle-o-notch', label: 'Gauge'},
      { type: 'markdown', icon: 'fa-paragraph', label: 'Markdown'}
    ].map((item, i, items) => {
      return (
        <VisPickerItem
        key={item.type}
        onClick={this.handleChange}
        selected={ item.type === model.type }
        {...item}/>
      );
    });

    return (
      <div className="vis_editor__vis_picker-container">
        { icons }
      </div>
    );
  }
});
