/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 15:06:53
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Modal, Alert, DatePicker, Spin } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';
import styles2 from '../../styles/storage.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const DateFormat = 'YYYY-MM-DD';
const routerUrl = '/bigInOrder';
const url = 'inorder';

@connect(({ base, loading }) => ({
  base,
  loading: loading.effects['base/confirmOrder'] || false,
}))
@Form.create()
@List.create()
export default class MyIndex extends Component {
  state = {
    visible: false,
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  record = {};

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
      if (!isEmpty(values.startDate))
        temp = {
          ...temp,
          startDate: values.startDate.format(DateFormat),
        };
      if (!isEmpty(values.endDate))
        temp = {
          ...temp,
          endDate: values.endDate.format(DateFormat),
        };
      setList({
        current: 1,
        queryMap: { ...values, ...temp } || {},
      });
    });
  };

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/delete',
      payload: {
        id: info.order_code,
      },
      url,
      callback: () => setList(),
    });
  };

  hanleConfirm = () => {
    const info = this.record;
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/confirmOrder',
      payload: {
        id: info.order_code,
      },
      url,
      callback: () => setList(),
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
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
    const { form, base, loading, hanleConfirm } = this.props;
    const { getFieldDecorator } = form;
    const { orderstatus, SubwareList } = base;
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
    const confirm = record => {
      this.record = record;
      this.setState({
        visible: true,
      });
    };

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 220,
        align: 'center',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            {record.order_status === 'new' ? (
              <React.Fragment>
                <Operate operateName="UPDATE">
                  <Link
                    to={{
                      pathname: `${routerUrl}/storage`,
                      state: { id: record.order_code },
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
                <Operate operateName="STORAGE">
                  <Button
                    type="danger"
                    icon="save"
                    ghost
                    size="small"
                    onClick={() => confirm(record)}
                  >
                    确认
                  </Button>
                </Operate>
              </React.Fragment>
            ) : (
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/storage`,
                    state: { id: record.order_code },
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small">
                    详情
                  </Button>
                </Link>
              </Operate>
            )}
          </Row>
        ),
      },
      {
        title: '入库单编号',
        dataIndex: 'order_code',
        width: 150,
        sorter: true,
      },
      {
        title: '入库单类型',
        dataIndex: 'order_type',
        width: 100,
      },
      {
        title: '入库总数',
        dataIndex: 'count',
        width: 110,
        render: (_, record) => record.count + record.tmp_count,
        sorter: true,
      },
      {
        title: '批数',
        dataIndex: 'lotnum',
        width: 80,
        render: (_, record) => record.lotnum + record.tmp_lotnum,
        sorter: true,
      },
      {
        title: '入库单状态',
        dataIndex: 'order_status',
        width: 100,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '采购单号',
        dataIndex: 'caigou_code',
        width: 120,
      },
      {
        title: '入库仓库',
        dataIndex: 'in_subware',
        width: 150,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '最后入库时间',
        dataIndex: 'last_inware',
      },
    ];

    const listConfig = {
      url: '/api/query/queryInwareList', // 必填,请求url
      scroll: { x: 1200, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        startDate: moment()
          .subtract(2, 'days')
          .format(DateFormat),
        endDate: moment().format(DateFormat),
      },
    };

    return (
      <Spin size="large" spinning={loading}>
        <div className={styles.tableListForm}>
          <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="入库单编号">
                    {getFieldDecorator('order_code', {
                      initialValue: this.props.list.queryMap.order_code,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="批号">
                    {getFieldDecorator('lot_code', {
                      initialValue: this.props.list.queryMap.lot_code,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="条码编号">
                    {getFieldDecorator('code_code', {
                      initialValue: this.props.list.queryMap.code_code,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="入库时间(开始)">
                    {getFieldDecorator('startDate', {
                      initialValue: this.props.list.queryMap.startDate
                        ? moment(this.props.list.queryMap.startDate)
                        : null,
                    })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="入库时间(结束)">
                    {getFieldDecorator('endDate', {
                      initialValue: this.props.list.queryMap.endDate
                        ? moment(this.props.list.queryMap.endDate)
                        : null,
                    })(<DatePicker format={DateFormat} placeholder="请选择" />)}
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
                        onClick={() =>
                          this.props.dispatch(routerRedux.push(`${routerUrl}/storage`))
                        }
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
          <Modal
            title="确认入库"
            visible={this.state.visible}
            onOk={this.hanleConfirm}
            loading={hanleConfirm}
            onCancel={this.handleCancel}
          >
            <Alert
              message="警告"
              description={
                <div>
                  <span className={styles2.total}>
                    入库总数:{this.record.tmp_count || this.record.count},
                  </span>确认数量后不可更改.
                </div>
              }
              type="warning"
              showIcon
            />
          </Modal>
        </div>
      </Spin>
    );
  }
}
