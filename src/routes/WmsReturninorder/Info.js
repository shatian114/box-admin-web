/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-13 20:36:19
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, DatePicker, Modal, Alert } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import ScanInfo from 'components/ScanInfo';

import MicStorage from './MicStorage';
import Operate from '../../components/Oprs';
import styles from '../../styles/storage.less';
import spanStyles from './Info.less';
import '../../utils/utils.less';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const DateFormat = 'YYYY-MM-DD';
const url = 'WmsReturninorder';
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

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects['base/info'] || loading.effects['base/new'] || false,
}))
@Form.create()
export default class MyInfo extends Component {
  state = {
    visible: false,
    list: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        callback: data => {
          this.setState({
            list: data.codes || [],
          });
        },
        url,
      });
    } else {
      dispatch({
        type: 'base/new',
        url,
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

  setList = (list, callback) => {
    this.setState(
      {
        list,
      },
      () => {
        if (callback) callback();
      }
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSave = () => {
    const { values } = this;
    const { dispatch } = this.props;

    dispatch({
      type: 'base/fetchAdd',
      payload: {
        ...values,
        ...this.props.base.newInfo,
        codes: this.state.list,
      },
      callback: () => {
        this.props.dispatch(routerRedux.goBack());
      },
      url,
    });
  };

  handleOk = () => {
    this.handleSave();
    this.handleCancel();
  };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       let temp = {};
  //       if (!isEmpty(values.inwareDate))
  //         temp = {
  //           ...temp,
  //           inwareDate: undefined,
  //         };
  //       const { dispatch } = this.props;
  //       if (this.props.base.info.dicId) {
  //         dispatch({
  //           type: 'base/fetch',
  //           payload: {
  //             ...values,
  //             ...temp,
  //           },
  //           callback: () => dispatch(routerRedux.goBack()),
  //           url,
  //         });
  //       } else {
  //         dispatch({
  //           type: 'base/fetchAdd',
  //           payload: {
  //             ...values,
  //             ...this.props.base.newInfo,
  //           },
  //           callback: () => dispatch(routerRedux.goBack()),
  //           url,
  //         });
  //       }
  //     }
  //   });
  // };
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
          messageV = '该车剩余' + data.length + '批,';
          for (let i = 0; i < data.length; i++) messageV += data[i].lot_code + ',';
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
          <FormItem {...formItemLayout} hasFeedback label="单据编码">
            {getFieldDecorator('orderCode', {
              initialValue: info.orderCode || newInfo.orderCode,
              rules: [
                {
                  required: true,
                  message: '单据编码不能缺失!',
                },
              ],
            })(<Input disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label="运输车辆">
            {getFieldDecorator('vehicleId', {
              initialValue: info.vehicleId || newInfo.vehicleId,
              rules: [
                {
                  required: true,
                  message: '运输车辆不能缺失!',
                },
                { max: 64, message: '运输车辆必须小于64位!' },
              ],
            })(
              <ScanInfo
                disabled={!isEmpty(info.orderCode)}
                userType="vehicle"
                success={this.searchCLCode}
                rowKey="vehicleNumber"
              />
            )}
            <span className={spanStyles.span}>{messageV}</span>
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="入库仓库">
            {getFieldDecorator('inSubware', {
              initialValue: info.inSubware || newInfo.inSubware,
              rules: [
                {
                  required: true,
                  message: '入库仓库不能缺失!',
                },
              ],
            })(
              <Select
                disabled
                showSearch
                placeholder="子库"
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
          <FormItem {...formItemLayout} hasFeedback label="入库时间">
            {getFieldDecorator('inwareDate', {
              initialValue: moment(info.inwareDate) || moment(newInfo.inwareDate),
              rules: [
                {
                  required: true,
                  message: '入库时间不能缺失!',
                },
              ],
            })(<DatePicker disabled format={DateFormat} placeholder="请输入" />)}
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              返回
            </Button>
            {info.orderCode ? null : (
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
                <span className={styles.total}>
                  当前载具总数:{this.state.list.reduce((total, item) => total + item.lotCount, 0)}
                </span>,保存后不可更改.
              </div>
            }
            type="warning"
            showIcon
          />
        </Modal>
        <MicStorage {...this.props} list={this.state.list} setList={this.setList} />
      </Spin>
    );
  }
}
