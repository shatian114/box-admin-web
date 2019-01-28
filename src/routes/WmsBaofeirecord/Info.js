/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-23 17:54:27
 * @Description:条码
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, Message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';
import Bind from 'lodash-decorators/bind';
import '../../utils/utils.less';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsbaofeirecord';
// const isSelectCode=false;
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
export default class WmsBaofeirecordInfo extends Component {
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

  @Bind()
  getInfoByCode() {
    const codeCode = this.props.form.getFieldValue('codeCode');
    const { dispatch } = this.props;
    const this1 = this;
    dispatch({
      type: `base/getobjbyCode`,
      payload: {
        codeCode,
      },
      callback: () => {
        const { infoByCode } = this1.props.base;
        if (infoByCode.codeType === undefined) Message.error('不存在该编号');
        this1.props.base.info.codeType = infoByCode.codeType;
        this1.props.base.info.supplyCode = infoByCode.supplyCode;
        this1.props.base.info.spec = infoByCode.spec;
        this1.props.base.info.color = infoByCode.color;
        this1.props.base.info.lastSubware = infoByCode.lastSubware;
        this1.props.base.info.lostCount = 1;
        this.props.form.setFieldsValue(this1.props.base.info);
      },
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
    const { info, newInfo, color, spec, supplylist, SubwareList } = base;
    const { ishandleE } = this.props.location.state;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="条码编码">
            {getFieldDecorator('codeCode', {
              initialValue: info.codeCode || newInfo.codeCode,
              rules: [
                {
                  required: false,
                  message: '必须输入条码编码!',
                },
              ],
            })(
              <Input
                disabled={ishandleE || info.codeCode != undefined}
                placeholder="请输入条码编码"
                onPressEnter={() => {
                  this.getInfoByCode();
                }}
              />
            )}
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
                disabled={ishandleE}
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
          <FormItem {...formItemLayout} hasFeedback label="责任人">
            {getFieldDecorator('baofeiUser', {
              initialValue: info.baofeiUser,
              rules: [
                {
                  max: 64,
                  message: '责任人必须小于64位!',
                },
              ],
            })(<Input disabled={ishandleE} placeholder="请输入责任人" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="报废原因">
            {getFieldDecorator('baofeiDesc', {
              initialValue: info.baofeiDesc,
              rules: [
                {
                  max: 640,
                  message: '报废原因必须小于640位!',
                },
              ],
            })(<Input disabled={ishandleE} placeholder="请输入报废原因" />)}
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
                disabled={ishandleE}
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
                disabled={ishandleE}
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
                disabled={ishandleE}
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
          <FormItem {...formItemLayout} hasFeedback label="处理人">
            {getFieldDecorator('handleUser', {
              initialValue: info.handleUser,
              rules: [
                {
                  max: 64,
                  message: '处理人必须小于64位!',
                },
              ],
            })(<Input disabled placeholder="请输入处理人" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="处理记录">
            {getFieldDecorator('handleDesc', {
              initialValue: info.handleDesc,
              rules: [
                {
                  max: 64,
                  message: '处理记录必须小于64位!',
                },
              ],
            })(<Input disabled={!ishandleE} placeholder="请输入处理记录" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否处理">
            {getFieldDecorator('ishandle', {
              initialValue: info.ishandle == null ? newInfo.ishandle : info.ishandle,
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                disabled={!ishandleE}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="损失金额">
            {getFieldDecorator('baofeiMoeny', {
              initialValue: info.baofeiMoeny,
              rules: [
                {
                  required: false,
                  message: '必须输入损失金额!',
                },
              ],
            })(<Input disabled={ishandleE} placeholder="请输入损失金额" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="是否退换">
            {getFieldDecorator('isreturn', {
              initialValue: info.isreturn == null ? newInfo.isreturn : info.isreturn,
            })(
              <Select
                showSearch
                placeholder="选择"
                optionFilterProp="children"
                disabled={ishandleE}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="报废数量">
            {getFieldDecorator('baofeiCount', {
              initialValue: info.baofeiCount,
              rules: [
                {
                  required: true,
                  message: '必须输入报废数量!',
                },
              ],
            })(<Input disabled={ishandleE} placeholder="请输入报废数量" />)}
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
                disabled={info.lastInware !== undefined || newInfo.lastInware != undefined}
                placeholder="请输入最后入库时间"
              />
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
                disabled={ishandleE}
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
