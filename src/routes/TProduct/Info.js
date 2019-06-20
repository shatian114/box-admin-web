/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Spin, Select, Alert, Upload, Progress, message } from 'antd';
import { routerRedux } from 'dva/router';
import Operate from '../../components/Oprs';
import '../../utils/utils.less';
import { delArrEle } from '../../utils/utils';
import {uploadImg, uploadUgc} from '../../utils/uploadImg';
import DelImg from '../../components/DelImg';
import {webConfig} from '../../utils/Constant';

const UUID = require('uuidjs');
const FormItem = Form.Item;
const { Option } = Select;
const url = 'TProduct';
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
  list,
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {

  state = {
    percent: 0,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
			type: 'list/list',
			payload: {
				url: '/api/TProducttype/queryTProducttypeList'
			},
		});
		let isEdit = this.props.base.isEdit;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      isEdit = true;
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      isEdit = false;
      dispatch({
        type: 'base/new',
        url,
      });
    }
    dispatch({
			type: 'base/save',
			payload: {
				isEdit
			}
		});
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
        if (this.props.base.info.zone) {
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

  //上传主图
  uploadChange = async (file) => {
		this.props.dispatch({
			type: 'base/save',
			payload: {
				isSelectImg: file.fileList.length > 0
			}
		})
		if(file.fileList.length > 0) {
      message.info("开始上传主图");
      let imgKey = url + "/" + (this.props.base.info.tProductId || this.props.base.newInfo.tProductId)+'.jpg';
      if(await uploadImg(file.file, imgKey)){
        this.props.form.setFields({
          mainpic: {value: webConfig.tpUriPre + imgKey}
        });
        console.log('上传成功');
        message.success("主图上传成功");
      }else{
        console.log('上传失败');
        message.error("主图上传失败");
      }
		}
  }

  //上传视频
  uploadVideo = async (file) => {
    console.log("开始上传视频：", file);
    this.setState({
      percent: 0
    });
		this.props.dispatch({
			type: 'base/save',
			payload: {
				isSelectVideo: file.fileList.length > 0
			}
		})
		if(file.fileList.length > 0) {
      message.info("开始上传视频");
      let res = await uploadUgc(file.file, this.progressCall);
      console.log("上传结果: ", res);
      this.props.form.setFields({
        videolink: {value: res.video.url}
      });
      message.success("视频上传完成");
		}
  }
  
  //上传视频进度
  progressCall = result => {
    this.setState({
      percent: result,
    })
    console.log(result.curr);
  };

  //上传索引图
  uploadIndexImg = async (file) => {
    console.log("索引图file:", file);
    message.info("开始上传索引图");
    let imgKey = url + "/" + (this.props.base.info.tProductId || this.props.base.newInfo.tProductId) + "_" + UUID.generate() + ".jpg";
    if(await uploadImg(file.file, imgKey)){
      message.success("索引图上传成功");
      let indexImgArr = this.props.base.tagindex.length > 0 ? this.props.base.tagindex.split(",") : [];
      indexImgArr.push(webConfig.tpUriPre + imgKey);
      this.props.dispatch({
        type: 'base/save',
        payload: {
          tagindex: indexImgArr.join(",")
        }
      });
      this.props.form.setFields({
        tagindex: {value: indexImgArr.join(",")}
      });
    }else{
      message.error("索引图上传失败");
    }
  }

  //删除索引图
  delIndexImg = (imgUrl) => {
    let indexImgArr = this.props.base.tagindex.length > 0 ? this.props.base.tagindex.split(",") : [];
    indexImgArr = delArrEle(indexImgArr, imgUrl);
    this.props.dispatch({
      type: 'base/save',
      payload: {
        tagindex: indexImgArr.join(",")
      }
    });
    this.props.form.setFields({
      tagindex: {value: indexImgArr.join(",")}
    });
  }

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { info, newInfo} = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="产品id">
{getFieldDecorator('tProductId', {
 initialValue: info.tProductId || newInfo.tProductId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="产品类型">
{getFieldDecorator('producttypeid', {
 initialValue: info.producttypeid,
  rules: [
    {
      required: true,
      message: '产品类型不能缺失!',
    },{ required: true,message: '产品类型不能缺失!', },
  ],
 })(<Select dropdownMatchSelectWidth={true} disabled={this.props.base.isEdit}>
  {
    this.props.list.list.map((v, k) => (
      <Option key={k} value={v.producttypeid}>{v.producttypename}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区域标识">
{getFieldDecorator('zone', {
 initialValue: info.zone || '320000',
  rules: [
    {
      required: true,
      message: '区域标识不能缺失!',
    },{ max: 50,message: '区域标识必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品编号">
{getFieldDecorator('productid', {
 initialValue: info.productid ||  newInfo.productid,
  rules: [
    {
      required: true,
      message: '商品编号不能缺失!',
    },{ max: 50,message: '商品编号必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品排序">
{getFieldDecorator('orderindex', {
 initialValue: info.orderindex || '1',
  rules: [
    {
      required: true,
      message: '商品排序不能缺失!',
    },{ required: true,message: '商品排序不能缺失!', },
  ],
 })(<InputNumber min={0} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品名称">
{getFieldDecorator('productname', {
 initialValue: info.productname ||  newInfo.productname,
  rules: [
    {
      required: true,
      message: '商品名称不能缺失!',
    },{ max: 255,message: '商品名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品描述">
{getFieldDecorator('productdes', {
 initialValue: info.productdes ||  newInfo.productdes,
  rules: [
    {
      required: true,
      message: '商品描述不能缺失!',
    },{ max: 255,message: '商品描述必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="剩余数量">
{getFieldDecorator('num', {
 initialValue: info.num || 1000,
  rules: [
    {
      required: true,
      message: '剩余数量不能缺失!',
    },{ required: true,message: '剩余数量不能缺失!', },
  ],
 })(<InputNumber min={0} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="价格">
{getFieldDecorator('price', {
 initialValue: info.price ||  newInfo.price,
  rules: [
    {
      required: true,
      message: '价格不能缺失!',
    },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门店标识">
{getFieldDecorator('shoptag', {
 initialValue: info.shoptag ||  newInfo.shoptag,
  rules: [
    { max: 50,message: '门店标识必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否显示实时视频">
{getFieldDecorator('ishowvideolink', {
 initialValue: info.ishowvideolink || "0",
  rules: [
    {
      required: true,
      message: '是否显示实时视频不能缺失!',
    },{ required: true,message: '是否显示实时视频不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否审核过">
{getFieldDecorator('ispassed', {
 initialValue: info.ispassed || "1",
  rules: [
    {
      required: true,
      message: '是否审核过不能缺失!',
    },{ required: true,message: '是否审核过不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否置顶">
{getFieldDecorator('istop', {
 initialValue: info.istop || "0",
  rules: [
    {
      required: true,
      message: '是否置顶不能缺失!',
    },{ required: true,message: '是否置顶不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否允许用户上传图片">
{getFieldDecorator('isneeduserpic', {
 initialValue: info.isneeduserpic ||  newInfo.isneeduserpic || "1",
  rules: [
    {
      required: true,
      message: '是否允许用户上传图片不能缺失!',
    },{ required: true,message: '是否允许用户上传图片不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否用户可留言">
{getFieldDecorator('isneeduserinfo', {
 initialValue: info.isneeduserinfo ||  newInfo.isneeduserinfo || "1",
  rules: [
    {
      required: true,
      message: '是否用户可留言不能缺失!',
    },{ required: true,message: '是否用户可留言不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否需要输入完整收货地址">
{getFieldDecorator('isneeduseraddress', {
 initialValue: info.isneeduseraddress ||  newInfo.isneeduseraddress || "1",
  rules: [
    {
      required: true,
      message: '是否需要输入完整收货地址不能缺失!',
    },{ required: true,message: '是否需要输入完整收货地址不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否要填写桌号信息">
{getFieldDecorator('isneeddesktag', {
 initialValue: info.isneeddesktag || "0",
  rules: [
    {
      required: true,
      message: '是否要填写桌号信息不能缺失!',
    },{ required: true,message: '是否要填写桌号信息不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否放到首页">
{getFieldDecorator('isatmain', {
 initialValue: info.isatmain || "0",
  rules: [
    {
      required: true,
      message: '是否放到首页不能缺失!',
    },{ required: true,message: '是否放到首页不能缺失!', },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="视频链接">
{getFieldDecorator('videolink', {
 initialValue: info.videolink ||  newInfo.videolink,
  rules: [
    {
      required: true,
      message: '视频链接不能缺失!',
    },{ max: 255,message: '视频链接必须小于255位!',   },
  ],
 })(<Input disabled placeholder="请选择视频文件" />)}
 <Alert type="warning" showIcon message="提示：只可选择一个视频，如果要重新选择视频，请先删除之前选择的视频" />
  <Upload
  	disabled={this.props.base.isSelectVideo}
    onChange={this.uploadVideo}
    onRemove={(file) => {this.props.form.setFields({videolink: undefined}); return true;}}
  	listType="picture-card"
  	multiple={false}
  	beforeUpload={(file, fileList) => {
  		return false;
  	}}>
   选择视频文件
  </Upload>
  <Progress percent={this.state.percent} />
 </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="产品主图">
            {getFieldDecorator('mainpic', {
              initialValue: info.mainpic ||  newInfo.mainpic,
              rules: [
                {
                  required: true,
                  message: '产品主图不能缺失!',
                },{ max: 400,message: '产品主图必须小于400位!',   },
              ],
            })(<Input placeholder="请选择商品主图文件" disabled />)}
            <Alert type="warning" showIcon message="提示：只可选择一张图片，如果要重新选择图片，请先删除之前选择的图片" />
						{info.mainpic ? <DelImg goDel={() => {info.mainpic=undefined}} imgUrl={info.mainpic + '?' + Math.random()} /> : ''}
						<Upload
							disabled={this.props.base.isSelectImg}
              onChange={this.uploadChange}
              onRemove={(file) => {this.props.form.setFields({mainpic: undefined}); return true;}}
							listType="picture-card"
							multiple={false}
            	accept="image/jpg,image/jpeg,image/png"
							beforeUpload={(file, fileList) => {
								return false;
							}}>
						 选择商品主图
						</Upload>
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="产品辅图">
            {getFieldDecorator('tagindex', {
              initialValue: info.tagindex ||  newInfo.tagindex,
              rules: [
                {
                  required: true,
                  message: '产品辅图不能缺失!',
                },{ max: 65535,message: '产品辅图必须小于65535位!',   },
              ],
            })(<Input disabled placeholder="请选择产品辅图" />)}
            <span>
             {
               this.props.base.tagindex != "" ? 
              this.props.base.tagindex.split(",").map((v, k) => {
                return (
                 <DelImg imgUrl={v} key={v} goDel={this.delIndexImg} />
                )
                
              }) : ''
             }
            </span>
           
            <Upload
              onChange={this.uploadIndexImg}
              showUploadList={false}
            	listType="picture-card"
              multiple={false}
              onRemove={(file) => {console.log(file); return true;}}
            	accept="image/jpg,image/jpeg,image/png"
            	beforeUpload={(file, fileList) => {
            		return false;
            	}}>
             选择产品辅图
            </Upload>
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
