import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  fetchMetricbeatMetrics
} from '../actions/metricbeat';
import _ from 'lodash';
import numeral from 'numeral';
import { getLastValue, BarVis, Chart } from '@elastic/rhythm-visualizations';

const latencyFormater = (val) => {
  if (!_.isNumber(val)) return '0s';
  return numeral(val / 1000).format('0,0.0') + 's';
};

const colors = [
  '#6eadc1',
  '#d76051',
  '#fbce47',
  '#80c383',
  '#e8488b',
  '#9980b2'
];

class Status extends Component {
  constructor(props) {
    super(props);
  }

  fetch() {
    const { dispatch } = this.props;
    dispatch(fetchMetricbeatMetrics());
  }

  componentWillReceiveProps(props) {
    if (props.app.shouldFetch) {
      this.fetch();
    }
  }

  componentDidMount() {
    this.fetch();
  }

  renderRow(row) {
    return (
      <div className="horz-bar_row" key={ row.hostname }>
        <div className="horz-bar_field">
          { row.hostname }
        </div>
        <div className="horz-bar_bar">
          <BarVis values={[{ value: row.percent, color: '#e8488b' }]}/>
        </div>
        <div className="horz-bar_value">
          { latencyFormater(row.value) }
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div>
          <div className="data-alert">
            <div className="data-alert_title">Unable to find any Metricbeat data</div>
            <div className="data-alert_note">Check your hosts to make sure Metricbeat is configured properly.</div>
          </div>
        </div>
      );
    }
    const { metricbeat } = this.props;
    const ingestRateSeries = [
      { label: 'Ingest Rate', data: metricbeat.ingest_rate, color: '#6eadc1' }
    ];
    const latencyRateSeries = [
      { label: 'Latency', data: metricbeat.latency, color: '#9980b2' }
    ];
    const slowSeries = metricbeat.top_five_slowest.map((row, index) => {
      row.color = colors[index];
      return row;
    });
    const hostRows = metricbeat.slowest_hosts.map((row) => this.renderRow(row));
    const currentIngestRate = getLastValue(metricbeat.ingest_rate);
    return (
      <div className="status-page">
        <div className="details">
          <div className="header">
            <h2>Metricbeat Stats</h2>
          </div>
          <div class="sections">
            <div className="section">
              <div className="row">
                <div className="item metrics">
                  <div className="metric_vis">
                    <div className="metric_vis_label">Current Ingest Rate</div>
                    <div className="metric_vis_value">
                      { numeral(currentIngestRate).format('0,0.0') + '/s'}
                    </div>
                    <div className="metric_vis_secondary">
                      {  numeral(metricbeat.ingest_rate_peak).format('0,0.0') + '/s' } PEAK
                    </div>
                  </div>
                  <div className="metric_vis">
                    <div className="metric_vis_label">Average Latency</div>
                    <div className="metric_vis_value">{ latencyFormater(metricbeat.latency_avg) }</div>
                    <div className="metric_vis_secondary">
                        {  latencyFormater(metricbeat.latency_peak) } PEAK
                    </div>
                  </div>
                  <div className="metric_vis">
                    <div className="metric_vis_label">Total Docs</div>
                    <div className="metric_vis_value">{ numeral(metricbeat.total_docs).format('0.00a') }</div>
                    <div className="metric_vis_secondary">
                        { numeral(metricbeat.bytes).format('0.0b') }
                    </div>
                  </div>
                  <div className="metric_vis">
                    <div className="metric_vis_label">Hosts Currently Online</div>
                    <div className="metric_vis_value">{ metricbeat.total_hosts - metricbeat.total_offline_hosts }</div>
                    <div className="metric_vis_secondary">
                      { numeral(metricbeat.total_offline_hosts).format('0,0') } OFFLINE
                    </div>
                  </div>
                </div>
              </div>
             <div className="row">
                <div className="item">
                  <Chart
                    title="Top Five Slowest Hosts by Average Latency"
                    tickFormatter={ latencyFormater }
                    fill={0.0}
                    line={1.0}
                    height={200}
                    metrics={slowSeries}/>
                </div>
              </div>
              <div className="row">
                <div className="item">
                  <Chart
                    title="Ingest Rate"
                    type="bar"
                    tickFormatter={ (val) => numeral(val).format('0,0.0') + '/s'}
                    fill={1.0}
                    height={200}
                    metrics={ingestRateSeries}/>
                </div>
              </div>
              <div className="row">
                <div className="item">
                  <Chart
                    title="Average Latency Aross All Hosts"
                    type="bar"
                    tickFormatter={ latencyFormater }
                    fill={1.0}
                    height={200}
                    metrics={latencyRateSeries}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { app, metricbeat } = state;
  const loaded = metricbeat.ingest_rate.length;
  return { app, metricbeat, loaded };
}

export default connect(mapStateToProps)(Status);

