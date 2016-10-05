import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import VisEditor from '../vis_editor/vis_editor';
import uuid from 'node-uuid';
import colors from '../../lib/colors';
import newSeriesFn from '../vis_editor/lib/new_series_fn';
import { fetchVisData } from '../../actions/vis_data.js';
import createNewPanel from '../../lib/create_new_panel';
import { panelToEdit } from '../../actions/dashboard';
import Header from '../../containers/header';
export default React.createClass({

  fetch(options) {
    const { dispatch } = this.props;
    dispatch(fetchVisData(_.assign({
      panels: this.props.model && [this.props.model] || []
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
    const { model, dashboard } = this.props;
    const dashboardsLink = {
      pathname: `/dashboards`
    };
    const dashboardLink = {
      pathname: `/dashboards/edit/${dashboard.doc.id}`
    };
    return (
      <div className="panel_editor">
        <Header>
          <div className="header__breadcrumbs">
            <Link to={dashboardsLink}>Dashboards</Link>
            <span>/</span>
            <Link to={dashboardLink}>{ dashboard.doc.title }</Link>
            <span>/</span>
            <span>Edit Panel: {model.title}</span>
          </div>
        </Header>
        <div className="panel_editor__body">
          <VisEditor
            fields={this.props.fields}
            dispatch={this.props.dispatch}
            onChange={this.handleChange}
            visData={ this.props.visData }
            model={this.props.model}/>
        </div>
        <div className="panel_editor__footer">
          <Link className="btn btn-default"
            to={dashboardLink}>Return to Dashboard</Link>
          <a onClick={ this.handleSave }
            className="btn btn-primary">Save Panel</a>
        </div>
      </div>
    );
  }
});

