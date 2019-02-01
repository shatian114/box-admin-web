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
const url = 'T1wuyejiaofei';

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
           <FormItem {...formItemLayout} hasFeedback label="物业费条目ID">
{getFieldDecorator('t1wuyejiaofeiId', {
 initialValue: info.t1wuyejiaofeiId || newInfo.t1wuyejiaofeiId,
  rules: [
    {
      required: true,
      message: '物业费条目ID不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="业主id">
{getFieldDecorator('yzid', {
 initialValue: info.yzid ||  newInfo.yzid,
  rules: [
    {
      required: true,
      message: '业主id不能缺失!',
    },{ required: true,message: '业主id不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="面积">
{getFieldDecorator('mj', {
 initialValue: info.mj ||  newInfo.mj,
  rules: [
    {
      required: true,
      message: '面积不能缺失!',
    },{ max: 255,message: '面积必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物业费单价">
{getFieldDecorator('wydj', {
 initialValue: info.wydj ||  newInfo.wydj,
  rules: [
    {
      required: true,
      message: '物业费单价不能缺失!',
    },{ max: 255,message: '物业费单价必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本月物业费">
{getFieldDecorator('bywy', {
 initialValue: info.bywy ||  newInfo.bywy,
  rules: [
    {
      required: true,
      message: '本月物业费不能缺失!',
    },{ max: 255,message: '本月物业费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物业费欠缴">
{getFieldDecorator('wyqj', {
 initialValue: info.wyqj ||  newInfo.wyqj,
  rules: [
    {
      required: true,
      message: '物业费欠缴不能缺失!',
    },{ max: 255,message: '物业费欠缴必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本期物业费">
{getFieldDecorator('bqwy', {
 initialValue: info.bqwy ||  newInfo.bqwy,
  rules: [
    {
      required: true,
      message: '本期物业费不能缺失!',
    },{ max: 255,message: '本期物业费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="车牌号">
{getFieldDecorator('cph', {
 initialValue: info.cph ||  newInfo.cph,
  rules: [
    {
      required: true,
      message: '车牌号不能缺失!',
    },{ max: 255,message: '车牌号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地库数量">
{getFieldDecorator('dk', {
 initialValue: info.dk ||  newInfo.dk,
  rules: [
    {
      required: true,
      message: '地库数量不能缺失!',
    },{ max: 255,message: '地库数量必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地面数量">
{getFieldDecorator('dm', {
 initialValue: info.dm ||  newInfo.dm,
  rules: [
    {
      required: true,
      message: '地面数量不能缺失!',
    },{ max: 255,message: '地面数量必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地库车价">
{getFieldDecorator('dkcj', {
 initialValue: info.dkcj ||  newInfo.dkcj,
  rules: [
    {
      required: true,
      message: '地库车价不能缺失!',
    },{ max: 255,message: '地库车价必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地面车价">
{getFieldDecorator('dmcj', {
 initialValue: info.dmcj ||  newInfo.dmcj,
  rules: [
    {
      required: true,
      message: '地面车价不能缺失!',
    },{ max: 255,message: '地面车价必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本月车费">
{getFieldDecorator('bycf', {
 initialValue: info.bycf ||  newInfo.bycf,
  rules: [
    {
      required: true,
      message: '本月车费不能缺失!',
    },{ max: 255,message: '本月车费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="车费欠缴">
{getFieldDecorator('cfqj', {
 initialValue: info.cfqj ||  newInfo.cfqj,
  rules: [
    {
      required: true,
      message: '车费欠缴不能缺失!',
    },{ max: 255,message: '车费欠缴必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本期车费">
{getFieldDecorator('bqcf', {
 initialValue: info.bqcf ||  newInfo.bqcf,
  rules: [
    {
      required: true,
      message: '本期车费不能缺失!',
    },{ max: 255,message: '本期车费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="水费单价">
{getFieldDecorator('sf', {
 initialValue: info.sf ||  newInfo.sf,
  rules: [
    {
      required: true,
      message: '水费单价不能缺失!',
    },{ max: 255,message: '水费单价必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本月吨数">
{getFieldDecorator('byds', {
 initialValue: info.byds ||  newInfo.byds,
  rules: [
    {
      required: true,
      message: '本月吨数不能缺失!',
    },{ max: 255,message: '本月吨数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本月水费">
{getFieldDecorator('bysf', {
 initialValue: info.bysf ||  newInfo.bysf,
  rules: [
    {
      required: true,
      message: '本月水费不能缺失!',
    },{ max: 255,message: '本月水费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="水费欠缴">
{getFieldDecorator('sfqj', {
 initialValue: info.sfqj ||  newInfo.sfqj,
  rules: [
    {
      required: true,
      message: '水费欠缴不能缺失!',
    },{ max: 255,message: '水费欠缴必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本期水费">
{getFieldDecorator('bqsf', {
 initialValue: info.bqsf ||  newInfo.bqsf,
  rules: [
    {
      required: true,
      message: '本期水费不能缺失!',
    },{ max: 255,message: '本期水费必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="当期小计">
{getFieldDecorator('dqxj', {
 initialValue: info.dqxj ||  newInfo.dqxj,
  rules: [
    {
      required: true,
      message: '当期小计不能缺失!',
    },
  ],
 })()}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="年月">
{getFieldDecorator('ny', {
 initialValue: info.ny ||  newInfo.ny,
  rules: [
    {
      required: true,
      message: '年月不能缺失!',
    },{ max: 255,message: '年月必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否结扣">
{getFieldDecorator('isover', {
 initialValue: info.isover ||  newInfo.isover,
  rules: [
    {
      required: true,
      message: '是否结扣不能缺失!',
    },{ required: true,message: '是否结扣不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
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
