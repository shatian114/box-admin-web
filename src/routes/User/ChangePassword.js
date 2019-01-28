/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 14:55:54 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-15 09:05:42
 */
import React from 'react';
import { Form, Button, Card, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import md5 from 'js-md5';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;

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

@connect(({ loading }) => ({
  submitting: loading.effects['user/changePassword'],
}))
@Form.create()
@Operate.create('/changePassword')
export default class ChangePassword extends React.PureComponent {
  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/changePassword',
          payload: {
            oldPass: md5(values.oldPassword),
            newPass: md5(values.password),
          },
          callback: () => this.props.dispatch({ type: 'login/logout' }),
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码必须一致!');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="旧密码">
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '必须输入!',
                },
              ],
            })(<Input type="password" placeholder="请输入旧密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '必须输入!',
                },
                {
                  min: 6,
                  message: '密码必须大于6位',
                },
                {
                  max: 16,
                  message: '密码必须小于16位!',
                },
                { validator: this.validateToNextPassword },
              ],
            })(<Input type="password" placeholder="请输入新密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="确认新密码">
            {getFieldDecorator('confirmPassword', {
              rules: [
                {
                  required: true,
                  message: '必须输入!',
                },
                { validator: this.compareToFirstPassword },
              ],
            })(
              <Input
                type="password"
                onBlur={this.handleConfirmBlur}
                placeholder="请再次输入新密码"
              />
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
            <Operate operateName="UPDATE">
              <Button
                style={{ marginLeft: 12 }}
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                完成
              </Button>
            </Operate>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
