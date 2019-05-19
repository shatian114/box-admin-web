import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
//import logo from '../assets/logo.svg';
import logo from '../assets/loginTitle.png';
import { getRoutes } from '../utils/utils';
import {webConfig} from '../utils/Constant';

const copyright = (
  <Fragment>
    <span style={{color: '#fefefe'}}>Copyright <Icon type="copyright" /> 2019 {webConfig.companyName}出品</span>
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = `${webConfig.webName}管理系统-登录`;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <img alt="logo" className={styles.logo} src={logo} />
              {/* <div className={styles.header}>
                <Link to="/">
                  <span className={styles.title}>{webConfig.webName}管理系统</span>
                </Link>
              </div> */}
              <div className={styles.desc}>{webConfig.companyName}</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/currentUser" to="/currentUser/login" />
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
