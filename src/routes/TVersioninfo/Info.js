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
const url = 'TVersioninfo';

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
{getFieldDecorator('tVersioninfoId', {
 initialValue: info.tVersioninfoId || newInfo.tVersioninfoId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="版本号">
{getFieldDecorator('ver', {
 initialValue: info.ver ||  newInfo.ver,
  rules: [
    {
      required: true,
      message: '版本号不能缺失!',
    },{ max: 255,message: '版本号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否送审">
{getFieldDecorator('isreview', {
 initialValue: info.isreview ||  newInfo.isreview,
  rules: [
    {
      required: true,
      message: '是否送审不能缺失!',
    },{ required: true,message: '是否送审不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="客户端描述">
{getFieldDecorator('strappdes', {
 initialValue: info.strappdes ||  newInfo.strappdes,
  rules: [
    {
      required: true,
      message: '客户端描述不能缺失!',
    },{ max: 255,message: '客户端描述必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="导航图片1">
{getFieldDecorator('strflash1', {
 initialValue: info.strflash1 ||  newInfo.strflash1,
  rules: [
    {
      required: true,
      message: '导航图片1不能缺失!',
    },{ max: 255,message: '导航图片1必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="导航图片2">
{getFieldDecorator('strflash2', {
 initialValue: info.strflash2 ||  newInfo.strflash2,
  rules: [
    {
      required: true,
      message: '导航图片2不能缺失!',
    },{ max: 255,message: '导航图片2必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="导航图片3">
{getFieldDecorator('strflash3', {
 initialValue: info.strflash3 ||  newInfo.strflash3,
  rules: [
    {
      required: true,
      message: '导航图片3不能缺失!',
    },{ max: 255,message: '导航图片3必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="导航图片4">
{getFieldDecorator('strflash4', {
 initialValue: info.strflash4 ||  newInfo.strflash4,
  rules: [
    {
      required: true,
      message: '导航图片4不能缺失!',
    },{ max: 255,message: '导航图片4必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="标签1">
{getFieldDecorator('tabtext1', {
 initialValue: info.tabtext1 ||  newInfo.tabtext1,
  rules: [
    {
      required: true,
      message: '标签1不能缺失!',
    },{ max: 255,message: '标签1必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="标签2">
{getFieldDecorator('tabtext2', {
 initialValue: info.tabtext2 ||  newInfo.tabtext2,
  rules: [
    {
      required: true,
      message: '标签2不能缺失!',
    },{ max: 255,message: '标签2必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('tabtext3', {
 initialValue: info.tabtext3 ||  newInfo.tabtext3,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="标签3">
{getFieldDecorator('tabtext4', {
 initialValue: info.tabtext4 ||  newInfo.tabtext4,
  rules: [
    {
      required: true,
      message: '标签3不能缺失!',
    },{ max: 255,message: '标签3必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="标签4">
{getFieldDecorator('tabtext5', {
 initialValue: info.tabtext5 ||  newInfo.tabtext5,
  rules: [
    {
      required: true,
      message: '标签4不能缺失!',
    },{ max: 255,message: '标签4必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="显示几个标签。--这是长度为5的字符串，比如11011">
{getFieldDecorator('fivetab', {
 initialValue: info.fivetab ||  newInfo.fivetab,
  rules: [
    {
      required: true,
      message: '显示几个标签。--这是长度为5的字符串，比如11011不能缺失!',
    },{ max: 255,message: '显示几个标签。--这是长度为5的字符串，比如11011必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="免责协议链接">
{getFieldDecorator('xieyilink', {
 initialValue: info.xieyilink ||  newInfo.xieyilink,
  rules: [
    {
      required: true,
      message: '免责协议链接不能缺失!',
    },{ max: 255,message: '免责协议链接必须小于255位!',   },
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
