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
const url = 'TClzSmalltype';

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
  base,
  list,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
			type: 'base/getUpperId',
			payload: {
				url: '/api/TClzSmalltype/queryTClzSmalltypeList',
			},
    });
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
        if (this.props.base.info.tClzSmalltypeId) {
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
           <FormItem {...formItemLayout} hasFeedback label="小类编号">
{getFieldDecorator('tClzSmalltypeId', {
 initialValue: info.tClzSmalltypeId || newInfo.tClzSmalltypeId,
  rules: [
    {
      required: true,
      message: '小类编号不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="关联的大类">
{getFieldDecorator('tClzBigtypeId', {
 initialValue: info.tClzBigtypeId ||  newInfo.tClzBigtypeId,
  rules: [
    {
      required: true,
      message: '关联的大类不能缺失!',
    },{ max: 255,message: '关联的大类必须小于255位!',   },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.info.tClzSmalltypeId}>
  {
    this.props.base.upList.map((v, k) => (
      <Option key={k} value={v.t_clz_bigtype_id}>{v.typename}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小类名称">
{getFieldDecorator('typename', {
 initialValue: info.typename ||  newInfo.typename,
  rules: [
    {
      required: true,
      message: '小类名称不能缺失!',
    },{ max: 255,message: '小类名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="小类描述">
{getFieldDecorator('typedesc', {
 initialValue: info.typedesc ||  newInfo.typedesc,
  rules: [
    {
      required: true,
      message: '小类描述不能缺失!',
    },{ max: 255,message: '小类描述必须小于255位!',   },
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
