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
//const routerUrl = cache.keysMenu.TVer;
const routerUrl ='/TVer';
const url = 'TVer';
const rowKey = 't_ver_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TVerList extends Component {
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
        filename: 't_ver.xls',
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
       {  title: '',   dataIndex: 't_ver_id',     width: 150,     sorter: false,      },
 {  title: '版本号',   dataIndex: 'ver',     width: 150,     sorter: false,      },
 {  title: '是否送审',   dataIndex: 'isreview',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'function',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text1',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text2',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text3',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text4',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'text5',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'showtextonmain',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'textonmain',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refreshbannersign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refreshbbssign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refresharroundsign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refreshmainsign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refreshrealsign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'refreshvirtualsign',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havaactivity',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havatalk',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havafabu',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havafabuvideo',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havapromise',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havecomment',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'haveredmnoney',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havezone',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have11',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have12',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have13',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have21',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have22',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'have23',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havemine',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havemarket',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havevitrual',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'havearrount',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TVer/queryTVerList', // 必填,请求url
      scroll: { x: 5400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_ver_id',{initialValue: this.props.list.queryMap.t_ver_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='版本号'>{getFieldDecorator('ver',{initialValue: this.props.list.queryMap.ver, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否送审(起始)'>{getFieldDecorator('start_isreview',{initialValue: this.props.list.queryMap.start_isreview  ? moment(this.props.list.queryMap.start_isreview): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否送审(结束)'>{getFieldDecorator('end_isreview',{initialValue: this.props.list.queryMap.end_isreview  ? moment(this.props.list.queryMap.end_isreview): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('function',{initialValue: this.props.list.queryMap.function, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text1',{initialValue: this.props.list.queryMap.text1, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text2',{initialValue: this.props.list.queryMap.text2, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text3',{initialValue: this.props.list.queryMap.text3, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text4',{initialValue: this.props.list.queryMap.text4, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('text5',{initialValue: this.props.list.queryMap.text5, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('showtextonmain',{initialValue: this.props.list.queryMap.showtextonmain, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('textonmain',{initialValue: this.props.list.queryMap.textonmain, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refreshbannersign',{initialValue: this.props.list.queryMap.refreshbannersign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refreshbbssign',{initialValue: this.props.list.queryMap.refreshbbssign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refresharroundsign',{initialValue: this.props.list.queryMap.refresharroundsign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refreshmainsign',{initialValue: this.props.list.queryMap.refreshmainsign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refreshrealsign',{initialValue: this.props.list.queryMap.refreshrealsign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('refreshvirtualsign',{initialValue: this.props.list.queryMap.refreshvirtualsign, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havaactivity',{initialValue: this.props.list.queryMap.havaactivity, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havatalk',{initialValue: this.props.list.queryMap.havatalk, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havafabu',{initialValue: this.props.list.queryMap.havafabu, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havafabuvideo',{initialValue: this.props.list.queryMap.havafabuvideo, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havapromise',{initialValue: this.props.list.queryMap.havapromise, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havecomment',{initialValue: this.props.list.queryMap.havecomment, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('haveredmnoney',{initialValue: this.props.list.queryMap.haveredmnoney, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havezone',{initialValue: this.props.list.queryMap.havezone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have11',{initialValue: this.props.list.queryMap.have11, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have12',{initialValue: this.props.list.queryMap.have12, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have13',{initialValue: this.props.list.queryMap.have13, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have21',{initialValue: this.props.list.queryMap.have21, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have22',{initialValue: this.props.list.queryMap.have22, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('have23',{initialValue: this.props.list.queryMap.have23, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havemine',{initialValue: this.props.list.queryMap.havemine, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havemarket',{initialValue: this.props.list.queryMap.havemarket, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havevitrual',{initialValue: this.props.list.queryMap.havevitrual, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('havearrount',{initialValue: this.props.list.queryMap.havearrount, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
