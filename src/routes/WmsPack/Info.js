/*
 * @Author: cuiwei 
 * @Date: 2018-05-24 15:24:07 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-19 21:43:42
 * @Description: 批次
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';
import db from '../../utils/db';

import Operate from '../../components/Oprs';

import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const url = 'wmspack';
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

@connect(({ wmspack, base, loading }) => ({
  wmspack,
  base,
  submitting: loading.effects[`${url}/fetch`] || loading.effects[`${url}/fetchAdd`],
  loading: loading.effects[`${url}/info`] || loading.effects[`${url}/new`] || false,
}))
@Form.create()
export default class WmsPackInfo extends Component {
  state = {
    tip: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.wmspack.info.id || (this.props.location.state && this.props.location.state.id)) {
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
  getInfoByCode = e => {
    const { dispatch } = this.props;
    let code = e.target.value;
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
              console.warn(oi);
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
                this.i_1.focus();
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
        if (this.props.wmspack.info.lotId) {
          dispatch({
            type: `${url}/fetch`,
            payload: {
              lotId: this.props.wmspack.info.lotId,
              ...values,
            },
            ...saveConfig.one,
            url,
          });
        } else {
          dispatch({
            type: `${url}/fetchAdd`,
            payload: {
              ...this.props.wmspack.newInfo,
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
    const { submitting, form, loading, wmspack, base } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist, SubwareList } = base;
    const { info, newInfo } = wmspack;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          {newInfo && newInfo.lotId ? (
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
          <FormItem {...formItemLayout} hasFeedback label="备料编号">
            {getFieldDecorator('lotId', {
              initialValue: info.lotId || newInfo.lotId,
            })(<Input disabled={true} placeholder="请输入条码数量" />)}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="批号">
            {getFieldDecorator('lotCode', {
              initialValue: info.lotCode || newInfo.lotCode,
              rules: [
                {
                  required: true,
                  message: '必须输入批号!',
                },
              ],
            })(
              <Input
                disabled={info.lotCode}
                placeholder="请输入批号"
                ref={e => {
                  this.i_1 = e;
                }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="条码数量">
            {getFieldDecorator('lotCount', {
              initialValue: info.lotCount || newInfo.lotCount,
              rules: [
                {
                  required: true,
                  message: '必须输入条码数量!',
                },
              ],
            })(<Input disabled={info.lotCode} placeholder="请输入条码数量" />)}
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
          <FormItem {...formItemLayout} hasFeedback label="子库编号">
            {getFieldDecorator('subwareCode ', {
              initialValue: info.subwareCode || newInfo.subwareCode,
            })(
              <Select
                placeholder="子库编号"
                optionFilterProp="children"
                disabled={true}
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
