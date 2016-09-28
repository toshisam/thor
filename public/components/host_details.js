import _ from 'lodash';
import numeral from 'numeral';
import React from 'react';
import Gauge from './visualizations/gauge';
import Metric from './visualizations/metric';
import State from './state';
import Sparkline from './visualizations/sparkline';
import LoadSparkline from './visualizations/load_sparkline';
import { Link } from 'react-router';

const HostDetails = (props) => {
  const link = {
    pathname: `/detail/${props.hostname}`,
    query: {
      _g: props.app.globalState.rison
    }
  };
  return (
    <tr>
      <td className="host-details">
        <h3>{ props.hostname }</h3>
      </td>
      <td className="vis middle">
        <div className="group">
          <State
            height={50}
            state={ props.state }
            title="State"/>
        </div>
      </td>
      <td className="vis">
        <div className="group">
          <Gauge
            width={50}
            height={50}
            metrics={ props.metrics.cpu_percent }
            title="CPU"/>
          <Sparkline
            width={100}
            height={65}
            max={1}
            min={0}
            thresholds={true}
            metrics={ props.metrics.cpu_percent }/>
        </div>
      </td>
      <td className="vis">
        <div className="group">
          <Gauge
            width={50}
            height={50}
            metrics={ props.metrics.memory_percent }
            title="MEM"/>
          <Sparkline
            width={100}
            height={65}
            max={1}
            min={0}
            thresholds={true}
            metrics={ props.metrics.memory_percent }/>
        </div>
      </td>
      <td className="vis">
        <div className="group">
          <Gauge
            width={50}
            height={50}
            format='0.00'
            max={props.metrics.load5_max}
            thresholds={false}
            color="#6eadc1"
            title="Load"
            metrics={ props.metrics.load5 }/>
          <LoadSparkline
            width={100}
            height={65}
            line={true}
            color="#6eadc1"
            thresholds={false}
            metrics={ props.metrics.load5}/>
        </div>
      </td>
      <td className="vis">
        <div className="group">
          <Gauge
            width={50}
            height={50}
            metrics={ props.metrics.disk_percent }
            title="DISK"/>
        </div>
      </td>
      <td className="actions">
        <Link to={link} className="btn btn-sm btn-default">View Details</Link>
      </td>
    </tr>
  );
};

export default HostDetails;
