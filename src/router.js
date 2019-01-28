import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import numeral from 'numeral';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import './locales';
// 设置国际化语言
numeral.locale('zh-cn');

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);

  const UserLayout = routerData['/currentUser'].component;
  const Exception403 = routerData['/exception/403'].component;
  const Exception404 = routerData['/exception/404'].component;
  const Exception500 = routerData['/exception/500'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/currentUser" component={UserLayout} />
          <Route path="/exception/403" component={Exception403} />
          <Route path="/exception/404" component={Exception404} />
          <Route path="/exception/500" component={Exception500} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['login']}
            redirectPath="/currentUser/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
