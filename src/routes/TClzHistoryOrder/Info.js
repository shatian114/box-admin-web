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
import {ordergetstatusArr} from "../../utils/Constant";

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const DateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const url = 'TClzOrder';

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
  list,
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
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzAssignfood/queryTClzAssignfoodList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzDeliveryclerk/queryTClzDeliveryclerkList',
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
        let valuesTemp = values;
        valuesTemp.ordertime = moment(values.ordertime._d).format('YYYY-MM-DD HH:mm:ss');
        valuesTemp.orderdate = moment(values.orderdate._d).format('YYYY-MM-DD');
        const { dispatch } = this.props;
        if (this.props.base.info.tClzOrderId) {
          dispatch({
            type: 'base/fetch',
            payload: {
              ...valuesTemp,
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
              ...valuesTemp,
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
    const { queryTClzDeliveryclerkList, queryTClzAssignfoodList  } = list;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="订单id">
{getFieldDecorator('tClzOrderId', {
 initialValue: info.tClzOrderId || newInfo.tClzOrderId,
  rules: [
    {
      required: true,
      message: '订单id不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户id(微信id)">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '用户id(微信id)不能缺失!',
    },{ max: 255,message: '用户id(微信id)必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本订单总金额">
{getFieldDecorator('totalamount', {
 initialValue: info.totalamount ||  newInfo.totalamount,
  rules: [
    {
      required: true,
      message: '本订单总金额不能缺失!',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter="元" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="下单时间">
{getFieldDecorator('ordertime', {
 initialValue: moment(info.ordertime || moment(), DateTimeFormat),
  rules: [
    {
      required: true,
      message: '下单时间不能缺失!',
    }
  ],
 })(<DatePicker showTime format='YYYY-MM-DD HH:mm:ss' placeholder='请输入' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单日期">
 {getFieldDecorator('orderdate', {
 initialValue: moment(info.orderdate || moment(), DateTimeFormat),
  rules: [
    {
      required: true,
      message: '订单日期不能缺失!',
    }
  ],
 })(<DatePicker showTime format='YYYY-MM-DD' placeholder='请输入' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配菜点">
{getFieldDecorator('tClzAssignfoodId', {
 initialValue: info.tClzAssignfoodId ||  newInfo.tClzAssignfoodId,
  rules: [
    {
      required: true,
      message: '关联的配菜点id不能缺失!',
    },{ max: 255,message: '关联的配菜点id必须小于255位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children">
 {
   queryTClzAssignfoodList ? queryTClzAssignfoodList.map(v => (
     <Option key={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
   )
   ) : ''
 }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配送员">
{getFieldDecorator('tClzDeliveryclerkId', {
 initialValue: info.tClzDeliveryclerkId ||  newInfo.tClzDeliveryclerkId,
  rules: [
    {
      required: true,
      message: '关联的配送员id不能缺失!',
    },{ max: 255,message: '关联的配送员id必须小于255位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children">
 {
   queryTClzDeliveryclerkList ? queryTClzDeliveryclerkList.map(v => (
     <Option key={v.t_clz_deliveryclerk_id}>{`${v.username}=>${v.deliveryclerkadress}`}</Option>
   )
   ) : ''
 }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="买家用户指定的配送地址">
{getFieldDecorator('tClzUseraddressId', {
 initialValue: info.tClzUseraddressId ||  newInfo.tClzUseraddressId,
  rules: [
    {
      required: true,
      message: '买家用户指定的配送地址不能缺失!',
    },{ max: 255,message: '买家用户指定的配送地址必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="获取方式">
{getFieldDecorator('gettype', {
 initialValue: info.gettype ||  newInfo.gettype,
  rules: [
    {
      required: true,
      message: '获取方式',
    },{ max: 255,message: '获取方式',   },
  ],
 })(<Select>
  <Option value=""></Option>
  <Option value="1">自提</Option>
  <Option value="2">配送</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单获取状态">
{getFieldDecorator('ordergetstatus', {
 initialValue: info.ordergetstatus ||  newInfo.ordergetstatus,
  rules: [
    {
      required: true,
      message: '订单获取状态不能缺失!',
    },
  ],
 })(<Select showSearch allowClear  placeholder='订单获取状态' >
 <Option value=""></Option>
  {
    ordergetstatusArr.map((v, i) => (
      <Option key={i} value={(i+1).toString()}>{v}</Option>
    ))
  }
</Select>)}
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
