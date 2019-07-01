/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Button, Spin, Select, Alert, Upload, Col } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import DelImg from '../../components/DelImg';
import {uploadImg} from '../../utils/uploadImg';
import ShengShiQu from '../../components/ShengShiQu';
import { webConfig } from '../../utils/Constant';
import { FormValid } from '../../utils/FormValid';
import QQMap from '../../components/QQMap';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TClzAssignfood';

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
  
  state = {
    uploading: false,
    mapPoint: {
      lng: 111.496392,
      lat: 36.952779
    }
  }

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
        if (this.props.base.info.tClzAssignfoodId) {
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

  goDel = () => {
    this.props.form.setFields({
      foodpiclink: {value: ""},
    });
    this.props.base.info.foodpiclink = "";
  }

  uploadChange = (file) => {
		this.props.dispatch({
			type: 'base/save',
			payload: {
				isSelectImg: file.fileList.length > 0,
			},
		})
		if(file.fileList.length > 0) {
      this.setState({
        uploading: true,
      });
			const imgKey = `${(this.props.base.info.tClzAssignfoodId || this.props.base.newInfo.tClzAssignfoodId)}.jpg`;
			uploadImg(file.fileList[0].originFileObj, imgKey).then( v => {
				if(v){
					this.props.form.setFields({
						assignfoodnpic: {value: webConfig.tpUriPre + imgKey},
          });
          console.log('上传成功');
          this.setState({
            uploading: false,
          });
				}else{
          console.log('上传失败');
          this.setState({
            uploading: false,
          });
				}
			});
		}else{
      this.props.form.setFields({
        assignfoodnpic: {value: ""},
      });
    }
  }

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="配菜点编号">
{getFieldDecorator('tClzAssignfoodId', {
 initialValue: info.tClzAssignfoodId || newInfo.tClzAssignfoodId,
  rules: [
    {
      required: true,
      message: '配菜点id不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 {<ShengShiQu getFieldDecorator={getFieldDecorator} base={base} form={form} gridType='info' formItemLayoutInfo={formItemLayout} />}
 <FormItem {...formItemLayout} hasFeedback label="详细地址">
{getFieldDecorator('address', {
 initialValue: info.address ||  newInfo.address,
  rules: [
    {
      required: true,
      message: '详细地址不能缺失!',
    },{ max: 255,message: '详细地址必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配菜点名称">
{getFieldDecorator('assignfoodname', {
 initialValue: info.assignfoodname ||  newInfo.assignfoodname,
  rules: [
    {
      required: true,
      message: '配菜点名称不能缺失!',
    },{ max: 255,message: '配菜点名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配菜点描述">
{getFieldDecorator('assignfooddesc', {
 initialValue: info.assignfooddesc ||  newInfo.assignfooddesc,
  rules: [
    {
      required: true,
      message: '配菜点描述不能缺失!',
    },{ max: 255,message: '配菜点描述必须小于255位!',   },
  ],
 })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="负责人名称">
{getFieldDecorator('assignfoodadminname', {
 initialValue: info.assignfoodadminname ||  newInfo.assignfoodadminname,
  rules: [
    {
      required: true,
      message: '负责人名称不能缺失!',
    },{ max: 255,message: '负责人名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="负责人联系方式">
{getFieldDecorator('assignfoodadminphone', {
 initialValue: info.assignfoodadminphone ||  newInfo.assignfoodadminphone,
  rules: [
    {
      required: true,
      message: '负责人联系方式不能缺失!',
    },{ max: 255,message: '负责人联系方式必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配菜点对外电话">
{getFieldDecorator('assignfoodphone', {
 initialValue: info.assignfoodphone ||  newInfo.assignfoodphone,
  rules: [
    {
      required: true,
      message: '配菜点对外电话不能缺失!',
    },{ max: 255,message: '配菜点对外电话必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="负责人账户">
{getFieldDecorator('useraccount', {
 initialValue: info.useraccount ||  newInfo.useraccount,
  rules: [
    {
      required: true,
      message: '负责人账户不能缺失!',
    },{ max: 255,message: '负责人账户必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="负责人密码">
{getFieldDecorator('userpassword', {
 initialValue: info.userpassword ||  newInfo.userpassword,
  rules: [
    {
      required: true,
      message: '负责人密码不能缺失!',
    },{ max: 255,message: '负责人密码必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="政府补贴费率">
{getFieldDecorator('subsideprice', {
 initialValue: info.subsideprice ||  newInfo.subsideprice,
  rules: [
    {
      required: true,
      message: '政府补贴费率',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="外墙广告价位">
{getFieldDecorator('advertisementprice', {
 initialValue: info.advertisementprice ||  newInfo.advertisementprice,
  rules: [
    {
      required: true,
      message: '外墙广告价位',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="外墙广告价位描述">
{getFieldDecorator('advertisementpricedesc', {
 initialValue: info.advertisementpricedesc ||  newInfo.advertisementpricedesc,
  rules: [
    {
      required: true,
      message: '外墙广告价位描述不能缺失!',
    },{ max: 255,message: '外墙广告价位描述必须小于255位!', },
  ],
 })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否交过保证金">
{getFieldDecorator('ispaygurantee', {
 initialValue: info.ispaygurantee ||  newInfo.ispaygurantee,
  rules: [
    {
      required: true,
      message: '是否交过保证金不能缺失!',
    },{ required: true,message: '是否交过保证金不能缺失!', },
  ],
 })(<Select>
   <Option value="1">是</Option>
   <Option value="0">否</Option>
 </Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="保证金数额">
{getFieldDecorator('guranteeamount', {
 initialValue: info.guranteeamount ||  newInfo.guranteeamount,
  rules: [
    {
      required: true,
      message: '保证金数额不能缺失!',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter='元' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="预留字段1">
{getFieldDecorator('yuliu1', {
 initialValue: info.yuliu1 ||  newInfo.yuliu1,
  rules: [
    {
      required: true,
      message: '预留字段1不能缺失!',
    },{ max: 255,message: '预留字段1必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="预留字段2">
{getFieldDecorator('yuliu2', {
 initialValue: info.yuliu2 ||  newInfo.yuliu2,
  rules: [
    {
      required: true,
      message: '预留字段2不能缺失!',
    },{ max: 255,message: '预留字段2必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="预留字段3">
{getFieldDecorator('yuliu3', {
 initialValue: info.yuliu3 ||  newInfo.yuliu3,
  rules: [
    {
      required: true,
      message: '预留字段3不能缺失!',
    },{ max: 255,message: '预留字段3必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配菜点外景图片">
{getFieldDecorator('assignfoodnpic', {
 initialValue: info.assignfoodnpic ||  newInfo.assignfoodnpic,
  rules: [
    {
      required: true,
      message: '图片不能缺失!',
    },{ max: 255,message: '图片的链接必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" disabled />)}
 <Alert type="warning" showIcon message="提示：只可选择一张图片，如果要重新选择图片，请先删除之前选择的图片" />
            {info.assignfoodnpic ? <DelImg goDel={this.goDel} imgUrl={info.assignfoodnpic + '?' + Math.random()} /> : ''}
            <Spin spinning={this.state.uploading} tip='图片上传中...'>
              <Upload
						  	disabled={this.props.form.getFieldValue("assignfoodnpic") !== undefined}
						  	onChange={this.uploadChange}
						  	listType="picture-card"
						  	multiple={false}
              	accept="image/jpg,image/jpeg,image/png"
						  	beforeUpload={(file, fileList) => {
						  		return false;
						  	}}>
						   选择配菜点外景图片
						  </Upload>
            </Spin>
						
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="经度">
{getFieldDecorator('longitude', {
 initialValue: info.longitude ||  newInfo.longitude,
  rules: [
    {
      required: true,
      message: '经度不能缺失!',
    },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="纬度">
{getFieldDecorator('latitude', {
 initialValue: info.latitude ||  newInfo.latitude,
  rules: [
    {
      required: true,
      message: '纬度不能缺失!',
    },
  ],
 })(<Input placeholder="请输入" />)}

   <Alert type="warning" showIcon message="提示：请点击下面的地图，可自动设置经度和纬度" />
<QQMap form={this.props.form} latFieldName='latitude' lngFieldName='longitude'  lng={info.longitude} lat={info.latitude} />
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
