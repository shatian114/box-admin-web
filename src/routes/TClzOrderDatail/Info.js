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
import { FormValid } from '../../utils/FormValid';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TClzOrderDatail';

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

@connect(({ base, loading, list }) => ({
  base,
  list,
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
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzFood/queryTClzFoodList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzOrder/queryTClzOrderList',
      },
    });
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
        if (this.props.base.info.tClzOrderDatailId) {
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
    const { submitting, form, loading, base, list } = this.props;
    const { getFieldDecorator } = form;
    const { queryTClzFoodList, queryTClzOrderList  } = list;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="订单详情编号">
{getFieldDecorator('tClzOrderDatailId', {
 initialValue: info.tClzOrderDatailId || newInfo.tClzOrderDatailId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单id">
{getFieldDecorator('tClzOrderId', {
 initialValue: info.tClzOrderId ||  newInfo.tClzOrderId,
  rules: [
    {
      required: true,
      message: '订单id不能缺失!',
    },{ max: 180,message: '订单id必须小于180位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children">
 {
   queryTClzOrderList ? queryTClzOrderList.map(v => (
     <Option key={v.t_clz_order_id}>{v.t_clz_order_id}</Option>
   )
   ) : ''
 }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="菜品">
{getFieldDecorator('tClzFoodId', {
 initialValue: info.tClzFoodId ||  newInfo.tClzFoodId,
  rules: [
    {
      required: true,
      message: '菜品id不能缺失!',
    },{ max: 255,message: '菜品id必须小于255位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children">
 {
   queryTClzFoodList ? queryTClzFoodList.map(v => (
     <Option key={v.t_clz_food_id}>{v.foodname}</Option>
   )
   ) : ''
 }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="当时这个菜品的单价">
{getFieldDecorator('foodprice', {
 initialValue: info.foodprice ||  newInfo.foodprice,
  rules: [
    {
      required: true,
      message: '当时这个菜品的单价不能缺失!',
    },{validator: FormValid.jine}
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="数量">
{getFieldDecorator('foodnum', {
 initialValue: info.foodnum ||  newInfo.foodnum,
  rules: [
    {
      required: true,
      message: '数量不能缺失!',
    },{ required: true,message: '数量不能缺失!', },
  ],
 })(<InputNumber min={0} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本菜总价">
{getFieldDecorator('foodtotalamount', {
 initialValue: info.foodtotalamount ||  newInfo.foodtotalamount,
  rules: [
    {
      required: true,
      message: '本菜总价不能缺失!',
    },{validator: FormValid.jine}
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
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
