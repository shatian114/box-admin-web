/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Alert, Button, Spin, Select, Upload } from 'antd';
import { routerRedux } from 'dva/router';
import { FormValid } from '../../utils/FormValid';
import DelImg from '../../components/DelImg';
import {uploadImg} from '../../utils/uploadImg';
import Operate from '../../components/Oprs';
import { webConfig } from '../../utils/Constant';
import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;

const url = 'TClzFood';

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

  state = {
    uploading: false,
    mapPoint: {
      lat: '116.446238',
      lng: '39.970917',
    },
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzBigtype/queryTClzBigtypeList',
      },
    });
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzSmalltype/queryTClzSmalltypeList',
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
        if (this.props.base.info.tClzFoodId) {
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
			const imgKey = `${(this.props.base.info.tClzFoodId || this.props.base.newInfo.tClzFoodId)}.jpg`;
			uploadImg(file.fileList[0].originFileObj, imgKey).then( v => {
				if(v){
					this.props.form.setFields({
						foodpiclink: {value: webConfig.tpUriPre + imgKey},
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
        foodpiclink: {value: ""},
      });
    }
  }
  
  setMap = (...props) => {
    console.log('latitude: ', props);
  }

  changeBigtype = (bigtype_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzSmalltype/queryTClzSmalltypeList',
        queryMap: {
          t_clz_bigtype_id: bigtype_id,
        },
      },
    });
    this.props.form.setFieldsValue({'tClzSmalltypeId': ''});
  }

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="菜品id">
{getFieldDecorator('tClzFoodId', {
 initialValue: info.tClzFoodId || newInfo.tClzFoodId,
  rules: [
    {
      required: true,
      message: '菜品id不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="关联的大类">
{getFieldDecorator('tClzBigtypeId', {
 initialValue: info.tClzBigtypeId ||  newInfo.tClzBigtypeId,
  rules: [
    {
      required: true,
      message: '关联的大类不能缺失!',
    },{ max: 255,message: '关联的大类必须小于255位!',   },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.info.tClzBigtypeId} showSearch onChange={this.changeBigtype}>
  {
    this.props.list.queryTClzBigtypeList.map((v, k) => (
      <Option key={k} value={v.t_clz_bigtype_id}>{v.typename}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="关联的小类">
{getFieldDecorator('tClzSmalltypeId', {
 initialValue: info.tClzSmalltypeId ||  newInfo.tClzSmalltypeId,
  rules: [
    {
      required: true,
      message: '关联的小类不能缺失!',
    },{ max: 255,message: '关联的小类必须小于255位!',   },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.info.tClzSmalltypeId} showSearch>
  {
    this.props.list.queryTClzSmalltypeList.map((v, k) => (
      <Option key={k} value={v.t_clz_smalltype_id}>{v.typename}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="名称">
{getFieldDecorator('foodname', {
 initialValue: info.foodname ||  newInfo.foodname,
  rules: [
    {
      required: true,
      message: '名称不能缺失!',
    },{ max: 255,message: '菜的名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="描述">
{getFieldDecorator('fooddesc', {
 initialValue: info.fooddesc ||  newInfo.fooddesc,
  rules: [
    {
      required: true,
      message: '描述不能缺失!',
    },{ max: 255,message: '菜的描述必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="单价">
{getFieldDecorator('foodprice', {
 initialValue: info.foodprice ||  newInfo.foodprice,
  rules: [
    {
      required: true,
      message: '单价必填',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="单位">
{getFieldDecorator('foodunit', {
 initialValue: info.foodunit ||  newInfo.foodunit,
  rules: [
    {
      required: true,
      message: '单位必填',
    },{ max: 255,message: '单位必须小于255位!',   },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.info.tClzSmalltypeId}>
  {
    webConfig.foodunitNameArr.map((v, k) => (
      <Option key={k} value={v}>{v}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="图片">
{getFieldDecorator('foodpiclink', {
 initialValue: info.foodpiclink ||  newInfo.foodpiclink,
  rules: [
    {
      required: true,
      message: '图片不能缺失!',
    },{ max: 255,message: '图片的链接必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" disabled />)}
 <Alert type="warning" showIcon message="提示：只可选择一张图片，如果要重新选择图片，请先删除之前选择的图片" />
            {info.foodpiclink ? <DelImg goDel={this.goDel} imgUrl={info.foodpiclink + '?' + Math.random()} /> : ''}
            <Spin spinning={this.state.uploading} tip='图片上传中...'>
              <Upload
						  	disabled={this.props.form.getFieldValue("foodpiclink")}
						  	onChange={this.uploadChange}
						  	listType="picture-card"
						  	multiple={false}
              	accept="image/jpg,image/jpeg,image/png"
						  	beforeUpload={(file, fileList) => {
						  		return false;
						  	}}>
						   选择菜品图片
						  </Upload>
            </Spin>
						
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
