/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 09:49:57
 * @Description: 发货出库
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const routerUrl = '/wmsmarketget';
const url = 'wmsmarketget';

@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class MyIndex extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(200)
  resize() {
    this.setState({
      scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
    });
  }
  handleSearch = e => {
    e.preventDefault();
    const { form, list } = this.props;
    const { setList } = list;
    form.validateFieldsAndScroll((err, values) => {
      let temp = {};
      if (!isEmpty(values.start_get_date))
        temp = {
          ...temp,
          start_get_date: values.start_get_date.format(DateFormat),
        };
      if (!isEmpty(values.end_get_date))
        temp = {
          ...temp,
          end_get_date: values.end_get_date.format(DateFormat),
        };

      setList({
        current: 1,
        queryMap: { ...values, ...temp } || {},
      });
    });
  };
  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/delete',
      payload: {
        id: info.record_id,
      },
      url,
      callback: () => setList(),
    });
  };
  handleFormReset = () => {
    const { form, list } = this.props;
    const { setList } = list;
    setList({
      current: 1,
      queryMap: {},
    });
    form.resetFields();
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist, codetype } = this.props.base;

    const columns = [
      {
        title: '条码编码',
        dataIndex: 'code_code',
        width: 160,
      },
      {
        title: '商超',
        dataIndex: 'market_name',
        width: 100,
      },
      {
        title: '车辆',
        dataIndex: 'vehicle_number',
        width: 120,
      },
      {
        title: '农户',
        dataIndex: 'farmer_name',
        width: 100,
      },
      {
        title: '农产品',
        dataIndex: 'product',
        width: 100,
      },
      {
        title: '农产品数量',
        dataIndex: 'product_count',
        width: 100,
      },
      {
        title: '中转仓',
        dataIndex: 'outware_id',
        width: 100,
      },
      {
        title: '领用时间',
        dataIndex: 'get_date',
        width: 200,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
      {
        title: '供应商',
        width: 120,
        dataIndex: 'supply_code',
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === text);
            if (temp) return `${temp.supply_name}` + '(' + temp.supply_sx + ')';
            return text;
          }
        },
      },
      {
        title: '载具规格',
        width: 150,
        dataIndex: 'spec',
        render: text => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '载具颜色',
        width: 100,
        dataIndex: 'color',
        render: text => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '条码类型',
        width: 120,
        dataIndex: 'code_type',
        render: text => {
          if (Array.isArray(codetype)) {
            const temp = codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}` + '(' + temp.dic_code + ')';
            return text;
          }
        },
      },
    ];

    const listConfig = {
      url: `/api/wmsmarketget/queryWmsMarketgetList`, // 必填,请求url
      scroll: { x: 1400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_get_date: moment()
          .subtract(6, 'days')
          .format(DateFormat),
        end_get_date: moment().format(DateFormat),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="供应商">
                  {getFieldDecorator('supply_code', {
                    initialValue: this.props.list.queryMap.supply_code,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(supplylist)
                        ? supplylist.map(item => (
                            <Option key={item.supply_code} value={item.supply_code}>
                              {`${item.supply_name}(${item.supply_sx})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="商超">
                  {getFieldDecorator('market_name', {
                    initialValue: this.props.list.queryMap.market_name,
                  })(<Input placeholder="请输入商超名称" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="领用时间(开始)">
                  {getFieldDecorator('start_get_date', {
                    initialValue: this.props.list.queryMap.start_get_date
                      ? moment(this.props.list.queryMap.start_get_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="领用时间(结束)">
                  {getFieldDecorator('end_get_date', {
                    initialValue: this.props.list.queryMap.end_get_date
                      ? moment(this.props.list.queryMap.end_get_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Button icon="search" type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.props.dispatch(routerRedux.push(`${routerUrl}/info`))}
                    >
                      新建
                    </Button>
                  </Operate>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
