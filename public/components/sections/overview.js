import React, { Component, PropTypes } from 'react';
import { CircleGauge, getLastValue } from '@elastic/rhythm-visualizations';
import Section from '../section';
export default (props) => {
  const { metrics, details } = props;
  const totalProcesses = getLastValue(metrics.total_processes);
  return (
    <Section name="system-overview" title="System Overview">
      <div className="vis row">
        <div className="item">
          <CircleGauge
            width={100}
            height={100}
            metrics={ metrics.memory_percent}
            title="Memory"/>
        </div>
        <div className="item">
          <CircleGauge
            width={100}
            height={100}
            metrics={ metrics.swap_percent}
            title="Swap"/>
        </div>
        <div className="item">
          <CircleGauge
            width={150}
            height={150}
            metrics={ metrics.cpu_percent }
            title="CPU"/>
        </div>
        <div className="item">
          <CircleGauge
            width={100}
            height={100}
            max={metrics.load5_max}
            format="0.00"
            color="#6eadc1"
            thresholds={false}
            metrics={ metrics.load5}
            title="load"/>
        </div>
        <div className="item">
          <CircleGauge
            width={100}
            height={100}
            metrics={ metrics.disk_percent}
            title="disk"/>
        </div>
      </div>
    </Section>
  );
};
