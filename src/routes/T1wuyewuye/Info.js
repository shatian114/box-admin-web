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
const url = 'T1wuyewuye';

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
		let isEdit = this.props.base.isEdit;
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
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let temp = {};
				const { dispatch } = this.props;
				console.log(this.props.base.newInfo);
        if (this.props.base.info.t1wuyewuyeId) {
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
           <FormItem hasFeedback {...formItemLayout} label="物业ID" style={{display: 'none'}}>
						{getFieldDecorator('t1wuyewuyeId', {
						 initialValue: info.t1wuyewuyeId || newInfo.t1wuyewuyeId,
						  rules: [
						    {
						      required: true,
						      message: '物业ID不能缺失!',
						    },
						  ],
						 })(<Input disabled />)}
						</FormItem>
						 <FormItem {...formItemLayout} hasFeedback label="物业编号">
						{getFieldDecorator('wybh', {
						 initialValue: info.wybh ||  newInfo.wybh,
						  rules: [
						    {
						      required: true,
						      message: '物业编号不能缺失!',
						    },{ max: 255,message: '物业编号必须小于255位!',   },
						  ],
						 })(<Input placeholder="请输入" disabled={this.props.base.isEdit} />)}
						 </FormItem>
						 <FormItem {...formItemLayout} hasFeedback label="物业名称">
						{getFieldDecorator('wymc', {
						 initialValue: info.wymc ||  newInfo.wymc,
						  rules: [
						    {
						      required: true,
						      message: '物业名称不能缺失!',
						    },{ max: 255,message: '物业名称必须小于255位!',   },
						  ],
						 })(<Input placeholder="请输入" />)}
						 </FormItem>
						 <FormItem {...formItemLayout} hasFeedback label="物业描述">
						{getFieldDecorator('wyms', {
						 initialValue: info.wyms ||  newInfo.wyms,
						  rules: [
						    {
						      required: true,
						      message: '物业描述不能缺失!',
						    },{ max: 255,message: '物业描述必须小于255位!',   },
						  ],
						 })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder="请输入" />)}
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
