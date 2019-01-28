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
const routerUrl = '/SysModule';
const url = 'SysModule';
const rowKey = 'module_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class SysModuleList extends Component {
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
      { title: '模块id', dataIndex: 'module_id', width: 150, sorter: false },
      { title: '模块名称', dataIndex: 'module_name', width: 150, sorter: false },
      { title: '模块描述', dataIndex: 'module_desc', width: 150, sorter: false },
      { title: '操作集', dataIndex: 'oprset', width: 150, sorter: false },
    ];

    const listConfig = {
      url: '/api/SysModule/querySysModuleList', // 必填,请求url
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
                <FormItem label="模块id">
                  {getFieldDecorator('module_id', {
                    initialValue: this.props.list.queryMap.module_id,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模块名称">
                  {getFieldDecorator('module_name', {
                    initialValue: this.props.list.queryMap.module_name,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="模块描述">
                  {getFieldDecorator('module_desc', {
                    initialValue: this.props.list.queryMap.module_desc,
                  })(<Input placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="操作集(起始)">
                  {getFieldDecorator('start_oprset', {
                    initialValue: this.props.list.queryMap.start_oprset
                      ? moment(this.props.list.queryMap.start_oprset)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}{' '}
                </FormItem>{' '}
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="操作集(结束)">
                  {getFieldDecorator('end_oprset', {
                    initialValue: this.props.list.queryMap.end_oprset
                      ? moment(this.props.list.queryMap.end_oprset)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}{' '}
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
