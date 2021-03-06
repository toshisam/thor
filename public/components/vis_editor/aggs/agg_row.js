import React from 'react';
import _ from 'lodash';
import AddDeleteButtons from '../../add_delete_buttons';
export default (props) => {

  let iconClassName = 'fa fa-eye-slash';
  let iconRowClassName = 'vis_editor__agg_row-icon';
  const last = _.last(props.siblings);
  if (last.id === props.model.id) {
    iconClassName = 'fa fa-eye';
    iconRowClassName += ' last';
  }


  return (
    <div className="vis_editor__agg_row">
      <div className="vis_editor__agg_row-item">
        <div className={iconRowClassName}>
          <i className={iconClassName}></i>
        </div>
        {props.children}
        <AddDeleteButtons
          onAdd={props.onAdd}
          onDelete={props.onDelete}
          disableDelete={props.disableDelete}/>
      </div>
    </div>
  );
};
