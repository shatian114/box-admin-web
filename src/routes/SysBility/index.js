import React, { PureComponent } from 'react';
import { Col, Row, Button, Card } from 'antd';
import { Link } from 'dva/router';
import modules from '../../utils/finishModules';

export default class SysBility extends PureComponent {
  render() {
    return (
      <div>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <h1>已完成功能</h1>
          <Row>
            {modules.map(item => {
              if (item.menuid.length === 4) {
                if (item.url && item.url.match(/^\/http/)) {
                  return (
                    <Col xs={12} md={3} key={item.menuid} style={{ marginTop: '10px' }}>
                      <a href={item.url.replace(/^\/http/, 'http')} target="_blank">
                        <Button type="primary">{item.menuname}</Button>
                      </a>
                    </Col>
                  );
                } else {
                  return (
                    <Col xs={12} md={3} key={item.menuid} style={{ marginTop: '10px' }}>
                      <Link to={{ pathname: item.url, params: { args: item.args } }}>
                        <Button type="primary">{item.menuname}</Button>
                      </Link>
                    </Col>
                  );
                }
              } else {
                return '';
              }
            })}
          </Row>
        </Card>
      </div>
    );
  }
}
