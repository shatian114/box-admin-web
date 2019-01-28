/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 12:02:06
 * @Description:条码
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';
import ScanInfo from '../../components/ScanInfo';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmscode';
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};

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

@connect(({ wmscode, loading, base }) => ({
  wmscode,
  base,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class WmscodeInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.wmscode.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: `${url}/info`,
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: `${url}/new`,
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${url}/clear`,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.wmscode.info.codeCode) {
          if (isEmpty(values.productCount)) values.productCount = 0;
          dispatch({
            type: `${url}/fetch`,
            payload: {
              codeCode: this.props.wmscode.info.codeCode,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.wmscode.newInfo,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, wmscode, base } = this.props;
    const { getFieldDecorator } = form;
    const { info, newInfo } = wmscode;
    const { color, spec, supplylist, SubwareList } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="条码编码">
            {getFieldDecorator('codeCode', {
              initialValue: info.codeCode || newInfo.codeCode,
              rules: [
                {
                  required: true,
                  message: '必须输入条码编码!',
                },
              ],
            })(<Input disabled={info.codeCode !== undefined} placeholder="请输入条码编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码类型">
            {getFieldDecorator('codeType', {
              initialValue: info.codeType,
              rules: [
                {
                  required: false,
                  message: '必须输入条码类型!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(wmscode.codetype)
                  ? wmscode.codetype.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码状态">
            {getFieldDecorator('codeStatus', {
              initialValue: info.codeStatus,
              rules: [
                {
                  required: false,
                  message: '必须输入条码状态',
                },
                {
                  max: 64,
                  message: '条码状态必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(wmscode.codestatus)
                  ? wmscode.codestatus.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="最后所在仓库">
            {getFieldDecorator('lastSubware', {
              initialValue: info.lastSubware,
              rules: [
                {
                  required: false,
                  message: '必须输入最后所在仓库',
                },
                {
                  max: 64,
                  message: '最后所在仓库必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(SubwareList)
                  ? SubwareList.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="最后所在批次编码">
            {getFieldDecorator('lastLot', {
              initialValue: info.lastLot,
              rules: [
                {
                  required: false,
                  message: '请确认最后所在批次编码格式',
                },
                {
                  max: 64,
                  message: '最后所在批次编码必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入最后所在批次编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否清洗">
            {getFieldDecorator('isClear', {
              initialValue: info.isClear || newInfo.isClear,
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="最后入库时间">
            {getFieldDecorator('lastInware', {
              initialValue: info.lastInware,
              rules: [
                {
                  max: 64,
                  message: '最后入库时间必须小于64位!',
                },
              ],
            })(<Input disabled={info.lastInware !== undefined} placeholder="请输入最后入库时间" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="出库次数">
            {getFieldDecorator('outwareTimes', {
              initialValue: info.outwareTimes || newInfo.outwareTimes,
            })(<Input placeholder="请输入出库次数" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商编码">
            {getFieldDecorator('supplyCode', {
              initialValue: info.supplyCode,
              rules: [
                {
                  max: 64,
                  message: '地址必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(supplylist)
                  ? supplylist.map(item => (
                      <Option key={item.supply_code} value={item.supply_code}>
                        {`${item.supply_name}(${item.supply_sx})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="载具规格">
            {getFieldDecorator('spec', {
              initialValue: info.spec,
              rules: [
                {
                  max: 64,
                  message: '载具规格必须小于64位!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(spec)
                  ? spec.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="载具颜色">
            {getFieldDecorator('color', {
              initialValue: info.color,
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(color)
                  ? color.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="农户">
            {getFieldDecorator('farmerId', {
              initialValue: info.farmerId,
            })(<ScanInfo userType="farmer" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="商户">
            {getFieldDecorator('marketId', {
              initialValue: info.marketId,
            })(<ScanInfo userType="market" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="车辆">
            {getFieldDecorator('vehicleId', {
              initialValue: info.vehicleId,
            })(<ScanInfo userType="vehicle" rowKey="vehicleNumber" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="中转仓">
            {getFieldDecorator('outwareId', {
              initialValue: info.outwareId,
            })(<Input placeholder="请输入中转仓" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="主营农产品">
            {getFieldDecorator('product', {
              initialValue: info.product,
            })(<Input placeholder="请输入农产品" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="农产品数量">
            {getFieldDecorator('productCount', {
              initialValue: info.productCount,
            })(<InputNumber min={0} placeholder="请输入农产品数量" />)}
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
                onClick={this.handleSubmit}
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
