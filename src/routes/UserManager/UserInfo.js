/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-14 19:12:20
 * @Description: 用户管理中的用户基础详情
 */

import React, { Component } from 'react';
import { Collapse } from 'antd';

import BaseInfo from './BaseInfo';
import AdvancedInfo from './AdvancedInfo';

const { Panel } = Collapse;

export default class UserManagerInfo extends Component {
  render() {
    return (
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="基础信息" key="1">
          <BaseInfo {...this.props} />
        </Panel>
        <Panel header="高级信息" key="2">
          <AdvancedInfo {...this.props} />
        </Panel>
      </Collapse>
    );
  }
}
