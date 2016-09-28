import React, { Component, PropTypes } from 'react';

export default (props) => {
  const createDelete = () => {
    if (props.disableDelete) {
      return (<i className="fa fa-minus disabled"></i>);
    }
    return (
      <a onClick={ props.onDelete }>
        <i className="fa fa-minus"></i>
      </a>
    );
  };
  const deleteBtn = createDelete();
  return (
    <div className="add_delete__buttons">
      <a onClick={ props.onAdd }>
        <i className="fa fa-plus"></i>
      </a>
      { deleteBtn }
    </div>
  );
};
