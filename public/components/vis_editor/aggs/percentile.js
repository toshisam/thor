import React from 'react';
import _ from 'lodash';
import AggSelect from './agg_select';
import FieldSelect from './field_select';
import AggRow from './agg_row';
import collectionActions from '../../../lib/collection_actions';
import calculateSiblings from '../lib/calculate_siblings';
import AddDeleteButtons from '../../add_delete_buttons';
import Select from 'react-select';
import uuid from 'node-uuid';
import createChangeHandler from '../lib/create_change_handler';
import createSelectHandler from '../../../lib/create_select_handler';
import createNumberHandler from '../../../lib/create_number_handler';
const newPercentile = (opts) => {
  return _.assign({ id: uuid.v1(), mode: 'line', shade: 0.2 }, opts);
};

const Percentiles = React.createClass({

  getDefaultProps() {
    return { name: 'percentiles' };
  },

  handleTextChange(item, name) {
    return (e) => {
      const handleChange = collectionActions.handleChange.bind(null, this.props);
      const part = {};
      part[name] = _.get(e, 'value', _.get(e, 'currentTarget.value'));
      handleChange(_.assign({}, item, part));
    };
  },

  handleNumberChange(item, name) {
    return (e) => {
      const handleChange = collectionActions.handleChange.bind(null, this.props);
      const part = {};
      part[name] = Number(_.get(e, 'value', _.get(e, 'currentTarget.value')));
      handleChange(_.assign({}, item, part));
    };
  },

  renderRow(row, i, items) {
    const handleAdd = collectionActions.handleAdd.bind(null, this.props, newPercentile);
    const handleDelete = collectionActions.handleDelete.bind(null, this.props, row);
    const modeOptions = [
      { label: 'Line', value: 'line' },
      { label: 'Band', value: 'band' }
    ];
    const optionsStyle = {};
    if (row.mode === 'line') {
      optionsStyle.display = 'none';
    }
    return  (
      <div className="vis_editor__percentiles-row" key={row.id}>
        <div className="vis_editor__percentiles-content">
          <input
            placeholder="Percentile"
            className="vis_editor__input-grows"
            type="text"
            onChange={this.handleNumberChange(row, 'value')}
            defaultValue={row.value}/>
          <div className="vis_editor__label">Mode</div>
          <div className="vis_editor__row_item">
            <Select
              clearable={false}
              onChange={this.handleTextChange(row, 'mode')}
              options={modeOptions}
              value={row.mode}/>
          </div>
          <div style={optionsStyle} className="vis_editor__label">Fill To</div>
          <input
            style={optionsStyle}
            className="vis_editor__input-grows"
            type="text"
            onChange={this.handleNumberChange(row, 'percentile')}
            defaultValue={row.percentile}/>
          <div style={optionsStyle} className="vis_editor__label">Shade (0 to 1)</div>
          <input
            style={optionsStyle}
            className="vis_editor__input-grows"
            type="text"
            onChange={this.handleNumberChange(row, 'shade')}
            defaultValue={row.shade}/>
        </div>
        <AddDeleteButtons
          onAdd={handleAdd}
          onDelete={handleDelete}
          disableDelete={items.length < 2}/>
      </div>
    );
  },

  render() {
    const { model, name } = this.props;
    if (!model[name]) return (<div/>);

    const rows = model[name].map(this.renderRow);
    return (
      <div className="vis_editor__percentiles">
        { rows }
      </div>
    );
  }
});

export default React.createClass({

  componentWillMount() {
    if (!this.props.model.percentiles) {
      this.props.onChange(_.assign({}, this.props.model, {
        percentiles: [newPercentile({ value: 50 })]
      }));
    }
  },

  render() {
    const { model, panelType, fields } = this.props;

    const handleChange = createChangeHandler(this.props.onChange, model);
    const handleSelectChange = createSelectHandler(handleChange);
    const handleNumberChange = createNumberHandler(handleChange);

    return (
      <AggRow {...this.props}>
        <div className="vis_editor__row_item">
          <div className="vis_editor__agg_row-item" style={{marginBottom: 10}}>
            <div className="vis_editor__row_item">
              <div className="vis_editor__label">Aggregation</div>
              <AggSelect
                panelType={panelType}
                value={model.type}
                onChange={handleSelectChange('type')}/>
            </div>
            <div className="vis_editor__row_item">
              <div className="vis_editor__label">Field</div>
              <FieldSelect
                fields={fields}
                type={model.type}
                restrict="numeric"
                value={model.field}
                onChange={handleSelectChange('field')}/>
            </div>
          </div>
          <Percentiles
            onChange={handleChange}
            name="percentiles"
            model={model}/>
        </div>
      </AggRow>
    );
  }
});

