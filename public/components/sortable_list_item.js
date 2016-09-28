/* eslint new-cap:0 */
import React from 'react';
import { Sortable } from 'react-sortable';
export default Sortable(React.createClass({
  displayName: 'SortableListItem',
  render() {
    return (
      <div {...this.props} className="list-item">
        { this.props.children }
      </div>
    );
  }
}));

