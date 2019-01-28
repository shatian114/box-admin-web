/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:00:36
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Modal, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import moment from 'moment';
const DateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const routerUrl = '/wmsinventory2order';
const url = 'wmsinventory2order';

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
    const { dispatch } = this.props;

    dispatch({
      type: 'base/queryPList',
    });
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
      if (values.start_outware_date)
        date.start_outware_date = values.start_outware_date.format(DateFormat);
      if (values.end_outware_date)
        date.end_outware_date = values.end_outware_date.format(DateFormat);
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
      callback: () => {
        setList();
        dispatch({
          type: 'base/queryPList',
        });
      },
    });
  };

  hanleConfirm = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/confirmInVOrder',
      payload: {
        id: info.order_code,
      },
      url,
      callback: () => {
        setList();
        dispatch({
          type: 'base/queryPList',
        });
      },
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
    const { orderstatus, SubwareList, isExistP } = base;
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
        title: '是否确认单据?',
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
        width: 160,
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
        title: '单据编码',
        dataIndex: 'order_code',
        width: 150,
        sorter: true,
      },
      {
        title: '单据状态',
        dataIndex: 'order_status',
        width: 100,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '盘点仓库',
        dataIndex: 'subware',
        width: 110,
        sorter: true,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '盘点仓管员',
        dataIndex: 'realname',
        width: 80,
        sorter: true,
      },
      {
        title: '盘点时间',
        dataIndex: 'outware_date',
        width: 200,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
    ];

    const listConfig = {
      url: '/api/query/queryWmsInventoryorderList', // 必填,请求url
      scroll: { x: 1200, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_outware_date: moment()
          .subtract(6, 'day')
          .format('YYYY-MM-DD 00:00:00'),
        end_outware_date: moment().format('YYYY-MM-DD 23:59:59'),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="盘点仓库">
                  {getFieldDecorator('subware', {
                    initialValue: this.props.list.queryMap.subware,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="盘点仓管员">
                  {getFieldDecorator('realname', {
                    initialValue: this.props.list.queryMap.realname,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="盘点时间从">
                  {getFieldDecorator('start_outware_date', {
                    initialValue: this.props.list.queryMap.start_outware_date
                      ? moment(this.props.list.queryMap.start_outware_date)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="盘点时间到">
                  {getFieldDecorator('end_outware_date', {
                    initialValue: this.props.list.queryMap.end_outware_date
                      ? moment(this.props.list.queryMap.end_outware_date)
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
                  {isExistP ? (
                    <span style={{ color: '#FF0000' }}>存在未确认的盘点单！</span>
                  ) : (
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
                  )}
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
