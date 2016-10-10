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
  const createAdd = () => {
    if (props.disableAdd) {
      return (<i className="fa fa-plus disabled"></i>);
    }
    return (
      <a onClick={ props.onAdd }>
        <i className="fa fa-plus"></i>
      </a>
    );
  };
  const deleteBtn = createDelete();
  const addBtn = createAdd();
  return (
    <div className="add_delete__buttons">
      { addBtn }
      { deleteBtn }
    </div>
  );
};
