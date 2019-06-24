/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import ListButtonGroup from '../../components/ListButtonGroup';
import styles from '../../styles/list.less';
import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import { webConfig, formItemLayout, formItemGrid } from '../../utils/Constant';
import cache from '../../utils/cache';
import Importer from '../../components/Importer';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TClzOrder;
const routerUrl ='/TClzOrder';
const url = 'TClzOrder';
const rowKey = 't_clz_order_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base, list }) => ({ base, list }))
@Form.create()
@List.create()
export default class TClzOrderList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    const { dispatch } = this.props;
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzAssignfood/queryTClzAssignfoodList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzDeliveryclerk/queryTClzDeliveryclerkList',
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
 if(!isEmpty(values.start_orderdate)) {
  temp = {
    ...temp,
    start_orderdate: values.start_orderdate.format(DateFormat),
  }
}
if(!isEmpty(values.end_orderdate)) {
 temp = {
   ...temp,
   end_orderdate: values.end_orderdate.format(DateFormat),
 }
}

      
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
    if (values.start_orderdate) date.start_orderdate = values.start_orderdate.format(DateFormat);
    if (values.end_orderdate) date.end_orderdate = values.end_orderdate.format(DateFormat);
    dispatch({
        type: `list/exportFoodDeliveryDatailExcel`,
        payload: {
          filename: '配菜点菜品统计.xls',
          queryMap: { ...values, ...date } || {},
          ...values,
          ...date,
        },
        url,
      });
    });
  };

  openOrderDatail = (record) => {
    window.open(window.location.href + "?component=TClzOrderDatail&id=" + record[rowKey]);
  }

  render() {
    const { form, base, list } = this.props;
    const { queryTClzDeliveryclerkList, queryTClzAssignfoodList  } = list;
    const { ordergetstatusdes,orderstatus,ordergetstatus } = base;
    
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

        {  title: '配菜点编号',   dataIndex: 't_clz_assignfood_id',     width: 100,     sorter: false,      },
      {  title: '配菜点名称',   dataIndex: 'assignfoodname',     width: 100,     sorter: false,      },
       {  title: '菜品大类',   dataIndex: 'bigtypename',     width: 100,     sorter: false,      },
       {  title: '菜品小类',   dataIndex: 'samlltypename',     width: 100,     sorter: false,      },
       {  title: '菜品',   dataIndex: 'foodname',     width: 100,     sorter: false,      },
       {  title: '总菜量',   dataIndex: 'totalfoodnum',     width: 100,     sorter: false,      },
       {  title: '菜品单位',   dataIndex: 'foodunit',     width: 100,     sorter: false,      },
       {  title: '总价格',   dataIndex: 'foodtotalamount',     width: 100,     sorter: false,      },
       {  title: '总订单数',   dataIndex: 'ordernum',     width: 100,     sorter: false,      },
    ];

    const listConfig = {
      url: '/api/TClzOrder/queryTClzFoodDeliveryDatailList', // 必填,请求url
      scroll: { x: 900, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
      queryMap: { start_orderdate: moment().format("YYYY-MM-DD"), end_orderdate: moment().format("YYYY-MM-DD") },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单日期(起始)'>{getFieldDecorator('start_orderdate',{initialValue: moment(this.props.list.queryMap.start_orderdate), })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单日期(结束)'>{getFieldDecorator('end_orderdate',{initialValue: moment(this.props.list.queryMap.end_orderdate), })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>

<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点'>{getFieldDecorator('t_clz_assignfood_id',{initialValue: this.props.list.queryMap.t_clz_assignfood_id, })(<Select allowClear showSearch optionFilterProp="children">
    {
      queryTClzAssignfoodList ? queryTClzAssignfoodList.map(v => (
        <Option key={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
      )
      ) : ''
    }
  </Select>)} </FormItem> </Col>
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
