/*
 * @Author: lbb 
 * @Date: 2018-05-17 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-06 10:44:01
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';
import List from '../../components/List';
import Operate from '../../components/Oprs';

const url = 'user';
const FormItem = Form.Item;
const roleList = {
  admin: '管理员',
  CGY: '仓管员',
  WDCGY: '网点仓管员',
  vehicle: '车辆',
  farmer: '农户',
  market: '超市',
  CW: '财务',
  TMY: '条码员',
};
const userStatus = ['失效', '可用'];
@connect(({ user }) => ({
  user,
}))
@Form.create()
@List.create()
@Operate.create('/user')
export default class UserManagerList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };
  // 在需要清楚状态的组件边界生命周期使用
  /*  componentWillUnmount() {
    this.props.dispatch({
      type: 'list/clear',
    })
  } */

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/query',
      payload: {
        type: 'roleId',
      },
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
        queryMap: values || {},
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

  // 注销后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: `${url}/cancelobj`,
      payload: { id: info.user_id },
      callback: () => setList(),
    });
  };
  // 恢复后调用list
  hanleRecover = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: `${url}/recoveryobj`,
      payload: { id: info.user_id },
      callback: () => setList(),
    });
  };
  hanleRest = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: `${url}/restPassword`,
      payload: { id: info.user_id },
      callback: () => setList(),
    });
  };
  render() {
    const { form, user } = this.props;
    const { getFieldDecorator } = form;
    const { hanleDelete, hanleRecover, hanleRest } = this;
    const cancelU = record => {
      Modal.confirm({
        title: '确定想要注销吗?',
        okType: 'danger',
        onOk() {
          hanleDelete(record);
        },
      });
    };
    const recoverU = record => {
      Modal.confirm({
        title: '确定想要恢复吗?',
        okType: 'primary',
        onOk() {
          hanleRecover(record);
        },
      });
    };
    const hanleU = record => {
      Modal.confirm({
        title: '确定想要重置密码吗?',
        okType: 'danger',
        onOk() {
          hanleRest(record);
        },
      });
    };

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 260,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="HF">
              <Button
                type="primary"
                icon="edit"
                ghost
                size="small"
                onClick={() => recoverU(record)}
              >
                恢复
              </Button>
            </Operate>
            <Operate operateName="ZX">
              <Button
                type="danger"
                icon="delete"
                ghost
                size="small"
                onClick={() => cancelU(record)}
              >
                注销
              </Button>
            </Operate>
            <Operate operateName="CZMM">
              <Button type="danger" icon="delete" ghost size="small" onClick={() => hanleU(record)}>
                重置密码
              </Button>
            </Operate>
          </Row>
        ),
      },
      {
        title: '用户姓名',
        dataIndex: 'username',
        width: 200,
        sorter: true,
      },
      {
        title: '账户名称',
        dataIndex: 'user_account',
        width: 200,
        sorter: true,
      },
      {
        title: '角色名',
        dataIndex: 'role_id',
        width: 150,
        render: text => roleList[text],
      },
      {
        title: '用户状态',
        dataIndex: 'user_status',
        width: 150,
        render: text => {
          return userStatus[text];
        },
      },
      {
        title: '最后登陆IP',
        dataIndex: 'last_ip',
        width: 200,
      },
      {
        title: '创建人',
        dataIndex: 'create_user',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: 200,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
      {
        title: '修改人',
        dataIndex: 'modify_user',
        width: 200,
      },
      {
        title: '修改时间',
        dataIndex: 'modify_date',
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
    ];

    const listConfig = {
      url: '/api/query/getUserList', // 必填,请求url
      scroll: { x: 2000, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'user_id', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="账号名称">
                  {getFieldDecorator('userAccount', {
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
              <Col md={8} sm={24}>
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
