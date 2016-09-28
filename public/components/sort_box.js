import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

const cols = [
  'CPU',
  'Memory',
  'Disk',
  'Load',
];

const fieldMappings = {
  'cpu': 'cpu_percent',
  'memory': 'memory_percent',
  'disk': 'disk_percent',
  'load': 'load5',
  // 'uptime': 'uptime'
};

const revFieldMapping = _.invert(fieldMappings);

class SortBox extends Component {

  constructor(props) {
    super(props);
  }

  handleChange(event) {
    event.preventDefault();
    const sort = this.refs.sort;
    const index = sort.selectedIndex;
    const [field, direction] = sort[index].value.split(/\s/);
    this.props.action({ field: fieldMappings[field], direction });
  }

  createOptions(dir, label) {
    return cols.map((col) => {
      const key = col.toLowerCase();
      const value = key + ' ' + dir;
      const title = col + label;
      const attrs = {
        key: value,
        value
      };
      return (<option {...attrs}>&nbsp;&nbsp;{ title }</option>);
    });
  }

  render() {
    const currentValue = `${revFieldMapping[this.props.sort.field]} ${this.props.sort.direction}`;
    const descendingOptions = this.createOptions('desc', ': Highest First');
    const ascendingOptions = this.createOptions('asc', ': Lowest First');
    return (
      <div className="sort-box">
        <span>Sort by</span>
        <select value={currentValue} ref="sort" onChange={ event => this.handleChange(event) }>
          <optgroup label="Descending"/>
          { descendingOptions }
          <optgroup label="Ascending"/>
          { ascendingOptions }
        </select>
      </div>
    );
  }

}

export default SortBox;
