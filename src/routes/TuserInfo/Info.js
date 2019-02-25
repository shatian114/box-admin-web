/*
 * @Author: lbb 
 * @Date: 2018-05-21 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:57:06
 * @Description: 系统用户管理
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const url = 'tuserInfo';
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

@connect(({ tuserInfo, loading, user, base }) => ({
  tuserInfo,
  user,
  base,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class TuserInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (
      this.props.tuserInfo.info.id ||
      (this.props.location.state && this.props.location.state.id)
    ) {
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
    dispatch({
      type: 'user/query',
      payload: {
        type: 'roleId',
      },
    });
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
        if (this.props.tuserInfo.info.userId) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              userId: this.props.tuserInfo.info.userId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.tuserInfo.newInfo,
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
    const { submitting, form, loading, tuserInfo, user, base } = this.props;
    const { getFieldDecorator } = form;
    const { info } = tuserInfo;
    const { SubwareList } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="用户姓名">
            {getFieldDecorator('realname', {
              initialValue: info.realname,
              rules: [
                {
                  required: true,
                  message: '必须输入用户姓名!',
                },
              ],
            })(<Input placeholder="请输入用户姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="用户登录账户">
            {getFieldDecorator('userAccount', {
              initialValue: info.userAccount,
              rules: [
                {
                  required: true,
                  message: '必须输入用户登录账户!',
                },
              ],
            })(
              <Input disabled={info.userAccount !== undefined} placeholder="请输入用户登录账户" />
            )}
          </FormItem>
          <FormItem label="用户角色" {...formItemLayout} hasFeedback>
            {getFieldDecorator('roleId', {
              initialValue: info.roleId,
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(user.roleId)
                  ? user.roleId.map(item => (
                      <Option key={item.roleCode} value={item.roleCode}>
                        {`${item.roleName}`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="部门">
            {getFieldDecorator('deptId', {
              initialValue: info.deptId,
              rules: [
                {
                  max: 64,
                  message: '部门必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入部门" />)}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="职务">
            {getFieldDecorator('resign', {
              initialValue: info.resign,
              rules: [
                {
                  max: 64,
                  message: '职务必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入职务" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="电话">
            {getFieldDecorator('mobile', {
              initialValue: info.mobile,
              rules: [
                {
                  required: false,
                  message: '必须输入电话',
                },
                {
                  max: 64,
                  message: '电话必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入电话" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="手机号">
            {getFieldDecorator('phone', {
              initialValue: info.phone,
              rules: [
                {
                  required: true,
                  message: '必须输入手机号',
                },
                {
                  max: 64,
                  message: '手机号必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="邮箱">
            {getFieldDecorator('email', {
              initialValue: info.email,
              rules: [
                {
                  type: 'email',
                  message: '请确认邮箱格式',
                },
                {
                  max: 64,
                  message: '邮箱必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="身份证号">
            {getFieldDecorator('identity', {
              initialValue: info.identity,
              rules: [
                {
                  len: 18,
                  message: '身份证号为18位!',
                },
              ],
            })(<Input placeholder="请输入身份证号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="子库编码">
            {getFieldDecorator('subwareCode', {
              initialValue: info.subwareCode,
              rules: [
                {
                  max: 256,
                  message: '子库编码必须小于256位!',
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
