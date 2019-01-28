/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-01 12:10:26
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../../index';

import Operate from '../../../components/Oprs';

import '../../../utils/utils.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const url = 'dic';
const dicType = 'usertype';
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

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class MyInfo extends Component {
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
        const { dispatch } = this.props;
        if (this.props.base.info.dicId) {
          dispatch({
            type: 'base/fetch',
            payload: {
              ...values,
              dicType,
              dicId: `${dicType}_${values.dicCode}`,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: 'base/fetchAdd',
            payload: {
              ...this.props.base.newInfo,
              ...values,
              dicType,
              dicId: `${dicType}_${values.dicCode}`,
            },
            ...saveConfig.one,
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { info } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="账户类型编号">
            {getFieldDecorator('dicCode', {
              initialValue: info.dicCode,
              rules: [
                {
                  required: true,
                  message: '必须输入账户类型编号!',
                },
                {
                  max: 64,
                  message: '账户类型编号必须小于64位!',
                },
              ],
            })(<Input disabled={info.dicId !== undefined} placeholder="请输入账户类型编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="账户类型名称">
            {getFieldDecorator('dicName', {
              initialValue: info.dicName,
              rules: [
                {
                  required: true,
                  message: '必须输入账户类型名称',
                },
                {
                  max: 64,
                  message: '账户类型名称必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入账户类型名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="账户类型描述">
            {getFieldDecorator('dicDesc', {
              initialValue: info.dicDesc,
              rules: [
                {
                  max: 255,
                  message: '账户类型描述必须小于255位!',
                },
              ],
            })(<TextArea placeholder="请输入账户类型描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
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
