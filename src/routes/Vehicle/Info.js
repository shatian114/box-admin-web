/*
 * @Author: lbb 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-17 23:03:53
 * @Description: 车辆
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
const url = 'vehicle';
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

@connect(({ vehicle, loading }) => ({
  vehicle,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class VehicleInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.vehicle.info.id || (this.props.location.state && this.props.location.state.id)) {
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
        if (this.props.vehicle.info.userId) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              userId: this.props.vehicle.info.userId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.vehicle.newInfo,
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
    const { submitting, form, loading, vehicle } = this.props;
    const { getFieldDecorator } = form;
    const { info } = vehicle;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="车牌号">
            {getFieldDecorator('vehicleNumber', {
              initialValue: info.vehicleNumber,
              rules: [
                {
                  required: true,
                  message: '必须输入车牌号!',
                },
              ],
            })(<Input placeholder="请输入车牌号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="司机姓名">
            {getFieldDecorator('realname', {
              initialValue: info.realname,
              rules: [
                {
                  required: true,
                  message: '必须输入司机姓名!',
                },
              ],
            })(<Input placeholder="请输入司机姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="司机登录账户">
            {getFieldDecorator('userAccount', {
              initialValue: info.userAccount,
              rules: [
                {
                  required: true,
                  message: '必须输入司机登录账户!',
                },
              ],
            })(
              <Input disabled={info.userAccount !== undefined} placeholder="请输入司机登录账户" />
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
          <FormItem {...formItemLayout} hasFeedback label="备注">
            {getFieldDecorator('remark', {
              initialValue: info.remark,
              rules: [
                {
                  max: 1024,
                  message: '备注必须小于1024位!',
                },
              ],
            })(<Input placeholder="请输入备注" />)}
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
