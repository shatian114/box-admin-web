import React from 'react';
import { connect } from 'dva';
import List from './List';

List.create = () => WrappedComponent => {
  @connect(({ listb }) => ({
    listb,
  }))
  class WraList extends React.Component {
    setList = payload => {
      this.props.dispatch({
        type: 'listb/list',
        payload: payload || {},
      });
    };

    clear = () => {
      this.props.dispatch({
        type: 'listb/clear',
      });
    };

    render() {
      const this2 = this;
      const props = {
        ...this2.props,
        listb: {
          ...this2.props.listb,
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
