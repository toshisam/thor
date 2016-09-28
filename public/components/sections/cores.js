import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import { BarVis } from '@elastic/rhythm-visualizations';
import Section from '../section';

class Cores extends Component {

  constructor(props) {
    super(props);
  }

  createRow(row) {
    const cpuPercent = row.system_percent + row.user_percent;
    const values = [
      { value: row.user_percent, color: '#8ac336'},
      { value: row.system_percent, color: '#d76051'}
    ];
    return (
      <tr key={ row.core }>
        <td className="core">
          <div>
            <span>Core { row.core + 1 }</span>
            <BarVis values={values}/>
            <span className="value">{ numeral(cpuPercent).format('0.00%') }</span>
          </div>
        </td>
      </tr>
    );
  }

  render() {
    const { sections, request } = this.props;
    const rows = sections.system.core
      .map((row) => this.createRow(row));
    return (
      <Section name="system-cores" title="Cores">
        <div className="row">
          <div className="item">
            <table className="table">
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    );
  }

}
export default Cores;

