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
const url = 'T1kaimentongji';

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
           <FormItem {...formItemLayout} hasFeedback label="序号">
{getFieldDecorator('t1kaimentongjiId', {
 initialValue: info.t1kaimentongjiId || newInfo.t1kaimentongjiId,
  rules: [
    {
      required: true,
      message: '序号不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="市">
{getFieldDecorator('shi', {
 initialValue: info.shi ||  newInfo.shi,
  rules: [
    {
      required: true,
      message: '市不能缺失!',
    },{ max: 255,message: '市必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区">
{getFieldDecorator('qu', {
 initialValue: info.qu ||  newInfo.qu,
  rules: [
    {
      required: true,
      message: '区不能缺失!',
    },{ max: 255,message: '区必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区名称">
{getFieldDecorator('xqmc', {
 initialValue: info.xqmc ||  newInfo.xqmc,
  rules: [
    {
      required: true,
      message: '小区名称不能缺失!',
    },{ max: 255,message: '小区名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="房屋总数">
{getFieldDecorator('fwzs', {
 initialValue: info.fwzs ||  newInfo.fwzs,
  rules: [
    {
      required: true,
      message: '房屋总数不能缺失!',
    },{ max: 255,message: '房屋总数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="掌上开门使用占比">
{getFieldDecorator('sybl', {
 initialValue: info.sybl ||  newInfo.sybl,
  rules: [
    {
      required: true,
      message: '掌上开门使用占比不能缺失!',
    },{ max: 255,message: '掌上开门使用占比必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户数">
{getFieldDecorator('yhs', {
 initialValue: info.yhs ||  newInfo.yhs,
  rules: [
    {
      required: true,
      message: '用户数不能缺失!',
    },{ max: 255,message: '用户数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="每周开门次数">
{getFieldDecorator('kmcs', {
 initialValue: info.kmcs ||  newInfo.kmcs,
  rules: [
    {
      required: true,
      message: '每周开门次数不能缺失!',
    },{ max: 255,message: '每周开门次数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="绑定设备数">
{getFieldDecorator('sbs', {
 initialValue: info.sbs ||  newInfo.sbs,
  rules: [
    {
      required: true,
      message: '绑定设备数不能缺失!',
    },{ max: 255,message: '绑定设备数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="广告投放率">
{getFieldDecorator('ggbl', {
 initialValue: info.ggbl ||  newInfo.ggbl,
  rules: [
    {
      required: true,
      message: '广告投放率不能缺失!',
    },{ max: 255,message: '广告投放率必须小于255位!',   },
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
