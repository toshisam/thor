import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import { Chart } from '@elastic/rhythm-visualizations';
import handleBrush from '../../lib/handle_brush';
import Section from '../section';

class Network extends Component {

  constructor(props) {
    super(props);
  }

  createRow(row) {
    const { dispatch } = this.props;
    const bytesSeries = [
      { label: 'In', data: row.metrics.in_bytes, color: '#6eadc1' },
      { label: 'Out', data: row.metrics.out_bytes, color: '#e8488b' }
    ];
    const packetsSeries = [
      { label: 'In', data: row.metrics.in_packets, color: '#6eadc1' },
      { label: 'Out', data: row.metrics.out_packets, color: '#e8488b' }
    ];
    return (
      <div className="row" key={ row.name }>
        <div className="item">
          <div className="net-head">
            <span className="field">Interface:</span>
            <span className="value">{ row.name }</span>
          </div>
          <div className="net-visualizations">
            <div className="chart">
              <Chart
                title="Bytes"
                tickFormatter={ (val) => numeral(Math.abs(val)).format('0.0b') + '/s' }
                onBrush={ handleBrush(dispatch) }
                type="bar"
                fill={1.0}
                stack={false}
                height={120}
                metrics={ bytesSeries }/>
            </div>
            <div className="chart">
              <Chart
                title="Packets"
                tickFormatter={ (val) => numeral(Math.abs(val)).format('0.0a') + '/s' }
                type="bar"
                onBrush={ handleBrush(dispatch) }
                fill={1.0}
                stack={false}
                height={120}
                metrics={ packetsSeries }/>
            </div>
          </div>
        </div>
      </div>
    );
  }


  render() {
    const { sections, request } = this.props;
    const rows = sections.system.network.map((row) => this.createRow(row));
    return (
      <Section name="system-network" title="Networking">
        { rows }
      </Section>
    );
  }

}
export default Network;



