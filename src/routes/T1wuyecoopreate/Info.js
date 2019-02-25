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
const url = 'T1wuyecoopreate';

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
           <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('t1wuyecoopreateId', {
 initialValue: info.t1wuyecoopreateId || newInfo.t1wuyecoopreateId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="id：这个不用系统生成，手工设定，长度是6位数字">
{getFieldDecorator('uniqueID', {
 initialValue: info.uniqueID ||  newInfo.uniqueID,
  rules: [
    {
      required: true,
      message: 'id：这个不用系统生成，手工设定，长度是6位数字不能缺失!',
    },{ max: 255,message: 'id：这个不用系统生成，手工设定，长度是6位数字必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="密码">
{getFieldDecorator('password', {
 initialValue: info.password ||  newInfo.password,
  rules: [
    {
      required: true,
      message: '密码不能缺失!',
    },{ max: 255,message: '密码必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="手机号">
{getFieldDecorator('mobile', {
 initialValue: info.mobile ||  newInfo.mobile,
  rules: [
    {
      required: true,
      message: '手机号不能缺失!',
    },{ max: 255,message: '手机号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="邮箱">
{getFieldDecorator('email', {
 initialValue: info.email ||  newInfo.email,
  rules: [
    {
      required: true,
      message: '邮箱不能缺失!',
    },{ max: 255,message: '邮箱必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="昵称">
{getFieldDecorator('nickname', {
 initialValue: info.nickname ||  newInfo.nickname,
  rules: [
    {
      required: true,
      message: '昵称不能缺失!',
    },{ max: 255,message: '昵称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="头像">
{getFieldDecorator('picklink', {
 initialValue: info.picklink ||  newInfo.picklink,
  rules: [
    {
      required: true,
      message: '头像不能缺失!',
    },{ max: 255,message: '头像必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="注册时间">
{getFieldDecorator('regtime', {
 initialValue: info.regtime ||  newInfo.regtime,
  rules: [
    {
      required: true,
      message: '注册时间不能缺失!',
    },{ max: 255,message: '注册时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="登录ip">
{getFieldDecorator('ip', {
 initialValue: info.ip ||  newInfo.ip,
  rules: [
    {
      required: true,
      message: '登录ip不能缺失!',
    },{ max: 255,message: '登录ip必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="qq">
{getFieldDecorator('qq', {
 initialValue: info.qq ||  newInfo.qq,
  rules: [
    {
      required: true,
      message: 'qq不能缺失!',
    },{ max: 255,message: 'qq必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="微信">
{getFieldDecorator('weixin', {
 initialValue: info.weixin ||  newInfo.weixin,
  rules: [
    {
      required: true,
      message: '微信不能缺失!',
    },{ max: 255,message: '微信必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物业id，可多个">
{getFieldDecorator('wyid', {
 initialValue: info.wyid ||  newInfo.wyid,
  rules: [
    {
      required: true,
      message: '物业id，可多个不能缺失!',
    },{ max: 255,message: '物业id，可多个必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区id，可多个">
{getFieldDecorator('xiaoquid', {
 initialValue: info.xiaoquid ||  newInfo.xiaoquid,
  rules: [
    {
      required: true,
      message: '小区id，可多个不能缺失!',
    },{ max: 255,message: '小区id，可多个必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="状态">
{getFieldDecorator('isnormal', {
 initialValue: info.isnormal ||  newInfo.isnormal,
  rules: [
    {
      required: true,
      message: '状态不能缺失!',
    },{ required: true,message: '状态不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
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
