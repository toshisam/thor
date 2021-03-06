import React from 'react';
import _ from 'lodash';
import AggRow from './agg_row';
import MetricSelect from './metric_select';
import AggSelect from './agg_select';
import Select from 'react-select';

import createChangeHandler from '../lib/create_change_handler';
import createSelectHandler from '../../../lib/create_select_handler';
import createTextHandler from '../../../lib/create_text_handler';

export default React.createClass({
  render() {
    const { model, siblings, panelType } = this.props;

    const handleChange = createChangeHandler(this.props.onChange, model);
    const handleSelectChange = createSelectHandler(handleChange);
    const handleTextChange = createTextHandler(handleChange, this.refs);

    const stdDev = {};
    if (model.type === 'std_deviation_bucket') {
      stdDev.sigma = (
        <div className="vis_editor__std_deviation-sigma_item">
          <div className="vis_editor__label">Sigma</div>
          <input
            className="vis_editor__std_deviation-sigma"
            ref="sigma"
            defaultValue={model.sigma}
            onChange={handleTextChange('sigma')}/>
        </div>
      );

      const modeOptions = [
        { label: 'Raw', value: 'raw' },
        { label: 'Upper Bound', value: 'upper' },
        { label: 'Lower Bound', value: 'lower' },
        { label: 'Bounds Band', value: 'band' }
      ];

      stdDev.mode = (
        <div className="vis_editor__row_item">
          <div className="vis_editor__label">Mode</div>
          <Select
            options={modeOptions}
            onChange={handleSelectChange('mode')}
            value={model.mode}/>
        </div>
      );
    }

    return (
      <AggRow {...this.props}>
        <div className="vis_editor__row_item">
          <div className="vis_editor__label">Aggregation</div>
          <AggSelect
            panelType={panelType}
            value={model.type}
            onChange={handleSelectChange('type')}/>
        </div>
        <div className="vis_editor__std_sibling-metric">
          <div className="vis_editor__label">Metric</div>
          <MetricSelect
            onChange={handleSelectChange('field')}
            metrics={siblings}
            metric={model}
            value={model.field}/>
        </div>
        { stdDev.sigma }
        { stdDev.mode }
      </AggRow>
    );
  }
});
