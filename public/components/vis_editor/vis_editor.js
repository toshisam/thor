import React from 'react';
import './less/styles.less';
import _ from 'lodash';
import SeriesEditor from './series_editor';
import Visualization from './visualization';
import VisPicker from './vis_picker';
import VisConfig from './vis_config';
import EditableText from '../editable_text';
import replaceVars from '../../lib/replace_vars';
export default React.createClass({

  handleChange(part) {
    if (this.props.onChange) {
      this.props.onChange(_.assign({}, this.props.model, part));
    }
  },

  render() {
    const { dashboard, model, data } = this.props;
    const handleTitleChange = value => {
      this.handleChange({ title: value });
    };
    const style = {};
    if (dashboard.doc.background_color) {
      style.backgroundColor = dashboard.doc.background_color;
    }
    if (dashboard.doc.panel_margin) {
      style.padding = dashboard.doc.panel_margin;
    }
    const visBackgroundColor = dashboard.doc.default_panel_color ||
      dashboard.doc.background_color;
    return (
      <div className="vis_editor">
        <div style={style} className="vis_editor__visualization">
          <Visualization
            backgroundColor={visBackgroundColor}
            className="dashboard__visualization"
            onChange={this.handleChange}
            {...this.props}/>
        </div>
        <VisPicker
          onChange={this.handleChange}
          {...this.props}/>
        <VisConfig
          onChange={this.handleChange}
          {...this.props}/>
      </div>
    );
  }
});
