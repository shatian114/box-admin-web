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
const url = 'TUserwx';

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
{getFieldDecorator('ID', {
 initialValue: info.ID || newInfo.ID,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="账户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '账户不能缺失!',
    },{ max: 60,message: '账户必须小于60位!',   },
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
    },{ max: 50,message: '昵称必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="头像">
{getFieldDecorator('piclink', {
 initialValue: info.piclink ||  newInfo.piclink,
  rules: [
    {
      required: true,
      message: '头像不能缺失!',
    },{ max: 500,message: '头像必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="版本号">
{getFieldDecorator('ver', {
 initialValue: info.ver ||  newInfo.ver,
  rules: [
    {
      required: true,
      message: '版本号不能缺失!',
    },{ max: 30,message: '版本号必须小于30位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="系统时间戳,,无用">
{getFieldDecorator('tTimeinfo', {
 initialValue: info.tTimeinfo ||  newInfo.tTimeinfo,
  rules: [
    {
      required: true,
      message: '系统时间戳,,无用不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="客户端ip">
{getFieldDecorator('ip', {
 initialValue: info.ip ||  newInfo.ip,
  rules: [
    {
      required: true,
      message: '客户端ip不能缺失!',
    },{ max: 255,message: '客户端ip必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="所在区域">
{getFieldDecorator('zone', {
 initialValue: info.zone ||  newInfo.zone,
  rules: [
    {
      required: true,
      message: '所在区域不能缺失!',
    },{ max: 255,message: '所在区域必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="真实姓名">
{getFieldDecorator('realname', {
 initialValue: info.realname ||  newInfo.realname,
  rules: [
    {
      required: true,
      message: '真实姓名不能缺失!',
    },{ max: 255,message: '真实姓名必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="手机号">
{getFieldDecorator('mobilephone', {
 initialValue: info.mobilephone ||  newInfo.mobilephone,
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
    },{ max: 100,message: '邮箱必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收货地址">
{getFieldDecorator('address', {
 initialValue: info.address ||  newInfo.address,
  rules: [
    {
      required: true,
      message: '收货地址不能缺失!',
    },{ max: 255,message: '收货地址必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="红包余额">
{getFieldDecorator('leftmoney', {
 initialValue: info.leftmoney ||  newInfo.leftmoney,
  rules: [
    {
      required: true,
      message: '红包余额不能缺失!',
    },{ required: true,message: '红包余额不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收款方式，银行卡或者支付宝之类，红包提现用">
{getFieldDecorator('bankaccount', {
 initialValue: info.bankaccount ||  newInfo.bankaccount,
  rules: [
    {
      required: true,
      message: '收款方式，银行卡或者支付宝之类，红包提现用不能缺失!',
    },{ max: 255,message: '收款方式，银行卡或者支付宝之类，红包提现用必须小于255位!',   },
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
    },{ max: 100,message: '微信必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否开放联系方式 0永不 1直接开放  2 根据红包决定">
{getFieldDecorator('ishowcontactduetoredmoney', {
 initialValue: info.ishowcontactduetoredmoney ||  newInfo.ishowcontactduetoredmoney,
  rules: [
    {
      required: true,
      message: '是否开放联系方式 0永不 1直接开放  2 根据红包决定不能缺失!',
    },{ required: true,message: '是否开放联系方式 0永不 1直接开放  2 根据红包决定不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收到某人至少多少红包才对他开放联系方式">
{getFieldDecorator('atleasthowmuchredmoney', {
 initialValue: info.atleasthowmuchredmoney ||  newInfo.atleasthowmuchredmoney,
  rules: [
    {
      required: true,
      message: '收到某人至少多少红包才对他开放联系方式不能缺失!',
    },{ required: true,message: '收到某人至少多少红包才对他开放联系方式不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="QQ">
{getFieldDecorator('qq', {
 initialValue: info.qq ||  newInfo.qq,
  rules: [
    {
      required: true,
      message: 'QQ不能缺失!',
    },{ max: 255,message: 'QQ必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="固定区域">
{getFieldDecorator('fixedzone', {
 initialValue: info.fixedzone ||  newInfo.fixedzone,
  rules: [
    {
      required: true,
      message: '固定区域不能缺失!',
    },{ max: 255,message: '固定区域必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="第一次登陆时间">
{getFieldDecorator('regtime', {
 initialValue: info.regtime ||  newInfo.regtime,
  rules: [
    {
      required: true,
      message: '第一次登陆时间不能缺失!',
    },{ max: 255,message: '第一次登陆时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="最后一次登录时间">
{getFieldDecorator('logontime', {
 initialValue: info.logontime ||  newInfo.logontime,
  rules: [
    {
      required: true,
      message: '最后一次登录时间不能缺失!',
    },{ max: 255,message: '最后一次登录时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="经度">
{getFieldDecorator('lng', {
 initialValue: info.lng ||  newInfo.lng,
  rules: [
    {
      required: true,
      message: '经度不能缺失!',
    },{ max: 30,message: '经度必须小于30位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="纬度">
{getFieldDecorator('lat', {
 initialValue: info.lat ||  newInfo.lat,
  rules: [
    {
      required: true,
      message: '纬度不能缺失!',
    },{ max: 30,message: '纬度必须小于30位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="详细位置">
{getFieldDecorator('addressdetail', {
 initialValue: info.addressdetail ||  newInfo.addressdetail,
  rules: [
    {
      required: true,
      message: '详细位置不能缺失!',
    },{ max: 100,message: '详细位置必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('lasttimeinfo', {
 initialValue: info.lasttimeinfo ||  newInfo.lasttimeinfo,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 50,message: '必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('videosecond', {
 initialValue: info.videosecond ||  newInfo.videosecond,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ required: true,message: '不能缺失!', },
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
