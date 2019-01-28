/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:53:09
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Modal, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const routerUrl = '/dbrk';
const url = 'dbrk';

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
      setList({
        current: 1,
        queryMap: { ...values } || {},
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
        id: info.order_code,
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
    const { orderstatus, SubwareList } = base;
    const { hanleConfirm } = this;

    const confirm = record => {
      Modal.confirm({
        title: '是否确认入库?',
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
        width: 230,
        align: 'center',
        render: (text, record) =>
          record.inware_status === 'new' ? (
            <Row type="flex" justify="space-around">
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record.order_code },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small">
                    详情
                  </Button>
                </Link>
              </Operate>
              <Operate operateName="STORAGE">
                <Button
                  type="danger"
                  icon="save"
                  ghost
                  size="small"
                  onClick={() => confirm(record)}
                >
                  确认收货
                </Button>
              </Operate>
            </Row>
          ) : (
            <Row type="flex" justify="space-around">
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record.order_code },
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
      {
        title: '调拨单编码',
        dataIndex: 'order_code',
        width: 150,
        sorter: true,
      },
      {
        title: '调拨单状态',
        dataIndex: 'order_status',
        width: 100,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}`;
            return text;
          }
        },
      },
      {
        title: '运输车牌',
        dataIndex: 'vehicle_number',
        width: 120,
      },
      {
        title: '总数',
        dataIndex: 'count',
        width: 60,
      },
      {
        title: '入库仓库',
        dataIndex: 'in_subware',
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
        title: '入库状态',
        dataIndex: 'inware_status',
        width: 80,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}`;
            return text;
          }
        },
      },
      {
        title: '入库仓管员',
        dataIndex: 'inware_user',
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
        title: '入库时间',
        width: 160,
        dataIndex: 'inware_date',
      },
      {
        title: '出库仓库',
        dataIndex: 'out_subware',
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
        title: '出库状态',
        dataIndex: 'outware_status',
        width: 80,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}`;
            return text;
          }
        },
      },
      {
        title: '出库仓管员',
        dataIndex: 'outware_user',
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
        title: '出库时间',
        dataIndex: 'outware_date',
        width: 160,
      },
    ];

    const listConfig = {
      url: '/api/query/queryInTransferList', // 必填,请求url
      scroll: { x: 2000, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        startDateOut: moment()
          .subtract(6, 'days')
          .format(DateFormat),
        endDateOut: moment().format(DateFormat),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="调拨单编码">
                  {getFieldDecorator('order_code', {
                    initialValue: this.props.list.queryMap.order_code,
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
                <FormItem label="出库仓库">
                  {getFieldDecorator('out_subware', {
                    initialValue: this.props.list.queryMap.out_subware,
                  })(
                    <Select allowClear placeholder="选择仓库">
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
                <FormItem label="出库时间(开始)">
                  {getFieldDecorator('startDateOut', {
                    initialValue: this.props.list.queryMap.startDateOut
                      ? moment(this.props.list.queryMap.startDateOut)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="出库时间(结束)">
                  {getFieldDecorator('endDateOut', {
                    initialValue: this.props.list.queryMap.endDateOut
                      ? moment(this.props.list.queryMap.endDateOut)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="入库仓库">
                  {getFieldDecorator('in_subware', {
                    initialValue: this.props.list.queryMap.in_subware,
                  })(
                    <Select allowClear placeholder="选择仓库">
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
                <FormItem label="入库时间(开始)">
                  {getFieldDecorator('startDateIn', {
                    initialValue: this.props.list.queryMap.startDateIn
                      ? moment(this.props.list.queryMap.startDateIn)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="入库时间(结束)">
                  {getFieldDecorator('endDateIn', {
                    initialValue: this.props.list.queryMap.endDateIn
                      ? moment(this.props.list.queryMap.endDateIn)
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
