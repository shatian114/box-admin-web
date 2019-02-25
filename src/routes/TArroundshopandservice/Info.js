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
const url = 'TArroundshopandservice';

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
{getFieldDecorator('tArroundshopandserviceId', {
 initialValue: info.tArroundshopandserviceId || newInfo.tArroundshopandserviceId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
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
 <FormItem {...formItemLayout} hasFeedback label="实体店名称">
{getFieldDecorator('shopname', {
 initialValue: info.shopname ||  newInfo.shopname,
  rules: [
    {
      required: true,
      message: '实体店名称不能缺失!',
    },{ max: 255,message: '实体店名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="实体店描述">
{getFieldDecorator('shopdesc', {
 initialValue: info.shopdesc ||  newInfo.shopdesc,
  rules: [
    {
      required: true,
      message: '实体店描述不能缺失!',
    },{ max: 255,message: '实体店描述必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="图片索引">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '图片索引不能缺失!',
    },{ max: 255,message: '图片索引必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地图位置">
{getFieldDecorator('maplink', {
 initialValue: info.maplink ||  newInfo.maplink,
  rules: [
    {
      required: true,
      message: '地图位置不能缺失!',
    },{ max: 255,message: '地图位置必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="联系手机">
{getFieldDecorator('mobilephone', {
 initialValue: info.mobilephone ||  newInfo.mobilephone,
  rules: [
    {
      required: true,
      message: '联系手机不能缺失!',
    },{ max: 255,message: '联系手机必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="座机">
{getFieldDecorator('telephone', {
 initialValue: info.telephone ||  newInfo.telephone,
  rules: [
    {
      required: true,
      message: '座机不能缺失!',
    },{ max: 255,message: '座机必须小于255位!',   },
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
 <FormItem {...formItemLayout} hasFeedback label="纬度">
{getFieldDecorator('lat', {
 initialValue: info.lat ||  newInfo.lat,
  rules: [
    {
      required: true,
      message: '纬度不能缺失!',
    },{ max: 255,message: '纬度必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="经度">
{getFieldDecorator('lng', {
 initialValue: info.lng ||  newInfo.lng,
  rules: [
    {
      required: true,
      message: '经度不能缺失!',
    },{ max: 255,message: '经度必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="排序">
{getFieldDecorator('orderindex', {
 initialValue: info.orderindex ||  newInfo.orderindex,
  rules: [
    {
      required: true,
      message: '排序不能缺失!',
    },{ required: true,message: '排序不能缺失!', },
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
 <FormItem {...formItemLayout} hasFeedback label="店铺主图">
{getFieldDecorator('mainpic', {
 initialValue: info.mainpic ||  newInfo.mainpic,
  rules: [
    {
      required: true,
      message: '店铺主图不能缺失!',
    },{ max: 500,message: '店铺主图必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地址">
{getFieldDecorator('address', {
 initialValue: info.address ||  newInfo.address,
  rules: [
    {
      required: true,
      message: '地址不能缺失!',
    },{ max: 500,message: '地址必须小于500位!',   },
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
