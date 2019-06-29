/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:10:47
 * @Description: 字典详情
 */

import  { queryList} from "../../services/list";
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Button, Spin, Select,DatePicker, Alert, Upload, message } from 'antd';
import DelImg from '../../components/DelImg';
import {uploadImg} from '../../utils/uploadImg';
import { FormValid } from '../../utils/FormValid';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { geneUuidArr, getPiclinkList } from '../../utils/utils';
import {webConfig} from '../../utils/Constant';
import {addobj, deleteobj, newoObj} from "../../services/api";

const FormItem = Form.Item;
const { Option } = Select;

const DateTimeFormat = 'YYYY-MM-DD hh:mm:ss';
const url = 'TProducttrade';

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

@connect(({ base, list, loading }) => ({
  base,
  list,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {

  delImgKeyArr = []

  state = {
    addtagindexArr: [],
    addshoppicArr: [],
    submitting: false,
    percent: 0,
    indexImgArr: [],
    tagindexArr: [],
    shoppicArr: [],
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
        callback: async () => {
          this.setState({
            tagindexArr: await getPiclinkList('tagindex', this.props.base.info.tagindex),
            shoppicArr: await getPiclinkList('tagindex', this.props.base.info.shoppic),
          });
        },
      });
    } else {
      dispatch({
        type: 'base/new',
        url,
      });
    }
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TProduct/queryTProductList',
      },
    });
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
    let tagindex = '', shoppic = '';
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      tagindex = info.tagindex && info.tagindex.length > 0 ? info.tagindex : `tProducttrade_tagindex_${this.props.form.getFieldValue('tProducttradeId')}`;
      shoppic = info.shoppic && info.shoppic.length > 0 ? info.shoppic : `tProducttrade_shoppic_${this.props.form.getFieldValue('tProducttradeId')}`;
    }else{
      tagindex = `tProducttrade_tagindex_${this.props.form.getFieldValue('tProducttradeId')}`;
      shoppic = `tProducttrade_shoppic_${this.props.form.getFieldValue('tProducttradeId')}`;
    }

    if(this.props.base.isEdit && this.props.base.info.tagindex.length > 0) {
      // 删除tagindex和shoppic
      console.log('delImgKeyArr: ', this.delImgKeyArr);
      for (let i=0; i<this.delImgKeyArr.length; i+=1) {
        await deleteobj({
          id: this.delImgKeyArr[i],
        }, 'TPicture');
      }
    }
    // 先上传索引图
    let uuidArr = geneUuidArr(this.state.addtagindexArr.length);
    // 获取newobj的tagidnex
    for(let i=0; i<uuidArr.length; i+=1) {
      let imgKey = this.props.base.info.tProducttradeId || this.props.base.newInfo.tProducttradeId;
      imgKey = `tProducttrade${imgKey}_indexTag_${uuidArr[i]}.jpg`;
      const upImgRes = await uploadImg(this.state.addtagindexArr[i].originFileObj, imgKey);
      if (upImgRes) {
        let response = await newoObj('TPicture');
        if (response && response.code.startsWith('2')) {
          const { tPictureId}  = response.data;
          response = await addobj({
            'tPictureId': tPictureId,
            tagindex: tagindex,
            piclink: webConfig.tpUriPre + imgKey,
          }, 'TPicture');
        }
      }
    }
    // 上商家额外提供的图片
     uuidArr = geneUuidArr(this.state.addshoppicArr.length);
    // 获取newobj的tagidnex
    for(let i=0; i<uuidArr.length; i+=1) {
      let imgKey = this.props.base.info.tProducttradeId || this.props.base.newInfo.tProducttradeId;
      imgKey = `tProducttrade${imgKey}_shoppic_${uuidArr[i]}.jpg`;
      const upImgRes = await uploadImg(this.state.addshoppicArr[i].originFileObj, imgKey);
      if (upImgRes) {
        let response = await newoObj('TPicture');
        if (response && response.code.startsWith('2')) {
          const { tPictureId}  = response.data;
          response = await addobj({
            'tPictureId': tPictureId,
            tagindex: shoppic,
            piclink: webConfig.tpUriPre + imgKey,
          }, 'TPicture');
        }
      }
    }

    this.props.form.setFieldsValue({
      'tagindex': tagindex,
      'shoppic': shoppic,
    });

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         let temp = {};
         values.buytime = values.buytime.format(DateTimeFormat);
         values.sendtime = values.sendtime.format(DateTimeFormat);
        const { dispatch } = this.props;
        if (this.props.base.info.tProducttradeId) {
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

  // 删除辅图
  delTagIndex = (imgUrl, imgIndex) => {
    let tagindexArr = this.state.tagindexArr;
    this.delImgKeyArr.push(tagindexArr[imgIndex].t_picture_id);
    delete tagindexArr[imgIndex];
    this.setState({
      'tagindexArr': tagindexArr,
    });
  }

  // 删除商家额外提供的图片
  delShoppic = (imgUrl, imgIndex) => {
    let shoppicArr = this.state.shoppicArr;
    this.delImgKeyArr.push(shoppicArr[imgIndex].t_picture_id);
    delete shoppicArr[imgIndex];
    this.setState({
      'shoppicArr': shoppicArr,
    });
  }

  render() {
    const { submitting, form, loading, base, list } = this.props;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="交易单号">
{getFieldDecorator('tProducttradeId', {
 initialValue: info.tProducttradeId || newInfo.tProducttradeId,
  rules: [
    {
      required: true,
      message: '交易单号不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品">
{getFieldDecorator('productid', {
 initialValue: info.productid ||  newInfo.productid,
  rules: [
    {
      required: true,
      message: '商品不能缺失!',
    },{ max: 40,message: '商品必须小于40位!',   },
  ],
 })(<Select allowClear showSearch dropdownMatchSelectWidth={true} disabled={this.props.base.isEdit}>
  {
    list.queryTProductList.map((v, k) => (
      <Option key={k} value={v.productid}>{v.productname}</Option>
    ))
   }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="购买价格">
{getFieldDecorator('price', {
 initialValue: info.price ||  newInfo.price,
  rules: [
    {
      required: true,
      message: '购买价格不能缺失!',
    },{ validator: FormValid.jine }
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户账户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '用户账户不能缺失!',
    },{ max: 255,message: '用户账户必须小于255位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="购买时间">
{getFieldDecorator('buytime', {
 initialValue: moment(info.buytime ||  newInfo.buytime),
  rules: [
    {
      required: true,
      message: '购买时间不能缺失!',
    },
  ],
 })(<DatePicker showTime format={DateTimeFormat} placeholder='请输入' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="是否发货">
{getFieldDecorator('issend', {
 initialValue: info.issend ||  newInfo.issend,
  rules: [
    {
      required: true,
      message: '是否发货不能缺失!',
    },
  ],
 })(<Select>
  <Option value={1}>是</Option>
  <Option value={0}>否</Option>
</Select>)}
 </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否支付">
            {getFieldDecorator('ispaid', {
              initialValue: info.ispaid ||  newInfo.ispaid,
              rules: [
                {
                  required: true,
                  message: '是否支付不能缺失!',
                },
              ],
            })(<Select>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>)}
          </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="发货时间">
{getFieldDecorator('sendtime', {
 initialValue: moment(info.sendtime ||  newInfo.sendtime),
  rules: [
    {
      required: true,
      message: '发货时间不能缺失!',
    }
  ],
 })(<DatePicker showTime format={DateTimeFormat} placeholder='请输入' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户留言">
{getFieldDecorator('userinfo', {
 initialValue: info.userinfo ||  newInfo.userinfo,
  rules: [
    {
      required: true,
      message: '用户留言不能缺失!',
    },{ max: 1000,message: '用户留言必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商家留言">
{getFieldDecorator('shopinfo', {
 initialValue: info.shopinfo ||  newInfo.shopinfo,
  rules: [
    {
      required: true,
      message: '商家留言不能缺失!',
    },{ max: 1000,message: '商家留言必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品数量">
{getFieldDecorator('num', {
 initialValue: info.num ||  newInfo.num,
  rules: [
    {
      required: true,
      message: '商品数量不能缺失!',
    }, {validator: FormValid.onlyNumber}
  ],
 })(<InputNumber min={0} />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="总额">
{getFieldDecorator('total', {
 initialValue: info.total ||  newInfo.total,
  rules: [
    {
      required: true,
      message: '总额不能缺失!',
    },{validator: FormValid.jine}
  ],
 })(<Input addonAfter='元' placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="物流单号等">
{getFieldDecorator('other', {
 initialValue: info.other ||  newInfo.other,
  rules: [
    {
      required: true,
      message: '物流单号等不能缺失!',
    },{ max: 500,message: '物流单号等必须小于500位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="门店标识">
{getFieldDecorator('shoptag', {
 initialValue: info.shoptag ||  newInfo.shoptag,
  rules: [
    {
      required: true,
      message: '门店标识不能缺失!',
    },{ max: 300,message: '门店标识必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="桌号">
{getFieldDecorator('desktag', {
 initialValue: info.desktag ||  newInfo.desktag,
  rules: [
    {
      required: true,
      message: '桌号不能缺失!',
    },{ max: 300,message: '桌号必须小于300位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="提取编号">
{getFieldDecorator('getproductcode', {
 initialValue: info.getproductcode ||  newInfo.getproductcode,
  rules: [
    {
      required: true,
      message: '提取编号',
    },{ max: 100,message: '提取编号必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="收货地址信息">
{getFieldDecorator('recieveaddress', {
 initialValue: info.recieveaddress ||  newInfo.recieveaddress,
  rules: [
    {
      required: true,
      message: '收货地址信息不能缺失!',
    },{ max: 1000,message: '收货地址信息必须小于1000位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单号">
{getFieldDecorator('seq', {
 initialValue: info.seq ||  newInfo.seq,
  rules: [
    {
      required: true,
      message: '订单号不能缺失!',
    },{ max: 100,message: '订单号必须小于100位!',   },
  ],
 })(<Input placeholder="请输入" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="卖家额外提供的图片">
{getFieldDecorator('shoppic', {
 initialValue: info.shoppic ||  newInfo.shoppic,
  rules: [
    {
      required: true,
      message: '卖家额外提供的图片不能缺失!',
    },{ max: 400,message: '卖家额外提供的图片必须小于400位!',   },
  ],
 })(<Input placeholder="请选择卖家额外提供的图片文件" disabled />)}
   {
     this.state.shoppicArr.map((v, index) => (
       <DelImg key={v.t_picture_id} goDel={this.delShoppic} imgUrl={`${v.piclink}`} imgIndex={index} />
     ))
   }
						<Upload
              onChange={file => {this.setState({addshoppicArr: file.fileList});}}
              listType="picture-card"
              multiple
              accept="image/jpg,image/jpeg,image/png"
              beforeUpload={(file, fileList) => {
                return false;
              }}>
						 选择卖家额外提供的图片
						</Upload>
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="商品图片索引">
{getFieldDecorator('tagindex', {
 initialValue: info.tagindex ||  newInfo.tagindex,
  rules: [
    {
      required: true,
      message: '商品图片索引不能缺失!',
    },{ max: 255,message: '商品图片索引必须小于255位!',   },
  ],
 })(<Input placeholder="请选择商品索引图" disabled />)}
   {
     this.state.tagindexArr.map((v, index) => (
       <DelImg key={v.t_picture_id} goDel={this.delTagIndex} imgUrl={`${v.piclink}`} imgIndex={index} />
     ))
   }
  <Upload
    onChange={file => {this.setState({addtagindexArr: file.fileList});}}
    listType="picture-card"
    multiple
    accept="image/jpg,image/jpeg,image/png"
    beforeUpload={(file, fileList) => {
      return false;
    }}>
   选择商品索引图
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
                loading={this.state.submitting}
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
