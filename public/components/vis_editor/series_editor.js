import React from 'react';
import _ from 'lodash';
import Series from './series';
import {
  handleAdd,
  handleDelete,
  handleChange
} from '../../lib/collection_actions';
import newSeriesFn from './lib/new_series_fn';
import { Sortable } from 'react-sortable';
import SortableListItem from '../sortable_list_item';

export default React.createClass({

  getInitialState() {
    return { draggingIndex: null };
  },

  getDefaultProps() {
    return {
      name: 'series',
      limit: Infinity,
      colorPicker: true
    };
  },

  updateState(obj) {
    this.setState({ draggingIndex: obj.draggingIndex });
    if (obj.items) {
      this.props.onChange({ series: obj.items });
    }
  },

  renderRow(row, index) {
    const { props } = this;
    const { fields, model, name, limit, colorPicker } = props;
    return (
      <SortableListItem
        key={index}
        updateState={this.updateState}
        items={model[name]}
        draggingIndex={this.state.draggingIndex}
        sortId={index}
        outline="list">
        <Series
          model={row}
          panelType={model.type}
          onAdd={handleAdd.bind(null, props, newSeriesFn)}
          onDelete={handleDelete.bind(null, props, row)}
          onChange={handleChange.bind(null, props)}
          disableDelete={model[name].length < 2}
          disableAdd={model[name].length >= limit}
          colorPicker={colorPicker}
          fields={fields}/>
      </SortableListItem>
    );
  },


  render() {
    const { model, name } = this.props;
    const series = model[name].map(this.renderRow);
    return (
      <div className="vis_editor__series_editor-container">
        { series }
      </div>
    );
  }
});
