/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:56:29
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Alert,
  Button,
  DatePicker,
  Card,
  Modal,
  InputNumber,
  Select,
} from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import numeral from 'numeral';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const url = 'taccount';
const isUserd = ['否', '是'];

@connect(({ loading, base }) => ({
  submitting: loading.effects['base/fetch'],
  base,
}))
@Form.create()
@List.create()
export default class MyList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
    visible: false,
    active: null,
    type: null,
    message: null,
    record: null,
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
      if (!isEmpty(values.start_sett_date))
        temp = {
          ...temp,
          start_sett_date: values.start_sett_date.format(DateFormat),
        };
      if (!isEmpty(values.end_sett_date))
        temp = {
          ...temp,
          end_sett_date: values.end_sett_date.format(DateFormat),
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

  handleOpen = () => {
    const { list, dispatch } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/fetch',
      payload: {
        accountCode: this.state.record.account_code,
        isactive: 1,
      },
      url,
      callback: () => {
        setList();
        this.setState({
          visible: false,
          active: null,
          type: null,
          message: null,
          record: null,
        });
      },
    });
  };

  handleClose = () => {
    const { list, dispatch } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/fetch',
      payload: {
        accountCode: this.state.record.account_code,
        isactive: 0,
      },
      url,
      callback: () => {
        setList();
        this.setState({
          visible: false,
          active: null,
          type: null,
          message: null,
          record: null,
        });
      },
    });
  };

  handleOk = () => {
    if (this.state.active === 'close') this.handleClose();
    if (this.state.active === 'open') this.handleOpen();
  };

  showModal = record => {
    if (Number(record.isactive) === 0) {
      this.setState({
        visible: true,
        active: 'open',
        type: 'warning',
        message: '确定启用账户?',
        record,
      });
    } else if (Number(record.isactive) === 1) {
      this.setState({
        visible: true,
        active: 'close',
        type: 'warning',
        message: '确定停用账户?',
        record,
      });
    } else {
      return;
    }
    this.setState({
      visible: true,
    });
  };

  handleCanCel = () => {
    this.setState({
      visible: false,
      active: null,
      type: null,
      message: null,
      record: null,
    });
  };

  render() {
    const { form, submitting, base } = this.props;
    const { getFieldDecorator } = form;
    const { usertype } = base;

    const columns = [
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 160,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            {Number(record.isactive) === 0 ? (
              <Operate operateName="UPDATE">
                <Button
                  onClick={() => this.showModal(record)}
                  type="primary"
                  icon="edit"
                  ghost
                  size="small"
                >
                  启用
                </Button>
              </Operate>
            ) : (
              <Operate operateName="UPDATE">
                <Button
                  onClick={() => this.showModal(record)}
                  type="danger"
                  icon="edit"
                  ghost
                  size="small"
                >
                  停用
                </Button>
              </Operate>
            )}
          </Row>
        ),
      },
      {
        title: '账户名称',
        dataIndex: 'userAccount',
        width: 160,
        sorter: true,
      },
      {
        title: '账户类型',
        dataIndex: 'accountType',
        width: 150,
        render: text => {
          if (Array.isArray(usertype)) {
            const temp = usertype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '余额',
        dataIndex: 'nowMoney',
        width: 80,
        render: value => numeral(value).format('$ 0,0.00'),
      },
      {
        title: '押金',
        dataIndex: 'payMoney',
        width: 80,
        render: value => numeral(value).format('$ 0,0.00'),
      },
      {
        title: '实际领用箱数',
        dataIndex: 'boxCount',
        width: 120,
      },
      {
        title: '允许领用箱数',
        dataIndex: 'allowCount',
        width: 120,
      },
      {
        title: '结算日期',
        dataIndex: 'settDate',
        width: 150,
      },
      {
        title: '是否可用',
        dataIndex: 'isactive',
        render: text => isUserd[text],
      },
      {
        title: '账户描述',
        dataIndex: 'accountDesc',
        align: 'center',
      },
    ];

    const listConfig = {
      url: '/api/query/queryTAccountList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'accountCode', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="账户名称">
                  {getFieldDecorator('user_account', {
                    initialValue: this.props.list.queryMap.user_account,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="账户类型">
                  {getFieldDecorator('account_type', {
                    initialValue: this.props.list.queryMap.account_type,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="余额范围(起始)">
                  {getFieldDecorator('start_now_money', {
                    initialValue: this.props.list.queryMap.start_now_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="余额范围(结束)">
                  {getFieldDecorator('end_now_money', {
                    initialValue: this.props.list.queryMap.end_now_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="押金范围(起始)">
                  {getFieldDecorator('start_pay_money', {
                    initialValue: this.props.list.queryMap.start_pay_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="押金范围(结束)">
                  {getFieldDecorator('end_pay_money', {
                    initialValue: this.props.list.queryMap.end_pay_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="结算日期(开始)">
                  {getFieldDecorator('start_sett_date', {
                    initialValue: this.props.list.queryMap.start_sett_date,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="结算日期(结束)">
                  {getFieldDecorator('end_sett_date', {
                    initialValue: this.props.list.queryMap.end_sett_date,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="是否可用">
                  {getFieldDecorator('isactive', {
                    initialValue: this.props.list.queryMap.isactive,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {isUserd.map((item, index) => {
                        return (
                          <Option value={index} key={`i-${item}`}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
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
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="确认"
          cancelText="取消"
          onCancel={this.handleCanCel}
          confirmLoading={submitting}
        >
          <Alert message={this.state.message} type={this.state.type} showIcon />
        </Modal>
        <List {...listConfig} />
      </div>
    );
  }
}
