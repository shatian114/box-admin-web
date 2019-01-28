import React from 'react';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { connect } from 'dva';
import { Button } from 'antd';
import Operate from '../../components/Oprs';
import styles from '../../styles/vTable.less';

const TOTAL_WIDTH = 800;
@connect(({ base }) => ({
  base,
}))
export default class MyTable extends React.PureComponent {
  render() {
    const { recoverinorder } = this.props;
    const { spec, supplylist, color } = this.props.base;
    const column = [
      {
        label: '操作',
        width: 100,
        dataKey: 'control',
        align: 'center',
        cellRenderer: ({ rowData }) =>
          recoverinorder.orderStatus === 'new' ? (
            <Operate operateName="DELETE">
              <Button
                type="danger"
                icon="delete"
                ghost
                size="small"
                onClick={() => this.props.deleteRow(rowData)}
              >
                删除
              </Button>
            </Operate>
          ) : (
            '已关闭'
          ),
      },
      {
        dataKey: 'lotCount',
        label: '数量',
        align: 'center',
        width: 100,
      },
      {
        dataKey: 'color',
        label: '颜色',
        width: 100,
        align: 'center',
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
          return cellData;
        },
      },
      {
        dataKey: 'spec',
        label: '载具规格',
        width: 100,
        align: 'center',
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
        width: 200,
        align: 'center',
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
        rowCount={this.props.list.length}
        rowGetter={({ index }) => this.props.list[index]}
      >
        {Columns}
      </Table>
    );
  }
}
