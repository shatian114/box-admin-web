/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker, InputNumber } from 'antd';

import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';
import moment from 'moment';
import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'PlanMarketboxneed';

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
    dispatch({
      type: 'base/new',
      url,
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
        if (!isEmpty(values.needTime))
          temp = {
            ...temp,
            needTime: values.needTime.format('YYYY-MM-DD HH:mm:ss'),
          };

        const { dispatch } = this.props;
        dispatch({
          type: 'base/fetchAdd',
          payload: {
            ...this.props.base.newInfo,
            ...values,
            ...temp,
          },
          callback: () => {
            this.props.closeModal();
            this.props.setList();
          },
          url,
        });
      }
    });
  };

  render() {
    const { submitting, form, loading, base, closeModal } = this.props;
    const { getFieldDecorator } = form;

    const { info, newInfo, SubwareList, spec } = base;
    console.log(newInfo);
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="超市地址">
            {getFieldDecorator('address', {
              initialValue: newInfo.address,
              rules: [
                {
                  required: true,
                  message: '超市地址不能缺失!',
                },
                { max: 255, message: '超市地址必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="超市联系电话">
            {getFieldDecorator('phone', {
              initialValue: newInfo.phone,
              rules: [
                {
                  required: true,
                  message: '超市联系电话不能缺失!',
                },
                { max: 64, message: '超市联系电话必须小于64位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="规格">
            {getFieldDecorator('spec', {
              initialValue: newInfo.spec,
              rules: [
                {
                  required: true,
                  message: '规格不能缺失!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="载具规格"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(spec)
                  ? spec.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}{' '}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="数量">
            {getFieldDecorator('needCount', {
              initialValue: newInfo.needCount,
              rules: [
                {
                  required: true,
                  message: '数量不能缺失!',
                },
                { type: 'number', min: 0, message: '数量不能小于0!' },
              ],
            })(<InputNumber precision={0} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="需求时间">
            {getFieldDecorator('needTime', {
              initialValue: moment(newInfo.needTime),
              rules: [
                {
                  required: true,
                  message: '需求时间不能缺失!',
                },
              ],
            })(<DatePicker format={DateFormat} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="备注">
            {getFieldDecorator('needDesc', {
              initialValue: newInfo.needDesc,
              rules: [
                {
                  required: false,
                  message: '备注不能缺失!',
                },
                { max: 255, message: '备注必须小于255位!' },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Form>
        <div className="ant-modal-footer">
          <div>
            <Button onClick={() => closeModal()}>取 消</Button>
            <Button onClick={this.handleSubmit} type="primary" loading={submitting}>
              保 存
            </Button>
          </div>
        </div>
      </Spin>
    );
  }
}
