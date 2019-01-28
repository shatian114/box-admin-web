/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-23 17:54:27
 * @Description:条码
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, Message, TextArea, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';

import Operate from '../../components/Oprs';
import Bind from 'lodash-decorators/bind';
import '../../utils/utils.less';
import TransferCode from '../../components/Transfer';
const FormItem = Form.Item;
const { Option } = Select;
const url = 'orderCommon';
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
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 17 },
  },
};

const formSmallItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 17 },
  },
};

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects[`base/fetch`] || loading.effects[`base/fetchAdd`],
  loading: loading.effects[`base/info`] || loading.effects[`base/new`] || false,
}))
@Operate.create('/orderCommon')
@Form.create()
export default class OrderCommonInfo extends Component {
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
      // dispatch({
      //   type: `base/new`,
      //   url,
      // });
    }
    dispatch({
      type: 'base/supplylist',
    });
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
    const orderType = this.props.form.getFieldValue('orderType');
    const codeType = this.props.form.getFieldValue('codeType');
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
        this1.props.base.info.codeShow = codeCode;

        this1.props.base.info.codeDetail =
          '编码:' +
          codeCode +
          ';' +
          '供应商:' +
          TransferCode('supplylist', infoByCode.supplyCode) +
          ';' +
          '规格:' +
          TransferCode('spec', infoByCode.spec) +
          ';' +
          '颜色:' +
          TransferCode('color', infoByCode.color) +
          ';仓库:' +
          TransferCode('SubwareList', infoByCode.lastSubware);
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
    const { TextArea } = Input;
    const { info, newInfo, color, spec, supplylist, SubwareList, ordertype, codetype } = base;
    return (
      <Form>
        <FormItem {...formItemLayout} hasFeedback label="条码展示">
          {getFieldDecorator('codeShow', {
            rules: [
              {
                required: false,
                message: '必须输入编码!',
              },
            ],
          })(<TextArea rows={20} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback label="详细信息">
          {getFieldDecorator('codeDetail', {
            rules: [
              {
                required: false,
                message: '必须输入编码!',
              },
            ],
          })(<TextArea disabled={true} rows={5} />)}
        </FormItem>
        <Row>
          <Col
            {...{
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 12 },
            }}
          >
            <FormItem {...formSmallItemLayout} hasFeedback label="单据类型">
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
                  {Array.isArray(ordertype)
                    ? ordertype.map(item => (
                        <Option key={item.dic_code} value={item.dic_code}>
                          {`${item.dic_name}(${item.dic_code})`}
                        </Option>
                      ))
                    : null}
                </Select>
              )}
            </FormItem>
            <FormItem {...formSmallItemLayout} hasFeedback label="条码类型">
              {getFieldDecorator('codeType', {
                initialValue: info.codeType,
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
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col
            {...{
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 12 },
            }}
          >
            <FormItem {...formSmallItemLayout} hasFeedback label="编码">
              {getFieldDecorator('codeCode', {
                initialValue: info.codeCode || newInfo.codeCode,
                rules: [
                  {
                    required: true,
                    message: '必须输入编码!',
                  },
                ],
              })(
                <Input
                  placeholder="请输入编码"
                  onPressEnter={() => {
                    this.getInfoByCode();
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col
            {...{
              xs: { span: 24 },
              sm: { span: 12 },
              md: { span: 12 },
            }}
          >
            <FormItem>
              <Operate operateName="SAVE">
                <Button
                  style={{ marginLeft: 12 }}
                  type="primary"
                  onClick={this.handleSubmit}
                  loading={submitting}
                >
                  输入
                </Button>
              </Operate>
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
          </Col>
        </Row>
      </Form>
    );
  }
}
