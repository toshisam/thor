import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import { Chart } from '@elastic/rhythm-visualizations';
import handleBrush from '../../lib/handle_brush';
import Section from '../section';
export default (props) => {
  const { dispatch, metrics, details } = props;
  const utilSeries = [
    { label: 'system', data: metrics.cpu_system_percent, color: '#6eadc1' },
    { label: 'user', data: metrics.cpu_user_percent, color: '#8ac336' },
    { label: 'iowait', data: metrics.cpu_iowait_percent, color: '#e8488b' },
    { label: 'steal', data: metrics.cpu_steal_percent, color: '#2d2d2d' },
    { label: 'softirq', data: metrics.cpu_softirq_percent, color: '#e4bb51' },
    { label: 'nice', data: metrics.cpu_nice_percent, color: '#9980b2' },
  ];
  const loadSeries = [
    { label: '1 minute', data: metrics.load1, color: '#6eadc1' },
    { label: '5 minutes', data: metrics.load5, color: '#8ac336' },
    { label: '15 minutes', data: metrics.load15, color: '#e4bb51' },
  ];
  return (
    <Section name="system-cpu" title="Central Processing Unit">
      <div className="row">
        <div className="item">
          <Chart
            title="Utillization"
            tickFormatter={ (val) => numeral(val).format('0.0%') }
            max={1}
            onBrush={ handleBrush(dispatch) }
            type="bar"
            min={0}
            fill={1.0}
            line={0}
            stack={true}
            height={200}
            metrics={ utilSeries }/>
        </div>
        <div className="item">
          <Chart
            title="Load"
            tickFormatter={ (val) => numeral(val).format('0.00') }
            onBrush={ handleBrush(dispatch) }
            type="line"
            fill={0}
            line={1}
            stack={false}
            height={200}
            metrics={ loadSeries }/>
        </div>
      </div>
    </Section>
  );
};
