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

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TVersioninfo;
const routerUrl ='/TVersioninfo';
const url = 'TVersioninfo';
const rowKey = 't_versioninfo_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TVersioninfoList extends Component {
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
       {  title: '',   dataIndex: 't_versioninfo_id',     width: 150,     sorter: false,      },
 {  title: '版本号',   dataIndex: 'ver',     width: 150,     sorter: false,      },
 {  title: '是否送审',   dataIndex: 'isreview',     width: 150,     sorter: false,      },
 {  title: '客户端描述',   dataIndex: 'strappdes',     width: 150,     sorter: false,      },
 {  title: '导航图片1',   dataIndex: 'strflash1',     width: 150,     sorter: false,      },
 {  title: '导航图片2',   dataIndex: 'strflash2',     width: 150,     sorter: false,      },
 {  title: '导航图片3',   dataIndex: 'strflash3',     width: 150,     sorter: false,      },
 {  title: '导航图片4',   dataIndex: 'strflash4',     width: 150,     sorter: false,      },
 {  title: '标签1',   dataIndex: 'tabtext1',     width: 150,     sorter: false,      },
 {  title: '标签2',   dataIndex: 'tabtext2',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'tabtext3',     width: 150,     sorter: false,      },
 {  title: '标签3',   dataIndex: 'tabtext4',     width: 150,     sorter: false,      },
 {  title: '标签4',   dataIndex: 'tabtext5',     width: 150,     sorter: false,      },
 {  title: '显示几个标签。--这是长度为5的字符串，比如11011',   dataIndex: 'fivetab',     width: 150,     sorter: false,      },
 {  title: '免责协议链接',   dataIndex: 'xieyilink',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TVersioninfo/queryTVersioninfoList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_versioninfo_id',{initialValue: this.props.list.queryMap.t_versioninfo_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='版本号'>{getFieldDecorator('ver',{initialValue: this.props.list.queryMap.ver, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否送审(起始)'>{getFieldDecorator('start_isreview',{initialValue: this.props.list.queryMap.start_isreview  ? moment(this.props.list.queryMap.start_isreview): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否送审(结束)'>{getFieldDecorator('end_isreview',{initialValue: this.props.list.queryMap.end_isreview  ? moment(this.props.list.queryMap.end_isreview): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='客户端描述'>{getFieldDecorator('strappdes',{initialValue: this.props.list.queryMap.strappdes, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='导航图片1'>{getFieldDecorator('strflash1',{initialValue: this.props.list.queryMap.strflash1, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='导航图片2'>{getFieldDecorator('strflash2',{initialValue: this.props.list.queryMap.strflash2, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='导航图片3'>{getFieldDecorator('strflash3',{initialValue: this.props.list.queryMap.strflash3, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='导航图片4'>{getFieldDecorator('strflash4',{initialValue: this.props.list.queryMap.strflash4, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='标签1'>{getFieldDecorator('tabtext1',{initialValue: this.props.list.queryMap.tabtext1, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='标签2'>{getFieldDecorator('tabtext2',{initialValue: this.props.list.queryMap.tabtext2, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('tabtext3',{initialValue: this.props.list.queryMap.tabtext3, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='标签3'>{getFieldDecorator('tabtext4',{initialValue: this.props.list.queryMap.tabtext4, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='标签4'>{getFieldDecorator('tabtext5',{initialValue: this.props.list.queryMap.tabtext5, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='显示几个标签。--这是长度为5的字符串，比如11011'>{getFieldDecorator('fivetab',{initialValue: this.props.list.queryMap.fivetab, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='免责协议链接'>{getFieldDecorator('xieyilink',{initialValue: this.props.list.queryMap.xieyilink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(起始)'>{getFieldDecorator('start_create_date',{initialValue: this.props.list.queryMap.start_create_date ? moment(this.props.list.queryMap.start_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(结束)'>{getFieldDecorator('end_create_date',{initialValue: this.props.list.queryMap.end_create_date? moment(this.props.list.queryMap.end_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>

              
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
