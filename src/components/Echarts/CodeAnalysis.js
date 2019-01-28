import React from 'react';
import echarts from 'echarts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

const config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
};

const labelOption = {
  normal: {
    show: true,
    position: config.position,
    distance: config.distance,
    align: config.align,
    verticalAlign: config.verticalAlign,
    rotate: config.rotate,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {
        textBorderColor: '#fff',
      },
    },
  },
};

export default class CodeAnalysis extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.codeAnalysis = echarts.init(this.codeAnalysis);
    this.codeAnalysis.setOption(this.option(this.props.data), true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(200)
  resize() {
    if (this.codeAnalysis) this.codeAnalysis.resize();
  }

  option = data => {
    return {
      title: {
        text: '载具数量统计',
        x: 'center',
      },
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['在库', '报废', '丢失', '在途'],
        x: 'left',
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
          axisTick: { show: false },
          data: data.map(item => item.subware_name),
        },
      ],
      yAxis: [
        {
          name: '载具数量(个)',
          type: 'value',
        },
      ],
      dataZoom: [
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: '在库',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          data: data.map(item => item.count || 0),
        },
        {
          name: '报废',
          type: 'bar',
          label: labelOption,
          data: data.map(item => item.BFCount || 0),
        },
        {
          name: '丢失',
          type: 'bar',
          label: labelOption,
          data: data.map(item => item.DSCount || 0),
        },
        {
          name: '在途',
          type: 'bar',
          label: labelOption,
          data: data.map(item => item.ZTCount || 0),
        },
      ],
    };
  };

  render() {
    return (
      <div
        id="codeAnalysis"
        ref={e => {
          this.codeAnalysis = e;
        }}
        style={{ width: '100%', height: '80vh' }}
      />
    );
  }
}
