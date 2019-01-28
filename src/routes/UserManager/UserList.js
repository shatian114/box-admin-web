/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-15 16:06:07
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const roleList = {
  admin: '管理员',
  CGY: '仓管员',
  WDCGY: '网点仓管员',
  CL: '车辆',
  NH: '农户',
  CS: '超市',
  CW: '财务',
  TMY: '条码员',
};

@connect()
@Form.create()
@List.create()
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

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'userManager/delete',
      payload: info,
      callback: () => setList(),
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
        onOk() {
          hanleDelete(record);
        },
      });
    };

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 180,
        fixed: 'left',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="UPDATE">
              <Link
                to={{
                  pathname: `/userManager/info`,
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
        title: '用户姓名',
        dataIndex: 'username',
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
          return m.isValid() ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '暂无';
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
          return m.isValid() ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
    ];

    const listConfig = {
      url: '/api/query/getUserList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
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
                  {getFieldDecorator('username', {
                    initialValue: this.props.list.queryMap.username,
                  })(<Input placeholder="请输入" />)}
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
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.props.dispatch(routerRedux.push('/userManager/info'))}
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
