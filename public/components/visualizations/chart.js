import _ from 'lodash';
import numeral from 'numeral';
import React, { Component } from 'react';
import $ from 'rhythm-flot';
import getLastValue from '../../lib/get_last_value';
import ChartVis from './chart_vis';
import eventBus from '../../lib/events';

class Chart extends Component {

  constructor(props) {
    super(props);
    const values = this.getLastValues();
    this.state = {
      values: this.getLastValues() || [],
      show: _.keys(values) || [],
      ignoreLegendUpdates: false,
      ignoreVisabilityUpdates: false
    };

    const debouncedUpdateLegend = _.debounce((pos) => {
      this.updateLegend(pos);
    }, 50, { leading: false, trailing: true });

    this.handlePlotHover = (e, pos) => {
      this.setState({ ignoreLegendUpdates: true });
      debouncedUpdateLegend(pos);
    };

    this.handlePlotLeave = (e) => {
      if (this.state.ignoreLegendUpdates) {
        debouncedUpdateLegend();
      } else {
        this.updateLegend();
      }
      this.setState({ ignoreLegendUpdates: false });
    };
  }

  format(value) {
    if (_.isFunction(this.props.tickFormatter)) return this.props.tickFormatter(value);
    return value;
  }

  toggleFilter(event, label) {
    const notAllShown = _.keys(this.state.values).length !== this.state.show.length;
    const isCurrentlyShown = _.includes(this.state.show, label);
    if (notAllShown && isCurrentlyShown) {
      this.setState({ ignoreVisabilityUpdates: false, show: Object.keys(this.state.values) });
    } else {
      this.setState({ ignoreVisabilityUpdates: true, show: [label] });
    }
  }

  createSeries(row) {
    const value = this.format(this.state.values[row.label]);
    const classes = ['item'];
    if (!_.includes(this.state.show, row.label)) classes.push('disabled');
    return (
      <div
        className={ classes.join(' ') }
        onClick={ event => this.toggleFilter(event, row.label) }
        key={ row.label }>
        <div className="legend-label">
          <i className="fa fa-circle" style={{ color: row.color }}></i>
          <span>{ row.label }</span>
        </div>
        <div className="legend-value">{ value }</div>
      </div>
    );
  }

  getLastValues(props) {
    props = props || this.props;
    const values = {};
    props.metrics.forEach((row) => {
      values[row.label] = getLastValue(row.data);
    });
    return values;
  }

  updateLegend(pos) {
    const values = {};
    if (pos) {
      this.props.metrics.forEach((row) => {
        let closest;
        for (let i = 0; i < row.data.length; i++) {
          closest = i;
          if (pos.x < row.data[i][0]) break;
        }
        const [ time, value ] = row.data[closest];
        values[row.label] = value || 0;
      });
    } else {
      _.assign(values, this.getLastValues());
    }

    this.setState({ values });
  }

  componentWillReceiveProps(props) {
    if (!this.state.ignoreLegendUpdates) {
      const values = this.getLastValues(props);
      const currentKeys = _.keys(this.state.values);
      const keys = _.keys(values);
      const nextState = { values: values };
      if (!this.state.ignoreVisabilityUpdates) {
        nextState.show = keys;
      }
      this.setState(nextState);
    }
  }

  plothover(event, pos, item) {
    this.setState({ ignoreLegendUpdates: true });
    this.updateLegend(pos);
    eventBus.trigger('rhythmPlothover', pos);
  }

  componentDidMount() {
    eventBus.on('rhythmPlothover', this.handlePlotHover);
    eventBus.on('rhythmPlotLeave', this.handlePlotLeave);
  }

  componentWillUnmount() {
    eventBus.off('rhythmPlothover', this.handlePlotHover);
    eventBus.off('rhythmPlotLeave', this.handlePlotLeave);
  }

  render() {
    const rows = this.props.metrics.map(row => this.createSeries(row));
    const title = this.props.title && (<div className="title">{ this.props.title }</div>) || '';
    return (
      <div className="flotchart">
        { title }
        <div className="chart-content">
          <div className="visualization">
            <ChartVis
              show={ this.state.show }
              plothover={ this.plothover.bind(this)}
              {...this.props}/>
          </div>
          <div className="legend">
            { rows }
          </div>
        </div>
      </div>
    );
  }

}

export default Chart;

