/*
 * @Author: lbb 
 * @Date: 2018-05-18 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:56:16
 * @Description: 子库管理
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const url = 'subware';
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};

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

@connect(({ base, subware, loading }) => ({
  base,
  subware,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class SubwareInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.subware.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: `${url}/info`,
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: `${url}/new`,
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${url}/clear`,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.subware.info.subwareCode) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              subwareCode: this.props.subware.info.subwareCode,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.subware.newInfo,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, subware, base } = this.props;
    const { getFieldDecorator } = form;
    const { info } = subware;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="子库编码">
            {getFieldDecorator('subwareCode', {
              initialValue: info.subwareCode,
              rules: [
                {
                  required: true,
                  message: '必须输入子库编码!',
                },
              ],
            })(<Input disabled={info.subwareCode !== undefined} placeholder="请输入子库编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="子库名称">
            {getFieldDecorator('subwareName', {
              initialValue: info.subwareName,
              rules: [
                {
                  required: true,
                  message: '必须输入子库名称!',
                },
              ],
            })(<Input placeholder="请输入子库名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="子库类型">
            {getFieldDecorator('subwareType', {
              initialValue: info.subwareType,
              rules: [
                {
                  required: false,
                  message: '必须输入子库类型',
                },
                {
                  max: 64,
                  message: '子库类型必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(base.WareHouseType)
                  ? base.WareHouseType.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="主库编码">
            {getFieldDecorator('warehouseCode', {
              initialValue: info.warehouseCode,
              rules: [
                {
                  required: true,
                  message: '必须输入主库编码',
                },
                {
                  max: 64,
                  message: '主库编码必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(base.WareHouse)
                  ? base.WareHouse.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="子库描述">
            {getFieldDecorator('warehouseDesc', {
              initialValue: info.warehouseDesc,
              rules: [
                {
                  required: false,
                  message: '请确认子库描述格式',
                },
                {
                  max: 64,
                  message: '子库描述必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入子库描述" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="经度">
            {getFieldDecorator('longitude', {
              initialValue: info.longitude,
            })(<Input placeholder="请输入经度" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="纬度">
            {getFieldDecorator('latitude', {
              initialValue: info.latitude,
            })(<Input placeholder="请输入纬度" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="地址">
            {getFieldDecorator('address', {
              initialValue: info.address,
              rules: [
                {
                  max: 64,
                  message: '地址必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入地址" />)}
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
                onClick={this.handleSubmit}
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
