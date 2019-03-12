/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, InputNumber, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import { formItemLayout, formItemGrid } from '../../utils/Constant';
import cache from '../../utils/cache';
import ListButtonGroup from '../../components/ListButtonGroup';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TPrivateopreate;
const routerUrl ='/TPrivateopreate';
const url = 'TPrivateopreate';
const rowKey = 't_privateopreate_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TPrivateopreateList extends Component {
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
    if(e) e.preventDefault();
    const { form, list } = this.props;
    const { setList } = list;
    form.validateFieldsAndScroll((err, values) => {
      let temp = {};
      if (!isEmpty(values.start_create_date))
temp = {
  ...temp,
  start_create_date: values.start_create_date.format(DateFormat),
 };
if (!isEmpty(values.end_create_date))
temp = {
  ...temp,
  end_create_date: values.end_create_date.format(DateFormat),
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
        filename: '个人合作者.xls',
        queryMap: { ...values, ...date } || {},
        },
        url,
        });
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
       {  title: '',   dataIndex: 't_privateopreate_id',     width: 150,     sorter: false,      },
 {  title: '个人合作者id：这个不用系统生成，手工设定，长度是6位数字',   dataIndex: 'uniqueID',     width: 150,     sorter: false,      },
 {  title: '密码',   dataIndex: 'password',     width: 150,     sorter: false,      },
 {  title: '手机号',   dataIndex: 'mobile',     width: 150,     sorter: false,      },
 {  title: '邮箱',   dataIndex: 'email',     width: 150,     sorter: false,      },
 {  title: '昵称',   dataIndex: 'nickname',     width: 150,     sorter: false,      },
 {  title: '头像',   dataIndex: 'picklink',     width: 150,     sorter: false,      },
 {  title: '注册时间',   dataIndex: 'regtime',     width: 150,     sorter: false,      },
 {  title: '登录ip',   dataIndex: 'ip',     width: 150,     sorter: false,      },
 {  title: '平台提成比例',   dataIndex: 'rate',     width: 150,     sorter: false,      },
 {  title: '是否交过保证金',   dataIndex: 'ispaygurantee',     width: 150,     sorter: false,      },
 {  title: '保证金数额',   dataIndex: 'guranteeamount',     width: 150,     sorter: false,      },
 {  title: 'qq',   dataIndex: 'qq',     width: 150,     sorter: false,      },
 {  title: '微信',   dataIndex: 'weixin',     width: 150,     sorter: false,      },
 {  title: '结算周期管理：天数',   dataIndex: 'clearperoid',     width: 150,     sorter: false,      },
 {  title: '状态',   dataIndex: 'isnormal',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TPrivateopreate/queryTPrivateopreateList', // 必填,请求url
      scroll: { x: 2550, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_privateopreate_id',{initialValue: this.props.list.queryMap.t_privateopreate_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='个人合作者id：这个不用系统生成，手工设定，长度是6位数字'>{getFieldDecorator('uniqueID',{initialValue: this.props.list.queryMap.uniqueID, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='密码'>{getFieldDecorator('password',{initialValue: this.props.list.queryMap.password, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='手机号'>{getFieldDecorator('mobile',{initialValue: this.props.list.queryMap.mobile, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='邮箱'>{getFieldDecorator('email',{initialValue: this.props.list.queryMap.email, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='昵称'>{getFieldDecorator('nickname',{initialValue: this.props.list.queryMap.nickname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='头像'>{getFieldDecorator('picklink',{initialValue: this.props.list.queryMap.picklink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='注册时间'>{getFieldDecorator('regtime',{initialValue: this.props.list.queryMap.regtime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='登录ip'>{getFieldDecorator('ip',{initialValue: this.props.list.queryMap.ip, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='平台提成比例'>{getFieldDecorator('rate',{initialValue: this.props.list.queryMap.rate, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否交过保证金(起始)'>{getFieldDecorator('start_ispaygurantee',{initialValue: this.props.list.queryMap.start_ispaygurantee  ? moment(this.props.list.queryMap.start_ispaygurantee): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否交过保证金(结束)'>{getFieldDecorator('end_ispaygurantee',{initialValue: this.props.list.queryMap.end_ispaygurantee  ? moment(this.props.list.queryMap.end_ispaygurantee): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='保证金数额(起始)'>{getFieldDecorator('start_guranteeamount',{initialValue: this.props.list.queryMap.start_guranteeamount  ? moment(this.props.list.queryMap.start_guranteeamount): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='保证金数额(结束)'>{getFieldDecorator('end_guranteeamount',{initialValue: this.props.list.queryMap.end_guranteeamount  ? moment(this.props.list.queryMap.end_guranteeamount): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='qq'>{getFieldDecorator('qq',{initialValue: this.props.list.queryMap.qq, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='微信'>{getFieldDecorator('weixin',{initialValue: this.props.list.queryMap.weixin, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='结算周期管理：天数(起始)'>{getFieldDecorator('start_clearperoid',{initialValue: this.props.list.queryMap.start_clearperoid  ? moment(this.props.list.queryMap.start_clearperoid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='结算周期管理：天数(结束)'>{getFieldDecorator('end_clearperoid',{initialValue: this.props.list.queryMap.end_clearperoid  ? moment(this.props.list.queryMap.end_clearperoid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='状态(起始)'>{getFieldDecorator('start_isnormal',{initialValue: this.props.list.queryMap.start_isnormal  ? moment(this.props.list.queryMap.start_isnormal): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='状态(结束)'>{getFieldDecorator('end_isnormal',{initialValue: this.props.list.queryMap.end_isnormal  ? moment(this.props.list.queryMap.end_isnormal): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(起始)'>{getFieldDecorator('start_create_date',{initialValue: this.props.list.queryMap.start_create_date ? moment(this.props.list.queryMap.start_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(结束)'>{getFieldDecorator('end_create_date',{initialValue: this.props.list.queryMap.end_create_date? moment(this.props.list.queryMap.end_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <ListButtonGroup handleFormReset={this.handleFormReset} routerUrl={this.routerUrl} dispatch={this.props.dispatch} handleExport={this.handleExport} url={url} handleSearch={this.handleSearch} />
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
