import React from 'react';
export default React.createClass({

  defaultProps: {
    className: 'editable-text',
    format: str => str
  },

  getInitialState() {
    return { value: this.props.value, editing: false };
  },

  handleChange() {
    this.setState({ value: this.refs.text.value });
  },

  save(e) {
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
    this.props.onChange(this.state.value);
  },

  edit(e) {
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
  },

  render() {
    if (this.state.editing) {
      return (
        <div className={ this.props.className }>
          <input
            ref="text"
            defaultValue={ this.props.value }
            onChange={ this.handleChange }/>
          <i onClick={ this.save }
            className="fa fa-check-square"/>
        </div>
      );
    }

    return (
      <div className={ this.props.className }>
        { this.props.format(this.props.value) }
        <i onClick={ this.edit }
          className="fa fa-pencil"/>
      </div>
    );
  }
});
