import React from 'react';
function getRows(props) {
  if (!props.tags || !props.tags.length) return (<div className="untagged">untagged</div>);
  return props.tags.map((tag) => {
    return (<div key={ `${props.hostname}-${tag}` } className="tag">{ tag }</div>);
  });
}
const Tags = (props) => {
  const rows = getRows(props);
  return (<div className="tags">{ rows }</div>);
};

export default Tags;
