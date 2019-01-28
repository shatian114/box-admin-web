import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { connect } from 'dva';
import NotFound from '../Exception/404';
import { getRoutes } from '../../utils/utils';
import Operate from '../../components/Oprs';

const routerUrl = '/fhck';
@connect()
@Operate.create(routerUrl)
export default class MyIndex extends PureComponent {
  componentWillUnmount() {
    this.props.dispatch({
      type: 'list/clear',
    });
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
        <Redirect
          exact
          from={`${routerUrl}`}
          to={{ pathname: `${routerUrl}/list`, state: this.props.location.params }}
        />
        <Route render={NotFound} />
      </Switch>
    );
  }
}
