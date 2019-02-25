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
//const routerUrl = cache.keysMenu.TBbs;
const routerUrl ='/TBbs';
const url = 'TBbs';
const rowKey = 't_bbs_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class TBbsList extends Component {
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
        filename: '论坛信息.xls',
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
       {  title: '',   dataIndex: 't_bbs_id',     width: 150,     sorter: false,      },
 {  title: '发帖者账户',   dataIndex: 'userid',     width: 150,     sorter: false,      },
 {  title: '帖子文本',   dataIndex: 'text',     width: 150,     sorter: false,      },
 {  title: '帖子图片索引: 在另外一个表t_picture 根据tagindex 有关联url',   dataIndex: 'tagindex',     width: 150,     sorter: false,      },
 {  title: '发布时间',   dataIndex: 'timeinfo',     width: 150,     sorter: false,      },
 {  title: '帖子类型:文字类，比如分享 晒单等',   dataIndex: 'cardtype',     width: 150,     sorter: false,      },
 {  title: '是否删除',   dataIndex: 'deletehava',     width: 150,     sorter: false,      },
 {  title: '发帖者ip',   dataIndex: 'ip',     width: 150,     sorter: false,      },
 {  title: '是否视频类帖子',   dataIndex: 'isvideo',     width: 150,     sorter: false,      },
 {  title: '视频缩略图',   dataIndex: 'videopic',     width: 150,     sorter: false,      },
 {  title: '视频链接',   dataIndex: 'videolink',     width: 150,     sorter: false,      },
 {  title: '区域标识',   dataIndex: 'zone',     width: 150,     sorter: false,      },
 {  title: '排序',   dataIndex: 'orderindex',     width: 150,     sorter: false,      },
 {  title: '是否置顶',   dataIndex: 'istop',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'rotate',     width: 150,     sorter: false,      },
 {  title: '',   dataIndex: 'good',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/TBbs/queryTBbsList', // 必填,请求url
      scroll: { x: 2550, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('t_bbs_id',{initialValue: this.props.list.queryMap.t_bbs_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='发帖者账户'>{getFieldDecorator('userid',{initialValue: this.props.list.queryMap.userid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='帖子文本'>{getFieldDecorator('text',{initialValue: this.props.list.queryMap.text, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='帖子图片索引: 在另外一个表t_picture 根据tagindex 有关联url'>{getFieldDecorator('tagindex',{initialValue: this.props.list.queryMap.tagindex, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='发布时间'>{getFieldDecorator('timeinfo',{initialValue: this.props.list.queryMap.timeinfo, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='帖子类型:文字类，比如分享 晒单等'>{getFieldDecorator('cardtype',{initialValue: this.props.list.queryMap.cardtype, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否删除(起始)'>{getFieldDecorator('start_deletehava',{initialValue: this.props.list.queryMap.start_deletehava  ? moment(this.props.list.queryMap.start_deletehava): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否删除(结束)'>{getFieldDecorator('end_deletehava',{initialValue: this.props.list.queryMap.end_deletehava  ? moment(this.props.list.queryMap.end_deletehava): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='发帖者ip'>{getFieldDecorator('ip',{initialValue: this.props.list.queryMap.ip, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否视频类帖子(起始)'>{getFieldDecorator('start_isvideo',{initialValue: this.props.list.queryMap.start_isvideo  ? moment(this.props.list.queryMap.start_isvideo): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否视频类帖子(结束)'>{getFieldDecorator('end_isvideo',{initialValue: this.props.list.queryMap.end_isvideo  ? moment(this.props.list.queryMap.end_isvideo): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='视频缩略图'>{getFieldDecorator('videopic',{initialValue: this.props.list.queryMap.videopic, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='视频链接'>{getFieldDecorator('videolink',{initialValue: this.props.list.queryMap.videolink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='区域标识'>{getFieldDecorator('zone',{initialValue: this.props.list.queryMap.zone, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='排序(起始)'>{getFieldDecorator('start_orderindex',{initialValue: this.props.list.queryMap.start_orderindex  ? moment(this.props.list.queryMap.start_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='排序(结束)'>{getFieldDecorator('end_orderindex',{initialValue: this.props.list.queryMap.end_orderindex  ? moment(this.props.list.queryMap.end_orderindex): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(起始)'>{getFieldDecorator('start_istop',{initialValue: this.props.list.queryMap.start_istop  ? moment(this.props.list.queryMap.start_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否置顶(结束)'>{getFieldDecorator('end_istop',{initialValue: this.props.list.queryMap.end_istop  ? moment(this.props.list.queryMap.end_istop): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label=''>{getFieldDecorator('rotate',{initialValue: this.props.list.queryMap.rotate, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(起始)'>{getFieldDecorator('start_good',{initialValue: this.props.list.queryMap.start_good  ? moment(this.props.list.queryMap.start_good): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='(结束)'>{getFieldDecorator('end_good',{initialValue: this.props.list.queryMap.end_good  ? moment(this.props.list.queryMap.end_good): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
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
