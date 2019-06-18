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
import ListButtonGroup from '../../components/ListButtonGroup';
import { webConfig, formItemLayout, formItemGrid } from '../../utils/Constant';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TClzFood;
const routerUrl ='/TClzFood';
const url = 'TClzFood';
const rowKey = 't_clz_food_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base, list }) => ({ base, list }))
@Form.create()
@List.create()
export default class TClzFoodList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('resize', this.resize);
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzBigtype/queryTClzBigtypeList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzSmalltype/queryTClzSmalltypeList',
      },
    });
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
        filename: '菜品.xls',
        queryMap: { ...values, ...date } || {},
        },
        ...values, ...date,
        url,
        });
    });
  };

  changeBigtype = (bigtype_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzSmalltype/queryTClzSmalltypeList',
        queryMap: {
          t_clz_bigtype_id: bigtype_id,
        },
      },
    });
    this.props.form.setFieldsValue({'t_clz_smalltype_id': ''});
  }

  render() {
    const { form, base, list } = this.props;
    
    
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
       {  title: '菜品编号',   dataIndex: 't_clz_food_id',     width: 150,     sorter: false,      },
 {  title: '关联的小类',   dataIndex: 'smalltypename',     width: 150,     sorter: false,      },
 {  title: '菜的名称',   dataIndex: 'foodname',     width: 150,     sorter: false,      },
 {  title: '菜的描述',   dataIndex: 'fooddesc',     width: 150,     sorter: false,      },
 {  title: '菜的单价',   dataIndex: 'foodprice',     width: 150,     sorter: false,      },
 {  title: '单位',   dataIndex: 'foodunit',     width: 150,     sorter: false,      },
 {  title: '菜的图片',   dataIndex: 'foodpiclink',     width: 150,     sorter: false,   render: (text) => (
  <img src={`${text}?${Math.random}`} width={80} height={80} alt="暂无图片" />
 )   },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TClzFood/queryTClzFoodList', // 必填,请求url
      scroll: { x: 1200, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='菜品编号'>{getFieldDecorator('t_clz_food_id',{initialValue: this.props.list.queryMap.t_clz_food_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='关联的大类'>{getFieldDecorator('t_clz_bigtype_id',{initialValue: this.props.list.queryMap.t_clz_bigtype_id, })(<Select dropdownMatchSelectWidth={true} allowClear showSearch onChange={this.changeBigtype}>
  {
    list.queryTClzBigtypeList.map((v) => (
      <Option key={v.t_clz_bigtype_id} value={v.t_clz_bigtype_id}>{v.typename}</Option>
    ))
   }
</Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='关联的小类'>{getFieldDecorator('t_clz_smalltype_id',{initialValue: this.props.list.queryMap.t_clz_smalltype_id, })(<Select dropdownMatchSelectWidth={true} allowClear showSearch>
  {
    list.queryTClzSmalltypeList.map((v) => (
      <Option key={v.t_clz_smalltype_id} value={v.t_clz_smalltype_id}>{v.typename}</Option>
    ))
   }
</Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='菜的名称'>{getFieldDecorator('foodname',{initialValue: this.props.list.queryMap.foodname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='菜的描述'>{getFieldDecorator('fooddesc',{initialValue: this.props.list.queryMap.fooddesc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='单位'>{getFieldDecorator('foodunit',{initialValue: this.props.list.queryMap.foodunit, })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.info.tClzSmalltypeId}>
  {
    webConfig.foodunitNameArr.map((v) => (
      <Option key={v} value={v}>{v}</Option>
    ))
   }
</Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(起始)'>{getFieldDecorator('start_create_date',{initialValue: this.props.list.queryMap.start_create_date ? moment(this.props.list.queryMap.start_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(结束)'>{getFieldDecorator('end_create_date',{initialValue: this.props.list.queryMap.end_create_date? moment(this.props.list.queryMap.end_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>

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
