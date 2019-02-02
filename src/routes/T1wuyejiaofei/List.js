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
//const routerUrl = cache.keysMenu.T1wuyejiaofei;
const routerUrl ='/T1wuyejiaofei';
const url = 'T1wuyejiaofei';
const rowKey = 't_1wuyejiaofei_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class T1wuyejiaofeiList extends Component {
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
       {  title: '物业费条目ID',   dataIndex: 't_1wuyejiaofei_id',     width: 150,     sorter: false,      },
 {  title: '业主id',   dataIndex: 'yzid',     width: 150,     sorter: false,      },
 {  title: '面积',   dataIndex: 'mj',     width: 150,     sorter: false,      },
 {  title: '物业费单价',   dataIndex: 'wydj',     width: 150,     sorter: false,      },
 {  title: '本月物业费',   dataIndex: 'bywy',     width: 150,     sorter: false,      },
 {  title: '物业费欠缴',   dataIndex: 'wyqj',     width: 150,     sorter: false,      },
 {  title: '本期物业费',   dataIndex: 'bqwy',     width: 150,     sorter: false,      },
 {  title: '车牌号',   dataIndex: 'cph',     width: 150,     sorter: false,      },
 {  title: '地库数量',   dataIndex: 'dk',     width: 150,     sorter: false,      },
 {  title: '地面数量',   dataIndex: 'dm',     width: 150,     sorter: false,      },
 {  title: '地库车价',   dataIndex: 'dkcj',     width: 150,     sorter: false,      },
 {  title: '地面车价',   dataIndex: 'dmcj',     width: 150,     sorter: false,      },
 {  title: '本月车费',   dataIndex: 'bycf',     width: 150,     sorter: false,      },
 {  title: '车费欠缴',   dataIndex: 'cfqj',     width: 150,     sorter: false,      },
 {  title: '本期车费',   dataIndex: 'bqcf',     width: 150,     sorter: false,      },
 {  title: '水费单价',   dataIndex: 'sf',     width: 150,     sorter: false,      },
 {  title: '本月吨数',   dataIndex: 'byds',     width: 150,     sorter: false,      },
 {  title: '本月水费',   dataIndex: 'bysf',     width: 150,     sorter: false,      },
 {  title: '水费欠缴',   dataIndex: 'sfqj',     width: 150,     sorter: false,      },
 {  title: '本期水费',   dataIndex: 'bqsf',     width: 150,     sorter: false,      },
 {  title: '当期小计',   dataIndex: 'dqxj',     width: 150,     sorter: false,      },
 {  title: '年月',   dataIndex: 'ny',     width: 150,     sorter: false,      },
 {  title: '是否结扣',   dataIndex: 'isover',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/T1wuyejiaofei/queryT1wuyejiaofeiList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业费条目ID'>{getFieldDecorator('t_1wuyejiaofei_id',{initialValue: this.props.list.queryMap.t_1wuyejiaofei_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='业主id(起始)'>{getFieldDecorator('start_yzid',{initialValue: this.props.list.queryMap.start_yzid  ? moment(this.props.list.queryMap.start_yzid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='业主id(结束)'>{getFieldDecorator('end_yzid',{initialValue: this.props.list.queryMap.end_yzid  ? moment(this.props.list.queryMap.end_yzid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='面积'>{getFieldDecorator('mj',{initialValue: this.props.list.queryMap.mj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业费单价'>{getFieldDecorator('wydj',{initialValue: this.props.list.queryMap.wydj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本月物业费'>{getFieldDecorator('bywy',{initialValue: this.props.list.queryMap.bywy, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业费欠缴'>{getFieldDecorator('wyqj',{initialValue: this.props.list.queryMap.wyqj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本期物业费'>{getFieldDecorator('bqwy',{initialValue: this.props.list.queryMap.bqwy, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车牌号'>{getFieldDecorator('cph',{initialValue: this.props.list.queryMap.cph, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地库数量'>{getFieldDecorator('dk',{initialValue: this.props.list.queryMap.dk, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地面数量'>{getFieldDecorator('dm',{initialValue: this.props.list.queryMap.dm, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地库车价'>{getFieldDecorator('dkcj',{initialValue: this.props.list.queryMap.dkcj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地面车价'>{getFieldDecorator('dmcj',{initialValue: this.props.list.queryMap.dmcj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本月车费'>{getFieldDecorator('bycf',{initialValue: this.props.list.queryMap.bycf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车费欠缴'>{getFieldDecorator('cfqj',{initialValue: this.props.list.queryMap.cfqj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本期车费'>{getFieldDecorator('bqcf',{initialValue: this.props.list.queryMap.bqcf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='水费单价'>{getFieldDecorator('sf',{initialValue: this.props.list.queryMap.sf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本月吨数'>{getFieldDecorator('byds',{initialValue: this.props.list.queryMap.byds, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本月水费'>{getFieldDecorator('bysf',{initialValue: this.props.list.queryMap.bysf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='水费欠缴'>{getFieldDecorator('sfqj',{initialValue: this.props.list.queryMap.sfqj, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='本期水费'>{getFieldDecorator('bqsf',{initialValue: this.props.list.queryMap.bqsf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='年月'>{getFieldDecorator('ny',{initialValue: this.props.list.queryMap.ny, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否结扣(起始)'>{getFieldDecorator('start_isover',{initialValue: this.props.list.queryMap.start_isover  ? moment(this.props.list.queryMap.start_isover): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否结扣(结束)'>{getFieldDecorator('end_isover',{initialValue: this.props.list.queryMap.end_isover  ? moment(this.props.list.queryMap.end_isover): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
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
