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
import {webConfig} from "../../utils/Constant";

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TProductShop';

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
{getFieldDecorator('tProductShopId', {
 initialValue: info.tProductShopId || newInfo.tProductShopId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="产品类型id">
{getFieldDecorator('producttypeid', {
 initialValue: info.producttypeid ||  newInfo.producttypeid,
  rules: [
    {
      required: true,
      message: '产品类型id不能缺失!',
    },{ required: true,message: '产品类型id不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区域标识">
{getFieldDecorator('zone', {
 initialValue: info.zone ||  newInfo.zone,
  rules: [
    {
      required: true,
      message: '区域标识不能缺失!',
    },{ max: 50,message: '区域标识必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品编号">
{getFieldDecorator('productid', {
 initialValue: info.productid ||  newInfo.productid,
  rules: [
    {
      required: true,
      message: '商品编号不能缺失!',
    },{ max: 50,message: '商品编号必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品排序">
{getFieldDecorator('orderindex', {
 initialValue: info.orderindex ||  newInfo.orderindex,
  rules: [
    {
      required: true,
      message: '商品排序不能缺失!',
    },{ required: true,message: '商品排序不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品名称">
{getFieldDecorator('productname', {
 initialValue: info.productname ||  newInfo.productname,
  rules: [
    {
      required: true,
      message: '商品名称不能缺失!',
    },{ max: 255,message: '商品名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品图片索引">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '商品图片索引不能缺失!',
    },{ max: 255,message: '商品图片索引必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="剩余数量">
{getFieldDecorator('num', {
 initialValue: info.num ||  newInfo.num,
  rules: [
    {
      required: true,
      message: '剩余数量不能缺失!',
    },{ required: true,message: '剩余数量不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品描述">
{getFieldDecorator('productdes', {
 initialValue: info.productdes ||  newInfo.productdes,
  rules: [
    {
      required: true,
      message: '商品描述不能缺失!',
    },{ max: 255,message: '商品描述必须小于255位!',   },
  ],
 })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="支付的费用">
{getFieldDecorator('price', {
 initialValue: info.price ||  newInfo.price,
  rules: [
    {
      required: true,
      message: '支付的费用不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否显示实时视频">
{getFieldDecorator('ishowvideolink', {
 initialValue: info.ishowvideolink ||  newInfo.ishowvideolink,
  rules: [
    {
      required: true,
      message: '是否显示实时视频不能缺失!',
    },{ required: true,message: '是否显示实时视频不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="视频链接">
{getFieldDecorator('videolink', {
 initialValue: info.videolink ||  newInfo.videolink,
  rules: [
    {
      required: true,
      message: '视频链接不能缺失!',
    },{ max: 255,message: '视频链接必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否审核过">
{getFieldDecorator('ispassed', {
 initialValue: info.ispassed ||  newInfo.ispassed,
  rules: [
    {
      required: true,
      message: '是否审核过不能缺失!',
    },{ required: true,message: '是否审核过不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否置顶">
{getFieldDecorator('istop', {
 initialValue: info.istop ||  newInfo.istop,
  rules: [
    {
      required: true,
      message: '是否置顶不能缺失!',
    },{ required: true,message: '是否置顶不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门店标识">
{getFieldDecorator('shoptag', {
 initialValue: info.shoptag ||  newInfo.shoptag,
  rules: [
    {
      required: true,
      message: '门店标识不能缺失!',
    },{ max: 50,message: '门店标识必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否允许用户上传图片">
{getFieldDecorator('isneeduserpic', {
 initialValue: info.isneeduserpic ||  newInfo.isneeduserpic,
  rules: [
    {
      required: true,
      message: '是否允许用户上传图片不能缺失!',
    },{ required: true,message: '是否允许用户上传图片不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否用户可留言">
{getFieldDecorator('isneeduserinfo', {
 initialValue: info.isneeduserinfo ||  newInfo.isneeduserinfo,
  rules: [
    {
      required: true,
      message: '是否用户可留言不能缺失!',
    },{ required: true,message: '是否用户可留言不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否需要输入完整收货地址">
{getFieldDecorator('isneeduseraddress', {
 initialValue: info.isneeduseraddress ||  newInfo.isneeduseraddress,
  rules: [
    {
      required: true,
      message: '是否需要输入完整收货地址不能缺失!',
    },{ required: true,message: '是否需要输入完整收货地址不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否要填写桌号信息">
{getFieldDecorator('isneeddesktag', {
 initialValue: info.isneeddesktag ||  newInfo.isneeddesktag,
  rules: [
    {
      required: true,
      message: '是否要填写桌号信息不能缺失!',
    },{ required: true,message: '是否要填写桌号信息不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否放到首页">
{getFieldDecorator('isatmain', {
 initialValue: info.isatmain ||  newInfo.isatmain,
  rules: [
    {
      required: true,
      message: '是否放到首页不能缺失!',
    },{ required: true,message: '是否放到首页不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="产品主图">
{getFieldDecorator('mainpic', {
 initialValue: info.mainpic ||  newInfo.mainpic,
  rules: [
    {
      required: true,
      message: '产品主图不能缺失!',
    },{ max: 400,message: '产品主图必须小于400位!',   },
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
