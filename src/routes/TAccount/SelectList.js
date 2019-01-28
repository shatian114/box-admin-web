/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:56:57
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Collapse, Form, Row, Col, Input, Button, DatePicker, InputNumber, Select } from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const isUserd = ['否', '是'];
const { Panel } = Collapse;

@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class MyList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'list/clear',
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
        queryMap: { ...values, ...temp, account_type: 'farmer' },
      });
    });
  };

  handleFormReset = () => {
    const { form, list } = this.props;
    const { setList } = list;
    setList({
      current: 1,
      queryMap: {
        account_type: 'farmer',
      },
    });
    form.resetFields();
  };

  render() {
    const { form, base } = this.props;
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
            <Button
              type="primary"
              icon="check"
              ghost
              size="small"
              onClick={() => this.props.handelInfo(record)}
            >
              选择
            </Button>
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
      },
      {
        title: '押金',
        dataIndex: 'payMoney',
        width: 80,
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
        width: 120,
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
      onRow: record => ({
        onDoubleClick: () => this.props.handelInfo(record),
      }),
      columns, // 必填,行配置
      queryMap: {
        account_type: 'farmer',
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Collapse bordered={false}>
          <Panel header="查询条件" key="1">
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
          </Panel>
        </Collapse>

        <List {...listConfig} />
      </div>
    );
  }
}
