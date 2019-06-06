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
import ListButtonGroup from '../../components/ListButtonGroup';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty, getLocationParam } from '../../utils/utils';
import { webConfig, formItemLayout, formItemGrid } from '../../utils/Constant';
import cache from '../../utils/cache';
import Importer from '../../components/Importer';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TClzOrderDatail;
const routerUrl ='/TClzOrderDatail';
const url = 'TClzOrderDatail';
const rowKey = 't_clz_order_datail_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base, list }) => ({ base, list }))
@Form.create()
@List.create()
export default class TClzOrderDatailList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentWillMount = () => {

  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    const { dispatch } = this.props;

    const param = getLocationParam();
    if(param.id) {
      this.props.form.setFieldsValue({
        t_clz_order_id: param.id,
      });
    }

    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzFood/queryTClzFoodList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzOrder/queryTClzOrderList',
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getQueryMap = () => {
    const param = getLocationParam();
    if(param.id) {
      return {'t_clz_order_id': param.id};
    }
    return {};
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
        filename: '订单明细.xls',
        queryMap: { ...values, ...date } || {},
        },
        ...values, ...date,
        url,
        });
    });
  };


  render() {
    const { form, list } = this.props;
    const { queryTClzFoodList, queryTClzOrderList  } = list;
    
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
       {  title: '',   dataIndex: 't_clz_order_datail_id',     width: 150,     sorter: false,      },
 {  title: '订单id',   dataIndex: 't_clz_order_id',     width: 150,     sorter: false,      },
 {  title: '菜品id',   dataIndex: 't_clz_food_id',     width: 150,     sorter: false,      },
 {  title: '菜品大类',   dataIndex: 'bigtypename',     width: 150,     sorter: false,      },
 {  title: '菜品小类',   dataIndex: 'samlltypename',     width: 150,     sorter: false,      },
 {  title: '菜名',   dataIndex: 'foodname',     width: 150,     sorter: false,      },
 {  title: '单位',   dataIndex: 'foodunit',     width: 150,     sorter: false,      },
 {  title: '当时这个菜品的单价',   dataIndex: 'foodprice',     width: 150,     sorter: false,      },
 {  title: '数量',   dataIndex: 'foodnum',     width: 150,     sorter: false,      },
 {  title: '本菜总价',   dataIndex: 'foodtotalamount',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TClzOrderDatail/queryTClzOrderDatailList', // 必填,请求url
      scroll: { x: 1050, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
      queryMap: this.getQueryMap(),
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单详情编号'>{getFieldDecorator('t_clz_order_datail_id',{initialValue: this.props.list.queryMap.t_clz_order_datail_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单'>{getFieldDecorator('t_clz_order_id',{initialValue: this.props.list.queryMap.t_clz_order_id, })(<Select allowClear showSearch optionFilterProp="children">
    {
      queryTClzOrderList ? queryTClzOrderList.map(v => (
        <Option key={v.t_clz_order_id}>{v.t_clz_order_id}</Option>
      )
      ) : ''
    }
  </Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='菜品'>{getFieldDecorator('t_clz_food_id',{initialValue: this.props.list.queryMap.t_clz_food_id, })(<Select allowClear showSearch optionFilterProp="children">
    {
      queryTClzFoodList ? queryTClzFoodList.map(v => (
        <Option key={v.t_clz_food_id}>{v.foodname}</Option>
      )
      ) : ''
    }
  </Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='数量(起始)'>{getFieldDecorator('start_foodnum',{initialValue: this.props.list.queryMap.start_foodnum  ? moment(this.props.list.queryMap.start_foodnum): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='数量(结束)'>{getFieldDecorator('end_foodnum',{initialValue: this.props.list.queryMap.end_foodnum  ? moment(this.props.list.queryMap.end_foodnum): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
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
