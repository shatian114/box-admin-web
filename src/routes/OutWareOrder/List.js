/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 20:29:22
 * @Description: 发货出库
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Modal, Select, DatePicker } from 'antd';
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
const DateFormat = 'YYYY-MM-DD';
const routerUrl = '/fhck';
const url = 'fhck';

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
    const { hanleDelete, hanleConfirm } = this;
    const type = this.props.location.state.args.type;
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
        title: '是否确认出库?',
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
        width: 260,
        align: 'center',
        render: (text, record) =>
          record.order_status === 'new' ? (
            <Row type="flex" justify="space-around">
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record.order_code },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small" hidden={type === 'lk'}>
                    编辑(批控)
                  </Button>
                </Link>
              </Operate>
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/infoC`,
                    state: { id: record.order_code },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small" hidden={type === 'pk'}>
                    编辑(数量)
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
              <Operate operateName="QR">
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
        title: '出库单编码',
        dataIndex: 'order_code',
        width: 150,
        sorter: true,
      },
      {
        title: '出库单状态',
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
        title: '运输车辆',
        dataIndex: 'vehicle_number',
        width: 90,
      },
      {
        title: '总数',
        dataIndex: 'count',
        width: 60,
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
        title: '出库仓管员',
        dataIndex: 'outware_user',
        width: 160,
      },
      {
        title: '出库时间',
        dataIndex: 'outware_date',
        width: 160,
      },
    ];

    const listConfig = {
      url: '/api/query/queryOutwareorderList', // 必填,请求url
      scroll: { x: 1400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_code', // 必填,行key
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
                <FormItem label="出库单编码">
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
                  {getFieldDecorator('startDate', {
                    initialValue: this.props.list.queryMap.startDate
                      ? moment(this.props.list.queryMap.startDate)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="出库时间(结束)">
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
                      hidden={type === 'lk'}
                      onClick={() => this.props.dispatch(routerRedux.push(`${routerUrl}/info`))}
                    >
                      新建(批控)
                    </Button>
                  </Operate>
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      hidden={type === 'pk'}
                      onClick={() => this.props.dispatch(routerRedux.push(`${routerUrl}/infoC`))}
                    >
                      新建(数量控制)
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
