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
const url = 'T1cartmprecord';

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
{getFieldDecorator('t1cartmprecordId', {
 initialValue: info.t1cartmprecordId || newInfo.t1cartmprecordId,
  rules: [
    {
      required: true,
      message: '记录ID不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门岗硬件标识">
{getFieldDecorator('stopdevicetag', {
 initialValue: info.stopdevicetag ||  newInfo.stopdevicetag,
  rules: [
    {
      required: true,
      message: '门岗硬件标识不能缺失!',
    },{ max: 255,message: '门岗硬件标识必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="车牌号">
{getFieldDecorator('carcode', {
 initialValue: info.carcode ||  newInfo.carcode,
  rules: [
    {
      required: true,
      message: '车牌号不能缺失!',
    },{ max: 255,message: '车牌号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="车辆图片链接，暂时不用管理">
{getFieldDecorator('piclink', {
 initialValue: info.piclink ||  newInfo.piclink,
  rules: [
    {
      required: true,
      message: '车辆图片链接，暂时不用管理不能缺失!',
    },{ max: 255,message: '车辆图片链接，暂时不用管理必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="进入时间">
{getFieldDecorator('intime', {
 initialValue: info.intime ||  newInfo.intime,
  rules: [
    {
      required: true,
      message: '进入时间不能缺失!',
    },{ max: 255,message: '进入时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="进门的门岗标识">
{getFieldDecorator('instopdevicetag', {
 initialValue: info.instopdevicetag ||  newInfo.instopdevicetag,
  rules: [
    {
      required: true,
      message: '进门的门岗标识不能缺失!',
    },{ max: 255,message: '进门的门岗标识必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="出去时间">
{getFieldDecorator('outime', {
 initialValue: info.outime ||  newInfo.outime,
  rules: [
    {
      required: true,
      message: '出去时间不能缺失!',
    },{ max: 255,message: '出去时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否需要收费">
{getFieldDecorator('isneedfee', {
 initialValue: info.isneedfee ||  newInfo.isneedfee,
  rules: [
    {
      required: true,
      message: '是否需要收费不能缺失!',
    },{ required: true,message: '是否需要收费不能缺失!', },
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
    },{ required: true,message: '收费总额不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
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
 <FormItem {...formItemLayout} hasFeedback label="车闸系统最后一次报文时间">
{getFieldDecorator('requesttime', {
 initialValue: info.requesttime ||  newInfo.requesttime,
  rules: [
    {
      required: true,
      message: '车闸系统最后一次报文时间不能缺失!',
    },{ required: true,message: '车闸系统最后一次报文时间不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="其他信息">
{getFieldDecorator('otherinfo', {
 initialValue: info.otherinfo ||  newInfo.otherinfo,
  rules: [
    {
      required: true,
      message: '其他信息不能缺失!',
    },{ max: 100,message: '其他信息必须小于100位!',   },
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
