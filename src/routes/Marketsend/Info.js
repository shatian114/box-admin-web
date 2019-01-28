/*
 * @Author: lbb 
 * @Date: 2018-05-24 15:24:07 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 10:37:41
 * @Description: 批次
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select } from 'antd';
import ScanInfo from 'components/ScanInfo';

import { routerRedux } from 'dva/router';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsmarketsend';

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
export default class Info extends Component {
  state = {
    tip: '',
  };
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
  getInfoByCode = e => {
    const { dispatch } = this.props;
    const code = e.target.value;
    this.setState(
      {
        tip: '',
      },
      () => {
        if (code) {
          dispatch({
            type: `base/otherInfo`,
            payload: {
              id: code,
            },
            url: 'wmscode',
            callback: () => {
              const oi = this.props.base.otherInfo;
              if (!oi || !oi.codeCode) {
                this.setState({
                  tip: <span style={{ color: '#f00' }}>查找不到{code}该条码！</span>,
                });
              } else {
                this.props.form.setFieldsValue({
                  supplyCode: oi.supplyCode,
                  spec: oi.spec,
                  color: oi.color,
                });
                // this.i_1.focus();
              }
            },
          });
        }
      }
    );
    e.target.value = '';
  };
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
            callback: () => {
              this.props.form.setFieldsValue({
                supplyCode: '',
                spec: '',
                color: '',
              });
            },
            url,
          });
        } else {
          dispatch({
            type: `base/fetchAdd`,
            payload: {
              ...this.props.base.newInfo,
              ...values,
            },
            callback: () => {
              this.props.form.setFieldsValue({
                supplyCode: '',
                spec: '',
                color: '',
              });
              (this.props.base.info = {}),
                dispatch({
                  type: `base/new`,
                  url,
                });
            },
            url,
          });
        }
      }
    });
  };

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist } = base;
    const { info, newInfo } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} label="商超">
            {getFieldDecorator('marketId', {
              initialValue: info.marketId || newInfo.marketId,
              rules: [
                {
                  required: true,
                  message: '不能忽略',
                },
              ],
            })(<ScanInfo userType="market" />)}
          </FormItem>
          {newInfo && newInfo.recordId ? (
            <FormItem
              {...formItemLayout}
              hasFeedback
              extra={this.state.tip}
              label="扫码自动填入信息"
            >
              <Input
                onPressEnter={e => {
                  this.getInfoByCode(e);
                }}
                placeholder="扫码自动填入信息"
              />
            </FormItem>
          ) : (
            ''
          )}
          <FormItem {...formItemLayout} hasFeedback label="回收数量">
            {getFieldDecorator('sendCount', {
              initialValue: newInfo.sendCount || info.sendCount,
              rules: [
                {
                  required: true,
                  message: '不能忽略',
                },
              ],
            })(<Input placeholder="请输入回收数量" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="供应商编码">
            {getFieldDecorator('supplyCode', {
              initialValue: info.supplyCode || newInfo.supplyCode,
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
                disabled={info.lotCode}
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
              initialValue: info.spec || newInfo.spec,
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
                disabled={info.lotCode}
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
              initialValue: info.color || newInfo.color,
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
                disabled={info.lotCode}
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
            {info.lotCode ? (
              ''
            ) : (
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
            )}
          </FormItem>
        </Form>
      </Spin>
    );
  }
}
