/*
 * @Author: zouwendi
 * @Date: 2018-05-14 18:56:24
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-28 16:38:02
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Card,
  DatePicker,
  Select,
  InputNumber,
  Popover,
} from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import db from '../../utils/db';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const oprStatus = ['正常', '业务异常', '系统异常'];

const routerUrl = '/sysFnc/oprLog';
const url = 'oprlog';
@connect()
@Form.create()
@List.create()
export default class OprLogList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 1000 : 400,
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
      scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 1000 : 400,
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, list } = this.props;
    const { setList } = list;
    form.validateFieldsAndScroll((err, values) => {
      const date = {};
      if (values.startDate) date.startDate = values.startDate.format(DateFormat);
      if (values.endDate) date.endDate = values.endDate.format(DateFormat);
      setList({
        current: 1,
        queryMap: { ...values, ...date } || {},
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
  handleExport = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const date = {};
      if (values.startDate) date.startDate = values.startDate.format(DateFormat);
      if (values.endDate) date.endDate = values.endDate.format(DateFormat);
      dispatch({
        type: `list/exportExcel`,
        payload: {
          filename: '操作日志.xls',
          queryMap: { ...values, ...date } || {},
        },
        url,
      });
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 80,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="QUERY">
              <Link
                to={{
                  pathname: `${routerUrl}/info`,
                  state: { info: record },
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
        title: '客户端IP',
        dataIndex: 'ip',
        width: 110,
        align: 'center',
      },
      {
        title: '客户端UID',
        dataIndex: 'client_uid',
        width: 200,
        align: 'center',
        render(text, record) {
          return (
            <Popover
              content={
                <span style={{ width: 400, display: 'inline-block', textIndent: '2em' }}>
                  {text}
                </span>
              }
              title="客户端UID"
            >
              <span className={styles.longText}>
                {text ? `${text.substr(0, 10)}...${text.substr(-13)}` : ''}
              </span>
            </Popover>
          );
        },
      },
      {
        title: '操作人',
        dataIndex: 'username',
        width: 110,
        sorter: true,
        align: 'center',
      },
      {
        title: '操作结果',
        dataIndex: 'status',
        width: 110,
        render: text => oprStatus[text],
        sorter: true,
        align: 'center',
      },
      {
        title: '请求URL',
        dataIndex: 'url',
        width: 130,
        align: 'center',
      },
      {
        title: '操作系统',
        dataIndex: 'os',
        align: 'center',
        width: 110,
      },
      {
        title: '调用方法',
        dataIndex: 'method_name',
        align: 'center',
        width: 110,
      },
      {
        title: '调用模块',
        dataIndex: 'class_name',
        align: 'center',
        width: 110,
      },
      {
        title: '执行时长',
        dataIndex: 'work_time',
        width: 110,
        align: 'center',
        sorter: true,
      },
      {
        title: '执行时间',
        dataIndex: 'opr_time',
        width: 150,
        align: 'center',
        sorter: true,
      },
    ];
    const listConfig = {
      url: '/api/query/queryOprLogList', // 必填,请求url
      scroll: { x: 1300, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'opr_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        startDate: moment().format(DateFormat),
        endDate: moment().format(DateFormat),
      },
    };
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="调用方法">
                  {getFieldDecorator('method_name', {
                    initialValue: this.props.list.queryMap.method_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="开始执行时间">
                  {getFieldDecorator('startDate', {
                    initialValue: this.props.list.queryMap.startDate
                      ? moment(this.props.list.queryMap.startDate)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="结束执行时间">
                  {getFieldDecorator('endDate', {
                    initialValue: this.props.list.queryMap.endDate
                      ? moment(this.props.list.queryMap.endDate)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="执行状态">
                  {getFieldDecorator('status', {
                    initialValue: this.props.list.queryMap.status,
                  })(
                    <Select placeholder="请选择">
                      {oprStatus.map((item, index) => (
                        <Option key={item} value={index}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="执行时长(大于该时长)">
                  {getFieldDecorator('start_work_time', {
                    initialValue: this.props.list.queryMap.start_work_time,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="执行时长(小于该时长)">
                  {getFieldDecorator('end_work_time', {
                    initialValue: this.props.list.queryMap.end_work_time,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="IP">
                  {getFieldDecorator('ip', {
                    initialValue: this.props.list.queryMap.ip,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: this.props.list.queryMap.username,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="请求URL">
                  {getFieldDecorator('method_name', {
                    initialValue: this.props.list.queryMap.method_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="调用模块">
                  {getFieldDecorator('class_name', {
                    initialValue: this.props.list.queryMap.class_name,
                  })(<Input placeholder="请输入" />)}
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
                  <Button
                    icon="export"
                    onClick={this.handleExport}
                    style={{ marginLeft: 8, backgroundColor: '#5bc0de', borderColor: '#46b8da' }}
                    type="primary"
                  >
                    导出
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
