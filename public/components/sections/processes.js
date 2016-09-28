import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';
import { updateProcessesSortAndFetch } from '../../actions/server';
import { BarVis } from '@elastic/rhythm-visualizations';
import Section from '../section';

class Processes extends Component {

  constructor(props) {
    super(props);
  }

  createRow(row) {
    const cpuValues = [{ value: row.cpu_percent, color: '#8ac336' }];
    const memoryValues = [{ value: row.memory_rss_percent, color: '#8ac336' }];
    return (
      <tr key={ row.pid }>
        <td className="pid">{ row.pid }</td>
        <td className="username">{ row.username }</td>
        <td className="name">{ row.name }</td>
        <td
          className="cpu_percent">
          <div>
            <span>{ numeral(row.cpu_percent).format('0.00%') }</span>
            <BarVis values={ cpuValues }/>
          </div>
        </td>
        <td
          className="memory_percent">
          <div>
            <span>{ numeral(row.memory_rss_percent).format('0.00%') }</span>
            <BarVis values={ memoryValues }/>
          </div>
        </td>
      </tr>
    );
  }

  changeSort(event, field) {
    event.preventDefault();
    const { dispatch, request } = this.props;
    const requestField = _.get(request, 'sections.system.process.sort.field');
    const requestDir = _.get(request, 'sections.system.process.sort.direction');
    const sort = { field, direction: 'desc' };
    if (requestField === field && requestDir === 'desc') {
      sort.direction = 'asc';
    }
    dispatch(updateProcessesSortAndFetch(sort));
  }

  render() {
    const { sections, request } = this.props;
    const { list } = sections.system.process;
    const requestField = _.get(request, 'sections.system.process.sort.field');
    const requestDir = _.get(request, 'sections.system.process.sort.direction');
    const rows = list.map((row) => this.createRow(row));
    let cpuSort = '';
    let memSort = '';
    if (requestField === 'cpu_percent') {
      const classes = ['fa', `fa-sort-amount-${requestDir}`].join(' ');
      cpuSort = (<i className={ classes }></i>);
    }
    if (requestField === 'memory_rss_percent') {
      const classes = ['fa', `fa-sort-amount-${requestDir}`].join(' ');
      memSort = (<i className={ classes }></i>);
    }
    return (
      <Section name="system-processes" title="Processes">
        <div className="row">
          <div className="item">
            <table className="table">
              <thead>
                <tr>
                  <th>PID</th>
                  <th>User</th>
                  <th>Name</th>
                  <th
                    onClick={ event => this.changeSort(event, 'cpu_percent')}>
                    <span>CPU%</span>
                    { cpuSort }
                  </th>
                  <th
                    onClick={ event => this.changeSort(event, 'memory_rss_percent')}>
                    <span>MEM%</span>
                    { memSort }
                  </th>
                </tr>
              </thead>
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
export default Processes;
