import React from 'react';
import { Form, Row, Col, Input, Button, Modal, InputNumber, Spin, Select } from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import Result from 'components/Result';

import Operate from '../../components/Oprs';
import styles from '../../styles/utils.less';
import SelectList from './SelectList';

const FormItem = Form.Item;
const { Option } = Select;
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
const routerUrl = '/nowSubtract';
const url = 'now';

@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects[`user/subtractMoney`],
  loading: loading.effects[`base/info`] || false,
}))
@Operate.create(routerUrl)
@Form.create()
export default class NowSubtract extends React.PureComponent {
  state = {
    visible: false,
    info: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/new',
      url: 'taccountrecord',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `base/clear`,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handelInfo = record => {
    this.setState(
      {
        info: record,
      },
      () => {
        this.props.form.resetFields();
        this.handleCancel();
      }
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handelInfo } = this;
    const { form, dispatch, base } = this.props;
    const { info } = this.state;
    const { paytype } = base;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/subtractMoney',
          payload: {
            ...base.newInfo,
            accountCode: this.state.info.accountCode,
            ...values,
          },
          url: `taccountrecord/${url}`,
          callback: data => {
            const information = (
              <div>
                <Row>
                  <Col span={8}>退还账户：</Col>
                  <Col span={16}>{info.userAccount}</Col>
                </Row>
                <Row>
                  <Col span={8}>退还方式：</Col>
                  <Col span={16}>
                    {Array.isArray(paytype)
                      ? paytype.find(item => item.dic_code === data.TAccountrecord.payType).dic_name
                      : data.TAccountrecord.payType}
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>退还金额：</Col>
                  <Col span={16}>
                    <span>{data.TAccountrecord.nowMoney}</span> 元
                  </Col>
                </Row>
              </div>
            );

            Modal.success({
              className: styles.modalResult,
              content: (
                <Result
                  type="success"
                  title="退还成功"
                  extra={information}
                  className={styles.result}
                />
              ),
              okText: '确定',
            });
            handelInfo({ ...data.TAccount, userAccount: info.userAccount });
            dispatch({
              type: 'base/new',
              url: 'taccountrecord',
            });
          },
        });
      }
    });
  };

  render() {
    const { submitting, form, loading, base } = this.props;
    const { info } = this.state;
    const { getFieldDecorator } = form;
    const { usertype, paytype } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="农户账户">
            {getFieldDecorator('userAccount', {
              initialValue: info.userAccount,
              rules: [
                {
                  required: true,
                  message: '请点击按钮选择用户!',
                },
              ],
            })(
              <Input
                placeholder="选择用户"
                disabled
                addonAfter={
                  <Button icon="search" type="primary" onClick={this.showModal}>
                    选择用户
                  </Button>
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="账户类型">
            {getFieldDecorator('accountType', {
              initialValue: info.accountType,
              rules: [
                {
                  required: true,
                  message: '账户类型不能缺失!',
                },
              ],
            })(
              <Select placeholder="账户类型" disabled>
                {Array.isArray(usertype)
                  ? usertype.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {item.dic_name}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="账户描述">
            {getFieldDecorator('accountDesc', {
              initialValue: info.accountDesc,
            })(
              <Input.TextArea placeholder="描述" disabled autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="退还方式">
            {getFieldDecorator('payType', {
              rules: [
                {
                  required: true,
                  message: '退还方式必选!',
                },
              ],
            })(
              <Select placeholder="退还方式">
                {Array.isArray(paytype)
                  ? paytype.map(item => (
                      <Option key={item.dic_code} value={item.dic_code}>
                        {item.dic_name}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="当前余额">
            {getFieldDecorator('old_now_money', {
              initialValue: info.nowMoney || 0,
              rules: [
                {
                  required: true,
                  message: '当前余额不能缺失!',
                },
              ],
            })(
              <InputNumber
                formatter={value => numeral(value).format('$ 0,0.00')}
                parser={value => numeral(value).value()}
                placeholder="当前余额"
                disabled
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="退还余额">
            {getFieldDecorator('nowMoney', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '必填!',
                },
                {
                  type: 'number',
                  max: info.nowMoney,
                  message: '不能大于当前余额!',
                },
                {
                  type: 'number',
                  min: 0,
                  message: '不能为负!',
                },
              ],
            })(
              <InputNumber
                min={0}
                formatter={value => numeral(value).format('$ 0,0.00')}
                parser={value => numeral(value).value()}
                placeholder="退还余额"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="流水描述">
            {getFieldDecorator('description', {})(
              <Input.TextArea placeholder="流水描述" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Operate operateName="SUBTRACTMONEY">
              <Button
                style={{ marginLeft: 12 }}
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                确认
              </Button>
            </Operate>
          </FormItem>
        </Form>
        <Modal
          width="90%"
          title="选择用户"
          onCancel={this.handleCancel}
          visible={this.state.visible}
          footer={null}
          destroyOnClose
        >
          <SelectList handelInfo={this.handelInfo} />
        </Modal>
      </Spin>
    );
  }
}
