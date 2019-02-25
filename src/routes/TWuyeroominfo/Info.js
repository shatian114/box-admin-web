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
const url = 'TWuyeroominfo';

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
{getFieldDecorator('tWuyeroominfoId', {
 initialValue: info.tWuyeroominfoId || newInfo.tWuyeroominfoId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('sqbh', {
 initialValue: info.sqbh ||  newInfo.sqbh,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('sqmc', {
 initialValue: info.sqmc ||  newInfo.sqmc,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('ld', {
 initialValue: info.ld ||  newInfo.ld,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('cfh', {
 initialValue: info.cfh ||  newInfo.cfh,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('zt', {
 initialValue: info.zt ||  newInfo.zt,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('xingming', {
 initialValue: info.xingming ||  newInfo.xingming,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('wyf', {
 initialValue: info.wyf ||  newInfo.wyf,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('sf', {
 initialValue: info.sf ||  newInfo.sf,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('df', {
 initialValue: info.df ||  newInfo.df,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('tcf', {
 initialValue: info.tcf ||  newInfo.tcf,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('total', {
 initialValue: info.total ||  newInfo.total,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('leftamount', {
 initialValue: info.leftamount ||  newInfo.leftamount,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('desclxm', {
 initialValue: info.desclxm ||  newInfo.desclxm,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('relativephone', {
 initialValue: info.relativephone ||  newInfo.relativephone,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('piclink', {
 initialValue: info.piclink ||  newInfo.piclink,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 400,message: '必须小于400位!',   },
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
