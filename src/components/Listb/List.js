import React, { Component } from 'react';
import { Table, Pagination, Card } from 'antd';
import { connect } from 'dva';
import db from '../../utils/db';

import styles from './index.less';

@connect(({ listb, loading }) => ({
  listb,
  listLoading: loading.effects['listb/list'],
}))
export default class List extends Component {
  componentDidMount() {
    const { dispatch, url, queryMap } = this.props;
    if (db.oldhistory.split('/').pop() === 'info') {
      dispatch({
        type: 'listb/list',
        payload: {
          url,
        },
      });
    } else {
      dispatch({
        type: 'listb/list',
        payload: {
          url,
          queryMap,
        },
      });
    }
  }

  handleTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'listb/list',
      payload: {
        pageSize,
        current,
      },
    });
  };

  handleSorter = (_1, _2, sorter) => {
    this.props.dispatch({
      type: 'listb/list',
      payload: {
        sorter,
      },
    });
  };

  render() {
    // 调用该组件请传递columns,url,rowkey,scroll,其中scroll可以选择
    const { onRow, columns, scroll, rowKey, listb, listLoading, rowSelection } = this.props;
    const { total, pagination } = listb;
    return (
      <Card bordered={false} hoverable bodyStyle={{ padding: 0 }}>
        <Table
          loading={listLoading}
          columns={columns}
          rowKey={rowKey}
          dataSource={listb.list}
          scroll={scroll}
          pagination={false}
          size="middle"
          rowSelection={rowSelection}
          locale={{
            emptyText: '',
          }}
          onRow={onRow}
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
