/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TVer';

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
            {getFieldDecorator('tVerId', {
              initialValue: info.tVerId || newInfo.tVerId,
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
              initialValue: info.ver || newInfo.ver,
              rules: [
                {
                  required: true,
                  message: '版本号不能缺失!',
                },
                { max: 100, message: '版本号必须小于100位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否送审">
            {getFieldDecorator('isreview', {
              initialValue: info.isreview || newInfo.isreview,
              rules: [
                {
                  required: true,
                  message: '是否送审不能缺失!',
                },
                { required: true, message: '是否送审不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('function', {
              initialValue: info.function || newInfo.function,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 100, message: '必须小于100位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('text1', {
              initialValue: info.text1 || newInfo.text1,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('text2', {
              initialValue: info.text2 || newInfo.text2,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('text3', {
              initialValue: info.text3 || newInfo.text3,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('text4', {
              initialValue: info.text4 || newInfo.text4,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('text5', {
              initialValue: info.text5 || newInfo.text5,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('showtextonmain', {
              initialValue: info.showtextonmain || newInfo.showtextonmain,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('textonmain', {
              initialValue: info.textonmain || newInfo.textonmain,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refreshbannersign', {
              initialValue: info.refreshbannersign || newInfo.refreshbannersign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refreshbbssign', {
              initialValue: info.refreshbbssign || newInfo.refreshbbssign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refresharroundsign', {
              initialValue: info.refresharroundsign || newInfo.refresharroundsign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refreshmainsign', {
              initialValue: info.refreshmainsign || newInfo.refreshmainsign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refreshrealsign', {
              initialValue: info.refreshrealsign || newInfo.refreshrealsign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('refreshvirtualsign', {
              initialValue: info.refreshvirtualsign || newInfo.refreshvirtualsign,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havaactivity', {
              initialValue: info.havaactivity || newInfo.havaactivity,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havatalk', {
              initialValue: info.havatalk || newInfo.havatalk,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havafabu', {
              initialValue: info.havafabu || newInfo.havafabu,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havafabuvideo', {
              initialValue: info.havafabuvideo || newInfo.havafabuvideo,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havapromise', {
              initialValue: info.havapromise || newInfo.havapromise,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havecomment', {
              initialValue: info.havecomment || newInfo.havecomment,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('haveredmnoney', {
              initialValue: info.haveredmnoney || newInfo.haveredmnoney,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havezone', {
              initialValue: info.havezone || newInfo.havezone,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have11', {
              initialValue: info.have11 || newInfo.have11,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have12', {
              initialValue: info.have12 || newInfo.have12,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have13', {
              initialValue: info.have13 || newInfo.have13,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have21', {
              initialValue: info.have21 || newInfo.have21,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have22', {
              initialValue: info.have22 || newInfo.have22,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('have23', {
              initialValue: info.have23 || newInfo.have23,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havemine', {
              initialValue: info.havemine || newInfo.havemine,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havemarket', {
              initialValue: info.havemarket || newInfo.havemarket,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havevitrual', {
              initialValue: info.havevitrual || newInfo.havevitrual,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('havearrount', {
              initialValue: info.havearrount || newInfo.havearrount,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 255, message: '必须小于255位!' },
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
