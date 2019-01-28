/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:56:11
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Collapse, Form, Row, Col, Input, Button } from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import Listb from '../../components/Listb';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const DateFormat = 'YYYY-MM-DD';
const { Panel } = Collapse;

@connect(({ base }) => ({
  base,
}))
@Form.create()
@Listb.create()
export default class SelectList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'listb/clear',
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
    const { form, listb } = this.props;
    const { setList } = listb;
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
    const { form, listb } = this.props;
    const { setList } = listb;
    setList({
      current: 1,
      queryMap: {
        account_type: 'farmer',
      },
    });
    form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

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
        title: '真实姓名',
        dataIndex: 'realname',
        width: 160,
        sorter: true,
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
        title: '账户描述',
        dataIndex: 'accountDesc',
        align: 'center',
      },
    ];

    const listConfig = {
      url: '/api/query/queryTAccountSelecttList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'accountCode', // 必填,行key
      onRow: record => ({
        onDoubleClick: () => this.props.handelInfo(record),
      }),
      columns, // 必填,行配置
      queryMap: {
        account_type: this.props.type,
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
                      initialValue: this.props.listb.queryMap.user_account,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="真实姓名">
                    {getFieldDecorator('realname', {
                      initialValue: this.props.listb.queryMap.realname,
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
                  </span>
                </Col>
              </Row>
            </Form>
          </Panel>
        </Collapse>

        <Listb {...listConfig} />
      </div>
    );
  }
}
