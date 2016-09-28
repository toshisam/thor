import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class SearchBox extends Component {

  constructor(props) {
    super(props);
    this.state = { query: this.props.query };
  }

  submit(event) {
    event.preventDefault();
    this.props.action(this.state.query);
  }

  handleChangeEvent(event) {
    this.setState({ query: this.refs.search.value });
  }

  handleKeyPress(event) {
    if (event.charCode === 13) this.submit(event);
  }

  render() {
    const query = this.state.query !== '*' && this.state.query || '';
    return (
      <div className={ this.props.className }>
        <input
          type="text"
          value={ query }
          placeholder={ this.props.placeholder }
          onChange={ event => this.handleChangeEvent(event) }
          onKeyPress={ event => this.handleKeyPress(event) }
          ref="search"
          className="form-control"/>
        <button
          type="search"
          onClick={ (event) => this.submit(event) }>
          <span className="fa fa-search"></span>
        </button>
      </div>
    );
  }

}

SearchBox.defaultProps = {
  placeholder: 'Search...',
  className: 'search-box input-group'
};

export default SearchBox;
