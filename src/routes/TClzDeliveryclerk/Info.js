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
import { FormValid } from '../../utils/FormValid';
import Operate from '../../components/Oprs';
import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TClzDeliveryclerk';

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
      type: 'list/list',
      payload: {
        url: '/api/TClzAssignfood/queryTClzAssignfoodList',
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
        if (this.props.base.info.tClzDeliveryclerkId) {
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
           <FormItem {...formItemLayout} hasFeedback label="配送员编号">
{getFieldDecorator('tClzDeliveryclerkId', {
 initialValue: info.tClzDeliveryclerkId || newInfo.tClzDeliveryclerkId,
  rules: [
    {
      required: true,
      message: '配送员编号不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="所属配送点">
{getFieldDecorator('assignfoodId', {
 initialValue: info.assignfoodId ||  newInfo.assignfoodId,
  rules: [
    {
      required: true,
      message: '配送点编号不能缺失!',
    },{ max: 255,message: '配送点编号必须小于255位!',   },
  ],
 })(<Select dropdownMatchSelectWidth={true}>
  {
    this.props.list.list.map((v, k) => (
      <Option key={k} value={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="账号">
{getFieldDecorator('useraccount', {
 initialValue: info.useraccount ||  newInfo.useraccount,
  rules: [
    {
      required: true,
      message: '账号不能缺失!',
    },{ max: 255,message: '账号必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="密码">
{getFieldDecorator('userpassword', {
 initialValue: info.userpassword ||  newInfo.userpassword,
  rules: [
    {
      required: true,
      message: '密码不能缺失!',
    },{ max: 255,message: '密码必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地址">
{getFieldDecorator('deliveryclerkadress', {
 initialValue: info.deliveryclerkadress ||  newInfo.deliveryclerkadress,
  rules: [
    {
      required: true,
      message: '地址不能缺失!',
    },{ max: 255,message: '地址必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="联系电话">
{getFieldDecorator('userphone', {
 initialValue: info.userphone ||  newInfo.userphone,
  rules: [
    {
      required: true,
      message: '联系电话不能缺失!',
    },{ max: 255,message: '联系电话必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="姓名">
{getFieldDecorator('username', {
 initialValue: info.username ||  newInfo.username,
  rules: [
    {
      required: true,
      message: '姓名不能缺失!',
    },{ max: 255,message: '姓名必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="描述">
{getFieldDecorator('userdesc', {
 initialValue: info.userdesc ||  newInfo.userdesc,
  rules: [
    {
      required: true,
      message: '描述不能缺失!',
    },{ max: 255,message: '描述必须小于255位!',   },
  ],
 })(<TextArea placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配送单价">
{getFieldDecorator('userprice', {
 initialValue: info.userprice ||  newInfo.userprice,
  rules: [
    {
      required: true,
      message: '配送单价不能缺失!',
    },{ validator: FormValid.jine },
  ],
 })(<InputNumber min={0} />)}
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
