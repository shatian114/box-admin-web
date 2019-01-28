import React from 'react';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

import styles from '../../styles/vTable.less';

const TOTAL_WIDTH = 800;

export default class MyTable extends React.PureComponent {
  render() {
    const { list, formatList } = this.props;
    const { spec, supplylist } = formatList;
    const column = [
      {
        dataKey: 'lotCode',
        label: '批号',
        width: 0.2,
      },
      {
        dataKey: 'color',
        label: '颜色',
        width: 0.2,
      },
      {
        dataKey: 'lotCount',
        label: '载具数量',
        width: 0.2,
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
        dataKey: 'supplyCode',
        label: '供应商',
        width: 0.2,
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === cellData);
            if (temp) return `${temp.supply_name}(${cellData})`;
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
