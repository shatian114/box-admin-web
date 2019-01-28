/*
 * @Author: lbb 
 * @Date: 2018-05-18 18:56:24 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-18 23:04:56
 * @Description: 商超
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;

const url = 'market';
const routerUrl = '/market';
@Form.create()
@List.create()
export default class marketList extends Component {
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
      setList({
        current: 1,
        queryMap: { ...values } || {},
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
      type: `${url}/delete`,
      payload: {
        id: info.user_id,
      },
      callback: () => setList(),
      url,
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { hanleDelete } = this;
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

    const columns = [
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 160,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="UPDATE">
              <Link
                to={{
                  pathname: `${routerUrl}/info`,
                  state: { id: record.user_id },
                }}
              >
                <Button type="primary" icon="edit" ghost size="small">
                  编辑
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
          </Row>
        ),
      },
      {
        title: '超市名称',
        dataIndex: 'market_name',
        width: 100,
        sorter: true,
      },
      {
        title: '负责人姓名',
        dataIndex: 'realname',
        width: 150,
        sorter: true,
      },
      {
        title: '负责人账户',
        dataIndex: 'user_account',
        width: 150,
        sorter: true,
      },
      {
        title: '负责人手机',
        dataIndex: 'phone',
        width: 150,
        sorter: true,
      },
      {
        title: '负责人电话',
        dataIndex: 'mobile',
        width: 150,
        sorter: true,
      },
      {
        title: '负责人邮箱',
        dataIndex: 'email',
        width: 200,
        sorter: true,
      },
      {
        title: '纬度',
        dataIndex: 'latitude',
        width: 150,
        sorter: true,
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        width: 150,
        sorter: true,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 150,
        sorter: true,
      },
      {
        title: '农链系统编码',
        dataIndex: 'nl_code',
        width: 150,
        sorter: true,
      },
      {
        title: '来源',
        dataIndex: 'source',
        sorter: true,
      },
    ];

    const listConfig = {
      url: '/api/query/queryTMarketList', // 必填,请求url
      scroll: { x: 1750, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'user_id', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="超市名称">
                  {getFieldDecorator('marketName', {
                    initialValue: this.props.list.queryMap.market_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="负责人名称">
                  {getFieldDecorator('realname', {
                    initialValue: this.props.list.queryMap.realname,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="负责人账号">
                  {getFieldDecorator('useraccount', {
                    initialValue: this.props.list.queryMap.user_account,
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
