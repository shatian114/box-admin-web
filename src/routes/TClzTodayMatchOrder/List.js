/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import ListButtonGroup from '../../components/ListButtonGroup';
import styles from '../../styles/list.less';
import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import { webConfig, formItemLayout, formItemGrid, ordergetstatusArr } from '../../utils/Constant';
import cache from '../../utils/cache';
import Importer from '../../components/Importer';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TClzOrder;
const routerUrl ='/TClzOrder';
const url = 'TClzOrder';
const rowKey = 't_clz_order_id';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const DateFormat2 = 'YYYY-MM-DD';
let selectRecordArr = [];

@connect(({ base, list, loading }) => ({ base, list, setting: loading.effects['list/setDeliveryList'] }))
@Form.create()
@List.create()
export default class TClzOrderList extends Component {
  state = {
    gettype: '',
    setqueryTClzDeliveryclerkList: [],
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    const { dispatch, form } = this.props;
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
    start_orderdate: values.start_orderdate.format(DateFormat2),
  }
}
if(!isEmpty(values.end_orderdate)) {
 temp = {
   ...temp,
   end_orderdate: values.end_orderdate.format(DateFormat2),
 }
}

if(!isEmpty(values.start_ordertime)) {
  temp = {
    ...temp,
    start_ordertime: values.start_ordertime.format(DateFormat),
  }
}
if(!isEmpty(values.end_ordertime)) {
  temp = {
    ...temp,
    end_ordertime: values.end_ordertime.format(DateFormat),
  }
}

 let orderdate = moment().format(DateFormat2);
      setList({
        current: 1,
        queryMap: { ...values, ...temp, start_orderdate: orderdate, end_orderdate: orderdate, gettype: '2' },
      });
    });
  };


  handleFormReset = () => {
    const { form, list } = this.props;
    const { setList } = list;
    form.resetFields();
    let orderdate = moment().format(DateFormat2);
    setList({
      current: 1,
      queryMap: {
        start_orderdate: orderdate,
        end_orderdate: orderdate,
        gettype: '2',
        ordergetstatus: '1',
        t_clz_assignfood_id: '',
        t_clz_deliveryclerk_id: '',
      },
    });
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
    if (values.start_orderdate) date.start_orderdate = values.start_orderdate.format(DateFormat2);
    if (values.end_orderdate) date.end_orderdate = values.end_orderdate.format(DateFormat2);
    if (values.start_ordertime) date.start_ordertime = values.start_ordertime.format(DateFormat);
    if (values.end_ordertime) date.end_ordertime = values.end_ordertime.format(DateFormat);
    dispatch({
        type: `list/exportTodayMatchOrderExcel`,
        payload: {
        filename: '当日订单和配菜点匹配.xls',
        queryMap: { ...values, ...date } || {},
          ...values, ...date,
        },
        url,
        });
    });
  };

  openOrderDatail = (record) => {
    window.open(window.location.href + "?component=TClzOrderDatail&id=" + record[rowKey]);
  }

  setDeliveryList = () => {
    const assignfoodid = this.props.form.getFieldValue('selectassignfoodname');
    const deliveryclerkid = this.props.form.getFieldValue('selectdeliveryusername');
    if(assignfoodid === '' || assignfoodid === undefined || deliveryclerkid === '' || deliveryclerkid === undefined) {
      message.error('请选择配菜点和配送员');
      return;
    }
    let orderids = [];
    for(let i=0; i<selectRecordArr.length; i+=1) {
      orderids.push(selectRecordArr[i].t_clz_order_id);
    }
    this.props.dispatch({
      type: 'list/setDeliveryList',
      payload: {
        'orderids': orderids.join(','),
        t_clz_assignfood_id: assignfoodid,
        t_clz_deliveryclerk_id: deliveryclerkid,
        callback: this.handleSearch,
      },
      url,
    });
  }

  changeSearchassignfood = (assignfoodid) => {
    let deliveryclerklist = [];
    const { queryTClzDeliveryclerkList } = this.props.list;
    queryTClzDeliveryclerkList.map(o => {
      if(o &&(o.assignfood_id == assignfoodid)) {
        deliveryclerklist.push(o);
      }
    });
    this.props.dispatch({
      type: 'list/save',
      payload: {
        searchqueryTClzDeliveryclerkList: deliveryclerklist,
      },
    });
  }

  changeSetassignfood = (assignfoodid) => {
    let deliveryclerklist = [];
    const { queryTClzDeliveryclerkList } = this.props.list;
    queryTClzDeliveryclerkList.map(o => {
      if(o && (o.assignfood_id == assignfoodid)) {
        deliveryclerklist.push(o);
      }
    });
    this.setState({
      setqueryTClzDeliveryclerkList: deliveryclerklist,
    });
  }

  changeGettype = (gettype) => {
    this.setState({
      'gettype': gettype,
    });
    if(gettype === '1') {
      this.props.form.setFieldsValue({
        selectdeliveryusername: '',
        deliveryusername: '',
      });
    }
  }

  render() {
    const { form, base, list } = this.props;
    const { searchqueryTClzDeliveryclerkList, setqueryTClzDeliveryclerkList, queryTClzAssignfoodList } = list;
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
      {
        title: '操作',
        key: 'action',
        width: 240,
        align: 'center',
        render: (text, record) => (
          <Row gutter={8}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Operate operateName="UPDATE">
                <Button
                  type="primary"
                  icon="info"
                  ghost
                  size="small"
                  onClick={this.openOrderDatail.bind(this, record)}
                >
                  详情
                </Button>
              </Operate>
            </Col>
            {/* <Col span={8}>
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
            </Col> */}
          </Row>
        ),
      },
       {  title: '订单编号',   dataIndex: 't_clz_order_id',     width: 150,     sorter: false,      },
       {  title: '订单金额',   dataIndex: 'totalamount',     width: 150,     sorter: false,      },
       {  title: '下单时间',   dataIndex: 'ordertime',     width: 150,     sorter: false,      },
       {  title: '订单日期',   dataIndex: 'orderdate',     width: 150,     sorter: false,      },
       {  title: '获取方式',   dataIndex: 'gettype',     width: 150,     sorter: false,   render: text => (
        <span>{text === '1' ? '自提' : '配送'}</span>
      )   },
      {  title: '订单获取状态',   dataIndex: 'ordergetstatus',     width: 150,     sorter: false,  render: text => {
        return (
          <span>{ordergetstatusArr[text-1]}</span>
        )
      },     },
      {  title: '配菜点',   dataIndex: 'assignfoodname',     width: 150,     sorter: false,      },
      {  title: '配送员',   dataIndex: 'deliveryusername',     width: 150,     sorter: false,      },
      {  title: '配送员地址',   dataIndex: 'deliveryclerkadress',     width: 150,     sorter: false,      },
      {  title: '配送地址',   dataIndex: 'recieveaddress',     width: 150,     sorter: false,      },
 {  title: '订单描述',   dataIndex: 'ordergetstatusdes',     width: 150,     sorter: false,       },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },
 {  title: '是否生效',   dataIndex: 'orderstatus',     width: 150,     sorter: false,  render: text => (
   <span>{text === '0' ? '不生效' : '生效'}</span>
 ),     },
 {  title: '用户姓名',   dataIndex: 'username',     width: 100,     sorter: false,      },

    ];

    let orderdate = moment().format("YYYY-MM-DD");

    const listConfig = {
      url: '/api/TClzOrder/queryTClzOrder2List', // 必填,请求url
      scroll: { x: 2290, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
      queryMap: { start_orderdate: orderdate, end_orderdate: orderdate, ordergetstatus: '1', gettype: '2', t_clz_assignfood_id: '', t_clz_deliveryclerk_id: '' },
      rowSelection: {onChange: (selectedRowKeys, selectRows) => {
        selectRecordArr = selectRows;
      }},
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单编号'>{getFieldDecorator('t_clz_order_id',{initialValue: this.props.list.queryMap.t_clz_order_id || '', })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='用户姓名'>{getFieldDecorator('username',{initialValue: this.props.list.queryMap.userid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点'>{getFieldDecorator('t_clz_assignfood_id',{initialValue: this.props.list.queryMap.t_clz_assignfood_id || '', })(<Select allowClear showSearch optionFilterProp="children" onChange={this.changeSearchassignfood} >
    <Option key="1" value=""></Option>
    {
      queryTClzAssignfoodList ? queryTClzAssignfoodList.map(v => (
        <Option key={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
      )
      ) : ''
    }
  </Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配送员'>{getFieldDecorator('t_clz_deliveryclerk_id',{initialValue: this.props.list.queryMap.t_clz_deliveryclerk_id || '', })(<Select allowClear showSearch optionFilterProp="children" disabled={this.state.gettype==='1'}>
    <Option key="1" value=""></Option>
    {
      this.state.setqueryTClzDeliveryclerkList ? searchqueryTClzDeliveryclerkList.map(v => (
        <Option key={v.t_clz_deliveryclerk_id}>{`${v.username}=>${v.deliveryclerkadress}`}</Option>
      )
      ) : ''
    }
  </Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配送地址'>{getFieldDecorator('receiveraddress',{initialValue: this.props.list.queryMap.t_clz_useraddress_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(起始)'>{getFieldDecorator('start_create_date',{initialValue: this.props.list.queryMap.start_create_date ? moment(this.props.list.queryMap.start_create_date) : null, })(<DatePicker showTime format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(结束)'>{getFieldDecorator('end_create_date',{initialValue: this.props.list.queryMap.end_create_date? moment(this.props.list.queryMap.end_create_date) : null, })(<DatePicker showTime format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='下单时间(起始)'>{getFieldDecorator('start_ordertime',{initialValue: this.props.list.queryMap.start_ordertime? moment(this.props.list.queryMap.start_ordertime) : null, })(<DatePicker showTime format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='下单时间(结束)'>{getFieldDecorator('end_ordertime',{initialValue: this.props.list.queryMap.end_ordertime ? moment(this.props.list.queryMap.end_ordertime) : null, })(<DatePicker showTime format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单日期(起始)'>{getFieldDecorator('start_orderdate',{initialValue: moment(), })(<DatePicker disabled format={DateFormat2} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='订单日期(结束)'>{getFieldDecorator('end_orderdate',{initialValue: moment(), })(<DatePicker disabled format={DateFormat2} placeholder='请输入' />)} </FormItem> </Col>

              
             
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <ListButtonGroup handleFormReset={this.handleFormReset} routerUrl={routerUrl} dispatch={this.props.dispatch} handleExport={this.handleExport} url={url} handleSearch={this.handleSearch} />
              </Col>
            </Row>
            <Row>
              <Col>
                <span style={{marginLeft: 140}}>共有{list.list.length || 0}个订单，合计金额{list.sumtotal || 0}</span>
              </Col>
            </Row>
          </Form>
        </Card>
        <Form>
          <FormItem label="配菜点" labelCol={{span: 3}} wrapperCol={{span: 21}}>
            {getFieldDecorator('selectassignfoodname',{initialValue: '', })(<Select allowClear showSearch optionFilterProp="children" onChange={this.changeSetassignfood}>
              {
                queryTClzAssignfoodList ? queryTClzAssignfoodList.map(v => (
                  <Option key={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
                )
                ) : ''
              }
            </Select>)}
          </FormItem>
          <FormItem label='配送员' labelCol={{span: 3}} wrapperCol={{span: 21}}>
          {getFieldDecorator('selectdeliveryusername',{initialValue: '', })(<Select allowClear showSearch optionFilterProp="children" disabled={this.state.gettype==='1'}>
    {
      this.state.setqueryTClzDeliveryclerkList.map(v => (
        <Option key={v.t_clz_deliveryclerk_id}>{`${v.username}=>${v.deliveryclerkadress}`}</Option>
      )
      )
    }
  </Select>)} </FormItem>
  <FormItem>
    <Row>
      <Col span={3}></Col>
      <Col>
        <Button onClick={this.setDeliveryList} loading={this.props.setting}>设置</Button>
      </Col>
    </Row>
  </FormItem>
        </Form>
        <List {...listConfig} />
      </div>
    );
  }
}
