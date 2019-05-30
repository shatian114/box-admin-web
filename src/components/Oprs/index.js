import React from 'react';
import { connect } from 'dva';

const operateAuthority = (oprs, operateName) => {
  return oprs.indexOf(operateName) > -1;
};

const noMatch = '';

function OperateBase({ oprs, operateName, ...props }) {
  return Array.isArray(oprs)
    ? operateAuthority(oprs, operateName) ? props.children : noMatch
    : noMatch;
}
const Operate = connect(({ setting }) => ({
  oprs: setting.oprs,
}))(OperateBase);

Operate.create = pathname => WrappedComponent => {
  @connect(({ setting }) => ({
    keysMenu: setting.keysMenu,
  }))
  class War extends React.PureComponent {
    componentDidMount() {
      const moduleName = '/' + pathname;
			
      // 打包压缩会更改类名
      /*  const moduleName =
      pathname || WrappedComponent.name.replace(/^[a-zA-Z]/, m => m.toLowerCase()); */
      if (this.props.keysMenu[moduleName]) {
        this.props.dispatch({
          type: 'setting/getOprs',
          payload: this.props.keysMenu[moduleName],
        });
      }
    }

    componentWillUnmount() {
      this.props.dispatch({
        type: 'setting/save',
        payload: {
          oprs: null,
        },
      });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return War;
};

export default Operate;
