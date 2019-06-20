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
import { isEmpty, viewBoolean } from '../../utils/utils';
import { formItemLayout, formItemGrid } from '../../utils/Constant';
import cache from '../../utils/cache';
import ListButtonGroup from '../../components/ListButtonGroup';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TProduct;
const routerUrl ='/TProduct';
const url = 'TProduct';
const rowKey = 't_product_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TProductList extends Component {
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
        filename: '实物商品.xls',
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
       {  title: '产品id',   dataIndex: 't_product_id',     width: 150,     sorter: false,      },
 {  title: '产品类型id',   dataIndex: 'producttypeid',     width: 150,     sorter: false,      },
 {  title: '区域标识',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '商品编号',   dataIndex: 'productid',     width: 150,     sorter: false,      },
 {  title: '商品排序',   dataIndex: 'orderindex',     width: 150,     sorter: false,      },
 {  title: '商品名称',   dataIndex: 'productname',     width: 150,     sorter: false,      },
 {  title: '产品主图',   dataIndex: 'mainpic',     width: 150,     sorter: false,   render: (val, record, index) => (
   <img src={val} width={80} height={80} alt="暂无图片" />
 )   },
 {  title: '商品图片索引',   dataIndex: 'tagindex',     width: 450,     sorter: false,   render: (val, record, index) => {
    let indexImgArr = [];
    if(val) {
      indexImgArr = val.split(",");
    }
    return <img src={indexImgArr[0]} width={80} height={80} alt="暂无图片" />
  }   },
 {  title: '剩余数量',   dataIndex: 'num',     width: 150,     sorter: false,      },
 {  title: '商品描述',   dataIndex: 'productdes',     width: 150,     sorter: false,      },
 {  title: '支付的费用',   dataIndex: 'price',     width: 150,     sorter: false,      },
 {  title: '是否显示实时视频',   dataIndex: 'ishowvideolink',     width: 150,     sorter: false,   render: viewBoolean   },
 {  title: '视频链接',   dataIndex: 'videolink',     width: 150,     sorter: false,   render: (val, record, index) => (
   <a href={val} target="_blank">查看视频</a>
    )   },
 {  title: '是否审核过',   dataIndex: 'ispassed',     width: 150,     sorter: false,       render: viewBoolean  },
 {  title: '是否置顶',   dataIndex: 'istop',     width: 150,     sorter: false,      render: viewBoolean   },
 {  title: '门店标识',   dataIndex: 'shoptag',     width: 150,     sorter: false,      },
 {  title: '是否允许用户上传图片',   dataIndex: 'isneeduserpic',     width: 180,     sorter: false,      render: viewBoolean   },
 {  title: '是否用户可留言',   dataIndex: 'isneeduserinfo',     width: 150,     sorter: false,      render: viewBoolean   },
 {  title: '是否需要输入完整收货地址',   dataIndex: 'isneeduseraddress',     width: 180,     sorter: false,      render: viewBoolean   },
 {  title: '是否要填写桌号信息',   dataIndex: 'isneeddesktag',     width: 150,     sorter: false,      render: viewBoolean   },
 {  title: '是否放到首页',   dataIndex: 'isatmain',     width: 150,     sorter: false,     render: viewBoolean    },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TProduct/queryTProductList', // 必填,请求url
      scroll: { x: 3660, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='产品类型id(起始)'>{getFieldDecorator('start_producttypeid',{initialValue: this.props.list.queryMap.start_producttypeid  ? moment(this.props.list.queryMap.start_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='产品类型id(结束)'>{getFieldDecorator('end_producttypeid',{initialValue: this.props.list.queryMap.end_producttypeid  ? moment(this.props.list.queryMap.end_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品编号'>{getFieldDecorator('productid',{initialValue: this.props.list.queryMap.productid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商品名称'>{getFieldDecorator('productname',{initialValue: this.props.list.queryMap.productname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='剩余数量(起始)'>{getFieldDecorator('start_num',{initialValue: this.props.list.queryMap.start_num  ? moment(this.props.list.queryMap.start_num): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='剩余数量(结束)'>{getFieldDecorator('end_num',{initialValue: this.props.list.queryMap.end_num  ? moment(this.props.list.queryMap.end_num): null, })
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
