/*
 * @Author: cuiwei 
 * @Date: 2018-05-18
 * @Description: 条码打印详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker, InputNumber, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import Bind from 'lodash-decorators/bind';
import Debounce from 'lodash-decorators/debounce';
import moment from 'moment';

import store from '../../index';
import { requestModels } from '../../utils/request';
import Operate from '../../components/Oprs';
import '../../utils/utils.less';
import { findItem } from '../../utils/utils';
import { ENGINE_METHOD_ALL } from 'constants';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const url = 'codeprint';
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};
let prefix = '';
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
@connect(({ base }) => ({
  base,
}))
@connect(({ codeprint, loading }) => ({
  codeprint,
  submitting: loading.effects['codeprint/fetchAdd'] || false,
  loading: loading.effects['codeprint/info'] || loading.effects['codeprint/new'] || false,
}))
@Form.create()
export default class CodeprintInfo extends Component {
  state = {
    codeRule: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: `${url}/new`,
      url,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${url}/clear`,
    });
  }
  @Bind()
  changeRule(value) {
    this.setState({
      codeRule: value,
    });
  }
  @Bind()
  @Debounce(300)
  buildCode() {
    const { coderule, codetype, color, spec, supplylist } = this.props.base;
    var _this = this;
    setTimeout(function() {
      var info = _this.props.form.getFieldsValue();
      let rule = _this.state.codeRule;
      if (!rule) return;
      var cs = rule.split('+');
      prefix = '';
      let len = 0;
      for (let c of cs) {
        if (c.indexOf('位顺序数') > 0) {
          len = parseInt(c);
        } else if (c.match(/y{2,}M{2,}d{2,}/)) {
          let format = c.replace(/d/g, 'D').replace(/y/g, 'Y');
          if (info.date) {
            prefix += info.date.format(format);
          }
        } else {
          switch (c) {
            case 'suply':
              if (info.supplyCode) {
                let obj = findItem(info.supplyCode, supplylist, 'supply_code');
                if (obj) {
                  prefix += obj.supply_sx;
                }
              }
              break;
            case 'color':
              if (info.color) {
                let obj = findItem(info.color, color);
                if (obj) {
                  prefix += obj.dic_data1;
                }
              }
              break;
            case 'spec':
              if (info.spec) {
                let obj = findItem(info.spec, spec);
                if (obj) {
                  prefix += obj.dic_data1;
                }
              }
              break;
            default:
              prefix += c;
              break;
          }
        }
      }
      if (len) {
        requestModels('/box/api/codeprint/getBegCode', {
          body: { prefix: prefix },
          method: 'POST',
        }).then(function(res) {
          if (res && res.code == '200') {
            var startVal = parseInt(res.data);
            function PrefixInteger(num, length) {
              return (Array(length).join('0') + num).slice(-length);
            }
            let start = PrefixInteger(parseInt(startVal), len);
            var update = {
              codeStart: prefix + start,
            };
            if (info.codeCount) {
              const tcodeEnd = startVal + parseInt(info.codeCount) - 1;
              if (tcodeEnd.toString().length > len) {
                Modal.error({
                  content: `条码数量不能大于${Math.pow(10, len) - startVal}`,
                  okText: '确定',
                  onOk: () =>
                    _this.props.form.setFieldsValue({
                      codeCount: null,
                    }),
                });
              } else {
                const codeEnd = PrefixInteger(tcodeEnd, len);
                update['codeEnd'] = prefix + codeEnd;
              }
            }
            _this.props.form.setFieldsValue(update);
          }
        });
      }
    }, 0);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: `${url}/fetchAdd`,
          payload: {
            ...this.props.codeprint.newInfo,
            ...values,
          },
          ...saveConfig.one,
          url,
        });
      }
    });
  };

  render() {
    const { submitting, form, loading, codeprint } = this.props;
    const { coderule, codetype, color, spec, supplylist } = this.props.base;
    const { getFieldDecorator } = form;
    const { info } = codeprint;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="条码类型">
            {getFieldDecorator('codeType', {
              initialValue: info.codeType,
              rules: [
                {
                  required: true,
                  message: '请选择条码类型!',
                },
              ],
            })(
              <Select showSearch placeholder="选择条码类型">
                {Array.isArray(codetype)
                  ? codetype.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="条码起始编号">
            {getFieldDecorator('codeStart', {
              initialValue: info.codeStart,
            })(<Input disabled placeholder={'系统自动生成'} />)}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="条码结束编号">
            {getFieldDecorator('codeEnd', {
              initialValue: info.codeEnd,
            })(<Input disabled placeholder={'填写条码打印数量后生成'} />)}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="条码打印规则">
            {getFieldDecorator('codeRule', {
              initialValue: info.codeRule,
              rules: [
                {
                  required: true,
                  message: '请选择条码打印规则!',
                },
                {
                  validator: this.validNum,
                },
              ],
            })(
              <Select showSearch placeholder="请选择条码打印规则" onSelect={this.changeRule}>
                {Array.isArray(coderule)
                  ? coderule.map(item => (
                      <Option key={item.dic_code} value={item.dic_desc}>
                        {`${item.dic_name}(${item.dic_code})`}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>

          {this.state.codeRule && this.state.codeRule.indexOf('suply') >= 0 ? (
            <FormItem {...formItemLayout} hasFeedback label="供应商">
              {getFieldDecorator('supplyCode', {
                initialValue: info.supplyCode,
                rules: [
                  {
                    required: true,
                    message: '请选择供应商!',
                  },
                ],
              })(
                <Select showSearch onSelect={this.buildCode} placeholder="请选择供应商">
                  {Array.isArray(supplylist)
                    ? supplylist.map(item => (
                        <Option key={item.supply_code} value={item.supply_code}>
                          {`${item.supply_name}(${item.supply_code})`}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </FormItem>
          ) : (
            ''
          )}

          {this.state.codeRule && this.state.codeRule.indexOf('spec') >= 0 ? (
            <FormItem {...formItemLayout} hasFeedback label="规格">
              {getFieldDecorator('spec', {
                initialValue: info.spec,
                rules: [
                  {
                    required: true,
                    message: '请选择规格!',
                  },
                ],
              })(
                <Select showSearch onSelect={this.buildCode} placeholder="请选择规格">
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
          ) : (
            ''
          )}

          {this.state.codeRule && this.state.codeRule.indexOf('color') >= 0 ? (
            <FormItem {...formItemLayout} hasFeedback label="颜色">
              {getFieldDecorator('color', {
                initialValue: info.color,
                rules: [
                  {
                    required: true,
                    message: '请选择颜色!',
                  },
                ],
              })(
                <Select showSearch onSelect={this.buildCode} placeholder="请选择颜色">
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
          ) : (
            ''
          )}

          {this.state.codeRule && this.state.codeRule.match(/y{2,}M{2,}d{2,}/) ? (
            <FormItem {...formItemLayout} hasFeedback label="日期">
              {getFieldDecorator('date', {
                initialValue: info.date ? moment(info.date) : moment(),
                rules: [
                  {
                    required: true,
                    message: '请选择日期!',
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={this.buildCode}
                  disabled={info.isPrint == '1'}
                  format="YYYYMMDD"
                  placeholder="请选择日期"
                />
              )}
            </FormItem>
          ) : (
            ''
          )}

          <FormItem {...formItemLayout} hasFeedback label="条码数量">
            {getFieldDecorator('codeCount', {
              initialValue: info.codeCount,
              rules: [
                {
                  required: true,
                  message: '必须输入条码数量!',
                },
              ],
            })(
              <InputNumber
                disabled={info.isPrint == '1'}
                onChange={this.buildCode}
                style={{ width: '100%' }}
                min={1}
                precision={0}
                placeholder="请输入条码打印数量"
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback label="条码打印份数">
            {getFieldDecorator('codeTimes', {
              initialValue: info.codeTimes,
              rules: [
                {
                  required: true,
                  message: '必须输入条码打印份数!',
                },
              ],
            })(
              <InputNumber
                disabled={info.isPrint == '1'}
                onChange={this.buildCode}
                style={{ width: '100%' }}
                min={1}
                precision={0}
                placeholder="请输入条码打印份数"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="条码打印说明">
            {getFieldDecorator('codeDesc', {
              initialValue: info.codeDesc,
            })(
              <TextArea
                disabled={info.isPrint == '1'}
                autosize={{ minRows: 3, maxRows: 6 }}
                placeholder="请输入条码打印说明"
              />
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
