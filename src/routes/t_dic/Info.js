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
const url = 'dic';

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
				<FormItem {...formItemLayout} hasFeedback label="字典编码">
            {getFieldDecorator('dicCode', {
              initialValue: info.dicCode,
              rules: [
                {
                  required: true,
                  message: '必须输入字典编码!',
                },
                {
                  max: 64,
                  message: '字典编码必须小于64位!',
                },
              ],
            })(<Input disabled={info.dicId !== undefined} placeholder="请输入字典编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="字典名称">
            {getFieldDecorator('dicName', {
              initialValue: info.dicName,
              rules: [
                {
                  required: true,
                  message: '必须输入字典名称',
                },
                {
                  max: 64,
                  message: '字典名称必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入字典名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="字典描述">
            {getFieldDecorator('dicDesc', {
              initialValue: info.dicDesc,
              rules: [
                {
                  max: 255,
                  message: '字典描述必须小于255位!',
                },
              ],
            })(<TextArea placeholder="请输入文本描述" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="数据集类型">
            {getFieldDecorator('dicData1', {
              initialValue: info.dicData1,
              rules: [
                {
                  required: true,
                  message: '必须输入字典描述',
                },
                {
                  max: 64,
                  message: '数据集类型必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入数据集类型" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="数据集参数">
            {getFieldDecorator('dicData2', {
              initialValue: info.dicData2,
              rules: [
                {
                  max: 64,
                  message: '数据集类型必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入数据集参数" />)}
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
