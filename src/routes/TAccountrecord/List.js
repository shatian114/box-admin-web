/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:57:02
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Card, InputNumber, Select } from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import numeral from 'numeral';

import styles from '../../styles/list.less';

import List from '../../components/List';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD';
const isUserd = ['否', '是'];

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

  render() {
    const { form, base } = this.props;
    const { getFieldDecorator } = form;
    const { paytype } = base;

    const columns = [
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
      },
      {
        title: '余额变动',
        dataIndex: 'nowMoney',
        width: 80,
        render: value => numeral(value).format('$ 0,0.00'),
      },
      {
        title: '押金变动',
        dataIndex: 'payMoney',
        width: 80,
        render: value => numeral(value).format('$ 0,0.00'),
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        width: 120,
        render: text => {
          if (Array.isArray(paytype)) {
            const temp = paytype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}`;
            return text;
          }
        },
      },
      {
        title: '交易流水号',
        dataIndex: 'transcationid',
        width: 150,
      },
      {
        title: '是否交易完成',
        dataIndex: 'istranscationed',
        render: text => isUserd[text],
        width: 120,
      },
      {
        title: '结算日期',
        dataIndex: 'settDate',
        width: 150,
      },
      {
        title: '流水描述',
        dataIndex: 'description',
      },
    ];

    const listConfig = {
      url: '/api/query/queryTAccountrecordList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'recordId', // 必填,行key
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
                <FormItem label="余额变动范围(起始)">
                  {getFieldDecorator('start_now_money', {
                    initialValue: this.props.list.queryMap.start_now_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="余额变动范围(结束)">
                  {getFieldDecorator('end_now_money', {
                    initialValue: this.props.list.queryMap.end_now_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="押金变动范围(起始)">
                  {getFieldDecorator('start_pay_money', {
                    initialValue: this.props.list.queryMap.start_pay_money,
                  })(<InputNumber placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="押金变动范围(结束)">
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
                <FormItem label="是否交易完成">
                  {getFieldDecorator('istranscationed', {
                    initialValue: this.props.list.queryMap.istranscationed,
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
        <List {...listConfig} />
      </div>
    );
  }
}
