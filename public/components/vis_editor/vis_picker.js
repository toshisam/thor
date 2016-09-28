import React from 'react';

const VisPickerItem = React.createClass({
  render() {
    const { label, icon } = this.props;
    let itemClassName = 'vis_editor__vis_picker-item';
    let iconClassName = 'vis_editor__vis_picker-icon';
    let labelClassName = 'vis_editor__vis_picker-label';
    if (this.props.selected) {
      itemClassName += ' selected';
      iconClassName += ' selected';
      labelClassName += ' selected';
    }
    return (
      <div className={itemClassName}>
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
  render() {
    const { model } = this.props;
    const icons = [
      { key: 'timeseries', icon: 'fa-line-chart', label: 'Time Series'},
      { key: 'metric', icon: 'fa-superscript', label: 'Metric'},
      { key: 'top_n', icon: 'fa-bar-chart fa-rotate-90', label: 'Top N'},
      { key: 'gauge', icon: 'fa-circle-o-notch', label: 'Gauge'},
      { key: 'markdown', icon: 'fa-paragraph', label: 'Markdown'}
    ].map((item, i, items) => {
      return (
        <VisPickerItem selected={ item.key === model.type } {...item}/>
      );
    });

    return (
      <div className="vis_editor__vis_picker-container">
        { icons }
      </div>
    );
  }
});
