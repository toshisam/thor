import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import handleBrush from '../../lib/handle_brush';
import { Chart } from '@elastic/rhythm-visualizations';
import Section from '../section';

class DiskIO extends Component {

  constructor(props) {
    super(props);
  }

  createRow(row) {
    const { dispatch } = this.props;
    const negativeValues = row => [row[0], row[1] * -1];
    const bytesSeries = [
      { label: 'Write', data: row.metrics.write_bytes, color: '#6eadc1' },
      { label: 'Read', data: row.metrics.read_bytes.map(negativeValues), color: '#e8488b' },
    ];
    const latencySeries = [
      { label: 'Write', data: row.metrics.write_latency, color: '#6eadc1' },
      { label: 'Read', data: row.metrics.read_latency.map(negativeValues), color: '#e8488b' },
    ];
    const iopsSeries = [
      { label: 'IOPS', data: row.metrics.iops, color: '#9980b2' },
    ];
    return (
      <div key={row.name} className="row">
        <div className="item">
          <div className="diskio">
            <div className="diskio__head">
              <span className="diskio__head_field">Name:</span>
              <span className="diskio__head_value">{ row.name }</span>
              <span className="diskio__head_field">Serial Number:</span>
              <span className="diskio__head_value">{ decodeURIComponent(row.serial_number) }</span>
            </div>
            <div className="diskio__visualizations">
              <div className="diskio__chart">
                <Chart
                  tickFormatter={ (val) => numeral(Math.abs(val)).format('0,0.0') + '/s' }
                  onBrush={ handleBrush(dispatch) }
                  type="bar"
                  fill={1.0}
                  stack={false}
                  height={120}
                  metrics={ iopsSeries }/>
              </div>
              <div className="diskio__chart">
                <Chart
                  title="Data Transfer"
                  tickFormatter={ (val) => numeral(Math.abs(val)).format('0,0.0b') + '/s' }
                  onBrush={ handleBrush(dispatch) }
                  type="bar"
                  fill={1.0}
                  stack={false}
                  height={120}
                  metrics={ bytesSeries }/>
              </div>
              <div className="diskio__chart">
                <Chart
                  title="Latency"
                  tickFormatter={ (val) => numeral(Math.abs(val)).format('0,0.0') + 'ms' }
                  onBrush={ handleBrush(dispatch) }
                  type="bar"
                  fill={1.0}
                  stack={false}
                  height={120}
                  metrics={ latencySeries }/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { sections, request } = this.props;
    const rows = sections.system.diskio.map((row) => this.createRow(row));
    return (
      <Section name="system-diskio" title="Disk IO">
        { rows }
      </Section>
    );

  }

}

export default DiskIO;

