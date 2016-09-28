import React from 'react';
import _ from 'lodash';
import ColorPicker from './color_picker';
import SortableListItem from '../sortable_list_item';
import Agg from './aggs/agg';
import newMetricAggFn from './lib/new_metric_agg_fn';
import AddDeleteButtons from '../add_delete_buttons';
import SeriesConfig from './series_config';
import {
  handleAdd,
  handleDelete,
  handleChange
} from '../../lib/collection_actions';

export default React.createClass({

  getInitialState() {
    return { visable: true, draggingIndex: null };
  },

  getDefaultProps() {
    return { name: 'metrics' };
  },

  updateState(obj) {
    this.setState({ draggingIndex: obj.draggingIndex });
    if (obj.items) {
      this.handleChange({ metrics: obj.items });
    }
  },

  handleChange(part) {
    if (this.props.onChange) {
      const { model } = this.props;
      const doc = _.assign({}, model, part);
      this.props.onChange(doc);
    }
  },

  toggleVisable(e) {
    e.preventDefault();
    this.setState({ visable: !this.state.visable });
  },

  renderRow(row, index, items) {
    const { props } = this;
    const { model, fields } = props;
    return (
      <SortableListItem
        key={index}
        updateState={this.updateState}
        items={items}
        draggingIndex={this.state.draggingIndex}
        sortId={index}
        outline="list">
        <Agg
          panelType={model.type}
          siblings={items}
          model={row}
          onAdd={handleAdd.bind(null, props, newMetricAggFn)}
          onDelete={handleDelete.bind(null, props, row)}
          onChange={handleChange.bind(null, props)}
          disableDelete={items.length < 2}
          fields={fields}/>
      </SortableListItem>
    );

  },

  render() {
    const {
      model,
      fields,
      onAdd,
      onDelete,
      disableDelete
    } = this.props;

    const handleFieldChange = (name) => {
      return (e) => {
        e.preventDefault;
        const part = {};
        part[name] = this.refs[name].value;
        this.handleChange(part);
      };
    };

    const aggs = model.metrics.map(this.renderRow);

    let caretClassName = 'fa fa-caret-down';
    if (!this.state.visable) caretClassName = 'fa fa-caret-right';

    let body = (<div style={{display: 'none'}}/>);
    if (this.state.visable) {
      body = (
        <div className="vis_editor__series-row">
          <div className="vis_editor__subhead">Metrics</div>
          <div>
            { aggs }
          </div>
          <SeriesConfig
            {...this.props}
            onChange={this.handleChange}/>
        </div>
      );
    }

    return (
      <div className="vis_editor__series">
        <div className="vis_editor__container">
          <div className="vis_editor__series-details">
            <div onClick={ this.toggleVisable }><i className={ caretClassName }/></div>
            <ColorPicker
              onChange={this.handleChange}
              name="color"
              value={model.color}/>
            <div className="vis_editor__row_item" style={{ display: 'flex' }}>
              <input
                className="vis_editor__input-grows"
                onChange={handleFieldChange('label')}
                placeholder='Label'
                ref="label"
                defaultValue={model.label}/>
            </div>
            <AddDeleteButtons
              onDelete={onDelete}
              onAdd={onAdd}
              disableDelete={disableDelete}/>
          </div>
        </div>
        { body }
      </div>
    );
  }
});
