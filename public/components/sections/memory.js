import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import { Chart } from '@elastic/rhythm-visualizations';
import handleBrush from '../../lib/handle_brush';
import Section from '../section';
import moment from 'moment';
export default (props) => {
  const { metrics, details, dispatch } = props;
  const usageSeries = [
    { label: 'Free', data: metrics.memory_free, color: '#8ac336' },
    { label: 'Used', data: metrics.memory_actual_used, color: '#d76051' },
    { label: 'Cache', data: metrics.memory_cache, color: '#6eadc1' },
  ];
  const swapSeries = [
    { label: 'Free', data: metrics.swap_free, color: '#8ac336' },
    { label: 'Used', data: metrics.swap_used, color: '#d76051' },
  ];
  return (
    <Section name="system-memory" title="Memory">
      <div className="row">
        <div className="item">
          <Chart
            title="Usage"
            tickFormatter={ (val) => numeral(val).format('0.0b') }
            onBrush={ handleBrush(dispatch) }
            type="bar"
            min={0}
            fill={1.0}
            stack={true}
            height={200}
            metrics={ usageSeries }/>
        </div>
        <div className="item">
          <Chart
            title="Swap"
            tickFormatter={ (val) => numeral(val).format('0.0b') }
            onBrush={ handleBrush(dispatch) }
            type="bar"
            min={0}
            line={1.0}
            fill={1.0}
            stack={true}
            height={200}
            metrics={ swapSeries }/>
        </div>
      </div>
    </Section>
  );
};
