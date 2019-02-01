/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TProducttrade';

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
{getFieldDecorator('tProducttradeId', {
 initialValue: info.tProducttradeId || newInfo.tProducttradeId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品编号">
{getFieldDecorator('productid', {
 initialValue: info.productid ||  newInfo.productid,
  rules: [
    {
      required: true,
      message: '商品编号不能缺失!',
    },{ max: 40,message: '商品编号必须小于40位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="购买价格">
{getFieldDecorator('price', {
 initialValue: info.price ||  newInfo.price,
  rules: [
    {
      required: true,
      message: '购买价格不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户账户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '用户账户不能缺失!',
    },{ max: 255,message: '用户账户必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="购买时间">
{getFieldDecorator('buytime', {
 initialValue: info.buytime ||  newInfo.buytime,
  rules: [
    {
      required: true,
      message: '购买时间不能缺失!',
    },{ max: 255,message: '购买时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否发货">
{getFieldDecorator('issend', {
 initialValue: info.issend ||  newInfo.issend,
  rules: [
    {
      required: true,
      message: '是否发货不能缺失!',
    },{ required: true,message: '是否发货不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发货时间">
{getFieldDecorator('sendtime', {
 initialValue: info.sendtime ||  newInfo.sendtime,
  rules: [
    {
      required: true,
      message: '发货时间不能缺失!',
    },{ max: 255,message: '发货时间必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户留言">
{getFieldDecorator('userinfo', {
 initialValue: info.userinfo ||  newInfo.userinfo,
  rules: [
    {
      required: true,
      message: '用户留言不能缺失!',
    },{ max: 1000,message: '用户留言必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商家留言">
{getFieldDecorator('shopinfo', {
 initialValue: info.shopinfo ||  newInfo.shopinfo,
  rules: [
    {
      required: true,
      message: '商家留言不能缺失!',
    },{ max: 1000,message: '商家留言必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="买了几个">
{getFieldDecorator('num', {
 initialValue: info.num ||  newInfo.num,
  rules: [
    {
      required: true,
      message: '买了几个不能缺失!',
    },{ required: true,message: '买了几个不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="总额">
{getFieldDecorator('total', {
 initialValue: info.total ||  newInfo.total,
  rules: [
    {
      required: true,
      message: '总额不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 255,message: '必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物流单号等">
{getFieldDecorator('other', {
 initialValue: info.other ||  newInfo.other,
  rules: [
    {
      required: true,
      message: '物流单号等不能缺失!',
    },{ max: 500,message: '物流单号等必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门店标识">
{getFieldDecorator('shoptag', {
 initialValue: info.shoptag ||  newInfo.shoptag,
  rules: [
    {
      required: true,
      message: '门店标识不能缺失!',
    },{ max: 300,message: '门店标识必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="桌号">
{getFieldDecorator('desktag', {
 initialValue: info.desktag ||  newInfo.desktag,
  rules: [
    {
      required: true,
      message: '桌号不能缺失!',
    },{ max: 300,message: '桌号必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="提取编号，一个门店内，一天内不重复">
{getFieldDecorator('getproductcode', {
 initialValue: info.getproductcode ||  newInfo.getproductcode,
  rules: [
    {
      required: true,
      message: '提取编号，一个门店内，一天内不重复不能缺失!',
    },{ max: 100,message: '提取编号，一个门店内，一天内不重复必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否支付">
{getFieldDecorator('ispaid', {
 initialValue: info.ispaid ||  newInfo.ispaid,
  rules: [
    {
      required: true,
      message: '是否支付不能缺失!',
    },{ required: true,message: '是否支付不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收货地址信息">
{getFieldDecorator('recieveaddress', {
 initialValue: info.recieveaddress ||  newInfo.recieveaddress,
  rules: [
    {
      required: true,
      message: '收货地址信息不能缺失!',
    },{ max: 1000,message: '收货地址信息必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单号">
{getFieldDecorator('seq', {
 initialValue: info.seq ||  newInfo.seq,
  rules: [
    {
      required: true,
      message: '订单号不能缺失!',
    },{ max: 100,message: '订单号必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="卖家额外提供的图片">
{getFieldDecorator('shoppic', {
 initialValue: info.shoppic ||  newInfo.shoppic,
  rules: [
    {
      required: true,
      message: '卖家额外提供的图片不能缺失!',
    },{ max: 200,message: '卖家额外提供的图片必须小于200位!',   },
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
