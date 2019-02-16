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
const url = 'T1wuyeyezhu';

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

@connect(({ list, base, loading }) => ({
	list,
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {
  componentDidMount() {
		const { dispatch } = this.props;
		let isEdit = this.props.base.isEdit;
		dispatch({
			type: 'list/list',
			payload: {
				url: '/api/T1wuyexiaoqu/queryT1wuyexiaoquList'
			},
			
		});
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
			isEdit = true;
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
			isEdit = false;
      dispatch({
        type: 'base/new',
        url,
      });
    }
		dispatch({
			type: 'base/save',
			payload: {
				isEdit
			}
		});
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
		});
		dispatch({
      type: 'list/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let temp = {};
				const { dispatch } = this.props;
				console.log(this.props.base.info);
        if (this.props.base.info.t1wuyeyezhuId) {
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
           <FormItem {...formItemLayout} hasFeedback label="业主id" style={{display: 'none'}}>
{getFieldDecorator('t1wuyeyezhuId', {
 initialValue: info.t1wuyeyezhuId || newInfo.t1wuyeyezhuId,
  rules: [
    {
      required: true,
      message: '业主id不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小区id">
{getFieldDecorator('xiaoquid', {
 initialValue: info.xiaoquid ||  newInfo.xiaoquid,
  rules: [
    {
      required: true,
      message: '小区id不能缺失!',
    },{ required: true,message: '小区id不能缺失!', },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.isEdit}>
	{
		this.props.list.list.map(v => (
			<Option key={v.t_1wuyexiaoqu_id} value={v.t_1wuyewuye_id}>{`${v.xqmc}---${v.t_1wuyexiaoqu_id}`}</Option>
		))
	}
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="业主编号">
{getFieldDecorator('yzbh', {
 initialValue: info.yzbh ||  newInfo.yzbh,
  rules: [
    {
      required: true,
      message: '业主编号不能缺失!',
    },{ max: 255,message: '业主编号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" disabled={this.props.base.isEdit} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="楼房编号">
{getFieldDecorator('lfbh', {
 initialValue: info.lfbh ||  newInfo.lfbh,
  rules: [
    {
      required: true,
      message: '楼房编号不能缺失!',
    },{ max: 255,message: '楼房编号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="楼房面积">
{getFieldDecorator('lfmj', {
 initialValue: info.lfmj ||  newInfo.lfmj,
  rules: [
    {
      required: true,
      message: '楼房面积不能缺失!',
    },{ max: 255,message: '楼房面积必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="业主联系方式">
{getFieldDecorator('yzsj', {
 initialValue: info.yzsj ||  newInfo.yzsj,
  rules: [
    {
      required: true,
      message: '业主联系方式不能缺失!',
    },{ max: 255,message: '业主联系方式必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="业主描述">
{getFieldDecorator('yzms', {
 initialValue: info.yzms ||  newInfo.yzms,
  rules: [
    {
      required: true,
      message: '业主描述不能缺失!',
    },{ max: 255,message: '业主描述必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="账户余额">
{getFieldDecorator('leftamount', {
 initialValue: info.leftamount ||  newInfo.leftamount,
  rules: [
    {
      required: true,
      message: '账户余额不能缺失!',
    },
  ],
 })(<InputNumber placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否正常">
{getFieldDecorator('isnormal', {
 initialValue: info.isnormal ||  newInfo.isnormal,
  rules: [
    {
      required: true,
      message: '是否正常不能缺失!',
    },{ required: true,message: '是否正常不能缺失!', },
  ],
 })(<Select>
	 	<Option value="1">是</Option>
		<Option value="0">否</Option>
	 </Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="欠费描述">
{getFieldDecorator('qianfeinum', {
 initialValue: info.qianfeinum ||  newInfo.qianfeinum,
  rules: [
    {
      required: true,
      message: '欠费描述不能缺失!',
    },{ max: 300,message: '欠费描述必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="车闸系统远程链接前缀">
{getFieldDecorator('carstoplink', {
 initialValue: info.carstoplink ||  newInfo.carstoplink,
  rules: [
    {
      required: true,
      message: '车闸系统远程链接前缀不能缺失!',
    },{ max: 255,message: '车闸系统远程链接前缀必须小于255位!',   },
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
