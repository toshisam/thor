import React from 'react';
import ColorPicker from '../vis_editor/color_picker';
import createTextHandler from '../../lib/create_text_handler';
export default React.createClass({
  render() {
    const { doc } = this.props.dashboard;
    const handleTextChange = createTextHandler(this.props.onChange, this.refs);
    return (
      <div className="dashboard_settings">
        <div className="dashboard_settings__row">
          <div className="dashboard_settings__label">Background Color</div>
          <ColorPicker
            name="background_color"
            value={doc.background_color}
            onChange={this.props.onChange}/>
          <div className="dashboard_settings__label">Title</div>
          <input
            className="dashboard_settings__input"
            type="text"
            ref="title"
            onChange={handleTextChange('title')}
            defaultValue={doc.title}/>
          </div>
        </div>
    );
  }
});
