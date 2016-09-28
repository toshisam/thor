import React from 'react';
export default (props) => {
  const { details } = props;
  return (
    <div className="detail-header">
      <h1>{ details.hostname }</h1>
      <div className={ ['state', details.state].join(' ') }>{ details.state }</div>
    </div>
  );
};
