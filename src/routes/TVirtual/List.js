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
import Importer from '../../components/Importer';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.TVirtual;
const routerUrl ='/TVirtual';
const url = 'TVirtual';
const rowKey = 't_virtual_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TVirtualList extends Component {
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
        filename: '虚拟物品.xls',
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
       {  title: '',   dataIndex: 't_virtual_id',     width: 150,     sorter: false,      },
 {  title: '虚拟物品类别id',   dataIndex: 'producttypeid',     width: 150,     sorter: false,      },
 {  title: '区域标识',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '虚拟物品编号',   dataIndex: 'productid',     width: 150,     sorter: false,      },
 {  title: '排序',   dataIndex: 'orderindex',     width: 150,     sorter: false,      },
 {  title: '虚拟物品名称',   dataIndex: 'productname',     width: 150,     sorter: false,      },
 {  title: '图片索引',   dataIndex: 'tagindex',     width: 150,     sorter: false,      },
 {  title: '虚拟产品描述',   dataIndex: 'productdes',     width: 150,     sorter: false,      },
 {  title: '虚拟产品链接',   dataIndex: 'virtuallink',     width: 150,     sorter: false,      },
 {  title: '价格',   dataIndex: 'price',     width: 150,     sorter: false,      },
 {  title: '是否显示增强描述',   dataIndex: 'isshowextendlink',     width: 150,     sorter: false,      },
 {  title: '增强描述链接',   dataIndex: 'extendlink',     width: 150,     sorter: false,      },
 {  title: '购买前的提示',   dataIndex: 'infobeforepaid',     width: 150,     sorter: false,      },
 {  title: '是否审核过',   dataIndex: 'ispassed',     width: 150,     sorter: false,      },
 {  title: '是否免费',   dataIndex: 'isfree',     width: 150,     sorter: false,      },
 {  title: '是否置顶',   dataIndex: 'istop',     width: 150,     sorter: false,      },
 {  title: '主图',   dataIndex: 'mainpic',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'extendtext',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'extendvidepic',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'extendvideourl',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'extendrotate',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'videourl',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'rotate',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'videpic',     width: 150,     sorter: false,      },
 {  title: '发布者的个人合作者账户',   dataIndex: 'accountprivate',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TVirtual/queryTVirtualList', // 必填,请求url
      scroll: { x: 4050, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_virtual_id',{initialValue: this.props.list.queryMap.t_virtual_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟物品类别id(起始)'>{getFieldDecorator('start_producttypeid',{initialValue: this.props.list.queryMap.start_producttypeid  ? moment(this.props.list.queryMap.start_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟物品类别id(结束)'>{getFieldDecorator('end_producttypeid',{initialValue: this.props.list.queryMap.end_producttypeid  ? moment(this.props.list.queryMap.end_producttypeid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='区域标识'>{getFieldDecorator('zone',{initialValue: this.props.list.queryMap.zone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟物品编号'>{getFieldDecorator('productid',{initialValue: this.props.list.queryMap.productid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='排序(起始)'>{getFieldDecorator('start_orderindex',{initialValue: this.props.list.queryMap.start_orderindex  ? moment(this.props.list.queryMap.start_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='排序(结束)'>{getFieldDecorator('end_orderindex',{initialValue: this.props.list.queryMap.end_orderindex  ? moment(this.props.list.queryMap.end_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟物品名称'>{getFieldDecorator('productname',{initialValue: this.props.list.queryMap.productname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='图片索引'>{getFieldDecorator('tagindex',{initialValue: this.props.list.queryMap.tagindex, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟产品描述'>{getFieldDecorator('productdes',{initialValue: this.props.list.queryMap.productdes, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='虚拟产品链接'>{getFieldDecorator('virtuallink',{initialValue: this.props.list.queryMap.virtuallink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否显示增强描述'>{getFieldDecorator('isshowextendlink',{initialValue: this.props.list.queryMap.isshowextendlink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='增强描述链接'>{getFieldDecorator('extendlink',{initialValue: this.props.list.queryMap.extendlink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='购买前的提示'>{getFieldDecorator('infobeforepaid',{initialValue: this.props.list.queryMap.infobeforepaid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否审核过(起始)'>{getFieldDecorator('start_ispassed',{initialValue: this.props.list.queryMap.start_ispassed  ? moment(this.props.list.queryMap.start_ispassed): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否审核过(结束)'>{getFieldDecorator('end_ispassed',{initialValue: this.props.list.queryMap.end_ispassed  ? moment(this.props.list.queryMap.end_ispassed): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否免费(起始)'>{getFieldDecorator('start_isfree',{initialValue: this.props.list.queryMap.start_isfree  ? moment(this.props.list.queryMap.start_isfree): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否免费(结束)'>{getFieldDecorator('end_isfree',{initialValue: this.props.list.queryMap.end_isfree  ? moment(this.props.list.queryMap.end_isfree): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(起始)'>{getFieldDecorator('start_istop',{initialValue: this.props.list.queryMap.start_istop  ? moment(this.props.list.queryMap.start_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(结束)'>{getFieldDecorator('end_istop',{initialValue: this.props.list.queryMap.end_istop  ? moment(this.props.list.queryMap.end_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='主图'>{getFieldDecorator('mainpic',{initialValue: this.props.list.queryMap.mainpic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('extendtext',{initialValue: this.props.list.queryMap.extendtext, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('extendvidepic',{initialValue: this.props.list.queryMap.extendvidepic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('extendvideourl',{initialValue: this.props.list.queryMap.extendvideourl, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('extendrotate',{initialValue: this.props.list.queryMap.extendrotate, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text',{initialValue: this.props.list.queryMap.text, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('videourl',{initialValue: this.props.list.queryMap.videourl, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('rotate',{initialValue: this.props.list.queryMap.rotate, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('videpic',{initialValue: this.props.list.queryMap.videpic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='发布者的个人合作者账户'>{getFieldDecorator('accountprivate',{initialValue: this.props.list.queryMap.accountprivate, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
                      <Operate operateName="import">
              <Importer
              style={{
              marginLeft: 8,
              color: '#fff',
              backgroundColor: '#f0ad4e',
              borderColor: '#eea236',
              }}
              reload={this.handleSearch}
              />
            </Operate>
                  <Operate operateName="export">
              <Button
              icon="export"
              type="primary"
                      style={{ marginLeft: 8 }}
                      loading={this.props.base.exporting}
                      onClick={this.handleExport}
              >
              导出
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
