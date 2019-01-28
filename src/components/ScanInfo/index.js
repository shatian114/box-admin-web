import React from 'react';
import { Input, Icon, Spin } from 'antd';
import { connect } from 'dva';

@connect(({ user, loading }) => ({ user, loading: loading.effects['user/queryScanInfo'] || false }))
export default class ScanInfo extends React.PureComponent {
  state = {
    initialValue: this.props['data-__meta'].initialValue,
    value: null,
    confirm: false,
    info: {},
  };

  componentWillReceiveProps(nextprops) {
    const dataMeta = nextprops['data-__meta'];
    const { initialValue } = this.state;
    if (dataMeta.initialValue !== initialValue) {
      if (dataMeta.initialValue) {
        this.setState(
          {
            value: dataMeta.initialValue,
            initialValue: dataMeta.initialValue,
          },
          () => {
            this.init(this.state.value);
          }
        );
      }
    }
  }
  onPressEnter = e => {
    e.preventDefault();
    if (this.i_1) this.i_1.blur();
  };

  handleSuccess = data => {
    this.setState(
      {
        value: data.userAccount,
        confirm: true,
        info: data || {},
      },
      () => this.props.onChange(this.state.info.userId)
    );
  };

  clearConfirm = () => {
    this.setState(
      {
        confirm: false,
        info: {},
      },
      () => this.props.onChange(null)
    );
  };

  init = init => {
    const { handleSuccess } = this;
    const { dispatch, userType, success, error } = this.props;
    dispatch({
      type: 'user/queryScanInfo',
      payload: {
        userId: init,
        userType,
      },
      success: data => {
        handleSuccess(data);
        if (success) success(data);
      },
      error: msg => {
        if (error) error(msg);
      },
    });
  };

  handleInfo = e => {
    e.preventDefault();
    const { handleSuccess } = this;
    const { dispatch, userType, success, error } = this.props;

    dispatch({
      type: 'user/queryScanInfo',
      payload: {
        userAccount: e.target.value,
        userType,
      },
      success: data => {
        handleSuccess(data);
        if (success) success(data);
      },
      error: msg => {
        if (error) error(msg);
      },
    });
  };
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value, confirm, info } = this.state;
    const { rowKey, loading, disabled } = this.props;
    return (
      <Spin spinning={loading}>
        <Input
          disabled={disabled || confirm}
          value={rowKey ? info[rowKey] || value : info.realname || value}
          ref={e => {
            this.i_1 = e;
          }}
          onChange={this.handleChange}
          onBlur={this.handleInfo}
          onPressEnter={this.onPressEnter}
          placeholder="请扫账户"
          addonAfter={
            disabled ? null : (
              <a onClick={this.clearConfirm}>
                <Icon type="close-circle-o" />
              </a>
            )
          }
        />
      </Spin>
    );
  }
}
