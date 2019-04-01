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
//const routerUrl = cache.keysMenu.TUserwx;
const routerUrl ='/TUserwx';
const url = 'TUserwx';
const rowKey = 'ID';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TUserwxList extends Component {
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
        filename: '用户信息.xls',
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
       {  title: '',   dataIndex: 'ID',     width: 150,     sorter: false,      },
 {  title: '账户',   dataIndex: 'userid',     width: 150,     sorter: false,      },
 {  title: '昵称',   dataIndex: 'nickname',     width: 150,     sorter: false,      },
 {  title: '头像',   dataIndex: 'piclink',     width: 150,     sorter: false,      },
 {  title: '版本号',   dataIndex: 'ver',     width: 150,     sorter: false,      },
 {  title: '系统时间戳,,无用',   dataIndex: 't_timeinfo',     width: 150,     sorter: false,      },
 {  title: '客户端ip',   dataIndex: 'ip',     width: 150,     sorter: false,      },
 {  title: '所在区域',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '真实姓名',   dataIndex: 'realname',     width: 150,     sorter: false,      },
 {  title: '手机号',   dataIndex: 'mobilephone',     width: 150,     sorter: false,      },
 {  title: '邮箱',   dataIndex: 'email',     width: 150,     sorter: false,      },
 {  title: '收货地址',   dataIndex: 'address',     width: 150,     sorter: false,      },
 {  title: '红包余额',   dataIndex: 'leftmoney',     width: 150,     sorter: false,      },
 {  title: '收款方式，银行卡或者支付宝之类，红包提现用',   dataIndex: 'bankaccount',     width: 150,     sorter: false,      },
 {  title: '微信',   dataIndex: 'weixin',     width: 150,     sorter: false,      },
 {  title: '是否开放联系方式 0永不 1直接开放  2 根据红包决定',   dataIndex: 'ishowcontactduetoredmoney',     width: 150,     sorter: false,      },
 {  title: '收到某人至少多少红包才对他开放联系方式',   dataIndex: 'atleasthowmuchredmoney',     width: 150,     sorter: false,      },
 {  title: 'QQ',   dataIndex: 'qq',     width: 150,     sorter: false,      },
 {  title: '固定区域',   dataIndex: 'fixedzone',     width: 150,     sorter: false,      },
 {  title: '第一次登陆时间',   dataIndex: 'regtime',     width: 150,     sorter: false,      },
 {  title: '最后一次登录时间',   dataIndex: 'logontime',     width: 150,     sorter: false,      },
 {  title: '经度',   dataIndex: 'lng',     width: 150,     sorter: false,      },
 {  title: '纬度',   dataIndex: 'lat',     width: 150,     sorter: false,      },
 {  title: '详细位置',   dataIndex: 'addressdetail',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'lasttimeinfo',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'videosecond',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TUserwx/queryTUserwxList', // 必填,请求url
      scroll: { x: 3900, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(起始)'>{getFieldDecorator('start_ID',{initialValue: this.props.list.queryMap.start_ID  ? moment(this.props.list.queryMap.start_ID): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(结束)'>{getFieldDecorator('end_ID',{initialValue: this.props.list.queryMap.end_ID  ? moment(this.props.list.queryMap.end_ID): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='账户'>{getFieldDecorator('userid',{initialValue: this.props.list.queryMap.userid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='昵称'>{getFieldDecorator('nickname',{initialValue: this.props.list.queryMap.nickname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='头像'>{getFieldDecorator('piclink',{initialValue: this.props.list.queryMap.piclink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='版本号'>{getFieldDecorator('ver',{initialValue: this.props.list.queryMap.ver, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='客户端ip'>{getFieldDecorator('ip',{initialValue: this.props.list.queryMap.ip, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='所在区域'>{getFieldDecorator('zone',{initialValue: this.props.list.queryMap.zone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='真实姓名'>{getFieldDecorator('realname',{initialValue: this.props.list.queryMap.realname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='手机号'>{getFieldDecorator('mobilephone',{initialValue: this.props.list.queryMap.mobilephone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='邮箱'>{getFieldDecorator('email',{initialValue: this.props.list.queryMap.email, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='收货地址'>{getFieldDecorator('address',{initialValue: this.props.list.queryMap.address, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='红包余额(起始)'>{getFieldDecorator('start_leftmoney',{initialValue: this.props.list.queryMap.start_leftmoney  ? moment(this.props.list.queryMap.start_leftmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='红包余额(结束)'>{getFieldDecorator('end_leftmoney',{initialValue: this.props.list.queryMap.end_leftmoney  ? moment(this.props.list.queryMap.end_leftmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='收款方式，银行卡或者支付宝之类，红包提现用'>{getFieldDecorator('bankaccount',{initialValue: this.props.list.queryMap.bankaccount, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='微信'>{getFieldDecorator('weixin',{initialValue: this.props.list.queryMap.weixin, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否开放联系方式 0永不 1直接开放  2 根据红包决定(起始)'>{getFieldDecorator('start_ishowcontactduetoredmoney',{initialValue: this.props.list.queryMap.start_ishowcontactduetoredmoney  ? moment(this.props.list.queryMap.start_ishowcontactduetoredmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否开放联系方式 0永不 1直接开放  2 根据红包决定(结束)'>{getFieldDecorator('end_ishowcontactduetoredmoney',{initialValue: this.props.list.queryMap.end_ishowcontactduetoredmoney  ? moment(this.props.list.queryMap.end_ishowcontactduetoredmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='收到某人至少多少红包才对他开放联系方式(起始)'>{getFieldDecorator('start_atleasthowmuchredmoney',{initialValue: this.props.list.queryMap.start_atleasthowmuchredmoney  ? moment(this.props.list.queryMap.start_atleasthowmuchredmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='收到某人至少多少红包才对他开放联系方式(结束)'>{getFieldDecorator('end_atleasthowmuchredmoney',{initialValue: this.props.list.queryMap.end_atleasthowmuchredmoney  ? moment(this.props.list.queryMap.end_atleasthowmuchredmoney): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='QQ'>{getFieldDecorator('qq',{initialValue: this.props.list.queryMap.qq, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='固定区域'>{getFieldDecorator('fixedzone',{initialValue: this.props.list.queryMap.fixedzone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='第一次登陆时间'>{getFieldDecorator('regtime',{initialValue: this.props.list.queryMap.regtime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='最后一次登录时间'>{getFieldDecorator('logontime',{initialValue: this.props.list.queryMap.logontime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='经度'>{getFieldDecorator('lng',{initialValue: this.props.list.queryMap.lng, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='纬度'>{getFieldDecorator('lat',{initialValue: this.props.list.queryMap.lat, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='详细位置'>{getFieldDecorator('addressdetail',{initialValue: this.props.list.queryMap.addressdetail, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('lasttimeinfo',{initialValue: this.props.list.queryMap.lasttimeinfo, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(起始)'>{getFieldDecorator('start_videosecond',{initialValue: this.props.list.queryMap.start_videosecond  ? moment(this.props.list.queryMap.start_videosecond): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(结束)'>{getFieldDecorator('end_videosecond',{initialValue: this.props.list.queryMap.end_videosecond  ? moment(this.props.list.queryMap.end_videosecond): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <ListButtonGroup handleFormReset={this.handleFormReset} routerUrl={routerUrl} dispatch={this.props.dispatch} handleExport={this.handleExport} url={url} handleSearch={this.handleSearch} />
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
