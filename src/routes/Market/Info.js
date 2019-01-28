/*
 * @Author: lbb 
 * @Date: 2018-05-18 18:55:55 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-18 23:03:53
 * @Description: 商超
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const url = 'market';
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};

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

@connect(({ market, loading }) => ({
  market,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class MarketInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.market.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: `${url}/info`,
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: `${url}/new`,
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${url}/clear`,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.market.info.userId) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              userId: this.props.market.info.userId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.market.newInfo,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, market } = this.props;
    const { getFieldDecorator } = form;
    const { info } = market;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="超市名称">
            {getFieldDecorator('marketName', {
              initialValue: info.marketName,
              rules: [
                {
                  required: true,
                  message: '必须输入超市名称!',
                },
              ],
            })(<Input placeholder="请输入超市名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="负责人姓名">
            {getFieldDecorator('realname', {
              initialValue: info.realname,
              rules: [
                {
                  required: true,
                  message: '必须输入负责人姓名!',
                },
              ],
            })(<Input placeholder="请输入负责人姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="负责人登录账户">
            {getFieldDecorator('userAccount', {
              initialValue: info.userAccount,
              rules: [
                {
                  required: true,
                  message: '必须输入负责人登录账户!',
                },
              ],
            })(
              <Input disabled={info.userAccount !== undefined} placeholder="请输入负责人登录账户" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="电话">
            {getFieldDecorator('mobile', {
              initialValue: info.mobile,
              rules: [
                {
                  required: false,
                  message: '必须输入电话',
                },
                {
                  max: 64,
                  message: '电话必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入电话" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="手机号">
            {getFieldDecorator('phone', {
              initialValue: info.phone,
              rules: [
                {
                  required: true,
                  message: '必须输入手机号',
                },
                {
                  max: 64,
                  message: '手机号必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="邮箱">
            {getFieldDecorator('email', {
              initialValue: info.email,
              rules: [
                {
                  type: 'email',
                  message: '请确认邮箱格式',
                },
                {
                  max: 64,
                  message: '邮箱必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="身份证号">
            {getFieldDecorator('identity', {
              initialValue: info.identity,
              rules: [
                {
                  len: 18,
                  message: '身份证号为18位!',
                },
              ],
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="经度">
            {getFieldDecorator('longitude', {
              initialValue: info.longitude,
              rules: [
                {
                  max: 64,
                  message: '经度必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入经度" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="纬度">
            {getFieldDecorator('latitude', {
              initialValue: info.latitude,
              rules: [
                {
                  max: 64,
                  message: '纬度必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入纬度" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="地址">
            {getFieldDecorator('address', {
              initialValue: info.address,
              rules: [
                {
                  max: 64,
                  message: '地址必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入地址" />)}
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
                onClick={this.handleSubmit}
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
