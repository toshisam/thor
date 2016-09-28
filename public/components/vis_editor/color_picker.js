import React from 'react';
import { CompactPicker } from 'react-color';
export default React.createClass({

  getInitialState() {
    return { displayPlicker: false, color: {} };
  },

  handleChange(color) {
    const part = {};
    part[this.props.name] = color.hex;
    if (this.props.onChange) this.props.onChange(part);
    this.setState({ displayPicker: false });
  },

  handleClick() {
    this.setState({ displayPicker: !this.state.displayColorPicker });
  },

  handleClose() {
    this.setState({ displayPicker: false });
  },

  render() {
    return (
      <div>
        <div
          style={{ backgroundColor: this.props.value }}
          className="vis_editor__color_picker-swatch"
          onClick={this.handleClick}/>
        { this.state.displayPicker ? <div className="vis_editor__color_picker-popover">
          <div className="vis_editor__color_picker-cover" onClick={ this.handleClose }/>
          <CompactPicker color={ this.props.value } onChange={ this.handleChange } />
        </div> : null }
      </div>
    );
  }

});
