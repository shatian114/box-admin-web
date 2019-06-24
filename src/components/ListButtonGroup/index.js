/*
 * @Author: zouwendi 
 * @Date: 2019-03-12 09:49:55 
 * @Last Modified by: peng
 * @Last Modified time: 2019-03-12 09:49:55 
 * @Description: 搜索列表的按钮组
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux } from 'dva/router';
import Operate from '../Oprs';
import Importer from '../Importer';
import styles from './index.less';
@connect(({ list }) => ({
  list,
}))

export default class ListButtonGroup extends Component {

  render() {
    return (
      <span className={styles.submitButtons}>
        <Button className={styles.searchBtn} icon="search" type="primary" htmlType="submit" loading={this.props.list.searching}>
          查询
        </Button>
        {/*<Button className={styles.resetBtn} icon="sync" onClick={this.props.handleFormReset}>*/}
          {/*重置*/}
        {/*</Button>*/}
        <Operate operateName="NEW">
          <Button
            icon="plus"
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={ () => this.props.dispatch(routerRedux.push(`${this.props.routerUrl}/info`)) }
          >
            新建
          </Button>
        </Operate>
        <Operate operateName="import">
      	  <Importer
						uploadName={`${this.props.url}Impoter`}
						uploadUrl={this.props.url}
						reload={this.props.handleSearch}
						rowId="t1wuyexiaoquId"
      	  />
      	</Operate>
        <Operate operateName="export">
      		<Button
      			icon="export"
      			type="primary"
      			style={{ marginLeft: 8 }}
      			loading={this.props.list.exporting}
      			onClick={this.props.handleExport}
      		>
      			导出
      		</Button>
      	</Operate>
      </span>
    );
  }
}
