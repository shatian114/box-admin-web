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
//const routerUrl = cache.keysMenu.TActivity;
const routerUrl ='/TActivity';
const url = 'TActivity';
const rowKey = 't_activity_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TActivityList extends Component {
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
        filename: '活动.xls',
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
       {  title: '',   dataIndex: 't_activity_id',     width: 150,     sorter: false,      },
 {  title: '名称',   dataIndex: 'activityname',     width: 150,     sorter: false,      },
 {  title: '描述',   dataIndex: 'activitydesc',     width: 150,     sorter: false,      },
 {  title: '图标索引标识',   dataIndex: 'tagindex',     width: 150,     sorter: false,      },
 {  title: '是否结束',   dataIndex: 'isover',     width: 150,     sorter: false,      },
 {  title: '发起人账户',   dataIndex: 'userid',     width: 150,     sorter: false,      },
 {  title: '预计举行时间',   dataIndex: 'plantime',     width: 150,     sorter: false,      },
 {  title: '期望总人数',   dataIndex: 'num',     width: 150,     sorter: false,      },
 {  title: '主图',   dataIndex: 'mainpic',     width: 150,     sorter: false,      },
 {  title: '地图位置',   dataIndex: 'maplink',     width: 150,     sorter: false,      },
 {  title: '区域标识',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'createtime',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'lng',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'lat',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'address',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TActivity/queryTActivityList', // 必填,请求url
      scroll: { x: 2400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_activity_id',{initialValue: this.props.list.queryMap.t_activity_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='名称'>{getFieldDecorator('activityname',{initialValue: this.props.list.queryMap.activityname, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='描述'>{getFieldDecorator('activitydesc',{initialValue: this.props.list.queryMap.activitydesc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='图标索引标识'>{getFieldDecorator('tagindex',{initialValue: this.props.list.queryMap.tagindex, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否结束(起始)'>{getFieldDecorator('start_isover',{initialValue: this.props.list.queryMap.start_isover  ? moment(this.props.list.queryMap.start_isover): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否结束(结束)'>{getFieldDecorator('end_isover',{initialValue: this.props.list.queryMap.end_isover  ? moment(this.props.list.queryMap.end_isover): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='发起人账户'>{getFieldDecorator('userid',{initialValue: this.props.list.queryMap.userid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='预计举行时间'>{getFieldDecorator('plantime',{initialValue: this.props.list.queryMap.plantime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='期望总人数(起始)'>{getFieldDecorator('start_num',{initialValue: this.props.list.queryMap.start_num  ? moment(this.props.list.queryMap.start_num): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='期望总人数(结束)'>{getFieldDecorator('end_num',{initialValue: this.props.list.queryMap.end_num  ? moment(this.props.list.queryMap.end_num): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='主图'>{getFieldDecorator('mainpic',{initialValue: this.props.list.queryMap.mainpic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地图位置'>{getFieldDecorator('maplink',{initialValue: this.props.list.queryMap.maplink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='区域标识'>{getFieldDecorator('zone',{initialValue: this.props.list.queryMap.zone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间'>{getFieldDecorator('createtime',{initialValue: this.props.list.queryMap.createtime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('lng',{initialValue: this.props.list.queryMap.lng, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('lat',{initialValue: this.props.list.queryMap.lat, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('address',{initialValue: this.props.list.queryMap.address, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
