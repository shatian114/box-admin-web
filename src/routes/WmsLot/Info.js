/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:01:22
 * @Description:批次
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
const { TextArea } = Input;
const url = 'wmslot';
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

@connect(({ wmslot, base, loading }) => ({
  wmslot,
  base,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class WmsLotInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.wmslot.info.id || (this.props.location.state && this.props.location.state.id)) {
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
    dispatch({
      type: `${url}/query`,
      payload: {
        type: 'codeType',
      },
    });
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
        if (this.props.wmslot.info.lotId) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              lotId: this.props.wmslot.info.lotId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.wmslot.newInfo,
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
    const { submitting, form, loading, wmslot, base } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist } = base;
    const { info } = wmslot;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="批号编码">
            {getFieldDecorator('lotCode', {
              initialValue: info.lotCode,
              rules: [
                {
                  required: true,
                  message: '必须输入批号编码!',
                },
              ],
            })(<Input disabled={info.lotCode !== undefined} placeholder="请输入批号编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="批号类型">
            {getFieldDecorator('lotType', {
              initialValue: info.lotType,
              rules: [
                {
                  required: true,
                  message: '必须输入批号类型',
                },
                {
                  max: 64,
                  message: '批号类型必须小于64位!',
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
                {Array.isArray(wmslot.codeType)
                  ? wmslot.codeType.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码数量">
            {getFieldDecorator('lotCount', {
              initialValue: info.lotCount,
              rules: [
                {
                  required: true,
                  message: '必须输入条码数量!',
                },
              ],
            })(<Input placeholder="请输入条码数量" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否包含条码信息">
            {getFieldDecorator('isCodes', {
              initialValue: info.isCodes,
              rules: [
                {
                  required: true,
                  message: '必须输入是否包含条码信息',
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
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码信息">
            {getFieldDecorator('codes', {
              initialValue: info.codes,
              rules: [
                {
                  required: false,
                  message: '必须输入条码信息!',
                },
              ],
            })(<Input placeholder="请输入条码信息" />)}
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
