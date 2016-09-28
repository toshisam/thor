import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import handleBrush from '../../lib/handle_brush';
import { getLastValue, CircleGauge, Chart } from '@elastic/rhythm-visualizations';
import Section from '../section';

class Disks extends Component {

  constructor(props) {
    super(props);
  }

  getUsedPercent(metrics) {
    const usedBytes = this.getUsedBytes(metrics);
    const totalBytes = this.getTotalBytes(metrics);
    return usedBytes / totalBytes;
  }

  getTotalBytes(metrics) {
    return getLastValue(metrics.total_bytes);
  }

  getUsedBytes(metrics) {
    return getLastValue(metrics.used_bytes);
  }

  createRow(row) {
    const { dispatch } = this.props;
    const usedPercent = this.getUsedPercent(row.metrics);
    const usageSeries = [
      { label: 'Free', data: row.metrics.free_bytes, color: '#8ac336' },
      { label: 'Used', data: row.metrics.used_bytes, color: '#d76051' }
    ];
    return (
      <div key={ row.mount_point } className="item">
        <div className="disk-head">
          <span className="field">Mount Point:</span>
          <span className="value">{ row.mount_point }</span>
          <span className="field">Device Name:</span>
          <span className="value">{ decodeURIComponent(row.device_name) }</span>
        </div>
        <div className="disk-visualizations">
          <div className="guage">
            <CircleGauge
              width={100}
              height={100}
              metrics={[[0, usedPercent]]}
              title="used"/>
          </div>
          <div className="chart">
            <Chart
              tickFormatter={ (val) => numeral(val).format('0.0b') }
              min={0}
              type="bar"
              fill={1.0}
              onBrush={ handleBrush(dispatch) }
              stack={true}
              height={120}
              metrics={ usageSeries }/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { sections, request } = this.props;
    const rows = sections.system.filesystem.map((row) => this.createRow(row));
    return (
      <Section name="system-disks" title="Disks">
        <div className="row">
          { rows }
        </div>
      </Section>
    );
  }

}
export default Disks;


