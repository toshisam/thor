import React, { Component, PropTypes } from 'react';
import Tooltip from './tooltip';

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
  let clone;
  if (props.onClone) {
    clone = (
      <Tooltip text="Clone">
        <a onClick={ props.onClone }>
          <i className="fa fa-files-o"></i>
        </a>
      </Tooltip>
    );
  }
  return (
    <div className="add_delete__buttons">
      { clone }
      { addBtn }
      { deleteBtn }
    </div>
  );
};
