/*
 * @Author: cuiwei 
 * @Date: 2018-05-25 10:00:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:36:07
 * @Description: 
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, Modal, Alert, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import ScanInfo from 'components/ScanInfo';

import RecoverinorderDetail from './RecoverinorderDetail';

import Operate from '../../components/Oprs';
import spanStyles from '../../styles/Info.less';
import styles from '../../styles/storage.less';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsrecoverinorder';
const saveType = 'text';
let messageV = '';
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

@connect(({ base, wmsrecoverinorder, loading }) => ({
  base,
  wmsrecoverinorder,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class WmsReturninorderInfo extends Component {
  state = {
    visible: false,
    codeCode: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if (
      this.props.base.info.orderCode ||
      (this.props.location.state && this.props.location.state.id)
    ) {
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
      });
    } else {
      dispatch({
        type: 'base/fetchAdd',
        url,
        silent: true,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
    messageV = '';
  }

  setCode = i => {
    this.setState({
      codeCode: i,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {
    const { values } = this;
    const { dispatch } = this.props;

    if (this.props.base.info.orderCode) {
      dispatch({
        type: 'base/fetch',
        payload: {
          ...values,
          inwareDate: null,
        },
        url,
      });
    } else {
      dispatch({
        type: 'base/fetchAdd',
        payload: {
          ...values,
          ...this.props.base.newInfo,
          codes: this.state.codeCode,
          saveType,
        },
        url,
      });
    }
  };

  handleOk = () => {
    this.handleSave();
    this.handleCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.values = values;
        if (this.props.base.info.orderCode) {
          this.handleSave();
        } else {
          this.setState({
            visible: true,
          });
        }
      }
    });
  };
  searchCLCode = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { dispatch, form } = this.props;
      dispatch({
        type: 'base/queryVehicleCodeNum',
        payload: {
          vehicleId: e.userId,
        },
        callback: data => {
          messageV = '该车回收' + data[0].count + '个载具';
          form.setFieldsValue({});
        },
        url,
      });
    });
  };
  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { info, newInfo, SubwareList } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="回收单编号">
            {getFieldDecorator('orderCode', {
              initialValue: info.orderCode || newInfo.orderCode,
              rules: [
                {
                  required: true,
                  message: '回收单编号不能缺失!',
                },
              ],
            })(<Input disabled placeholder="回收单编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="入库仓库">
            {getFieldDecorator('inSubware', {
              initialValue: info.inSubware || newInfo.inSubware,
            })(
              <Select
                placeholder="入库仓库"
                optionFilterProp="children"
                disabled
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
          <FormItem {...formItemLayout} hasFeedback label="入库时间">
            {getFieldDecorator('inwareDate', {
              initialValue: moment(info.inwareDate || newInfo.inwareDate),
            })(
              <DatePicker
                style={{ width: '100%' }}
                disabled
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="请输入"
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="运输车辆">
            {getFieldDecorator('vehicleId', {
              initialValue: info.vehicleId || newInfo.vehicleId,
            })(<ScanInfo userType="vehicle" rowKey="vehicleNumber" success={this.searchCLCode} />)}
            <span className={spanStyles.span}>{messageV}</span>
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              返回
            </Button>
            {info.orderStatus === 'new' ? (
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
            ) : (
              ''
            )}
          </FormItem>
        </Form>
        <Modal
          title="确认入库"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Alert
            message="警告"
            description={
              <div>
                <span className={styles.total}>当前载具总数:{this.state.codeCode.length}</span>,确认数量后不可更改.
              </div>
            }
            type="warning"
            showIcon
          />
        </Modal>
        <RecoverinorderDetail {...this.props} setCode={this.setCode} />
      </Spin>
    );
  }
}
