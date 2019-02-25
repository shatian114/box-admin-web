import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import db from '../../utils/db';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Option } = Select;
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};
@connect(({ base, user, setting }) => ({
  base,
  user,
  setting,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  changeSubware = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateSubware',
      payload: {
        subwareCode: value,
      },
      callback: () => {
        db.set('subwareCode', value);
        this.setState({
          subwareCode: value,
        });
        window.location.reload();
      },
    });
  };
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { currentUser, collapsed, fetchingNotices, isMobile, logo, onMenuClick } = this.props;
    const { SubwareList } = this.props.base;
    const { userInfo } = this.props.user;
    let subware = '';
    if (SubwareList && SubwareList.length && userInfo.subwareCode) {
      subware = (
        <Select
          disabled={userInfo.role !== 'admin'}
          style={{ width: '180px', border: '0' }}
          value={userInfo.subwareCode}
          onChange={(value, option) => {
            this.changeSubware(value, option);
          }}
        >
          {SubwareList.map(item => (
            <Option key={item.dic_code} value={item.dic_code}>
              {`${item.dic_name}(${item.dic_code})`}
            </Option>
          ))}
        </Select>
      );
    }
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <PageHeaderLayout wrapperClassName={styles.breadCrumbs} />
        <div className={styles.right}>
          {currentUser.username ? (
            <div>
              {subware}
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} src={`/images/avatar.gif`} />
                  <span className={styles.name}>{currentUser.username}</span>
                </span>
              </Dropdown>
            </div>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
