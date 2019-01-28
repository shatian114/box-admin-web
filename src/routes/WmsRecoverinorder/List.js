/*
 * @Author: cuiwei 
 * @Date: 2018-05-25 10:00:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 13:14:25
 * @Description: 
 */

import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Modal, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const routerUrl = '/wmsrecoverinorder';
const url = 'wmsrecoverinorder';

@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class WmsReturninorderList extends Component {
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
      const date = {};
      if (values.start_create_date)
        date.start_create_date = values.start_create_date.format(DateFormat);
      if (values.end_create_date) date.end_create_date = values.end_create_date.format(DateFormat);
      setList({
        current: 1,
        queryMap: { ...values, ...date } || {},
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
        width: 220,
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
                  <Button type="primary" icon="edit" ghost size="small">
                    编辑
                  </Button>
                </Link>
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
        title: '入库单编号',
        dataIndex: 'order_code',
        width: 200,
        align: 'center',
        sorter: true,
      },
      {
        title: '入库单状态',
        dataIndex: 'order_status',
        width: 100,
        align: 'center',
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}`;
            return text;
          }
        },
      },
      {
        title: '条码数量',
        dataIndex: 'lot_count',
        width: 110,
        align: 'center',
        sorter: true,
      },
      {
        title: '入库仓库',
        dataIndex: 'in_subware',
        align: 'center',
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
        title: '最后入库时间',
        width: 160,
        align: 'center',
        dataIndex: 'inware_date',
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex: 'create_date',
      },
    ];

    const listConfig = {
      url: '/api/query/queryWmsRecoverinorderList', // 必填,请求url
      scroll: { x: 1200, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_create_date: moment()
          .subtract(6, 'day')
          .format('YYYY-MM-DD 00:00:00'),
        end_create_date: moment().format('YYYY-MM-DD 23:59:59'),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="入库单编号">
                  {getFieldDecorator('order_code', {
                    initialValue: this.props.list.queryMap.order_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码编号">
                  {getFieldDecorator('code_code', {
                    initialValue: this.props.list.queryMap.code_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码数量从">
                  {getFieldDecorator('start_lot_count', {
                    initialValue: this.props.list.queryMap.start_lot_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码数量到">
                  {getFieldDecorator('end_lot_count', {
                    initialValue: this.props.list.queryMap.end_lot_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间从">
                  {getFieldDecorator('start_create_date', {
                    initialValue: this.props.list.queryMap.start_create_date
                      ? moment(this.props.list.queryMap.start_create_date)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间到">
                  {getFieldDecorator('end_create_date', {
                    initialValue: this.props.list.queryMap.end_create_date
                      ? moment(this.props.list.queryMap.end_create_date)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
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
