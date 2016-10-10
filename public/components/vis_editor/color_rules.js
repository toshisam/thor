import React from 'react';
import _ from 'lodash';
import AddDeleteButtons from '../add_delete_buttons';
import Select from 'react-select';
import collectionActions from '../../lib/collection_actions';
import ColorPicker from './color_picker';

export default React.createClass({

  getDefaultProps() {
    return { name: 'color_rules' };
  },

  handleChange(item, name, cast = String) {
    return (e) => {
      const handleChange = collectionActions.handleChange.bind(null, this.props);
      const part = {};
      part[name] = cast(_.get(e, 'value', _.get(e, 'currentTarget.value')));
      if (part[name] === 'undefined') part[name] = undefined;
      handleChange(_.assign({}, item, part));
    };
  },

  renderRow(row, i, items) {
    const handleAdd = collectionActions.handleAdd.bind(null, this.props);
    const handleDelete = collectionActions.handleDelete.bind(null, this.props, row);
    const operatorOptions = [
      { label: '> greater then', value: 'gt' },
      { label: '>= greater then or equal', value: 'gte' },
      { label: '< less then', value: 'lt' },
      { label: '<= less then or equal', value: 'lte' },
    ];
    const handleColorChange = (part) => {
      const handleChange = collectionActions.handleChange.bind(null, this.props);
      handleChange(_.assign({}, row, part));
    };
    return (
      <div key={row.id} className="color_rules__rule">
        <div className="color_rules__label">Set background to</div>
        <ColorPicker
          onChange={handleColorChange}
          name="background_color"
          value={row.background_color}/>
        <div className="color_rules__label">and text to</div>
        <ColorPicker
          onChange={handleColorChange}
          name="color"
          value={row.color}/>
        <div className="color_rules__label">if metric is</div>
        <div className="color_rules__item">
          <Select
            onChange={this.handleChange(row, 'opperator')}
            value={row.opperator}
            options={operatorOptions}/>
        </div>
        <input
          className="color_rules__input"
          type="text"
          defaultValue={row.value}
          onChange={this.handleChange(row, 'value', Number)}/>
        <div className="color_rules__control">
          <AddDeleteButtons
            onAdd={handleAdd}
            onDelete={handleDelete}
            disableDelete={items.length < 2}/>
        </div>
      </div>
    );
  },

  render() {
    const { model, name } = this.props;
    if (!model[name]) return (<div/>);
    const rows = model[name].map(this.renderRow);
    return (
      <div className="color_rules">
        { rows }
      </div>
    );
  }
});
