import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';

export default class Forms extends PureComponent {
  render() {
    const colums = [
      {
        title: '操作',
        dataIndex: 'operate',
      },
    ];
    return (
      <Card>
        <Table bordered colums={colums} />
      </Card>
    );
  }
}
