import React from 'react';
import Split from '../split';
import Select from 'react-select';
import DataFormatPicker from '../data_format_picker';
import createSelectHandler from '../../../lib/create_select_handler';
import createTextHandler from '../../../lib/create_text_handler';

export default React.createClass({
  render() {
    const { fields, model } = this.props;
    const handleSelectChange = createSelectHandler(this.props.onChange);
    const handleTextChange = createTextHandler(this.props.onChange, this.refs);

    const yesNoOptions = [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ];

    const positionOptions = [
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' }
    ];

    const chartTypeOptions = [
      { label: 'Bar', value: 'bar' },
      { label: 'Line', value: 'line' }
    ];

    let type;
    if (model.chart_type === 'line') {
      type = (
        <div className="vis_editor__series_config-row">
          <div className="vis_editor__label">Chart Type</div>
          <div className="vis_editor__item">
            <Select
              clearable={false}
              options={chartTypeOptions}
              value={model.chart_type}
              onChange={handleSelectChange('chart_type')}/>
          </div>
          <div className="vis_editor__label">Stacked</div>
          <div className="vis_editor__item">
            <Select
              clearable={false}
              options={yesNoOptions}
              value={model.stacked}
              onChange={handleSelectChange('stacked')}/>
          </div>
          <div className="vis_editor__label">Fill (0 to 1)</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="fill"
            onChange={handleTextChange('fill')}
            defaultValue={model.fill}/>
          <div className="vis_editor__label">Line Width</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="line_width"
            onChange={handleTextChange('line_width')}
            defaultValue={model.line_width}/>
        </div>
      );
    }
    if (model.chart_type === 'bar') {
      type = (
        <div className="vis_editor__series_config-row">
          <div className="vis_editor__label">Chart Type</div>
          <div className="vis_editor__item">
            <Select
              clearable={false}
              options={chartTypeOptions}
              value={model.chart_type}
              onChange={handleSelectChange('chart_type')}/>
          </div>
          <div className="vis_editor__label">Stacked</div>
          <div className="vis_editor__item">
            <Select
              clearable={false}
              options={yesNoOptions}
              value={model.stacked}
              onChange={handleSelectChange('stacked')}/>
          </div>
          <div className="vis_editor__label">Fill (0 to 1)</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="fill"
            onChange={handleTextChange('fill')}
            defaultValue={model.fill}/>
          <div className="vis_editor__label">Line Width</div>
          <input
            className="vis_editor__input-grows"
            type="text"
            ref="line_width"
            onChange={handleTextChange('line_width')}
            defaultValue={model.line_width}/>
        </div>
      );
    }

    return (
      <div>
        <div className="vis_editor__series_config-container">
          <div className="vis_editor__series_config-row">
            <Split
              onChange={this.props.onChange}
              fields={fields}
              model={model}/>
          </div>
          { type }
          <div className="vis_editor__series_config-row">
              <div className="vis_editor__label">Seperate Axis</div>
              <div className="vis_editor__item">
                <Select
                  clearable={false}
                  options={yesNoOptions}
                  value={model.seperate_axis}
                  onChange={handleSelectChange('seperate_axis')}/>
              </div>
              { model.seperate_axis ? (
                <div className="vis_editor__row_item" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="vis_editor__label" style={{ marginLeft: 10 }}>Axis Min</div>
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
                </div>
              ) : (<div style={{display: 'none'}}/>)}<div>
              </div>
          </div>
          { model.seperate_axis ? (
            <div className="vis_editor__row" style={{ fontSize: 12 }}>
              <div className="vis_editor__label">Axis Position</div>
              <div className="vis_editor__row_item">
                <Select
                  clearable={false}
                  options={positionOptions}
                  value={model.axis_position}
                  onChange={handleSelectChange('axis_position')}/>
              </div>
              <DataFormatPicker
                onChange={handleSelectChange('axis_formatter')}
                value={model.axis_formatter}/>
            </div>
          ) : (<div style={{display:'none'}}/>) }
        </div>
      </div>
    );
  }
});

