import React, { PureComponent } from 'react';
import { Layout, Menu, Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import styles from './index.less';
import db from '../../utils/db';
import {webConfig} from '../../utils/Constant';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { getLocationParam } from '../../utils/utils';

const { Sider } = Layout;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
// const getIcon = icon => {
//   if (typeof icon === 'string' && icon.indexOf('http') === 0) {
//     return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
//   }
//   if (typeof icon === 'string') {
//     return <Icon type={icon} />;
//   }
//   return icon;
// };

export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

@connect()
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      openKeys: [],
      loading: true,
    };
  }

  getMenuCallback = () => {
    this.setState({
      loading: false,
    });

    const param = getLocationParam();
    if(param.component) {
      this.props.dispatch(routerRedux.push(`${param.component}`));
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/getMenuData',
      callback: () => {this.getMenuCallback()},
      
    });
  }

  onOpenChange = openKeys => {
    if (openKeys.length) {
      const key = openKeys
        .pop()
        .split('_')
        .pop();

      this.setState({
        openKeys: this.getKey(key, []),
      });
    } else {
      this.setState({
        openKeys: [],
      });
    }
  };

  getKey = (key, selectKeys) => {
    if (db.kv[key]) {
      selectKeys.push(`link_${key}`);
      return this.getKey(db.kv[key], selectKeys);
    }
    selectKeys.push(`link_${key}`);
    return selectKeys;
  };

  generateMenuTree(menus, parent) {
    return menus.map(item => {
      if (item.children && item.children.length) {
        return (
          <Menu.SubMenu key={`link_${item.menuid}`} title={<span><span style={{marginRight: '10px'}}><i className={`iconfont ${item.icon}`}></i></span>{item.name}</span>}>
            {this.generateMenuTree(item.children, item)}
          </Menu.SubMenu>
        );
      } else if (item.path && item.path.match(/^\/http/)) {
        return (
          <Menu.Item key={`link_${item.menuid}`}>
            <a href={item.path.replace(/^\/http/, 'http')} target="_blank">
              {/* <Icon className={item.icon} name={item.icon || 'chain'} /> */}
              <span style={{marginRight: '10px'}}><i className={`iconfont ${item.icon}`}></i></span>
              {item.name}
            </a>
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item key={`link_${item.menuid}`}>
            <Link to={{ pathname: item.path, params: { args: item.args } }}>
              {/* <Icon className="menu-icon" name={item.icon || 'chain'} /> */}
              <span style={{marginRight: '10px'}}><i className={`iconfont ${item.icon}`}></i></span>
              {item.name}
            </Link>
          </Menu.Item>
        );
      }
    });
  }
  render() {
    const { logo, collapsed, onCollapse } = this.props;
    // Don't show popup menu when it is been collapsed
    return (
      <Sider
        style={{ overflow: 'auto' }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        collapsedWidth={140}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            {/* <h1>{webConfig.webName}</h1> */}
          </Link>
        </div>
        {
          this.state.loading ? <div style={{textAlign: 'center'}}><Spin /></div> : 
          <Menu
            key="Menu"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['link_4603']}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            // selectedKeys={selectedKeys}
            style={{ padding: '16px 0', width: '100%' }}
          >
            {this.generateMenuTree(this.props.menuData)}
          </Menu>
        }
        
      </Sider>
    );
  }
}
