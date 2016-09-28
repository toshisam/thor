import React from 'react';
import Overview from '../components/sections/overview';
import Memory from '../components/sections/memory';
import Processes from '../components/sections/processes';
import CPU from '../components/sections/cpu';
import Cores from '../components/sections/cores';
import Disks from '../components/sections/disks';
import DiskIO from '../components/sections/diskio';
import Network from '../components/sections/network';

export default (props) => {
  const sections = [
    (<Overview key="section-system-overview" {...props}/>),
    (<Memory key="section-system-memory" {...props}/>),
    (<CPU key="section-system-cpu" {...props}/>),
  ];
  if (props.sections.system.filesystem) sections.push(<Disks key="section-system-disk" {...props}/>);
  if (props.sections.system.diskio) sections.push(<DiskIO key="section-system-diskio" {...props}/>);
  if (props.sections.system.network) sections.push(<Network key="section-system-network" {...props}/>);
  if (props.sections.system.core) sections.push(<Cores key="section-system-cores" {...props}/>);
  if (props.sections.system.process) sections.push(<Processes key="section-system-proceses" {...props}/>);
  return (
    <div className="sections">
      { sections }
    </div>
  );
};
