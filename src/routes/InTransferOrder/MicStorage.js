import React from 'react';
import { Card, Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import styles from '../../styles/storage.less';
import Table from './Table';

const FormItem = Form.Item;

@connect(({ base }) => ({
  base,
}))
@Form.create()
export default class MicStorage extends React.PureComponent {
  changeFoucus = i => {
    this[`i_${i}`].focus();
  };

  render() {
    const { spec, supplylist } = this.props.base;
    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="vertical">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem label="批号">
                  {getFieldDecorator('lotCode', {})(
                    <Input
                      disabled
                      ref={e => {
                        this.i_1 = e;
                      }}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label={<div />}>
                  <div className={styles.total}>
                    当前批数:{this.props.list.length},当前载具总数:{this.props.list.reduce(
                      (total, item) => total + item.lotCount,
                      0
                    )}
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Table formatList={{ spec, supplylist }} list={this.props.list} />
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}
