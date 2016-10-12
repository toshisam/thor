import SeriesEditor from '../series_editor';
import IndexPattern from '../index_pattern';
import React from 'react';
import Select from 'react-select';
import createSelectHandler from '../../../lib/create_select_handler';
import createTextHandler from '../../../lib/create_text_handler';
import DataFormatPicker from '../data_format_picker';
import ColorRules from '../color_rules';
import uuid from 'node-uuid';
export default React.createClass({

  componentWillMount() {
    const { model } = this.props;
    if (!model.background_color_rules || (model.background_color_rules && model.background_color_rules.length === 0)) {
      this.props.onChange({
        background_color_rules: [{id: uuid.v1() }]
      });
    }
  },

  render() {
    const { model } = this.props;
    const handleSelectChange = createSelectHandler(this.props.onChange);
    const handleTextChange = createTextHandler(this.props.onChange, this.refs);
    const positionOptions = [
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' }
    ];
    const yesNoOptions = [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ];
    return (
      <div>
        <div className="vis_editor__subhead-main">Series</div>
        <div className="vis_editor__note">The first series will be the primary
          metric and second series will be the secondary metric. You can drag
          and drop the series to change the ordering. The secondary metric is optional.</div>
        <SeriesEditor limit={2} colorPicker={false} {...this.props}/>
        <div className="vis_editor__subhead-main">Options</div>
        <div className="vis_editor__vis_config-row">
          <div className="vis_editor__label">Title</div>
          <input
            className="vis_editor__input-grows"
            ref="title"
            onChange={handleTextChange('title')}
            value={model.title}/>
        </div>
        <IndexPattern with-interval={true} {...this.props}/>
        <div className="vis_editor__vis_config-row">
          <div className="vis_editor__label">Panel Filter</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="filter"
            onChange={handleTextChange('filter')}
            defaultValue={model.filter}/>
          <div className="vis_editor__label">Ignore Global Filter</div>
          <Select
            autosize={false}
            clearable={false}
            options={yesNoOptions}
            value={model.ignore_global_filter}
            onChange={handleSelectChange('ignore_global_filter')}/>
        </div>
        <div className="vis_editor__label" style={{margin: '0 10px 0 0'}}>Color Rules</div>
        <div className="vis_editor__vis_config-row">
          <ColorRules
            model={model}
            onChange={this.props.onChange}
            name="background_color_rules"/>
        </div>
      </div>
    );
  }
});

