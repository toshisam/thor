import React, { Component, PropTypes } from 'react';
export default (props) => {
  function backToTop(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  }
  const classes = [props.name, 'section'].join(' ');
  return (
    <div className={ classes }>
      <div className="heading">
        <a name={ props.name }></a>
        <div className="title">{ props.title }</div>
        <a onClick={ e => backToTop(e) }>Back to top</a>
      </div>
      { props.children }
    </div>
  );
};
