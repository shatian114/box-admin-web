/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select,DatePicker } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TBbsBak4';

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
{getFieldDecorator('tBbsBak4Id', {
 initialValue: info.tBbsBak4Id || newInfo.tBbsBak4Id,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发帖者账户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '发帖者账户不能缺失!',
    },{ max: 100,message: '发帖者账户必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="帖子文本">
{getFieldDecorator('text', {
 initialValue: info.text ||  newInfo.text,
  rules: [
    {
      required: true,
      message: '帖子文本不能缺失!',
    },{ max: 300,message: '帖子文本必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="帖子图片索引: 在另外一个表t_picture 根据tagindex 有关联url">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '帖子图片索引: 在另外一个表t_picture 根据tagindex 有关联url不能缺失!',
    },{ max: 300,message: '帖子图片索引: 在另外一个表t_picture 根据tagindex 有关联url必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发布时间">
{getFieldDecorator('timeinfo', {
 initialValue: info.timeinfo ||  newInfo.timeinfo,
  rules: [
    {
      required: true,
      message: '发布时间不能缺失!',
    },{ max: 100,message: '发布时间必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="帖子类型:文字类，比如分享 晒单等">
{getFieldDecorator('cardtype', {
 initialValue: info.cardtype ||  newInfo.cardtype,
  rules: [
    {
      required: true,
      message: '帖子类型:文字类，比如分享 晒单等不能缺失!',
    },{ max: 100,message: '帖子类型:文字类，比如分享 晒单等必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否删除">
{getFieldDecorator('deletehava', {
 initialValue: info.deletehava ||  newInfo.deletehava,
  rules: [
    {
      required: true,
      message: '是否删除不能缺失!',
    },{ required: true,message: '是否删除不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发帖者ip">
{getFieldDecorator('ip', {
 initialValue: info.ip ||  newInfo.ip,
  rules: [
    {
      required: true,
      message: '发帖者ip不能缺失!',
    },{ max: 255,message: '发帖者ip必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否视频类帖子">
{getFieldDecorator('isvideo', {
 initialValue: info.isvideo ||  newInfo.isvideo,
  rules: [
    {
      required: true,
      message: '是否视频类帖子不能缺失!',
    },{ required: true,message: '是否视频类帖子不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="视频缩略图">
{getFieldDecorator('videopic', {
 initialValue: info.videopic ||  newInfo.videopic,
  rules: [
    {
      required: true,
      message: '视频缩略图不能缺失!',
    },{ max: 700,message: '视频缩略图必须小于700位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="视频链接">
{getFieldDecorator('videolink', {
 initialValue: info.videolink ||  newInfo.videolink,
  rules: [
    {
      required: true,
      message: '视频链接不能缺失!',
    },{ max: 700,message: '视频链接必须小于700位!',   },
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
    },{ max: 10,message: '区域标识必须小于10位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="排序">
{getFieldDecorator('orderindex', {
 initialValue: info.orderindex ||  newInfo.orderindex,
  rules: [
    {
      required: true,
      message: '排序不能缺失!',
    },{ required: true,message: '排序不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否置顶">
{getFieldDecorator('istop', {
 initialValue: info.istop ||  newInfo.istop,
  rules: [
    {
      required: true,
      message: '是否置顶不能缺失!',
    },{ required: true,message: '是否置顶不能缺失!', },
  ],
 })(<InputNumber min={0} disabled />)}
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
