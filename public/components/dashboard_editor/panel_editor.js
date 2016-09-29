import _ from 'lodash';
import React from 'react';
import VisEditor from '../vis_editor/vis_editor';
import uuid from 'node-uuid';
import colors from '../../lib/colors';
import newSeriesFn from '../vis_editor/lib/new_series_fn';
import { fetchVisData } from '../../actions/vis_data.js';
import createNewPanel from '../../lib/create_new_panel';
import { panelToEdit } from '../../actions/dashboard';
export default React.createClass({

  fetch(options) {
    const { dispatch } = this.props;
    dispatch(fetchVisData(_.assign({
      panels: [this.props.model]
    }, options)));
  },

  componentWillMount() {
    const { dispatch } = this.props;

    this.debouncedFetch = _.debounce((options) => {
      dispatch(fetchVisData(options));
    }, 300, { leading: false, trailing: true });

    this.fetch();
  },

  handleChange(part) {
    const { model, dispatch } = this.props;
    const nextPanel = _.assign({}, model, part);
    dispatch(panelToEdit(nextPanel));
    this.debouncedFetch({
      panels: [nextPanel]
    });
  },

  handleCancel(e) {
    e.preventDefault();
    this.fetch();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },

  handleSave(e) {
    e.preventDefault();
    this.fetch();
    if (this.props.onSave) {
      this.props.onSave(this.props.model);
    }
  },

  render() {
    return (
      <div className="panel_editor">
        <div className="panel_editor__header">
          <i className="fa fa-times" onClick={ this.handleCancel }></i>
        </div>
        <div className="panel_editor__body">
          <VisEditor
            fields={this.props.fields}
            dispatch={this.props.dispatch}
            onChange={this.handleChange}
            visData={ this.props.visData }
            model={this.props.model}/>
        </div>
        <div className="panel_editor__footer">
          <a onClick={ this.handleSave }
            className="btn btn-success">Save Panel</a>
          &nbsp;or&nbsp;
          <a onClick={ this.handleCancel }>Cancel</a>
        </div>
      </div>
    );
  }
});

