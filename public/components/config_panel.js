import React from 'react';
import _ from 'lodash';
export default React.createClass({

  handleClose() {
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  },

  render() {
    if (!this.props.show) return (<div style={{display:'none'}}/>);
    return (
      <div className="config_panel">
        <div className="config_panel__body">{ this.props.children }</div>
        <div className="config_panel__control">
          <i className="fa fa-chevron-up"
            onClick={this.handleClose}/>
      </div>
      </div>
    );
  }
});
