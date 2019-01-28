/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-16 09:45:17
 * @Description: 用户管理中的用户基础详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker, Spin, Select } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
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

@connect(({ userManager, loading }) => ({
  userManager,
  submitting: loading.effects['userManager/fetch'] || loading.effects['userManager/fetchAdd'],
  loading: loading.effects['userManager/info'] || loading.effects['userManager/new'] || false,
}))
@Form.create()
export default class BaseInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (
      this.props.userManager.userInfo.id ||
      (this.props.location.state && this.props.location.state.id)
    ) {
      dispatch({
        type: 'userManager/info',
        payload: {
          id: this.props.location.state.id,
        },
      });
      dispatch({
        type: 'userManager/detailInfo',
        payload: {
          id: this.props.location.state.id,
        },
      });
    } else {
      dispatch({
        type: 'userManager/new',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManager/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.userManager.userInfo.userId) {
          dispatch({
            type: 'userManager/fetch',
            payload: {
              ...this.props.userManager.userInfo,
              ...values,
            },
          });
        } else {
          dispatch({
            type: 'userManager/fetchAdd',
            payload: {
              ...this.props.userManager.newInfo,
              ...values,
            },
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="用户姓名">
            {getFieldDecorator('username', {
              initialValue: this.props.userManager.userInfo.username,
              rules: [
                {
                  required: true,
                  message: '必须输入!',
                },
                {
                  max: 32,
                  message: '用户姓名小于32位!',
                },
              ],
            })(<Input placeholder="请输入用户姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="用户帐户">
            {getFieldDecorator('userAccount', {
              initialValue: this.props.userManager.userInfo.userAccount,
              rules: [
                {
                  required: true,
                  message: '必须输入!',
                },
                {
                  max: 32,
                  message: '用户帐户小于32位!',
                },
              ],
            })(<Input placeholder="请输入用户帐户" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="角色">
            {getFieldDecorator('roleId', {
              initialValue: this.props.userManager.userInfo.roleId,
              rules: [
                {
                  required: true,
                  message: '必选!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择角色"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="CGY">仓管员</Option>
                <Option value="WDCGY">网点仓管员</Option>
                <Option value="CL">车辆</Option>
                <Option value="NH">农户</Option>
                <Option value="CS">超市</Option>
                <Option value="CW">财务</Option>
                <Option value="TMY">条码员</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="创建时间">
            <DatePicker
              value={moment(this.props.userManager.userInfo.createDate)}
              disabled
              placeholder="默认日期"
              format={dateFormat}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="修改时间">
            <DatePicker
              disabled
              placeholder="默认日期"
              value={moment(this.props.userManager.userInfo.modifyDate)}
              format={dateFormat}
            />
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
