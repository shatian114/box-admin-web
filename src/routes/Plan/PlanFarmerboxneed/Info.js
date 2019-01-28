import React from 'react';
import { Button, Spin, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { isEmpty } from '../../../utils/utils';

const url = 'planfarmerboxneed';
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
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ base, user, loading }) => ({
  base,
  user,
  submitting: loading.effects['base/fetch'] || loading.effects['base/fetchAdd'],
  loading: loading.effects[`base/info`] || loading.effects[`base/new`] || false,
}))
@Form.create()
export default class NeedModal extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/new',
      url,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        let temp = {};
        if (!isEmpty(values.needTime))
          temp = {
            ...temp,
            needTime: values.needTime.format(DateFormat),
          };
        dispatch({
          type: 'base/fetchAdd',
          payload: {
            ...this.props.base.newInfo,
            ...values,
            ...temp,
          },
          url,
          callback: () => {
            this.props.closeModal();
            this.props.setList();
          },
        });
      }
    });
  };

  render() {
    const { loading, form, base, closeModal, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { newInfo, spec } = base;
    return (
      <Spin size="large" spinning={loading}>
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="订单号">
            {getFieldDecorator('needId', {
              initialValue: newInfo.needId,
              rules: [
                {
                  required: true,
                  message: '订单号不能缺失!',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="地址">
            {getFieldDecorator('address', {
              initialValue: newInfo.address,
              rules: [
                {
                  required: true,
                  message: '地址不能为空!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="联系电话">
            {getFieldDecorator('phone', {
              initialValue: newInfo.phone,
              rules: [
                {
                  required: true,
                  message: '联系电话不能为空!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="需求时间">
            {getFieldDecorator('needTime', {
              initialValue: moment(newInfo.needTime),
              rules: [
                {
                  required: true,
                  message: '需求时间不能为空!',
                },
              ],
            })(<DatePicker showTime format={DateFormat} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="数量">
            {getFieldDecorator('needCount', {
              rules: [
                {
                  required: true,
                  message: '数量不能为空!',
                },
                {
                  type: 'number',
                  min: 0,
                  message: '数量不能小于0!',
                },
              ],
            })(<InputNumber precision={0} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="规格">
            {getFieldDecorator('spec', {
              rules: [
                {
                  required: true,
                  message: '规格不能为空!',
                },
              ],
            })(
              <Select
                showSearch
                placeholder="载具规格"
                optionFilterProp="children"
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
          <FormItem {...formItemLayout} hasFeedback label="备注">
            {getFieldDecorator('needDesc', {
              initialValue: newInfo.needDesc,
              rules: [
                {
                  max: 255,
                  message: '备注必须小于255位!',
                },
              ],
            })(<TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
        <div className="ant-modal-footer">
          <div>
            <Button onClick={() => closeModal()}>取 消</Button>
            <Button onClick={this.handleSubmit} type="primary" loading={submitting}>
              保 存
            </Button>
          </div>
        </div>
      </Spin>
    );
  }
}
