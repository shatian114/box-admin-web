/*
 * @Author: zouwendi
 * @Date: 2018-05-14 18:55:55
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-18 17:03:26
 * @Description: 操作日志
 */

import React, { Component } from 'react';
import { Button, List } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import '../../utils/utils.less';

const oprStatus = ['成功', '业务异常', '系统异常'];

const columns = [
  {
    title: '客户端IP',
    dataIndex: 'ip',
  },
  {
    title: '操作人',
    dataIndex: 'username',
  },
  {
    title: '操作结果',
    dataIndex: 'status',
  },
  {
    title: '请求URL',
    dataIndex: 'url',
  },
  {
    title: '操作系统',
    dataIndex: 'os',
  },
  {
    title: '调用方法',
    dataIndex: 'method_name',
  },
  {
    title: '调用类名',
    dataIndex: 'class_name',
  },
  {
    title: '执行时长',
    dataIndex: 'work_time',
  },
  {
    title: '执行时间',
    dataIndex: 'opr_time',
  },
  {
    title: '调用结果',
    dataIndex: 'return_value',
  },
  {
    title: '主键id',
    dataIndex: 'opr_id',
  },
  {
    title: '调用参数',
    dataIndex: 'params',
  },
  {
    title: '调试信息',
    dataIndex: 'extend1',
  },
];

let colObj = {};
columns.forEach(item => {
  colObj = {
    ...colObj,
    [item.dataIndex]: item.title,
  };
});

@connect()
export default class OprLogInfo extends Component {
  render() {
    const { location, dispatch } = this.props;
    const { state } = location;
    const data = Object.keys(state.info).map(item => {
      if (item === 'status') return `${colObj[item]}: ${oprStatus[state.info[item]]}`;
      return `${colObj[item]}: ${state.info[item]}`;
    });
    return (
      <List
        header={<div>日志详情</div>}
        footer={
          <Button
            onClick={() => {
              dispatch(routerRedux.goBack());
            }}
          >
            返回
          </Button>
        }
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    );
  }
}
