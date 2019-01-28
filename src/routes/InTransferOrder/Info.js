/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-25 13:36:20
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import MicStorage from './MicStorage';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'dbrk';

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
  loading: loading.effects['base/info'] || false,
}))
@Form.create()
export default class MyInfo extends Component {
  state = {
    list: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/info',
      payload: {
        id: this.props.location.state.id,
      },
      callback: data => {
        this.setState({
          list: data.codes,
        });
      },
      url,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  render() {
    const { form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { info, newInfo, SubwareList } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="调拨单编码">
            {getFieldDecorator('orderCode', {
              initialValue: info.orderCode || newInfo.orderCode,
              rules: [
                {
                  required: true,
                  message: '调拨单编码不能缺失!',
                },
              ],
            })(<Input disabled placeholder="请输入调拨单编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="出库仓库">
            {getFieldDecorator('outSubware', {
              initialValue: info.outSubware || newInfo.outSubware,
              rules: [
                {
                  required: true,
                  message: '必须输入出库仓库名称',
                },
              ],
            })(
              <Select placeholder="选择仓库" disabled>
                {Array.isArray(SubwareList)
                  ? SubwareList.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="入库仓库">
            {getFieldDecorator('inSubware', {
              initialValue: info.inSubware || newInfo.inSubware,
              rules: [
                {
                  required: true,
                  message: '必须输入仓库名称',
                },
              ],
            })(
              <Select placeholder="选择仓库" disabled>
                {Array.isArray(SubwareList)
                  ? SubwareList.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="出库时间">
            {getFieldDecorator('outwareDate', {
              initialValue: moment(info.outwareDate || newInfo.outwareDate),
              rules: [
                {
                  required: true,
                  message: '不能忽略',
                },
              ],
            })(<DatePicker disabled showTime format="YYYY-MM-DD HH:mm" placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="运输车牌">
            {getFieldDecorator('carCode', {
              initialValue: info.carCode || newInfo.carCode,
            })(<Input disabled placeholder="请输入运输车牌" />)}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              返回
            </Button>
          </FormItem>
        </Form>
        <MicStorage {...this.props} list={this.state.list} setList={this.setList} />
      </Spin>
    );
  }
}
