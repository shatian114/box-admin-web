import React from 'react';
import echarts from 'echarts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

export default class FarmerAnalysis extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.farmerAnalysis = echarts.init(this.farmerAnalysis);
    this.farmerAnalysis.setOption(this.option(), true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(200)
  resize() {
    if (this.farmerAnalysis) this.farmerAnalysis.resize();
  }

  option = () => {
    return {
      title: {
        text: '农户需求分析',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: this.props.series.map(item => item.name),
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.props.xData,
        },
      ],
      yAxis: [
        {
          name: '数量(个)',
          type: 'value',
        },
      ],
      dataZoom: [
        {
          start: 0,
          end: 100,
        },
      ],
      series: this.props.series,
    };
  };

  render() {
    return (
      <div
        id="farmerAnalysis"
        ref={e => {
          this.farmerAnalysis = e;
        }}
        style={{ width: '100%', height: '80vh' }}
      />
    );
  }
}
