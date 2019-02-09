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
const url = 'T1wuyexiaoqu';

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
				console.log(this.props.base.info);
        if (this.props.base.info.t1wuyexiaoquId) {
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
           <FormItem {...formItemLayout} hasFeedback label="小区ID">
{getFieldDecorator('t1wuyexiaoquId', {
 initialValue: info.t1wuyexiaoquId || newInfo.t1wuyexiaoquId,
  rules: [
    {
      required: true,
      message: '小区ID不能缺失!',
    },
  ],
 })(<Input />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物业id">
{getFieldDecorator('wyid', {
 initialValue: info.wyid ||  newInfo.wyid,
  rules: [
    {
      required: true,
      message: '物业id不能缺失!',
    },{ required: true,message: '物业id不能缺失!', },
  ],
 })(<InputNumber min={0} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区编号">
{getFieldDecorator('xqbh', {
 initialValue: info.xqbh ||  newInfo.xqbh,
  rules: [
    {
      required: true,
      message: '小区编号不能缺失!',
    },{ max: 255,message: '小区编号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区名称">
{getFieldDecorator('xqmc', {
 initialValue: info.xqmc ||  newInfo.xqmc,
  rules: [
    {
      required: true,
      message: '小区名称不能缺失!',
    },{ max: 255,message: '小区名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="省">
{getFieldDecorator('sheng', {
 initialValue: info.sheng ||  newInfo.sheng,
  rules: [
    {
      required: true,
      message: '省不能缺失!',
    },{ max: 255,message: '省必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="市">
{getFieldDecorator('shi', {
 initialValue: info.shi ||  newInfo.shi,
  rules: [
    {
      required: true,
      message: '市不能缺失!',
    },{ max: 255,message: '市必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区">
{getFieldDecorator('qu', {
 initialValue: info.qu ||  newInfo.qu,
  rules: [
    {
      required: true,
      message: '区不能缺失!',
    },{ max: 255,message: '区必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="楼栋数">
{getFieldDecorator('lds', {
 initialValue: info.lds ||  newInfo.lds,
  rules: [
    {
      required: true,
      message: '楼栋数不能缺失!',
    },{ max: 255,message: '楼栋数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="户型数">
{getFieldDecorator('hxs', {
 initialValue: info.hxs ||  newInfo.hxs,
  rules: [
    {
      required: true,
      message: '户型数不能缺失!',
    },{ max: 255,message: '户型数必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="固定车数量">
{getFieldDecorator('gdc', {
 initialValue: info.gdc ||  newInfo.gdc,
  rules: [
    {
      required: true,
      message: '固定车数量不能缺失!',
    },{ max: 255,message: '固定车数量必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="临时车数量">
{getFieldDecorator('lsc', {
 initialValue: info.lsc ||  newInfo.lsc,
  rules: [
    {
      required: true,
      message: '临时车数量不能缺失!',
    },{ max: 255,message: '临时车数量必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="路段">
{getFieldDecorator('ld', {
 initialValue: info.ld ||  newInfo.ld,
  rules: [
    {
      required: true,
      message: '路段不能缺失!',
    },{ max: 255,message: '路段必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物业费价格">
{getFieldDecorator('wyf', {
 initialValue: info.wyf ||  newInfo.wyf,
  rules: [
    {
      required: true,
      message: '物业费价格不能缺失!',
    },{ max: 255,message: '物业费价格必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="水费价格">
{getFieldDecorator('sf', {
 initialValue: info.sf ||  newInfo.sf,
  rules: [
    {
      required: true,
      message: '水费价格不能缺失!',
    },{ max: 255,message: '水费价格必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="电费价格">
{getFieldDecorator('df', {
 initialValue: info.df ||  newInfo.df,
  rules: [
    {
      required: true,
      message: '电费价格不能缺失!',
    },{ max: 255,message: '电费价格必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地库车价格">
{getFieldDecorator('dkc', {
 initialValue: info.dkc ||  newInfo.dkc,
  rules: [
    {
      required: true,
      message: '地库车价格不能缺失!',
    },{ max: 255,message: '地库车价格必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地面车价格">
{getFieldDecorator('dmc', {
 initialValue: info.dmc ||  newInfo.dmc,
  rules: [
    {
      required: true,
      message: '地面车价格不能缺失!',
    },{ max: 255,message: '地面车价格必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区图片">
{getFieldDecorator('piclink', {
 initialValue: info.piclink ||  newInfo.piclink,
  rules: [
    {
      required: true,
      message: '小区图片不能缺失!',
    },{ max: 1000,message: '小区图片必须小于1000位!',   },
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
