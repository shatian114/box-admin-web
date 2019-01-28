import React from 'react';
import { connect } from 'dva';
import List from './List';

List.create = () => WrappedComponent => {
  @connect(({ list }) => ({
    list,
  }))
  class WraList extends React.Component {
    setList = payload => {
      this.props.dispatch({
        type: 'list/list',
        payload: payload || {},
      });
    };

    clear = () => {
      this.props.dispatch({
        type: 'list/clear',
      });
    };

    render() {
      const this2 = this;
      const props = {
        ...this2.props,
        list: {
          ...this2.props.list,
          setList: this2.setList,
          clear: this2.clear,
        },
      };
      return <WrappedComponent {...props} />;
    }
  }
  return WraList;
};

export default List;
