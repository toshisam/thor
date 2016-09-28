import React from 'react';
const State = (props) => {
  const classNames = ['value', props.state.toLowerCase()];
  return (
    <div className="state">
      <div className={ classNames.join(' ') }>{ props.state }</div>
    </div>
  );
};

export default State;
