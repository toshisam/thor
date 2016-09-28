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
    const { model, data } = this.props;
    const handleTitleChange = value => {
      this.handleChange({ title: value });
    };

    return (
      <div className="vis_editor">
        <div className="vis_editor__title">
          { replaceVars(model.title, this.props.location)}
        </div>
        <VisPicker
          onChange={this.handleChange}
          {...this.props}/>
        <Visualization
          onChange={this.handleChange}
          {...this.props}/>
        <VisConfig
          onChange={this.handleChange}
          {...this.props}/>
      </div>
    );
  }
});
