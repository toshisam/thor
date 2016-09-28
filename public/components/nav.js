import React from 'react';

function scrollTo(e, section) {
  e.preventDefault();
  const element = document.querySelector(`a[name=${section}]`);
  if (element) element.scrollIntoView();
}

export default (props) => {
  const nav = [
    (<div
      key="nav-system-overview"
      className="item"
      onClick={ e => scrollTo(e, 'system-overview')}>System Overview</div>),
    (<div
      key="nav-system-memory"
      className="item"
      onClick={ e => scrollTo(e, 'system-memory')}>Memory</div>),
    (<div
      key="nav-system-cpu"
      className="item"
      onClick={ e => scrollTo(e, 'system-cpu')}>CPU</div>)
  ];
  if (props.sections.system.filesystem) {
    nav.push(<div
      key="nav-system-disks"
      className="item"
      onClick={ e => scrollTo(e, 'system-disks')}>Disks</div>);
  }
  if (props.sections.system.diskio) {
    nav.push(<div
      key="nav-system-diskio"
      className="item"
      onClick={ e => scrollTo(e, 'system-diskio')}>Disk IO</div>);
  }
  if (props.sections.system.network) {
    nav.push(<div
      key="nav-system-network"
      className="item"
      onClick={ e => scrollTo(e, 'system-network')}>Networking</div>);
  }
  if (props.sections.system.core) {
    nav.push(<div
      key="nav-system-cores"
      className="item"
      onClick={ e => scrollTo(e, 'system-cores')}>Cores</div>);
  }
  if (props.sections.system.process) {
    nav.push(<div
      key="nav-system-processes"
      className="item"
      onClick={ e => scrollTo(e, 'system-processes')}>Processes</div>);
  }
  return (
    <div className="navigation">
      { nav }
    </div>
  );
};
