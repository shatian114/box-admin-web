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
import {formItemLayout, formItemGrid, webConfig} from '../../utils/Constant';
import cache from '../../utils/cache';
import ListButtonGroup from '../../components/ListButtonGroup';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TProductShop;
const routerUrl ='/TProductShop';
const url = 'TProductShop';
const rowKey = 't_product_shop_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TProductShopList extends Component {
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
        filename: 't_product_shop.xls',
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
       {  title: '',   dataIndex: 't_product_shop_id',     width: 150,     sorter: false,      },
 {  title: '产品类型id',   dataIndex: 'producttypeid',     width: 150,     sorter: false,      },
 {  title: '区域标识',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '商品编号',   dataIndex: 'productid',     width: 150,     sorter: false,      },
 {  title: '商品排序',   dataIndex: 'orderindex',     width: 150,     sorter: false,      },
 {  title: '商品名称',   dataIndex: 'productname',     width: 150,     sorter: false,      },
 {  title: '商品图片索引',   dataIndex: 'tagindex',     width: 150,     sorter: false,      },
 {  title: '剩余数量',   dataIndex: 'num',     width: 150,     sorter: false,      },
 {  title: '商品描述',   dataIndex: 'productdes',     width: 150,     sorter: false,      },
 {  title: '支付的费用',   dataIndex: 'price',     width: 150,     sorter: false,      },
 {  title: '是否显示实时视频',   dataIndex: 'ishowvideolink',     width: 150,     sorter: false,      },
 {  title: '视频链接',   dataIndex: 'videolink',     width: 150,     sorter: false,      },
 {  title: '是否审核过',   dataIndex: 'ispassed',     width: 150,     sorter: false,      },
 {  title: '是否置顶',   dataIndex: 'istop',     width: 150,     sorter: false,      },
 {  title: '门店标识',   dataIndex: 'shoptag',     width: 150,     sorter: false,      },
 {  title: '是否允许用户上传图片',   dataIndex: 'isneeduserpic',     width: 150,     sorter: false,      },
 {  title: '是否用户可留言',   dataIndex: 'isneeduserinfo',     width: 150,     sorter: false,      },
 {  title: '是否需要输入完整收货地址',   dataIndex: 'isneeduseraddress',     width: 150,     sorter: false,      },
 {  title: '是否要填写桌号信息',   dataIndex: 'isneeddesktag',     width: 150,     sorter: false,      },
 {  title: '是否放到首页',   dataIndex: 'isatmain',     width: 150,     sorter: false,      },
 {  title: '产品主图',   dataIndex: 'mainpic',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TProductShop/queryTProductShopList', // 必填,请求url
      scroll: { x: 3300, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_product_shop_id',{initialValue: this.props.list.queryMap.t_product_shop_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='产品类型id(起始)'>{getFieldDecorator('start_producttypeid',{initialValue: this.props.list.queryMap.start_producttypeid  ? moment(this.props.list.queryMap.start_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='产品类型id(结束)'>{getFieldDecorator('end_producttypeid',{initialValue: this.props.list.queryMap.end_producttypeid  ? moment(this.props.list.queryMap.end_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='区域标识'>{getFieldDecorator('zone',{initialValue: this.props.list.queryMap.zone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品编号'>{getFieldDecorator('productid',{initialValue: this.props.list.queryMap.productid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品排序(起始)'>{getFieldDecorator('start_orderindex',{initialValue: this.props.list.queryMap.start_orderindex  ? moment(this.props.list.queryMap.start_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品排序(结束)'>{getFieldDecorator('end_orderindex',{initialValue: this.props.list.queryMap.end_orderindex  ? moment(this.props.list.queryMap.end_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品名称'>{getFieldDecorator('productname',{initialValue: this.props.list.queryMap.productname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品图片索引'>{getFieldDecorator('tagindex',{initialValue: this.props.list.queryMap.tagindex, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='剩余数量(起始)'>{getFieldDecorator('start_num',{initialValue: this.props.list.queryMap.start_num  ? moment(this.props.list.queryMap.start_num): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='剩余数量(结束)'>{getFieldDecorator('end_num',{initialValue: this.props.list.queryMap.end_num  ? moment(this.props.list.queryMap.end_num): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品描述'>{getFieldDecorator('productdes',{initialValue: this.props.list.queryMap.productdes, })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否显示实时视频(起始)'>{getFieldDecorator('start_ishowvideolink',{initialValue: this.props.list.queryMap.start_ishowvideolink  ? moment(this.props.list.queryMap.start_ishowvideolink): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否显示实时视频(结束)'>{getFieldDecorator('end_ishowvideolink',{initialValue: this.props.list.queryMap.end_ishowvideolink  ? moment(this.props.list.queryMap.end_ishowvideolink): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='视频链接'>{getFieldDecorator('videolink',{initialValue: this.props.list.queryMap.videolink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否审核过(起始)'>{getFieldDecorator('start_ispassed',{initialValue: this.props.list.queryMap.start_ispassed  ? moment(this.props.list.queryMap.start_ispassed): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否审核过(结束)'>{getFieldDecorator('end_ispassed',{initialValue: this.props.list.queryMap.end_ispassed  ? moment(this.props.list.queryMap.end_ispassed): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(起始)'>{getFieldDecorator('start_istop',{initialValue: this.props.list.queryMap.start_istop  ? moment(this.props.list.queryMap.start_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(结束)'>{getFieldDecorator('end_istop',{initialValue: this.props.list.queryMap.end_istop  ? moment(this.props.list.queryMap.end_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='门店标识'>{getFieldDecorator('shoptag',{initialValue: this.props.list.queryMap.shoptag, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否允许用户上传图片(起始)'>{getFieldDecorator('start_isneeduserpic',{initialValue: this.props.list.queryMap.start_isneeduserpic  ? moment(this.props.list.queryMap.start_isneeduserpic): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否允许用户上传图片(结束)'>{getFieldDecorator('end_isneeduserpic',{initialValue: this.props.list.queryMap.end_isneeduserpic  ? moment(this.props.list.queryMap.end_isneeduserpic): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否用户可留言(起始)'>{getFieldDecorator('start_isneeduserinfo',{initialValue: this.props.list.queryMap.start_isneeduserinfo  ? moment(this.props.list.queryMap.start_isneeduserinfo): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否用户可留言(结束)'>{getFieldDecorator('end_isneeduserinfo',{initialValue: this.props.list.queryMap.end_isneeduserinfo  ? moment(this.props.list.queryMap.end_isneeduserinfo): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否需要输入完整收货地址(起始)'>{getFieldDecorator('start_isneeduseraddress',{initialValue: this.props.list.queryMap.start_isneeduseraddress  ? moment(this.props.list.queryMap.start_isneeduseraddress): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否需要输入完整收货地址(结束)'>{getFieldDecorator('end_isneeduseraddress',{initialValue: this.props.list.queryMap.end_isneeduseraddress  ? moment(this.props.list.queryMap.end_isneeduseraddress): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否要填写桌号信息(起始)'>{getFieldDecorator('start_isneeddesktag',{initialValue: this.props.list.queryMap.start_isneeddesktag  ? moment(this.props.list.queryMap.start_isneeddesktag): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否要填写桌号信息(结束)'>{getFieldDecorator('end_isneeddesktag',{initialValue: this.props.list.queryMap.end_isneeddesktag  ? moment(this.props.list.queryMap.end_isneeddesktag): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否放到首页(起始)'>{getFieldDecorator('start_isatmain',{initialValue: this.props.list.queryMap.start_isatmain  ? moment(this.props.list.queryMap.start_isatmain): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否放到首页(结束)'>{getFieldDecorator('end_isatmain',{initialValue: this.props.list.queryMap.end_isatmain  ? moment(this.props.list.queryMap.end_isatmain): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='产品主图'>{getFieldDecorator('mainpic',{initialValue: this.props.list.queryMap.mainpic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
