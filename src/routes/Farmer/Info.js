/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-05 11:32:24
 * @Description: 字典详情
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
const url = 'farmer';
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

@connect(({ farmer, loading }) => ({
  farmer,
  submitting: loading.effects['farmer/fetch'] || loading.effects['farmer/fetchAdd'],
  loading: loading.effects['farmer/info'] || loading.effects['farmer/new'] || false,
}))
@Form.create()
export default class FarmerInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.farmer.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: 'farmer/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: 'farmer/new',
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'farmer/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.farmer.info.userId) {
          dispatch({
            type: 'farmer/fetch',
            payload: {
              userId: this.props.farmer.info.userId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: 'farmer/fetchAdd',
            payload: {
              ...this.props.farmer.newInfo,
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
    const { submitting, form, loading, farmer } = this.props;
    const { getFieldDecorator } = form;
    const { info } = farmer;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="农户姓名">
            {getFieldDecorator('realname', {
              initialValue: info.realname,
              rules: [
                {
                  required: true,
                  message: '必须输入农户姓名!',
                },
              ],
            })(<Input disabled={info.realname !== undefined} placeholder="请输入农户姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="农户登录账户">
            {getFieldDecorator('userAccount', {
              initialValue: info.userAccount,
              rules: [
                {
                  required: true,
                  message: '必须输入农户登录账户!',
                },
              ],
            })(
              <Input disabled={info.userAccount !== undefined} placeholder="请输入农户登录账户" />
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
          <FormItem {...formItemLayout} hasFeedback label="主营农产品">
            {getFieldDecorator('product', {
              initialValue: info.product,
            })(<Input placeholder="输入主营农产品" />)}
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
