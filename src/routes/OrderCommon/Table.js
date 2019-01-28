import React from 'react';
import { Column, Table } from 'react-virtualized';

import 'react-virtualized/styles.css';

import styles from '../../styles/vTable.less';

const TOTAL_WIDTH = 800;

export default class MyTable extends React.PureComponent {
  render() {
    const { list, column } = this.props;

    const Columns = column.map(item => (
      <Column
        key={item.dataKey}
        dataKey={item.dataKey}
        label={item.label}
        width={item.width * TOTAL_WIDTH}
        cellRenderer={item.cellRenderer}
      />
    ));
    return (
      <Table
        className={styles.VTable}
        width={TOTAL_WIDTH}
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
