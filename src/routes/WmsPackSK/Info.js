/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:03:00
 * @Description: 字典详情
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Select, Modal, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import MicStorage from './MicStorage';

import Operate from '../../components/Oprs';

import styles from '../../styles/storage.less';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsPackSK';

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
    codeCode: [],
    location: null,
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
        type: 'base/new',
        url,
        callback: data => {
          this.setLocation(data.location);
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  setLocation = i => {
    this.setState({
      location: i,
    });
  };

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
    const lotCode =
      Array.isArray(this.state.codeCode) && this.state.codeCode.length > 0
        ? this.state.codeCode[0].split(',')[0]
        : null;
    dispatch({
      type: 'base/fetchAdd',
      payload: {
        ...values,
        ...this.props.base.newInfo,
        codes: Array.isArray(this.state.codeCode)
          ? this.state.codeCode.map(item => item.split(',')[1]).join(',')
          : null,
        location: this.state.location,
        lotCode,
      },
      callback: () => dispatch(routerRedux.goBack()),

      url,
    });
  };

  handleOk = () => {
    this.handleSave();
    this.handleCancel();
  };

  handleSubmit = e => {
    if (e) e.preventDefault();
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

  render() {
    const { submitting, form, loading, base } = this.props;
    const { getFieldDecorator } = form;
    const { SubwareList, info, newInfo } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} hasFeedback label="备料编号">
            {getFieldDecorator('lotId', {
              initialValue: info.lotId || newInfo.lotId,
              rules: [
                {
                  required: true,
                  message: '备料编号不能缺失!',
                },
              ],
            })(<Input disabled placeholder="请输入备料编号编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="备料仓库">
            {getFieldDecorator('subwareCode', {
              initialValue: info.subwareCode || newInfo.subwareCode,
              rules: [
                {
                  required: true,
                  message: '必须输入仓库名称',
                },
              ],
            })(
              <Select placeholder="选择仓库" disabled>
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
                htmlType="submit"
                loading={submitting}
              >
                保存
              </Button>
            </Operate>
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
        <MicStorage
          {...this.props}
          setCode={this.setCode}
          setLocation={this.setLocation}
          submit={this.handleSubmit}
        />
      </Spin>
    );
  }
}
