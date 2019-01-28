import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import Operate from '../../components/Oprs';
import { CodeAnalysis } from '../../components/Echarts';

const routerUrl = '/codeAnalysis';
const url = 'codeAnalysis';

@Operate.create(routerUrl)
@connect(({ loading, chart }) => ({
  loading: loading.effects['chart/query'],
  chart,
}))
export default class Code extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/query',
      url,
    });
  }

  render() {
    const { loading, chart } = this.props;
    return (
      <Card loading={loading}>
        <CodeAnalysis data={chart.codeAnalysis} />
      </Card>
    );
  }
}
