/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'SysRole2module';

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
        if (this.props.base.info.roleCode) {
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
          <FormItem {...formItemLayout} hasFeedback label="角色编码">
            {getFieldDecorator('roleCode', {
              initialValue: info.roleCode || newInfo.roleCode,
              rules: [
                {
                  required: true,
                  message: '角色编码不能缺失!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="模块id">
            {getFieldDecorator('moduleId', {
              initialValue: info.moduleId || newInfo.moduleId,
              rules: [
                {
                  required: true,
                  message: '模块id不能缺失!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="操作集">
            {getFieldDecorator('oprset', {
              initialValue: info.oprset || newInfo.oprset,
              rules: [
                {
                  required: true,
                  message: '操作集不能缺失!',
                },
                { type: 'number', min: 0, message: '数量不能小于0!' },
              ],
            })(<InputNumber precision={0} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="数据集">
            {getFieldDecorator('dataSet', {
              initialValue: info.dataSet || newInfo.dataSet,
              rules: [
                {
                  required: true,
                  message: '数据集不能缺失!',
                },
                { max: 255, message: '数据集必须小于255位!' },
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
