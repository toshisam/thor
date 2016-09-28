import _ from 'lodash';
import React, { Component } from 'react';
import $ from 'rhythm-flot';
import eventBus from '../../lib/events';

class ChartVis extends Component {

  constructor(props) {
    super(props);
    const { min, max } = props;
    this.height = props.height || 75;
    this.width = props.width || 150;
    const type = props.type || 'line';
    this.opts = {
      legend: { show: false },
      yaxis: {
        color: '#EEEEEE',
        font: { color: '#CCCCCC' },
        tickFormatter: props.tickFormatter
      },
      xaxis: {
        color: '#EEEEEE',
        timezone: 'browser',
        mode: 'time',
        font: { color: '#CCCCCC' }
      },
      series: {
        stack: props.stack,
        shadowSize: 0,
        lines: {
          fill: props.fill != null ? props.fill : 0.5,
          line: props.line != null ? props.line : 0,
          show: (type === 'line')
        },
        bars: {
          barWidth: 2,
          show: (type === 'bar')
        },
        points: {
          radius: 0.7,
          fill: 1.0,
          show: false
        }
      },
      crosshair: {
        mode: 'x',
        color: '#666666',
        lineWidth: 2
      },
      grid: {
        margin: 0,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        hoverable: true,
        autoHighlight: false,
        mouseActiveRadius: 400
      }
    };

    if (props.max) _.set(this.opts, 'yaxis.max', props.max);
    if (props.min) _.set(this.opts, 'yaxis.min', props.min);
    this.handleResize = (e) => {
      this.plot.resize();
      this.plot.setupGrid();
      this.plot.draw();
    };

    this.setCrosshair = (e, pos) => {
      this.plot.setCrosshair(pos);
    };

    this.clearCrosshair = (e) => {
      this.plot.clearCrosshair();
    };
  }

  shouldComponentUpdate() {
    if (!this.plot) return true;
    return false;
  }

  componentWillUnmount() {
    $(this.plot.getPlaceholder()).unbind('plothover', this.props.plothover);
    window.removeEventListener('resize', this.handleResize);
    this.plot.shutdown();
    eventBus.off('rhythmPlothover', this.setCrosshair);
    eventBus.off('rhythmPlotLeave', this.clearCrosshair);
  }

  filterByShow(show) {
    if (show) {
      return (metric) => {
        return _.includes(show, metric.label);
      };
    }
    return (metric) => true;
  }

  componentWillReceiveProps(newProps) {
    if (this.plot) {
      const { metrics } = newProps;
      this.plot.setData(this.calculateData(metrics, newProps.show));
      this.plot.setupGrid();
      this.plot.draw();
    }
  }

  componentDidMount() {
    this.renderChart();
  }

  calculateData(data, show) {
    const series = [];
    return _(data)
      .filter(this.filterByShow(show))
      .map((set) => {
        if (_.isPlainObject(set)) {
          return set;
        }
        return {
          color: '#990000',
          data: set
        };
      }).reverse().value();
  }

  renderChart() {
    const { target} = this.refs;
    const { metrics } = this.props;
    const parent = $(target.parentElement);
    const data = this.calculateData(metrics, this.props.show);
    $(target).height(this.height);
    this.plot = $.plot(target, data, this.opts);
    window.addEventListener('resize', this.handleResize);
    if (_.isFunction(this.props.plothover)) {
      $(target).bind('plothover', this.props.plothover);
    }
    $(target).on('mouseleave', (e) => {
      eventBus.trigger('rhythmPlotLeave');
    });
    eventBus.on('rhythmPlothover', this.setCrosshair);
    eventBus.on('rhythmPlotLeave', this.clearCrosshair);
  }

  render() {
    return (<div ref="target"></div>);
  }

}

export default ChartVis;
