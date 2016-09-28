import SeriesEditor from '../series_editor';
import IndexPattern from '../index_pattern';
import React from 'react';
import Select from 'react-select';
import createSelectHandler from '../../../lib/create_select_handler';
import createTextHandler from '../../../lib/create_text_handler';
import DataFormatPicker from '../data_format_picker';
export default React.createClass({
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
        <SeriesEditor {...this.props}/>
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
          <div className="vis_editor__label">Axis Min</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="axis_min"
            onChange={handleTextChange('axis_min')}
            defaultValue={model.axis_min}/>
          <div className="vis_editor__label">Axis Max</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="axis_max"
            onChange={handleTextChange('axis_max')}
            defaultValue={model.axis_max}/>
          <div className="vis_editor__label">Axis Position</div>
          <div className="vis_editor__row_item">
            <Select
              autosize={false}
              clearable={false}
              options={positionOptions}
              value={model.axis_position}
              onChange={handleSelectChange('axis_position')}/>
          </div>
        </div>
        <div className="vis_editor__vis_config-row">
          <div className="vis_editor__label">Show Legend</div>
          <Select
            autosize={false}
            clearable={false}
            options={yesNoOptions}
            value={model.show_legend}
            onChange={handleSelectChange('show_legend')}/>
          <DataFormatPicker
            onChange={handleSelectChange('axis_formatter')}
            value={model.axis_formatter}/>
        </div>
        <div className="vis_editor__vis_config-row">
          <div className="vis_editor__label">Include Query</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="include_query"
            onChange={handleTextChange('include_query')}
            defaultValue={model.include_query}/>
          <div className="vis_editor__label">Exclude Query</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="exclude_query"
            onChange={handleTextChange('exclude_query')}
            defaultValue={model.exclude_query}/>
        </div>
      </div>
    );
  }
});

