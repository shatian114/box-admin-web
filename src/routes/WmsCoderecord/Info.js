/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:59:08
 * @Description:条码
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmscoderecord';
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

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects[`base/fetch`] || loading.effects[`base/fetchAdd`],
  loading: loading.effects[`base/info`] || loading.effects[`base/new`] || false,
}))
@Form.create()
export default class WmsCoderecordInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: `base/info`,
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: `base/new`,
        url,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `base/clear`,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.base.info.recordId) {
          dispatch({
            type: `base/fetch`,
            payload: {
              recordId: this.props.base.info.recordId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `base/fetchAdd`,
            payload: {
              ...this.props.base.newInfo,
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
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { info, newInfo, color, spec, supplylist } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="单据编码">
            {getFieldDecorator('orderCode', {
              initialValue: info.orderCode || newInfo.orderCode,
              rules: [
                {
                  required: true,
                  message: '必须输入条码编码!',
                },
              ],
            })(<Input placeholder="请输入条码编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="单据类型">
            {getFieldDecorator('orderType', {
              initialValue: info.orderType,
              rules: [
                {
                  required: true,
                  message: '必须输入单据类型!',
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
                {Array.isArray(base.ordertype)
                  ? base.ordertype.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码编码">
            {getFieldDecorator('codeCode', {
              initialValue: info.codeCode || newInfo.codeCode,
              rules: [
                {
                  required: true,
                  message: '必须输入条码编码!',
                },
              ],
            })(<Input placeholder="请输入条码编码" />)}
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
                {Array.isArray(base.codetype)
                  ? base.codetype.map(item => (
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
                {Array.isArray(base.codestatus)
                  ? base.codestatus.map(item => (
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
              rules: [
                {
                  max: 64,
                  message: '农户必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入农户" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="商超">
            {getFieldDecorator('marketId', {
              initialValue: info.marketId,
              rules: [
                {
                  max: 64,
                  message: '商超必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入商超" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="车辆">
            {getFieldDecorator('vehicleId', {
              initialValue: info.vehicleId,
              rules: [
                {
                  max: 64,
                  message: '车辆必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入车辆" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="中转仓">
            {getFieldDecorator('outwareId', {
              initialValue: info.outwareId,
              rules: [
                {
                  max: 64,
                  message: '中转仓必须小于64位!',
                },
              ],
            })(<Input placeholder="请输入中转仓" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="批次系统主键">
            {getFieldDecorator('lotId', {
              initialValue: info.lotId,
              rules: [
                {
                  required: true,
                  message: '必须输入批次系统主键!',
                },
              ],
            })(<Input placeholder="请输入批次系统主键" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="批次条码">
            {getFieldDecorator('lotCode', {
              initialValue: info.lotCode || newInfo.lotCode,
              rules: [
                {
                  required: true,
                  message: '必须输入批次条码!',
                },
              ],
            })(<Input placeholder="请输入条码编码" />)}
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
            })(<Input placeholder="请输入条码编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="最后入库时间">
            {getFieldDecorator('lastInware', {
              initialValue: info.lastInware || newInfo.lastInware,
              rules: [
                {
                  max: 64,
                  message: '最后入库时间必须小于64位!',
                },
              ],
            })(
              <Input
                disabled={info.lastInware !== undefined || newInfo.lastInware !== undefined}
                placeholder="请输入最后入库时间"
              />
            )}
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
