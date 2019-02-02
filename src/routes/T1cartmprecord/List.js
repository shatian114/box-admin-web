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

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.T1cartmprecord;
const routerUrl ='/T1cartmprecord';
const url = 'T1cartmprecord';
const rowKey = 't_1cartmprecord_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class T1cartmprecordList extends Component {
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
    e.preventDefault();
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
       {  title: '记录ID',   dataIndex: 't_1cartmprecord_id',     width: 150,     sorter: false,      },
 {  title: '门岗硬件标识',   dataIndex: 'stopdevicetag',     width: 150,     sorter: false,      },
 {  title: '车牌号',   dataIndex: 'carcode',     width: 150,     sorter: false,      },
 {  title: '车辆图片链接，暂时不用管理',   dataIndex: 'piclink',     width: 150,     sorter: false,      },
 {  title: '进入时间',   dataIndex: 'intime',     width: 150,     sorter: false,      },
 {  title: '进门的门岗标识',   dataIndex: 'instopdevicetag',     width: 150,     sorter: false,      },
 {  title: '出去时间',   dataIndex: 'outime',     width: 150,     sorter: false,      },
 {  title: '是否需要收费',   dataIndex: 'isneedfee',     width: 150,     sorter: false,      },
 {  title: '收费总额',   dataIndex: 'howmuch',     width: 150,     sorter: false,      },
 {  title: '商户订单号',   dataIndex: 'seq',     width: 150,     sorter: false,      },
 {  title: '用户标识',   dataIndex: 'userid',     width: 150,     sorter: false,      },
 {  title: '是否成功缴费',   dataIndex: 'ispaid',     width: 150,     sorter: false,      },
 {  title: '缴费时间',   dataIndex: 'paidtime',     width: 150,     sorter: false,      },
 {  title: '车闸系统最后一次报文时间',   dataIndex: 'requesttime',     width: 150,     sorter: false,      },
 {  title: '其他信息',   dataIndex: 'otherinfo',     width: 150,     sorter: false,      },
 {  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },

    ];

    const listConfig = {
      url: '/api/T1cartmprecord/queryT1cartmprecordList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='记录ID'>{getFieldDecorator('t_1cartmprecord_id',{initialValue: this.props.list.queryMap.t_1cartmprecord_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='门岗硬件标识'>{getFieldDecorator('stopdevicetag',{initialValue: this.props.list.queryMap.stopdevicetag, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车牌号'>{getFieldDecorator('carcode',{initialValue: this.props.list.queryMap.carcode, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车辆图片链接，暂时不用管理'>{getFieldDecorator('piclink',{initialValue: this.props.list.queryMap.piclink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='进入时间'>{getFieldDecorator('intime',{initialValue: this.props.list.queryMap.intime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='进门的门岗标识'>{getFieldDecorator('instopdevicetag',{initialValue: this.props.list.queryMap.instopdevicetag, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='出去时间'>{getFieldDecorator('outime',{initialValue: this.props.list.queryMap.outime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否需要收费(起始)'>{getFieldDecorator('start_isneedfee',{initialValue: this.props.list.queryMap.start_isneedfee  ? moment(this.props.list.queryMap.start_isneedfee): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否需要收费(结束)'>{getFieldDecorator('end_isneedfee',{initialValue: this.props.list.queryMap.end_isneedfee  ? moment(this.props.list.queryMap.end_isneedfee): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='商户订单号'>{getFieldDecorator('seq',{initialValue: this.props.list.queryMap.seq, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='用户标识'>{getFieldDecorator('userid',{initialValue: this.props.list.queryMap.userid, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否成功缴费(起始)'>{getFieldDecorator('start_ispaid',{initialValue: this.props.list.queryMap.start_ispaid  ? moment(this.props.list.queryMap.start_ispaid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='是否成功缴费(结束)'>{getFieldDecorator('end_ispaid',{initialValue: this.props.list.queryMap.end_ispaid  ? moment(this.props.list.queryMap.end_ispaid): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='缴费时间'>{getFieldDecorator('paidtime',{initialValue: this.props.list.queryMap.paidtime, })(<Input placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车闸系统最后一次报文时间(起始)'>{getFieldDecorator('start_requesttime',{initialValue: this.props.list.queryMap.start_requesttime  ? moment(this.props.list.queryMap.start_requesttime): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='车闸系统最后一次报文时间(结束)'>{getFieldDecorator('end_requesttime',{initialValue: this.props.list.queryMap.end_requesttime  ? moment(this.props.list.queryMap.end_requesttime): null, })
 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='其他信息'>{getFieldDecorator('otherinfo',{initialValue: this.props.list.queryMap.otherinfo, })(<Input placeholder='请输入' />)} </FormItem> </Col>
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
