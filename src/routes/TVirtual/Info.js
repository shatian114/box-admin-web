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
const url = 'TVirtual';

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
            {getFieldDecorator('tVirtualId', {
              initialValue: info.tVirtualId || newInfo.tVirtualId,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="虚拟物品类别id">
            {getFieldDecorator('producttypeid', {
              initialValue: info.producttypeid || newInfo.producttypeid,
              rules: [
                {
                  required: true,
                  message: '虚拟物品类别id不能缺失!',
                },
                { required: true, message: '虚拟物品类别id不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="区域标识">
            {getFieldDecorator('zone', {
              initialValue: info.zone || newInfo.zone,
              rules: [
                {
                  required: true,
                  message: '区域标识不能缺失!',
                },
                { max: 10, message: '区域标识必须小于10位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="虚拟物品编号">
            {getFieldDecorator('productid', {
              initialValue: info.productid || newInfo.productid,
              rules: [
                {
                  required: true,
                  message: '虚拟物品编号不能缺失!',
                },
                { max: 20, message: '虚拟物品编号必须小于20位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="排序">
            {getFieldDecorator('orderindex', {
              initialValue: info.orderindex || newInfo.orderindex,
              rules: [
                {
                  required: true,
                  message: '排序不能缺失!',
                },
                { required: true, message: '排序不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="虚拟物品名称">
            {getFieldDecorator('productname', {
              initialValue: info.productname || newInfo.productname,
              rules: [
                {
                  required: true,
                  message: '虚拟物品名称不能缺失!',
                },
                { max: 255, message: '虚拟物品名称必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="图片索引">
            {getFieldDecorator('tagindex', {
              initialValue: info.tagindex || newInfo.tagindex,
              rules: [
                {
                  required: true,
                  message: '图片索引不能缺失!',
                },
                { max: 255, message: '图片索引必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="虚拟产品描述">
            {getFieldDecorator('productdes', {
              initialValue: info.productdes || newInfo.productdes,
              rules: [
                {
                  required: true,
                  message: '虚拟产品描述不能缺失!',
                },
                { max: 255, message: '虚拟产品描述必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="虚拟产品链接">
            {getFieldDecorator('virtuallink', {
              initialValue: info.virtuallink || newInfo.virtuallink,
              rules: [
                {
                  required: true,
                  message: '虚拟产品链接不能缺失!',
                },
                { max: 255, message: '虚拟产品链接必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="价格">
            {getFieldDecorator('price', {
              initialValue: info.price || newInfo.price,
              rules: [
                {
                  required: true,
                  message: '价格不能缺失!',
                },
              ],
            })()}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否显示增强描述">
            {getFieldDecorator('isshowextendlink', {
              initialValue: info.isshowextendlink || newInfo.isshowextendlink,
              rules: [
                {
                  required: true,
                  message: '是否显示增强描述不能缺失!',
                },
                { max: 255, message: '是否显示增强描述必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="增强描述链接">
            {getFieldDecorator('extendlink', {
              initialValue: info.extendlink || newInfo.extendlink,
              rules: [
                {
                  required: true,
                  message: '增强描述链接不能缺失!',
                },
                { max: 255, message: '增强描述链接必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="购买前的提示">
            {getFieldDecorator('infobeforepaid', {
              initialValue: info.infobeforepaid || newInfo.infobeforepaid,
              rules: [
                {
                  required: true,
                  message: '购买前的提示不能缺失!',
                },
                { max: 2000, message: '购买前的提示必须小于2000位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否审核过">
            {getFieldDecorator('ispassed', {
              initialValue: info.ispassed || newInfo.ispassed,
              rules: [
                {
                  required: true,
                  message: '是否审核过不能缺失!',
                },
                { required: true, message: '是否审核过不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否免费">
            {getFieldDecorator('isfree', {
              initialValue: info.isfree || newInfo.isfree,
              rules: [
                {
                  required: true,
                  message: '是否免费不能缺失!',
                },
                { required: true, message: '是否免费不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否置顶">
            {getFieldDecorator('istop', {
              initialValue: info.istop || newInfo.istop,
              rules: [
                {
                  required: true,
                  message: '是否置顶不能缺失!',
                },
                { required: true, message: '是否置顶不能缺失!' },
              ],
            })(<InputNumber min={0} disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="主图">
            {getFieldDecorator('mainpic', {
              initialValue: info.mainpic || newInfo.mainpic,
              rules: [
                {
                  required: true,
                  message: '主图不能缺失!',
                },
                { max: 200, message: '主图必须小于200位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('extendtext', {
              initialValue: info.extendtext || newInfo.extendtext,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 2000, message: '必须小于2000位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('extendvidepic', {
              initialValue: info.extendvidepic || newInfo.extendvidepic,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 400, message: '必须小于400位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('extendvideourl', {
              initialValue: info.extendvideourl || newInfo.extendvideourl,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 600, message: '必须小于600位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('extendrotate', {
              initialValue: info.extendrotate || newInfo.extendrotate,
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
            {getFieldDecorator('text', {
              initialValue: info.text || newInfo.text,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 2000, message: '必须小于2000位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('videourl', {
              initialValue: info.videourl || newInfo.videourl,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 600, message: '必须小于600位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="">
            {getFieldDecorator('rotate', {
              initialValue: info.rotate || newInfo.rotate,
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
            {getFieldDecorator('videpic', {
              initialValue: info.videpic || newInfo.videpic,
              rules: [
                {
                  required: true,
                  message: '不能缺失!',
                },
                { max: 400, message: '必须小于400位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="发布者的个人合作者账户">
            {getFieldDecorator('accountprivate', {
              initialValue: info.accountprivate || newInfo.accountprivate,
              rules: [
                {
                  required: true,
                  message: '发布者的个人合作者账户不能缺失!',
                },
                { max: 255, message: '发布者的个人合作者账户必须小于255位!' },
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
