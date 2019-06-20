import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Button, Icon, Spin } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit, VerificationCode } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
  codeLoading: loading.effects['login/getCode'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'login/getCode',
    // });
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handlerefresh = () => {
    // this.props.dispatch({
    //   type: 'login/getCode',
    // });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          guest_uid: this.props.login.uid,
        },
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting, codeLoading } = this.props;
    const { type } = this.state;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const image = (
      <Spin indicator={antIcon} spinning={codeLoading} delay="100">
        <Button size="large" onClick={this.handlerefresh}>
          {login.uid ? (
            <img className={styles.verify} src={`/auth/refresh/${login.uid}`} alt="验证码" />
          ) : (
            '暂无验证码'
          )}
        </Button>
      </Spin>
    );
    const tabName = (
      <p className={styles.tabName}>欢迎登录</p>
    )
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab={tabName}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage(login.msg)}
            <UserName name="username" placeholder="请输入帐号" />
            <Password name="password" placeholder="请输入密码" />
            {/* <VerificationCode span={image} name="verify_code" placeholder="请输入验证码" /> */}
          </Tab>

          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
