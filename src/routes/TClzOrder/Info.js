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
import { FormValid } from '../../utils/FormValid';
import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';
import { ordergetstatusdesArr, ordergetstatusArr } from "../../utils/Constant";

const FormItem = Form.Item;
const { Option } = Select;

const { TextArea } = Input;
const DateFormat = 'YYYY-MM-DD';
const DateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const url = 'TClzOrder';

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

@connect(({ base, loading, list }) => ({
  list,
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class DicManagerInfo extends Component {

  state = {
    setqueryTClzDeliveryclerkList: [],
    useraddressList: [],
    gettype: '',
    isEdit: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      this.setState({
        isEdit: true,
      });
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
        callback: this.getParentInfo, // 先获取信息，再获取需要的父参数
      });
    } else {
      dispatch({
        type: 'base/new',
        url,
        callback: this.getParentInfo,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  getParentInfo = () => {

    // 先判断获取方式，设置对应的参数
    this.changeGettype(this.props.base.info.gettype);
    const { dispatch } = this.props;
    // 先获取配菜点，再获取配送员
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzAssignfood/queryTClzAssignfoodList',
      },
      callback: () => {
        dispatch({
          type: 'list/listsaveinfo',
          payload: {
            url: '/api/TClzDeliveryclerk/queryTClzDeliveryclerkList',
          },
        });
      },
    });
    // 先获取用户，再获取用户地址
    dispatch({
      type: 'list/listsaveinfo',
      payload: {
        url: '/api/TClzUser/queryTClzUserList',
      },
      callback: () => {
        dispatch({
          type: 'list/listsaveinfo',
          payload: {
            url: '/api/TClzUseraddress/queryTClzUseraddressList',
            userid: this.props.base.info.userid,
          },
          callback: this.setUseraddreddList,
        });
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let temp = {
          ordergetstatusdes: ordergetstatusdesArr[values.ordergetstatus - 1],
        };
        let valuesTemp = values;
        valuesTemp.ordertime = moment(values.ordertime._d).format('YYYY-MM-DD HH:mm:ss');
        valuesTemp.orderdate = moment(values.orderdate._d).format('YYYY-MM-DD');
        console.log(temp, values, valuesTemp);
        const { dispatch } = this.props;
        if (this.props.base.info.tClzOrderId) {
          dispatch({
            type: 'base/fetch',
            payload: {
              ...valuesTemp,
                  ...temp,
            },
            callback: () => dispatch(routerRedux.goBack()),
            url,
          });
        } else {
          // 如果是新建，并且时间是17点后，则将orderdate设置为第二天
          if(moment().format("HH") > 16) {
            valuesTemp.orderdate = moment(values.orderdate._d).add(1, 'days').format('YYYY-MM-DD')
          }
          dispatch({
            type: 'base/fetchAdd',
            payload: {
              ...this.props.base.newInfo,
              ...valuesTemp,
                  ...temp,
              orderstatus: '1',
            },
            callback: () => dispatch(routerRedux.goBack()),
            url,
          });
        }
      }
    });
  };

  changeSetassignfood = (assignfoodid) => {
    let deliveryclerklist = [];
    const { queryTClzDeliveryclerkList } = this.props.list;
    queryTClzDeliveryclerkList.map(o => {
      if(o && (o.assignfood_id == assignfoodid)) {
        deliveryclerklist.push(o);
      }
    });
    this.setState({
      setqueryTClzDeliveryclerkList: deliveryclerklist,
    });
  }

  changeGettype = (gettype) => {
    this.setState({
      'gettype': gettype,
    });
    // 新建则固定为1，修改的时候可改
    if (this.props.base.info.tClzOrderId){
      if(gettype === '1') {
        this.props.form.setFieldsValue({
          tClzDeliveryclerkId: '',
          tClzUseraddressId: '',
          ordergetstatus: '2',
        });
      }
      if(gettype === '2') {
        this.props.form.setFieldsValue({
          ordergetstatus: '6',
        });
      }
    }

  }

  changeUserid = (userid) => {
    this.setUseraddreddList(userid);
  }

  setUseraddreddList = (userid) => {
    const useraddressList = [];
    // 筛选出选中用户的地址和默认地址
    let defaultUseraddressid = this.props.base.info.tClzUseraddressId;
    this.props.list.queryTClzUseraddressList.map(v => {
      if(v.userid === userid) {
        useraddressList.push(v);
        if(v.isdefault === '1' && !defaultUseraddressid && defaultUseraddressid !== '') {
          defaultUseraddressid = v.t_clz_useraddress_id;
        }
      }
    });

    // 如果没有默认地址，并且地址列表不为空，则将第一个地址作为默认地址
    if(!defaultUseraddressid && useraddressList.length > 0) {
      defaultUseraddressid = useraddressList[0].t_clz_useraddress_id;
    }
    this.setState({
      'useraddressList': useraddressList,
    });
    this.props.form.setFieldsValue({
      tClzUseraddressId: defaultUseraddressid,
    });
  }

  render() {
    const { submitting, form, loading, base, list } = this.props;
    const { queryTClzDeliveryclerkList, queryTClzAssignfoodList  } = list;
    const { getFieldDecorator } = form;
    
  const { info, newInfo } = base;

    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
           <FormItem {...formItemLayout} hasFeedback label="订单id">
{getFieldDecorator('tClzOrderId', {
 initialValue: info.tClzOrderId || newInfo.tClzOrderId,
  rules: [
    {
      required: true,
      message: '订单id不能缺失!',
    },
  ],
 })(<Input disabled />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="用户">
{getFieldDecorator('userid', {
 initialValue: info.userid ||  newInfo.userid,
  rules: [
    {
      required: true,
      message: '用户不能缺失!',
    },{ max: 255,message: '用户必须小于255位!',   },
  ],
 })(<Select showSearch allowClear onChange={this.changeUserid} disabled={this.state.isEdit}>
  {
    this.props.list.queryTClzUserList.map(v => (
      <Option key={v.userid} value={v.userid}>{v.nickname}</Option>
    ))
  }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="买家指定的送货地址">
{getFieldDecorator('tClzUseraddressId', {
 initialValue: info.tClzUseraddressId || newInfo.tClzUseraddressId,
  rules: [
    {
      required:  this.state.gettype!=='1',
      message: '买家指定的送货地址不能缺失!',
    },{ max: 255,message: '买家指定的送货地址必须小于255位!',   },
  ],
 })(<Select showSearch allowClear disabled={this.state.gettype==='1'}>
   <Option key='0' value=''></Option>
  {
    this.state.useraddressList.map(v => (
      <Option key={v.t_clz_useraddress_id} value={v.t_clz_useraddress_id}>{v.recieveaddress}</Option>
    ))
  }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="本订单总金额">
{getFieldDecorator('totalamount', {
 initialValue: info.totalamount ||  newInfo.totalamount,
  rules: [
    {
      required: true,
      message: '本订单总金额不能缺失!',
    },{ validator: FormValid.jine },
  ],
 })(<Input addonAfter="元" />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="下单时间">
{getFieldDecorator('ordertime', {
 initialValue: moment(info.ordertime || moment(), DateTimeFormat),
  rules: [
    {
      required: true,
      message: '下单时间不能缺失!',
    }
  ],
 })(<DatePicker showTime format='YYYY-MM-DD HH:mm:ss' placeholder='请输入' />)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="订单日期">
 {getFieldDecorator('orderdate', {
 initialValue: moment(info.orderdate || moment(), DateTimeFormat),
  rules: [
    {
      required: true,
      message: '订单日期不能缺失!',
    }
  ],
 })(<DatePicker showTime format='YYYY-MM-DD' placeholder='请输入' />)}
 </FormItem>
          {
            !this.state.isEdit ? <FormItem {...formItemLayout} hasFeedback label="获取方式">
              {getFieldDecorator('gettype', {
                initialValue: info.gettype ||  newInfo.gettype,
                rules: [
                  {
                    required: true,
                    message: '获取方式',
                  },{ max: 255,message: '获取方式',   },
                ],
              })(<Select showSearch allowClear onChange={this.changeGettype}>
                <Option value="1">自提</Option>
                <Option value="2">配送</Option>
              </Select>)}
            </FormItem> : ''
          }

 <FormItem {...formItemLayout} hasFeedback label="配菜点">
{getFieldDecorator('tClzAssignfoodId', {
 initialValue: info.tClzAssignfoodId ||  newInfo.tClzAssignfoodId,
  rules: [
    {
      required: true,
      message: '关联的配菜点id不能缺失!',
    },{ max: 255,message: '关联的配菜点id必须小于255位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children" onChange={this.changeSetassignfood}>
 {
   queryTClzAssignfoodList ? queryTClzAssignfoodList.map(v => (
     <Option key={v.t_clz_assignfood_id}>{`${v.assignfoodname}=>${v.address}`}</Option>
   )
   ) : ''
 }
</Select>)}
 </FormItem>
 <FormItem {...formItemLayout} hasFeedback label="配送员">
{getFieldDecorator('tClzDeliveryclerkId', {
 initialValue: info.tClzDeliveryclerkId ||  newInfo.tClzDeliveryclerkId,
  rules: [
    {
      required: (this.state.gettype !== '1'),
      message: '关联的配送员不能缺失!',
    },{ max: 255,message: '关联的配送员必须小于255位!',   },
  ],
 })(<Select allowClear showSearch optionFilterProp="children" disabled={this.state.gettype==='1'}>
 {
   this.state.setqueryTClzDeliveryclerkList.map(v => (
     <Option key={v.t_clz_deliveryclerk_id}>{`${v.username}=>${v.deliveryclerkadress}`}</Option>
   )
   )
 }
</Select>)}
 </FormItem>
          {
            <FormItem {...formItemLayout} hasFeedback label="订单获取状态">
              {getFieldDecorator('ordergetstatus', {
                initialValue: info.ordergetstatus ||  newInfo.ordergetstatus || '1',
                rules: [
                  {
                    required: true,
                    message: '订单获取状态不能缺失!',
                  },
                ],
              })(<Select showSearch allowClear  placeholder='订单获取状态' disabled={!this.state.isEdit} >
                <Option value=""></Option>
                {
                  ordergetstatusArr.map((v, i) => (
                    <Option key={i} value={(i+1).toString()}>{v}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          }
          
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
