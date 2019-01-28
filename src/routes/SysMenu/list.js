/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker } from 'antd';
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
const routerUrl = '/SysMenu';
const url = 'SysMenu';
const rowKey = 'menu_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class SysMenuList extends Component {
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

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/delete',
      payload: {
        // 主键id
        id: info[rowKey],
      },
      url,
      callback: () => setList(),
    });
  };

  render() {
    const { form, base } = this.props;

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
        width: 160,
        align: 'center',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="UPDATE">
              <Link
                to={{
                  pathname: `${routerUrl}/info`,
                  state: { id: record[rowKey] },
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
      { title: '菜单主键', dataIndex: 'menu_id', width: 150, sorter: false },
      { title: '菜单名称', dataIndex: 'menu_name', width: 150, sorter: false },
      { title: '菜单描述', dataIndex: 'menu_desc', width: 150, sorter: false },
      { title: '父节点id', dataIndex: 'parent_id', width: 150, sorter: false },
      { title: '排序', dataIndex: 'order_no', width: 150, sorter: false },
      { title: '子系统主键', dataIndex: 'subsys_id', width: 150, sorter: false },
      { title: '菜单链接', dataIndex: 'menu_url', width: 150, sorter: false },
      { title: '菜单参数', dataIndex: 'params', width: 150, sorter: false },
      { title: '菜单链接类型', dataIndex: 'call_type', width: 150, sorter: false },
    ];

    const listConfig = {
      url: '/api/SysMenu/querySysMenuList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="菜单主键">
                  {getFieldDecorator('menu_id', { initialValue: this.props.list.queryMap.menu_id })(
                    <Input placeholder="请输入" />
                  )}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="菜单名称">
                  {getFieldDecorator('menu_name', {
                    initialValue: this.props.list.queryMap.menu_name,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="菜单描述">
                  {getFieldDecorator('menu_desc', {
                    initialValue: this.props.list.queryMap.menu_desc,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="父节点id">
                  {getFieldDecorator('parent_id', {
                    initialValue: this.props.list.queryMap.parent_id,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="排序(起始)">
                  {getFieldDecorator('start_order_no', {
                    initialValue: this.props.list.queryMap.start_order_no
                      ? moment(this.props.list.queryMap.start_order_no)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="排序(结束)">
                  {getFieldDecorator('end_order_no', {
                    initialValue: this.props.list.queryMap.end_order_no
                      ? moment(this.props.list.queryMap.end_order_no)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="子系统主键">
                  {getFieldDecorator('subsys_id', {
                    initialValue: this.props.list.queryMap.subsys_id,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="菜单链接">
                  {getFieldDecorator('menu_url', {
                    initialValue: this.props.list.queryMap.menu_url,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="菜单参数">
                  {getFieldDecorator('params', { initialValue: this.props.list.queryMap.params })(
                    <Input placeholder="请输入" />
                  )}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="菜单链接类型">
                  {getFieldDecorator('call_type', {
                    initialValue: this.props.list.queryMap.call_type,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
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
