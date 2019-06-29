/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import { newoObj, addobj, deleteobj } from "../../services/api";
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Spin, Select,DatePicker, Alert, Upload, Progress } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import {isEmpty, geneUuidArr, delArrEle, getPiclinkList} from '../../utils/utils';
import {uploadImg, uploadUgc} from '../../utils/uploadImg';
import DelImg from '../../components/DelImg';
import {webConfig} from '../../utils/Constant';
import { FormValid } from '../../utils/FormValid';

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
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
    mainpicFile: undefined,
    videoFile: undefined,
    addtagindexArr: [],
    tagindexArr: [],
    indexImgArr: [],
    submitting: false,
    percent: 0,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TProducttype/queryTProducttypeList',
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
        callback: async () => {
          this.setState({
            tagindexArr: await getPiclinkList('tagindex', this.props.base.info.tagindex),
          });
        },
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
				isEdit,
			},
		});
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  delImgKeyArr = [];

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      submitting: true,
    });
    const { info, newInfo } = this.props.base;
    // 计算索引图
    let tagindex = '';
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      tagindex = info.tagindex && info.tagindex.length > 0 ? info.tagindex : `tproduct_${info.tProductId}`;
    }else{
      tagindex = `tproduct_${newInfo.tProductId}`;
    }

    if(this.props.base.isEdit && this.props.base.info.tagindex.length > 0) {
      // 删除tagindex
      for (let i=0; i<this.delImgKeyArr.length; i+=1) {
        await deleteobj({
          id: this.delImgKeyArr[i],
        }, 'TPicture');
      }
    }
    // 先上传索引图
    const uuidArr = geneUuidArr(this.state.indexImgArr.length);
    // 获取newobj的tagidnex
    for(let i=0; i<uuidArr.length; i+=1) {
      let imgKey = this.props.base.info.tProductId || this.props.base.newInfo.tProductId;
      imgKey += `_tproduct_${uuidArr[i]}.jpg`;
      // tagindexArr.push(webConfig.tpUriPre + imgKey);
      const upImgRes = await uploadImg(this.state.indexImgArr[i].originFileObj, imgKey);
      if (upImgRes) {
        let response = await newoObj('TPicture');
        if (response && response.code.startsWith('2')) {
          const { tPictureId}  = response.data;
          response = await addobj({
            'tPictureId': tPictureId,
            'tagindex': tagindex,
            piclink: webConfig.tpUriPre + imgKey,
          }, 'TPicture');
        }
      }
    }

    this.props.form.setFieldsValue({
      'tagindex': tagindex,
    });
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

    this.setState({
      submitting: false,
    });
  };

  // 删除主图
  delMainpic = () => {
    const { info } = this.props.base;
    info.mainpic = undefined;
    this.props.dispatch({
      type: 'base/save',
      payload: {
        'info': info,
      },
    });
  }

  // 上传主图
  uploadChange = async (file) => {
		this.props.dispatch({
			type: 'base/save',
			payload: {
				isSelectImg: file.fileList.length > 0,
			},
		});
		if(file.fileList.length > 0) {
		  this.setState({
        mainpicFile: [file.fileList[file.fileList.length-1]],
      });
      const { info } = this.props.base;
      info.mainpic = undefined;
      this.props.dispatch({
        type: 'base/save',
        payload: {
          'info': info,
        },
      });
			const imgKey = `tproduct_${this.props.base.info.tProductId || this.props.base.newInfo.tProductId}.jpg`;
			if(await uploadImg(file.fileList[0].originFileObj, imgKey)) {
        this.props.form.setFields({
          mainpic: {value: webConfig.tpUriPre + imgKey},
        });
        console.log('上传成功');
      }else {
        console.log('上传失败');
      }
		}
  }

  // 删除辅图
  delTagIndex = (imgUrl, imgIndex) => {
    let tagindexArr = this.state.tagindexArr;
    this.delImgKeyArr.push(tagindexArr[imgIndex].t_picture_id);
    delete tagindexArr[imgIndex];
    this.setState({
      'tagindexArr': tagindexArr,
    });
  }

  // 上传视频
  uploadVideo = (file) => {
    this.setState({
      percent: 0,
    });
		this.props.dispatch({
			type: 'base/save',
			payload: {
				isSelectVideo: file.fileList.length > 0
			}
		})
		if(file.fileList.length > 0) {
      this.setState({
        videoFile: [file.fileList[file.fileList.length-1]],
      });
      const { info } = this.props.base;
      info.videolink = undefined;
      this.props.dispatch({
        type: 'base/save',
        payload: {
          'info': info,
        },
      });
      uploadUgc(file.fileList[0].originFileObj, this.progressCall).then(res => {
        console.log("视频上传成功：", res);
        const infoTmp = this.props.base.info;
        infoTmp.videolink = res.video.url;
        this.props.dispatch({
          type: 'base/save',
          payload: {
            info: infoTmp,
          },
        });
      }).then(err => {
        console.log('上传视频错误：', err);
      });
		}
  }
  
  //上传视频进度
  progressCall = result => {
    this.setState({
      percent: result,
    })
    console.log(result.curr);
  };

  render() {
    const { submitting, form, loading, base, list } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

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
 initialValue: info.producttypeid ||  '',
  rules: [
    {
      required: true,
      message: '产品类型不能缺失!',
    },{ required: true,message: '产品类型不能缺失!', },
  ],
 })(<Select allowClear showSearch dropdownMatchSelectWidth={true} disabled={this.props.base.isEdit}>
  {
    this.props.list.queryTProducttypeList.map((v, k) => (
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
 initialValue: info.orderindex || 1,
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
    },{ validator:FormValid.onlyNumber },
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
    }, {validator: FormValid.jine}
  ],
 })(<InputNumber placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门店标识">
{getFieldDecorator('shoptag', {
 initialValue: info.shoptag || newInfo.shoptag || '',
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否审核过">
{getFieldDecorator('ispassed', {
 initialValue: info.ispassed ||  newInfo.ispassed || "1",
  rules: [
    {
      required: true,
      message: '是否审核过不能缺失!',
    },{ required: true,message: '是否审核过不能缺失!', },
  ],
 })(<Select>
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
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
  <Option value="1">是</Option>
 <Option value="0">否</Option>
</Select>)}
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
 <Alert type="warning" showIcon message="提示：只可选择一张图片，重新选择的图片会覆盖之前的图片" />
						{info.mainpic ? <DelImg goDel={this.delMainpic} imgUrl={info.mainpic + '?' + Math.random()} /> : ''}
						<Upload
              fileList={this.state.mainpicFile}
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
    { max: 65535,message: '产品辅图必须小于65535位!',   },
  ],
 })(<Input placeholder="请选择产品辅图" disabled />)}
   {
     this.state.tagindexArr.map((v, index) => (
      <DelImg key={v.t_picture_id} goDel={this.delTagIndex} imgUrl={`${v.piclink}`} imgIndex={index} />
     ))
   }
  <Upload
  	onChange={file => {this.setState({indexImgArr: file.fileList});}}
  	listType="picture-card"
  	multiple
  	accept="image/jpg,image/jpeg,image/png"
  	beforeUpload={(file, fileList) => {
  		return false;
  	}}>
   选择产品辅图
  </Upload>
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="视频链接">
{getFieldDecorator('videolink', {
 initialValue: info.videolink || newInfo.videolink || '',
  rules: [{ max: 255,message: '视频链接必须小于255位!',   },
  ],
 })(<Input disabled placeholder="请选择视频文件" />)}
 <Alert type="warning" showIcon message="提示：只可选择一个视频，重新上传的视频会覆盖之前的视频" />
   {
     info.videolink && info.videolink.length > 0 ? <div><a href={info.videolink} target="_blank">查看视频</a></div> : ''
   }
  <Upload
  	fileList={this.state.videoFile}
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
                loading={this.state.submitting || submitting}
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
