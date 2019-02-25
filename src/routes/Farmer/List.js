/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-31 09:55:38
 * @Description: 用户管理列表
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
import Importer from './Importer';

const FormItem = Form.Item;

const url = 'farmer';
const routerUrl = '/farmer';
@Form.create()
@List.create()
export default class farmerList extends Component {
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
    if (e) e.preventDefault();
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
          filename: '农户数据.xls',
          queryMap: { ...values, ...date } || {},
        },
        url,
      });
    });
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
        title: '农户姓名',
        dataIndex: 'realname',
        width: 100,
        sorter: true,
      },
      {
        title: '农户账户',
        dataIndex: 'user_account',
        width: 100,
        sorter: true,
      },
      {
        title: '农户手机',
        dataIndex: 'phone',
        width: 150,
        sorter: true,
      },
      {
        title: '农户电话',
        dataIndex: 'mobile',
        width: 150,
        sorter: true,
      },
      {
        title: '农户邮箱',
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
        width: 100,
      },
      {
        title: '主营农产品',
        dataIndex: 'product',
      },
    ];

    const listConfig = {
      url: '/api/query/queryTFarmerList', // 必填,请求url
      scroll: { x: 1650, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'user_id', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="农户名称">
                  {getFieldDecorator('farmerName', {
                    initialValue: this.props.list.queryMap.farmerName,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="农户账号">
                  {getFieldDecorator('useraccount', {
                    initialValue: this.props.list.queryMap.farmerSx,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Operate operateName="QUERY">
                    <Button icon="search" type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Operate>
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
                  <Operate operateName="QUERY">
                    <Button
                      icon="export"
                      onClick={this.handleExport}
                      style={{ marginLeft: 8, backgroundColor: '#5bc0de', borderColor: '#46b8da' }}
                      type="primary"
                    >
                      导出
                    </Button>
                  </Operate>
                  <Operate operateName="QUERY">
                    <Importer
                      style={{
                        marginLeft: 8,
                        color: '#fff',
                        backgroundColor: '#f0ad4e',
                        borderColor: '#eea236',
                      }}
                      reload={this.handleSearch}
                    />
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
