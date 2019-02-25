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
const url = 'TActivity';

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
           <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('tActivityId', {
 initialValue: info.tActivityId || newInfo.tActivityId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="名称">
{getFieldDecorator('activityname', {
 initialValue: info.activityname ||  newInfo.activityname,
  rules: [
    {
      required: true,
      message: '名称不能缺失!',
    },{ max: 100,message: '名称必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="描述">
{getFieldDecorator('activitydesc', {
 initialValue: info.activitydesc ||  newInfo.activitydesc,
  rules: [
    {
      required: true,
      message: '描述不能缺失!',
    },{ max: 500,message: '描述必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="图标索引标识">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '图标索引标识不能缺失!',
    },{ max: 100,message: '图标索引标识必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否结束">
{getFieldDecorator('isover', {
 initialValue: info.isover ||  newInfo.isover,
  rules: [
    {
      required: true,
      message: '是否结束不能缺失!',
    },{ required: true,message: '是否结束不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发起人账户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '发起人账户不能缺失!',
    },{ max: 100,message: '发起人账户必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="预计举行时间">
{getFieldDecorator('plantime', {
 initialValue: info.plantime ||  newInfo.plantime,
  rules: [
    {
      required: true,
      message: '预计举行时间不能缺失!',
    },{ max: 100,message: '预计举行时间必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="期望总人数">
{getFieldDecorator('num', {
 initialValue: info.num ||  newInfo.num,
  rules: [
    {
      required: true,
      message: '期望总人数不能缺失!',
    },{ required: true,message: '期望总人数不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="主图">
{getFieldDecorator('mainpic', {
 initialValue: info.mainpic ||  newInfo.mainpic,
  rules: [
    {
      required: true,
      message: '主图不能缺失!',
    },{ max: 300,message: '主图必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地图位置">
{getFieldDecorator('maplink', {
 initialValue: info.maplink ||  newInfo.maplink,
  rules: [
    {
      required: true,
      message: '地图位置不能缺失!',
    },{ max: 400,message: '地图位置必须小于400位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区域标识">
{getFieldDecorator('zone', {
 initialValue: info.zone ||  newInfo.zone,
  rules: [
    {
      required: true,
      message: '区域标识不能缺失!',
    },{ max: 255,message: '区域标识必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="创建时间">
{getFieldDecorator('createtime', {
 initialValue: info.createtime ||  newInfo.createtime,
  rules: [
    {
      required: true,
      message: '创建时间不能缺失!',
    },{ max: 30,message: '创建时间必须小于30位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('lng', {
 initialValue: info.lng ||  newInfo.lng,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 50,message: '必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('lat', {
 initialValue: info.lat ||  newInfo.lat,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 50,message: '必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="">
{getFieldDecorator('address', {
 initialValue: info.address ||  newInfo.address,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },{ max: 200,message: '必须小于200位!',   },
  ],
 })(<Input placeholder="请输入" />)}
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
