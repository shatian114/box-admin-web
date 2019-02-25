/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Spin, Select,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'T1carfixedpayrecord';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 10, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: 'base/new',
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         let temp = {};
        

        const { dispatch } = this.props;
        if (this.props.base.info.id) {
          dispatch({
            type: 'base/fetch',
            payload: {
              ...values,
                  ...temp,
            },
            callback: () => dispatch(routerRedux.goBack()),
            url,
          });
        } else {
          dispatch({
            type: 'base/fetchAdd',
            payload: {
              ...this.props.base.newInfo,
              ...values,
                  ...temp,
            },
            callback: () => dispatch(routerRedux.goBack()),
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="记录ID">
{getFieldDecorator('t1carfixedpayrecordId', {
 initialValue: info.t1carfixedpayrecordId || newInfo.t1carfixedpayrecordId,
  rules: [
    {
      required: true,
      message: '记录ID不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="固定车id">
{getFieldDecorator('fixedcarid', {
 initialValue: info.fixedcarid ||  newInfo.fixedcarid,
  rules: [
    {
      required: true,
      message: '固定车id不能缺失!',
    },{ required: true,message: '固定车id不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label=" 固定车套餐规则id">
{getFieldDecorator('fixedcarpriceruleid', {
 initialValue: info.fixedcarpriceruleid ||  newInfo.fixedcarpriceruleid,
  rules: [
    {
      required: true,
      message: ' 固定车套餐规则id不能缺失!',
    },{ required: true,message: ' 固定车套餐规则id不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收费总额">
{getFieldDecorator('howmuch', {
 initialValue: info.howmuch ||  newInfo.howmuch,
  rules: [
    {
      required: true,
      message: '收费总额不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商户订单号">
{getFieldDecorator('seq', {
 initialValue: info.seq ||  newInfo.seq,
  rules: [
    {
      required: true,
      message: '商户订单号不能缺失!',
    },{ max: 255,message: '商户订单号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户标识">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '用户标识不能缺失!',
    },{ max: 255,message: '用户标识必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否成功缴费">
{getFieldDecorator('ispaid', {
 initialValue: info.ispaid ||  newInfo.ispaid,
  rules: [
    {
      required: true,
      message: '是否成功缴费不能缺失!',
    },{ required: true,message: '是否成功缴费不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="缴费时间">
{getFieldDecorator('paidtime', {
 initialValue: info.paidtime ||  newInfo.paidtime,
  rules: [
    {
      required: true,
      message: '缴费时间不能缺失!',
    },{ max: 255,message: '缴费时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>

          
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              返回
            </Button>
            <Operate operateName="SAVE">
              <Button
                style={{ marginLeft: 12 }}
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                保存
              </Button>
            </Operate>
          </FormItem>
        </Form>
      </Spin>
    );
  }
}
