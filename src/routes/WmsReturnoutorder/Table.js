import React from 'react';
import { Column, Table } from 'react-virtualized';
import { Button } from 'antd';
import 'react-virtualized/styles.css';

import styles from '../../styles/vTable.less';

export default class MyTable extends React.PureComponent {
  render() {
    const { list, formatList } = this.props;
    const { spec, color } = formatList;
    const column = [
      {
        label: '操作',
        dataKey: 'action',
        width: 0.2,
        cellRenderer: ({ rowIndex }) => {
          return this.props.status ? (
            <Button
              type="danger"
              icon="delete"
              ghost
              size="small"
              onClick={() => this.props.delete(rowIndex)}
            >
              删除
            </Button>
          ) : null;
        },
      },
      {
        dataKey: 'lotCount',
        label: '载具数量',
        width: 0.1,
      },
      {
        dataKey: 'spec',
        label: '载具规格',
        width: 0.2,
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
          return cellData;
        },
      },
      {
        dataKey: 'color',
        label: '载具规格',
        width: 0.2,
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
          return cellData;
        },
      },
    ];
    const Columns = column.map(item => (
      <Column
        key={item.dataKey}
        dataKey={item.dataKey}
        label={item.label}
        width={item.width}
        cellRenderer={item.cellRenderer}
      />
    ));
    return (
      <Table
        className={styles.VTable}
        height={300}
        headerHeight={20}
        rowHeight={30}
        rowCount={list.length}
        rowGetter={({ index }) => list[index]}
      >
        {Columns}
      </Table>
    );
  }
}
