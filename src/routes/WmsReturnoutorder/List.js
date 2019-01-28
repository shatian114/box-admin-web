/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-13 21:05:29
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const routerUrl = '/WmsReturnoutorder';
const url = 'WmsReturnoutorder';
const rowKey = 'order_code';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class WmsReturnoutorderList extends Component {
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
      if (!isEmpty(values.start_outware_date))
        temp = {
          ...temp,
          start_outware_date: values.start_outware_date.format(DateFormat),
        };
      if (!isEmpty(values.end_outware_date))
        temp = {
          ...temp,
          end_outware_date: values.end_outware_date.format(DateFormat),
        };
      if (!isEmpty(values.start_create_date))
        temp = {
          ...temp,
          start_create_date: values.start_create_date.format(DateFormat),
        };
      if (!isEmpty(values.end_create_date))
        temp = {
          ...temp,
          end_create_date: values.end_create_date.format(DateFormat),
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

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/delete',
      payload: {
        // 主键id
        id: info[rowKey],
      },
      url,
      callback: () => setList(),
    });
  };

  hanleConfirm = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/confirmOrder',
      payload: {
        id: info.order_code,
      },
      url,
      callback: () => setList(),
    });
  };

  render() {
    const { form, base } = this.props;
    const { orderstatus, SubwareList, supplylist } = base;

    const { getFieldDecorator } = form;
    const { hanleDelete, hanleConfirm } = this;
    const showConfirm = record => {
      Modal.confirm({
        title: '确定想要删除吗?',
        okType: 'danger',
        okText: '是',
        cancelText: '否',
        onOk() {
          hanleDelete(record);
        },
      });
    };

    const confirm = record => {
      Modal.confirm({
        title: '是否确认余货入库?',
        okType: 'waring',
        okText: '是',
        cancelText: '否',
        onOk() {
          hanleConfirm(record);
        },
      });
    };

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 210,
        align: 'center',
        render: (text, record) =>
          record.order_status === 'new' ? (
            <Row type="flex" justify="space-around">
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record[rowKey] },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small">
                    详情
                  </Button>
                </Link>
              </Operate>
              <Operate operateName="DELETE">
                <Button
                  type="danger"
                  icon="delete"
                  ghost
                  size="small"
                  onClick={() => showConfirm(record)}
                >
                  删除
                </Button>
              </Operate>
              <Operate operateName="STORAGE">
                <Button
                  type="danger"
                  icon="save"
                  ghost
                  size="small"
                  onClick={() => confirm(record)}
                >
                  确认
                </Button>
              </Operate>
            </Row>
          ) : (
            <Row type="flex" justify="space-around">
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record[rowKey] },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small">
                    详情
                  </Button>
                </Link>
              </Operate>
            </Row>
          ),
      },
      { title: '单据编码', dataIndex: 'order_code', width: 150, sorter: false },
      {
        title: '单据状态',
        dataIndex: 'order_status',
        width: 150,
        sorter: false,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '供应商',
        dataIndex: 'supply_code',
        width: 150,
        sorter: false,
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '出库仓库',
        dataIndex: 'out_subware',
        width: 150,
        sorter: false,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      { title: '出库仓管员', dataIndex: 'outware_name', width: 150, sorter: false },
      { title: '出库时间', dataIndex: 'outware_date', width: 150, sorter: false },
      { title: '创建时间', dataIndex: 'create_date', width: 150, sorter: false },
    ];

    const listConfig = {
      url: '/api/WmsReturnoutorder/queryWmsReturnoutorderList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_create_date: moment()
          .subtract(6, 'day')
          .format(DateFormat),
        end_create_date: moment().format(DateFormat),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="单据编码">
                  {getFieldDecorator('order_code', {
                    initialValue: this.props.list.queryMap.order_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="单据状态">
                  {getFieldDecorator('order_status', {
                    initialValue: this.props.list.queryMap.order_status,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="单据状态"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(orderstatus)
                        ? orderstatus.map(item => (
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
                <FormItem label="供应商">
                  {getFieldDecorator('supply_code', {
                    initialValue: this.props.list.queryMap.supply_code,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="单据状态"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(supplylist)
                        ? supplylist.map(item => (
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
                <FormItem label="运输车牌">
                  {getFieldDecorator('vehicle_number', {
                    initialValue: this.props.list.queryMap.vehicle_number,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="出库仓库">
                  {getFieldDecorator('out_subware', {
                    initialValue: this.props.list.queryMap.out_subware,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="出库仓库"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
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
                <FormItem label="出库仓管员">
                  {getFieldDecorator('outware_user', {
                    initialValue: this.props.list.queryMap.outware_user,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="出库时间(起始)">
                  {getFieldDecorator('start_outware_date', {
                    initialValue: this.props.list.queryMap.start_outware_date
                      ? moment(this.props.list.queryMap.start_outware_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="出库时间(结束)">
                  {getFieldDecorator('end_outware_date', {
                    initialValue: this.props.list.queryMap.end_outware_date
                      ? moment(this.props.list.queryMap.start_outware_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间(起始)">
                  {getFieldDecorator('start_create_date', {
                    initialValue: this.props.list.queryMap.start_create_date
                      ? moment(this.props.list.queryMap.start_create_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间(结束)">
                  {getFieldDecorator('end_create_date', {
                    initialValue: this.props.list.queryMap.end_create_date
                      ? moment(this.props.list.queryMap.end_create_date)
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
