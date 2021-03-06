import React from 'react';
import _ from 'lodash';
import AddDeleteButtons from '../../add_delete_buttons';
import collectionActions from '../../../lib/collection_actions';
import MetricSelect from './metric_select';

export default React.createClass({

  getDefaultProps() {
    return { name: 'variables' };
  },

  handleChange(item, name) {
    return (e) => {
      const handleChange = collectionActions.handleChange.bind(null, this.props);
      const part = {};
      part[name] = _.get(e, 'value', _.get(e, 'currentTarget.value'));
      handleChange(_.assign({}, item, part));
    };
  },

  renderRow(row, i, items) {
    const handleAdd = collectionActions.handleAdd.bind(null, this.props);
    const handleDelete = collectionActions.handleDelete.bind(null, this.props, row);
    return  (
      <div className="vis_editor__calc_vars-row" key={row.id}>
        <div className="vis_editor__calc_vars-name">
          <input
            placeholder="Variable Name"
            style={{ width: '100%' }}
            className="vis_editor__input-grows"
            type="text"
            onChange={this.handleChange(row, 'name')}
            defaultValue={row.name}/>
        </div>
        <div className="vis_editor__calc_vars-var">
          <MetricSelect
            onChange={this.handleChange(row, 'field')}
            metrics={this.props.metrics}
            metric={this.props.model}
            value={row.field}/>
        </div>
        <div className="vis_editor__calc_vars-control">
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
      <div className="vis_editor__calc_vars">
        { rows }
      </div>
    );
  }

});
