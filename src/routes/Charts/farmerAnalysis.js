import React from 'react';
import { connect } from 'dva';
import { Card, DatePicker, Row, Form, Col, Button, Radio, Cascader } from 'antd';
import moment from 'moment';
import Operate from '../../components/Oprs';
// import { CodeAnalysis } from '../../components/Echarts';
import styles from './query.less';
import { isEmpty, getTimeDistance, getTimeLimit } from '../../utils/utils';
import { FarmerAnalysis } from '../../components/Echarts';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const routerUrl = '/farmerAnalysis';
const url = 'farmerAnalysis';

const dateFormat = 'YYYY-MM-DD';
const formatSwitch = {
  day: 'YYYY-MM-DD',
  month: 'YYYY-MM',
};
const options = [
  {
    value: 'guizhou',
    label: '贵州',
    children: [
      {
        value: 'guiyang',
        label: '贵阳',
        children: [
          {
            value: 'baiyunqu',
            label: '白云区',
          },
          {
            value: 'guanshanhuqu',
            label: '观山湖区',
          },
        ],
      },
    ],
  },
];

const checkboxOptions = [{ label: '正常', value: 'normal' }, { label: '农产品', value: 'product' }];

@Operate.create(routerUrl)
@Form.create()
@connect(({ loading, chart }) => ({
  loading: loading.effects['chart/query'],
  chart,
}))
export default class Code extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/query',
      payload: {
        timeScale: 'day',
        type: 'normal',
        timeLimit: [
          moment()
            .startOf('year')
            .format(dateFormat),
          moment().format(dateFormat),
        ],
      },
      url,
    });
  }

  handleSearch = e => {
    if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const timeLimit = Array.isArray(values.timeLimit)
        ? values.timeLimit.map(item => item.format(dateFormat))
        : undefined;
      dispatch({
        type: 'chart/query',
        payload: {
          ...values,
          timeLimit,
        },
        url,
      });
    });
  };

  render() {
    const { loading, form, chart: { queryMap, farmerAnalysis } } = this.props;
    const { getFieldDecorator } = form;
    let xData = [];
    const productsSet = new Set();

    if (Array.isArray(queryMap.timeLimit)) {
      xData = getTimeLimit({ limit: queryMap.timeLimit, type: queryMap.timeScale });
    }

    const series = [];
    farmerAnalysis.forEach(item => {
      productsSet.add(item.product);
    });
    const products = Array.from(productsSet);
    if (queryMap.type === 'normal' || isEmpty(queryMap.type)) {
      series.push({
        name: '需求',
        type: 'line',
        data: xData.map(item => {
          const temp = farmerAnalysis.find(item2 => item2.type === 'need' && item2.time === item);
          if (isEmpty(temp)) return 0;
          return temp.count;
        }),
      });
      series.push({
        name: '领用',
        type: 'line',
        data: xData.map(item => {
          const temp = farmerAnalysis.find(item2 => item2.type === 'get' && item2.time === item);
          if (isEmpty(temp)) return 0;
          return temp.count;
        }),
      });
      series.push({
        name: '装车',
        type: 'line',
        data: xData.map(item => {
          const temp = farmerAnalysis.find(item2 => item2.type === 'send' && item2.time === item);
          if (isEmpty(temp)) return 0;
          return temp.count;
        }),
      });
    } else {
      products.forEach(product => {
        series.push({
          name: `${product}需求`,
          type: 'line',
          data: xData.map(item => {
            const temp = farmerAnalysis.find(
              item2 => item2.type === 'need' && item2.time === item && item2.product === product
            );
            if (isEmpty(temp)) return 0;
            return temp.count;
          }),
        });
        series.push({
          name: `${product}领用`,
          type: 'line',
          data: xData.map(item => {
            const temp = farmerAnalysis.find(
              item2 => item2.type === 'get' && item2.time === item && item2.product === product
            );
            if (isEmpty(temp)) return 0;
            return temp.count;
          }),
        });
        series.push({
          name: `${product}装车`,
          type: 'line',
          data: xData.map(item => {
            const temp = farmerAnalysis.find(
              item2 => item2.type === 'send' && item2.time === item && item2.product === product
            );
            if (isEmpty(temp)) return 0;
            return temp.count;
          }),
        });
      });
    }
    return (
      <div className={styles.tableListForm}>
        <Card bodyStyle={{ paddingBottom: 0 }} bordered={false} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 12, xl: 12 }}>
              <Col md={10} sm={24}>
                <FormItem label="时间范围">
                  {getFieldDecorator('timeLimit', {
                    initialValue: Array.isArray(queryMap.timeLimit)
                      ? queryMap.timeLimit.map(item => moment(item))
                      : undefined,
                  })(
                    <RangePicker
                      allowClear={false}
                      format={dateFormat}
                      placeholder={['起始', '结束']}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={7} sm={24}>
                <FormItem label="地址">
                  {getFieldDecorator('address', {
                    initialValue: queryMap.address,
                  })(<Cascader options={options} placeholder="地址" />)}
                </FormItem>
              </Col>
              <Col md={7} sm={24}>
                <FormItem label="时间刻度">
                  {getFieldDecorator('timeScale', {
                    initialValue: queryMap.timeScale,
                  })(
                    <RadioGroup>
                      <RadioButton value="day">日</RadioButton>
                      {/* <RadioButton value="week">周</RadioButton> */}
                      <RadioButton value="month">月</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="图表类型">
                  {getFieldDecorator('type', {
                    initialValue: queryMap.type,
                  })(<RadioGroup options={checkboxOptions} />)}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Operate operateName="QUERY">
                    <Button icon="search" type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Operate>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card loading={loading}>
          <FarmerAnalysis xData={xData} series={series} />
        </Card>
      </div>
    );
  }
}
