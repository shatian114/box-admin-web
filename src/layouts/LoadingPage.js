import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { enquireScreen, unenquireScreen } from 'enquire-js';

import BasicLayout from './BasicLayout';
import { getMenuData } from '../common/menu';
/**
 * 根据菜单取得重定向地址.
 */

const getRedirectData = () => {
  const MenuData = getMenuData();
  const redirectData = [];
  const getRedirect = item => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          getRedirect(children);
        });
      }
    }
  };
  MenuData.forEach(getRedirect);
  return redirectData;
};

class LoadingPage extends PureComponent {
  state = {
    isMobile: false,
    loading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    /*dispatch({
      type: 'base/querySubwareList',
    });*/

    // dispatch({
    //   type: 'base/queryAllDic',
    // });
    /* dispatch({
      type: 'user/info',
    });
    dispatch({
      type: 'base/supplylist',
    });*/
    const urlParams = new URL(window.location.href);
    const settingString = urlParams.searchParams.get('setting');
    if (settingString) {
      const setting = {};
      settingString.split(';').forEach(keyValue => {
        const [key, value] = keyValue.split(':');
        setting[key] = value;
      });
      this.props.dispatch({
        type: 'setting/changeSetting',
        payload: setting,
      });
    }
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  render() {
    const redirectData = getRedirectData();
    if (this.state.loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    return (
      <BasicLayout isMobile={this.state.isMobile} redirectData={redirectData} {...this.props} />
    );
  }
}

export default connect()(LoadingPage);
