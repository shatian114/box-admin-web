/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 20:35:42
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Select, InputNumber, DatePicker } from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import './list.less';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const routerUrl = '/NPZCJL';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
@Operate.create(routerUrl)
export default class NPZCJL extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'clear/list',
    });
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
      if (!isEmpty(values.start_send_date))
        temp = {
          ...temp,
          start_send_date: values.start_send_date.format(DateFormat),
        };
      if (!isEmpty(values.end_send_date))
        temp = {
          ...temp,
          end_send_date: values.end_send_date.format(DateFormat),
        };
      setList({
        current: 1,
        queryMap: { ...values, ...temp },
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
    const { codetype, spec, color, orderstatus, supplylist } = base;

    const columns = [
      {
        title: '条码编号',
        dataIndex: 'code_code',
        width: 150,
        sorter: true,
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        width: 150,
        render: text => {
          if (Array.isArray(codetype)) {
            const temp = codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '载具供应商',
        dataIndex: 'supply_code',
        width: 150,
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === text);
            if (temp) return `${temp.supply_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '载具规格',
        dataIndex: 'spec',
        width: 150,
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
        dataIndex: 'color',
        width: 130,
        render: text => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '送货数量',
        dataIndex: 'send_count',
        width: 130,
      },
      {
        title: '车辆',
        dataIndex: 'vehicle_number',
        width: 130,
      },
      {
        title: '农户',
        dataIndex: 'farmer_name',
        width: 130,
      },
      {
        title: '送货状态',
        dataIndex: 'send_status',
        width: 130,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '送货时间',
        dataIndex: 'send_date',
      },
    ];

    const listConfig = {
      url: `/api/query${routerUrl}`, // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_send_date: moment()
          .subtract(6, 'day')
          .format(DateFormat),
        end_send_date: moment().format(DateFormat),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="条码编号">
                  {getFieldDecorator('code_code', {
                    initialValue: this.props.list.queryMap.code_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码类型">
                  {getFieldDecorator('code_type', {
                    initialValue: this.props.list.queryMap.code_type,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(codetype)
                        ? codetype.map(item => (
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
                <FormItem label="规格">
                  {getFieldDecorator('spec', {
                    initialValue: this.props.list.queryMap.spec,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="载具规格"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(spec)
                        ? spec.map(item => (
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
                <FormItem label="载具颜色">
                  {getFieldDecorator('color', {
                    initialValue: this.props.list.queryMap.color,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(color)
                        ? color.map(item => (
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
                <FormItem label="送货数量(起始)">
                  {getFieldDecorator('start_send_count', {
                    initialValue: this.props.list.queryMap.start_send_count,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="送货数量(结束)">
                  {getFieldDecorator('end_send_count', {
                    initialValue: this.props.list.queryMap.end_send_count,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="司机名称">
                  {getFieldDecorator('vehicle_number', {
                    initialValue: this.props.list.queryMap.vehicle_number,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="农户名称">
                  {getFieldDecorator('farmer_name', {
                    initialValue: this.props.list.queryMap.farmer_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="送货时间(开始)">
                  {getFieldDecorator('start_send_date', {
                    initialValue: this.props.list.queryMap.start_send_date
                      ? moment(this.props.list.queryMap.start_send_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="送货时间(结束)">
                  {getFieldDecorator('end_send_date', {
                    initialValue: this.props.list.queryMap.end_send_date
                      ? moment(this.props.list.queryMap.end_send_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
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
