import React from 'react';
import { Button, Form, Select, Input } from 'antd';
import { connect } from 'dva';
import ScanInfo from 'components/ScanInfo';

import SelectList from '../../SelectList';
import '../../../styles/utils.less';

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
const { TextArea } = Input;
const url = 'planfarmerboxneed';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ base, user, loading }) => ({
  base,
  user,
  submitting: loading.effects['base/fetch'],
}))
@Form.create()
export default class Distribution extends React.PureComponent {
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
        const { dispatch, selectedRowKeys } = this.props;

        if (selectedRowKeys.length) {
          dispatch({
            type: 'base/fetch',
            payload: {
              ids: selectedRowKeys,
              ...values,
            },
            url,
            callback: () => {
              this.props.closeModal();
              this.props.setList();
            },
          });
        } else {
          dispatch({
            type: 'base/fetch',
            payload: {
              ids: [this.props.info.need_id],
              ...values,
            },
            url,
            callback: () => {
              this.props.closeModal();
              this.props.setList();
            },
          });
        }
      }
    });
  };

  handelInfo = record => {
    this.props.form.setFieldsValue({
      vehicleId: record.accountCode,
    });
  };

  render() {
    const { form, submitting, base, closeModal, user: { userInfo }, info } = this.props;
    const { getFieldDecorator } = form;
    const { SubwareList } = base;
    return (
      <Form>
        {userInfo.role === 'CGM' ? (
          <React.Fragment>
            <FormItem {...formItemLayout} hasFeedback label="仓库名称">
              {getFieldDecorator('subwareCode', {
                initialValue: info.subware_code,
                rules: [
                  {
                    required: true,
                    message: '仓库名称不能为空!',
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder="仓库名称"
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
            <FormItem {...formItemLayout} label="司机">
              {getFieldDecorator('vehicleId', {
                initialValue: info.vehicle_id,
              })(<ScanInfo userType="vehicle" rowKey="vehicleNumber" />)}
            </FormItem>
          </React.Fragment>
        ) : (
          <FormItem {...formItemLayout} label="司机">
            {getFieldDecorator('vehicleId', {
              initialValue: info.vehicle_id,
            })(<ScanInfo userType="vehicle" rowKey="vehicleNumber" />)}
          </FormItem>
        )}
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('needDesc', {
            rules: [
              {
                max: 255,
                message: '备注必须小于255位!',
              },
            ],
          })(<TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <div className="ant-modal-footer">
          <div>
            <Button onClick={() => closeModal()}>取 消</Button>
            <Button onClick={this.handleSubmit} type="primary" loading={submitting}>
              保 存
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}
