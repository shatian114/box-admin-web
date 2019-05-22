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
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Link } from 'dva/router';
import moment from 'moment';
import ListButtonGroup from '../../components/ListButtonGroup';
import ShengShiQu from '../../components/ShengShiQu';
import { FormValid } from '../../utils/FormValid';
import styles from '../../styles/list.less';
import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import { formItemLayout, formItemGrid } from '../../utils/Constant';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TClzAssignfood;
const routerUrl ='/TClzAssignfood';
const url = 'TClzAssignfood';
const rowKey = 't_clz_assignfood_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TClzAssignfoodList extends Component {
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
        filename: '配菜点.xls',
        queryMap: { ...values, ...date } || {},
        },
        url,
        });
    });
  };


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
       {  title: '配菜点编号',   dataIndex: 't_clz_assignfood_id',     width: 150,     sorter: false,      },
 {  title: '省',   dataIndex: 'sheng',     width: 150,     sorter: false,      },
 {  title: '市',   dataIndex: 'shi',     width: 150,     sorter: false,      },
 {  title: '区',   dataIndex: 'qu',     width: 150,     sorter: false,      },
 {  title: '详细地址',   dataIndex: 'address',     width: 150,     sorter: false,      },
 {  title: '经度',   dataIndex: 'longitude',     width: 150,     sorter: false,      },
 {  title: '纬度',   dataIndex: 'latitude',     width: 150,     sorter: false,      },
 {  title: '配菜点名称',   dataIndex: 'assignfoodname',     width: 150,     sorter: false,      },
 {  title: '配菜点描述',   dataIndex: 'assignfooddesc',     width: 150,     sorter: false,      },
 {  title: '配菜点外景图片',   dataIndex: 'assignfoodnpic',     width: 150,     sorter: false,   render: (text) => (
  <img src={`${text}?${Math.random}`} width={80} height={80} alt="暂无图片" />
 )   },
 {  title: '负责人名称',   dataIndex: 'assignfoodadminname',     width: 150,     sorter: false,      },
 {  title: '负责人联系方式',   dataIndex: 'assignfoodadminphone',     width: 150,     sorter: false,      },
 {  title: '配菜点对外电话',   dataIndex: 'assignfoodphone',     width: 150,     sorter: false,      },
 {  title: '政府补贴费率',   dataIndex: 'subsideprice',     width: 150,     sorter: false,      },
 {  title: '外墙广告价位',   dataIndex: 'advertisementprice',     width: 150,     sorter: false,      },
 {  title: '外墙广告描述',   dataIndex: 'advertisementpricedesc',     width: 150,     sorter: false,      },
 {  title: '是否交过保证金',   dataIndex: 'ispaygurantee',     width: 150,     sorter: false,      },
 {  title: '保证金数额',   dataIndex: 'guranteeamount',     width: 150,     sorter: false,      },
 {  title: '预留字段1',   dataIndex: 'yuliu1',     width: 150,     sorter: false,      },
 {  title: '预留字段2',   dataIndex: 'yuliu2',     width: 150,     sorter: false,      },
 {  title: '预留字段3',   dataIndex: 'yuliu3',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TClzAssignfood/queryTClzAssignfoodList', // 必填,请求url
      scroll: { x: 3300, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点编号'>{getFieldDecorator('t_clz_assignfood_id',{initialValue: this.props.list.queryMap.t_clz_assignfood_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
              {<ShengShiQu getFieldDecorator={getFieldDecorator} base={base} form={form} gridType='list' list={list} />}
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='详细地址'>{getFieldDecorator('address',{initialValue: this.props.list.queryMap.address, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='经度'>{getFieldDecorator('longitude',{initialValue: this.props.list.queryMap.longitude, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='纬度'>{getFieldDecorator('latitude',{initialValue: this.props.list.queryMap.latitude, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点名称'>{getFieldDecorator('assignfoodname',{initialValue: this.props.list.queryMap.assignfoodname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点描述'>{getFieldDecorator('assignfooddesc',{initialValue: this.props.list.queryMap.assignfooddesc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
{/* <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点外景图片'>{getFieldDecorator('assignfoodnpic',{initialValue: this.props.list.queryMap.assignfoodnpic, })(<Input placeholder='请输入' />)} </FormItem> </Col> */}
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='负责人名称'>{getFieldDecorator('assignfoodadminname',{initialValue: this.props.list.queryMap.assignfoodadminname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='负责人联系方式'>{getFieldDecorator('assignfoodadminphone',{initialValue: this.props.list.queryMap.assignfoodadminphone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='配菜点对外电话'>{getFieldDecorator('assignfoodphone',{initialValue: this.props.list.queryMap.assignfoodphone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='外墙广告价位描述'>{getFieldDecorator('advertisementpricedesc',{initialValue: this.props.list.queryMap.advertisementpricedesc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否交过保证金'>{getFieldDecorator('ispaygurantee',{initialValue: this.props.list.queryMap.ispaygurantee  ? moment(this.props.list.queryMap.ispaygurantee): null, })
 (<Select dropdownMatchSelectWidth>
   <Option value="1">是</Option>
   <Option value="2">否</Option>
 </Select>)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='保证金数额(起始)'>{getFieldDecorator('start_guranteeamount',{initialValue: this.props.list.queryMap.start_guranteeamount  ? moment(this.props.list.queryMap.start_guranteeamount): null, rules: [{ validator: FormValid.jine },] })
 (<InputNumber addonAfter='元' placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='保证金数额(结束)'>{getFieldDecorator('end_guranteeamount',{initialValue: this.props.list.queryMap.end_guranteeamount  ? moment(this.props.list.queryMap.end_guranteeamount): null, rules: [{ validator: FormValid.jine },] })
 (<InputNumber addonAfter='元' placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='预留字段1'>{getFieldDecorator('yuliu1',{initialValue: this.props.list.queryMap.yuliu1, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='预留字段2'>{getFieldDecorator('yuliu2',{initialValue: this.props.list.queryMap.yuliu2, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='预留字段3'>{getFieldDecorator('yuliu3',{initialValue: this.props.list.queryMap.yuliu3, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
