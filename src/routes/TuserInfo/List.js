/*
 * @Author: lbb 
 * @Date: 2018-05-21 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-01 17:47:56
 * @Description: 系统用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;

const url = 'tuserInfo';
const routerUrl = '/tuserInfo';
@connect(({ user, base }) => ({
  user,
  base,
}))
@Form.create()
@List.create()
export default class TuserList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/query',
      payload: {
        type: 'roleId',
      },
    });
    dispatch({
      type: 'base/querySubwareList',
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
    const { form, user } = this.props;
    const { getFieldDecorator } = form;
    const { hanleDelete } = this;
    const { SubwareList } = this.props.base;
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
        title: '用户名称',
        dataIndex: 'realname',
        width: 100,
        sorter: true,
      },
      {
        title: '用户账户',
        dataIndex: 'user_account',
        width: 100,
        sorter: true,
      },
      {
        title: '用户角色',
        dataIndex: 'role_id',
        width: 100,
        sorter: true,
        render: text => {
          if (Array.isArray(user.roleId)) {
            const temp = user.roleId.find(item => item.roleCode === text);
            if (temp) return `${temp.roleName}`;
            return text;
          }
        },
      },
      {
        title: '职务',
        dataIndex: 'resign',
        width: 100,
        sorter: true,
      },
      {
        title: '部门',
        dataIndex: 'dept_id',
        width: 100,
        sorter: true,
      },
      {
        title: '身份证号',
        dataIndex: 'identity',
        width: 150,
      },
      {
        title: '用户手机',
        dataIndex: 'phone',
        width: 150,
      },
      {
        title: '用户电话',
        dataIndex: 'mobile',
        width: 150,
      },
      {
        title: '用户邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '子库编码',
        dataIndex: 'subware_code',
        width: 200,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
    ];

    const listConfig = {
      url: '/api/query/queryTUserInfoList', // 必填,请求url
      scroll: { x: 1800, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'user_id', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="用户名称">
                  {getFieldDecorator('realname', {
                    initialValue: this.props.list.queryMap.realname,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="用户账户">
                  {getFieldDecorator('useraccount', {
                    initialValue: this.props.list.queryMap.user_account,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="用户角色">
                  {getFieldDecorator('roleId', {
                    initialValue: this.props.list.queryMap.role_id,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(user.roleId)
                        ? user.roleId.map(item => (
                            <Option key={item.roleCode} value={item.roleCode}>
                              {`${item.roleName}`}
                            </Option>
                          ))
                        : null}
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
