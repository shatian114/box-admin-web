import React, { Component } from 'react';
import { Table, Pagination, Card } from 'antd';
import { connect } from 'dva';
import db from '../../utils/db';

import styles from './index.less';

@connect(({ list, loading }) => ({
  list,
  listLoading: loading.effects['list/list'],
}))
export default class List extends Component {
  componentDidMount() {
    const { dispatch, url, queryMap } = this.props;
    if (db.oldhistory.split('/').pop() === 'info' || db.oldhistory.split('/').pop() === 'storage') {
      dispatch({
        type: 'list/list',
        payload: {
          url,
          queryMap,
        },
      });
    } else {
      dispatch({
        type: 'list/list',
        payload: {
          url,
          queryMap,
        },
      });
    }
  }

  handleTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'list/list',
      payload: {
        pageSize,
        current,
      },
    });
  };

  handleSorter = (_1, _2, sorter) => {
    this.props.dispatch({
      type: 'list/list',
      payload: {
        sorter,
      },
    });
  };

  render() {
    // 调用该组件请传递columns,url,rowkey,scroll,其中scroll可以选择
    const { onRow, columns, scroll, rowKey, list, listLoading, rowSelection } = this.props;
    const { total, pagination } = list;
    return (
      <Card bordered={false} hoverable bodyStyle={{ padding: 0 }}>
        <Table
          loading={listLoading}
          columns={columns}
          rowKey={rowKey}
          dataSource={list.list}
          scroll={scroll}
          pagination={false}
          size="middle"
          onRow={onRow}
          rowSelection={rowSelection}
          locale={{
            emptyText: '',
          }}
          onChange={this.handleSorter}
        />
        <Pagination
          className={styles.PaginationLeft}
          onChange={this.handleTableChange}
          onShowSizeChange={this.handleTableChange}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(item, range) =>
            range[1] !== 0 ? `${range[0]}-${range[1]} 共 ${item} 条数据` : '暂无数据'
          }
          {...pagination}
        />
      </Card>
    );
  }
}
