/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import {Form, Input, InputNumber, Button, Spin, Select, Alert, Upload} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import {geneUuidArr, isEmpty} from '../../utils/utils';
import DelImg from "../../components/DelImg";
import QQMap from "../../components/QQMap";
import {uploadImg} from "../../utils/uploadImg";
import {webConfig} from "../../utils/Constant";
import {addobj, deleteobj, newoObj} from "../../services/api";

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const url = 'TArroundshopandservice';

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
    mainpicFile: [],
    addtagindexArr: [],
    submitting: false,
    indexImgArr: [],
  }

  delImgKeyArr = [];

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
        callback: () => {
          dispatch({
            type: 'list/listsaveinfo',
            payload: {
              url: '/api/TPicture/queryTPictureList',
              queryMap: {
                tagindex: this.props.base.info.tagindex,
              },
            },
          });
        }
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

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      submitting: true,
    });
    const { info, newInfo } = this.props.base;
    // 计算索引图
    let tagindex = '';
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      tagindex = info.tagindex && info.tagindex.length > 0 ? info.tagindex : `arroundshopandservice_${info.tArroundshopandserviceId}`;
    }else{
      tagindex = `arroundshopandservice_${newInfo.tArroundshopandserviceId}`;
    }

    // 删除tagindex
    for (let i=0; i<this.delImgKeyArr.length; i+=1) {
      await deleteobj({
        id: this.delImgKeyArr[i],
      }, 'TPicture');
    }
    // 先上传索引图
    const uuidArr = geneUuidArr(this.state.indexImgArr.length);
    // 获取newobj的tagidnex
    for(let i=0; i<uuidArr.length; i+=1) {
      let imgKey = this.props.base.info.tArroundshopandserviceId || this.props.base.newInfo.tArroundshopandserviceId;
      imgKey += `arroundshopandservice_${uuidArr[i]}.jpg`;
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
      const imgKey = `arroundshopandservice${this.props.base.info.tArroundshopandserviceId || this.props.base.newInfo.tArroundshopandserviceId}.jpg`;
      if(await uploadImg(file.fileList[0].originFileObj, imgKey)) {
        this.props.form.setFields({
          mainpic: {value: webConfig.tpUriPre + imgKey}
        });
        console.log('上传成功');
      }else {
        console.log('上传失败');
      }
    }
  }

  // 删除辅图
  delTagIndex = (imgUrl, imgIndex) => {
    let { queryTPictureList } = this.props.list;
    this.delImgKeyArr.push(queryTPictureList[imgIndex].t_picture_id);
    delete queryTPictureList[imgIndex];
    this.props.dispatch({
      type: 'list/save',
      payload: {
        'queryTPictureList': queryTPictureList,
      },
    });
  }

  render() {
    const { submitting, form, loading, base, list } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="店铺id">
{getFieldDecorator('tArroundshopandserviceId', {
 initialValue: info.tArroundshopandserviceId || newInfo.tArroundshopandserviceId,
  rules: [
    {
      required: true,
      message: '不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="区域标识">
{getFieldDecorator('zone', {
 initialValue: info.zone ||  newInfo.zone,
  rules: [
    {
      required: true,
      message: '区域标识不能缺失!',
    },{ max: 50,message: '区域标识必须小于50位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="实体店名称">
{getFieldDecorator('shopname', {
 initialValue: info.shopname ||  newInfo.shopname,
  rules: [
    {
      required: true,
      message: '实体店名称不能缺失!',
    },{ max: 255,message: '实体店名称必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="实体店描述">
{getFieldDecorator('shopdesc', {
 initialValue: info.shopdesc ||  newInfo.shopdesc,
  rules: [
    {
      required: true,
      message: '实体店描述不能缺失!',
    },{ max: 255,message: '实体店描述必须小于255位!',   },
  ],
 })(<TextArea autosize={webConfig.textAreaAutoSize} placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="地图位置">
{getFieldDecorator('maplink', {
 initialValue: info.maplink ||  newInfo.maplink,
  rules: [
    {
      required: true,
      message: '地图位置不能缺失!',
    },{ max: 255,message: '地图位置必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="联系手机">
{getFieldDecorator('mobilephone', {
 initialValue: info.mobilephone ||  newInfo.mobilephone,
  rules: [
    {
      required: true,
      message: '联系手机不能缺失!',
    },{ max: 255,message: '联系手机必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="座机">
{getFieldDecorator('telephone', {
 initialValue: info.telephone ||  newInfo.telephone,
  rules: [
    {
      required: true,
      message: '座机不能缺失!',
    },{ max: 255,message: '座机必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否审核过">
{getFieldDecorator('ispassed', {
 initialValue: info.ispassed ||  newInfo.ispassed,
  rules: [
    {
      required: true,
      message: '是否审核过不能缺失!',
    },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="排序">
            {getFieldDecorator('orderindex', {
              initialValue: info.orderindex ||  newInfo.orderindex,
              rules: [
                {
                  required: true,
                  message: '排序不能缺失!',
                }
              ],
            })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否置顶">
            {getFieldDecorator('istop', {
              initialValue: info.istop ||  newInfo.istop,
              rules: [
                {
                  required: true,
                  message: '是否置顶不能缺失!',
                },
              ],
            })(<Select>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="地址">
            {getFieldDecorator('address', {
              initialValue: info.address ||  newInfo.address,
              rules: [
                {
                  required: true,
                  message: '地址不能缺失!',
                },{ max: 500,message: '地址必须小于500位!',   },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="纬度">
{getFieldDecorator('lat', {
 initialValue: info.lat ||  newInfo.lat,
  rules: [
    {
      required: true,
      message: '纬度不能缺失!',
    },{ max: 255,message: '纬度必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="经度">
{getFieldDecorator('lng', {
 initialValue: info.lng ||  newInfo.lng,
  rules: [
    {
      required: true,
      message: '经度不能缺失!',
    },{ max: 255,message: '经度必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
   <Alert type="warning" showIcon message="提示：请点击下面的地图，可自动设置经度和纬度" />
   <QQMap form={this.props.form} latFieldName='lat' lngFieldName='lng' lng={info.longitude} lat={info.latitude} />
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="店铺主图">
{getFieldDecorator('mainpic', {
 initialValue: info.mainpic ||  newInfo.mainpic,
  rules: [
    {
      required: true,
      message: '店铺主图不能缺失!',
    },{ max: 500,message: '店铺主图必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" disabled />)}
   <Alert type="warning" showIcon message="提示：只可选择一张图片，如果要重新选择图片，请先删除之前选择的图片" />
   {info.mainpic ? <DelImg goDel={this.delMainpic} imgUrl={info.mainpic + '?' + Math.random()} /> : ''}
   <Upload
     onChange={this.uploadChange}
     fileList={this.state.mainpicFile}
     onRemove={(file) => {this.props.form.setFields({mainpic: undefined}); return true;}}
     listType="picture-card"
     multiple={false}
     accept="image/jpg,image/jpeg,image/png"
     beforeUpload={(file, fileList) => {
       return false;
     }}>
     选择店铺主图
   </Upload>
 </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="图片索引">
            {getFieldDecorator('tagindex', {
              initialValue: info.tagindex ||  newInfo.tagindex,
              rules: [
                {
                  required: true,
                  message: '图片索引不能缺失!',
                },{ max: 255,message: '图片索引必须小于255位!',   },
              ],
            })(<Input placeholder="请输入" disabled />)}
            {
              list.queryTPictureList.map((v, index) => (
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
              选择索引图
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
