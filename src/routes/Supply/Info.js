/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-17 23:08:27
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
const url = 'supply';
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

@connect(({ supply, loading }) => ({
  supply,
  submitting: loading.effects['supply/fetch'] || loading.effects['supply/fetchAdd'],
  loading: loading.effects['supply/info'] || loading.effects['supply/new'] || false,
}))
@Form.create()
export default class SupplyInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.supply.info.id || (this.props.location.state && this.props.location.state.id)) {
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
        if (this.props.supply.info.supplyCode) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              ...this.props.supply.info,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.supply.newInfo,
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
    const { submitting, form, loading, supply } = this.props;
    const { getFieldDecorator } = form;
    const { info } = supply;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="供应商编号">
            {getFieldDecorator('supplyCode', {
              initialValue: info.supplyCode,
              rules: [
                {
                  required: true,
                  message: '必须输入供应商编号!',
                },
                {
                  max: 64,
                  message: '供应商编号必须小于64位!',
                },
              ],
            })(<Input disabled={info.supplyCode !== undefined} placeholder="请输入供应商编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商名称">
            {getFieldDecorator('supplyName', {
              initialValue: info.supplyName,
              rules: [
                {
                  required: true,
                  message: '必须输入供应商名称!',
                },
                {
                  max: 64,
                  message: '供应商名称必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入供应商名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商缩写(两位字符)">
            {getFieldDecorator('supplySx', {
              initialValue: info.supplySx,
              rules: [
                {
                  required: true,
                  message: '必须输入供应商缩写!',
                },
                {
                  len: 2,
                  message: '供应商缩写必须为两位字符!',
                },
              ],
            })(<Input placeholder="请输入供应商缩写" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商手机号码">
            {getFieldDecorator('supplyPhone', {
              initialValue: info.supplyPhone,
              rules: [
                {
                  required: true,
                  message: '必须输入供应商手机号码!',
                },
                {
                  max: 16,
                  message: '供应商手机号码方式小于16位!',
                },
              ],
            })(<Input placeholder="请输入供应商手机号码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商邮箱">
            {getFieldDecorator('supplyEmail', {
              initialValue: info.supplyEmail,
              rules: [
                {
                  type: 'email',
                  message: '请确认邮箱格式',
                },
              ],
            })(<Input placeholder="请输入供应商邮箱" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商联系方式">
            {getFieldDecorator('supplyContact', {
              initialValue: info.supplyContact,
              rules: [
                {
                  max: 64,
                  message: '供应商联系方式小于64位!',
                },
              ],
            })(<Input placeholder="请输入供应商联系方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商地址">
            {getFieldDecorator('supplyAddress', {
              initialValue: info.supplyAddress,
            })(<Input placeholder="请输入供应商地址" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商描述">
            {getFieldDecorator('supplyDesc', {
              initialValue: info.supplyDesc,
              rules: [
                {
                  max: 255,
                  message: '供应商描述小于255位!',
                },
              ],
            })(<TextArea placeholder="请输入供应商描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
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
