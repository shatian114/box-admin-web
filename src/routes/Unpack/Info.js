/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 11:17:02
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';

import Operate from '../../components/Oprs';
import styles from '../../styles/list.less';

const FormItem = Form.Item;
const url = 'unpack';
let countS = 0;
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
export default class MyInfo extends Component {
  componentDidMount() {
    const { dispatch, submitting, loading } = this.props;
    this.interval = setInterval(() => {
      if (this.i_1 && !submitting && !loading) this.i_1.focus();
    }, 1000);
    dispatch({
      type: 'base/new',
      url,
    });
    dispatch({
      type: 'base/getVehicleList',
    });
    dispatch({
      type: 'base/queryFarmerList',
    });
    dispatch({
      type: 'base/queryMarketList',
    });
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch, form } = this.props;
        dispatch({
          type: 'base/fetchAdd',
          payload: {
            ...values,
            ...this.props.base.newInfo,
          },
          url,
          callback: () => {
            countS++;
            form.setFieldsValue({
              codeCode: null,
            });
            dispatch({
              type: 'base/new',
              url,
            });
          },
        });
      }
    });
  };

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const {
      info,
      newInfo,
      SubwareList,
      vehicleList,
      spec,
      supplylist,
      farmerList,
      marketList,
    } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="拆包编号">
            {getFieldDecorator('recordId', {
              initialValue: newInfo.recordId,
              rules: [
                {
                  required: true,
                  message: '拆包编号不能缺失!',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="拆解时间">
            {getFieldDecorator('unpackDate', {
              initialValue: moment(newInfo.unpackDate),
              rules: [
                {
                  required: true,
                  message: '不能忽略',
                },
              ],
            })(<DatePicker disabled showTime format="YYYY-MM-DD HH:mm" placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="箱号">
            {getFieldDecorator('codeCode', {
              initialValue: newInfo.codeCode,
              rules: [
                {
                  required: true,
                  message: '箱号不能缺失!',
                },
              ],
            })(
              <Input
                ref={e => {
                  this.i_1 = e;
                }}
                className={styles.inputC}
                placeholder="请继续扫箱号"
              />
            )}
            <span className={styles.spanC}>已扫:{countS}个</span>
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="中转仓">
            <Input
              placeholder="中转仓"
              disabled
              value={(() => {
                if (Array.isArray(SubwareList)) {
                  const temp = SubwareList.find(item => item.dic_code === info.outwareId);
                  if (temp) return `${temp.dic_name}(${info.outwareId})`;
                  return info.outwareId;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="运输车辆">
            <Input
              placeholder="运输车辆"
              disabled
              value={(() => {
                if (Array.isArray(vehicleList)) {
                  const temp = vehicleList.find(item => item.user_id === info.vehicleId);
                  if (temp) return `${temp.vehicle_number}`;
                  return info.vehicleId;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="农户">
            <Input
              placeholder="农户"
              disabled
              value={(() => {
                if (Array.isArray(farmerList)) {
                  const temp = farmerList.find(item => item.user_id === info.farmerId);
                  if (temp) return `${temp.realname}`;
                  return info.farmerId;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="商超">
            <Input
              placeholder="商超"
              disabled
              value={(() => {
                if (Array.isArray(marketList)) {
                  const temp = marketList.find(item => item.user_id === info.marketId);
                  if (temp) return `${temp.realname}`;
                  return info.marketId;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商">
            <Input
              placeholder="供应商"
              disabled
              value={(() => {
                if (Array.isArray(supplylist)) {
                  const temp = supplylist.find(item => item.supply_code === info.supplyCode);
                  if (temp) return `${temp.supply_name}(${info.supplyCode})`;
                  return info.supplyCode;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="规格">
            <Input
              placeholder="规格"
              disabled
              value={(() => {
                if (Array.isArray(spec)) {
                  const temp = spec.find(item => item.dic_code === info.spec);
                  if (temp) return `${temp.dic_name}(${info.spec})`;
                  return info.spec;
                }
              })()}
            />
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="颜色">
            <Input placeholder="颜色" disabled value={info.color} />
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
                countS = 0;
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
