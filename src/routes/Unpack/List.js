/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 11:26:03
 * @Description: 用户管理列表
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
const DateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const routerUrl = '/unpack';

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
      if (!isEmpty(values.startDate))
        temp = {
          ...temp,
          startDate: values.startDate.format(DateFormat),
        };
      if (!isEmpty(values.endDate))
        temp = {
          ...temp,
          endDate: values.endDate.format(DateFormat),
        };
      setList({
        current: 1,
        queryMap: { ...values, ...temp } || {},
      });
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
    const { form, base } = this.props;
    const { getFieldDecorator } = form;
    const { SubwareList, spec, supplylist } = base;

    const columns = [
      {
        title: '拆包编号',
        dataIndex: 'record_id',
        width: 150,
        sorter: true,
      },
      {
        title: '箱号',
        dataIndex: 'code_code',
        width: 150,
        sorter: true,
      },
      {
        title: '拆解管理员',
        dataIndex: 'unpack_user',
        width: 100,
      },
      {
        title: '拆解时间',
        dataIndex: 'unpack_date',
        width: 150,
        sorter: true,
      },
      {
        title: '中转仓',
        dataIndex: 'outware_id',
        width: 160,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '运输车辆',
        dataIndex: 'vehicle_number',
        width: 100,
      },
      {
        title: '农户',
        dataIndex: 'farmer_name',
        width: 100,
      },
      {
        title: '商超',
        dataIndex: 'market_name',
        width: 100,
      },
      {
        title: '供应商',
        dataIndex: 'supply_code',
        width: 130,
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === text);
            if (temp) return `${temp.supply_name}(${text})`;
            return text;
          }
          return text;
        },
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 130,
        render: text => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
          return text;
        },
      },
      {
        title: '颜色',
        dataIndex: 'color',
      },
    ];

    const listConfig = {
      url: '/api/query/queryWmsUnPackList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        startDate: moment()
          .subtract(6, 'days')
          .format(DateFormat),
        endDate: moment().format(DateFormat),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="拆包编号">
                  {getFieldDecorator('record_id', {
                    initialValue: this.props.list.queryMap.record_id,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="箱号">
                  {getFieldDecorator('code_code', {
                    initialValue: this.props.list.queryMap.code_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="运输车牌">
                  {getFieldDecorator('vehicle_number', {
                    initialValue: this.props.list.queryMap.vehicle_number,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="中转仓">
                  {getFieldDecorator('outware_id', {
                    initialValue: this.props.list.queryMap.outware_id,
                  })(
                    <Select allowClear placeholder="中转仓">
                      {Array.isArray(SubwareList)
                        ? SubwareList.map(item => (
                            <Option key={item.dic_code} value={item.dic_code}>
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="农户">
                  {getFieldDecorator('farmer_name', {
                    initialValue: this.props.list.queryMap.farmer_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="商超">
                  {getFieldDecorator('market_name', {
                    initialValue: this.props.list.queryMap.market_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="供应商">
                  {getFieldDecorator('supply_code', {
                    initialValue: this.props.list.queryMap.supply_code,
                  })(
                    <Select allowClear placeholder="供应商">
                      {Array.isArray(supplylist)
                        ? supplylist.map(item => (
                            <Option key={item.supply_code} value={item.supply_code}>
                              {`${item.supply_name}`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="拆解时间(开始)">
                  {getFieldDecorator('startDate', {
                    initialValue: this.props.list.queryMap.startDate
                      ? moment(this.props.list.queryMap.startDate)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="拆解时间(结束)">
                  {getFieldDecorator('endDate', {
                    initialValue: this.props.list.queryMap.endDate
                      ? moment(this.props.list.queryMap.endDate)
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
