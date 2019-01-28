import React from 'react';
import { Card, Row, Col, Form, Select, Button, notification, Modal, InputNumber } from 'antd';
import { connect } from 'dva';
import Sound from 'react-sound';
import styles from '../../styles/storage.less';
import Table from './Table';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ base }) => ({
  base,
}))
@Form.create()
export default class MicStorage extends React.PureComponent {
  state = {
    playing: 'STOPPED', // PLAYING报警声
  };
  componentDidMount() {
    this.changeFoucus(1);
  }

  msg = '系统错误';

  // 触发报错
  hadnleErr = () => {
    this.setState({
      playing: 'PLAYING',
    });
    notification.open({
      placement: 'topLeft',
      className: styles.notification,
      message: '导入失败',
      description: (
        <div>
          {this.msg},请检查原因
          <Button
            type="primary"
            size="large"
            style={{ margin: 20 }}
            onClick={() => {
              notification.close('not');
              this.setState({
                playing: 'STOPPED',
              });
            }}
          >
            确认
          </Button>
        </div>
      ),
      key: 'not',
      duration: 0,
      onClose: () => {
        this.setState({
          playing: 'STOPPED',
        });
      },
    });
  };

  handleChange = () => {
    const spec = this.props.form.getFieldValue('spec');
    const lotCount = this.props.form.getFieldValue('lotCount');
    const color = this.props.form.getFieldValue('color');
    if (isEmpty(spec) && isEmpty(lotCount)) {
      this.handleSubmit();
      return;
    }
    this.props.setList(
      this.props.list.concat([
        {
          spec,
          lotCount,
          color,
        },
      ])
    );
    this.props.form.setFieldsValue({
      lotCount: null,
      spec: null,
      color: null,
    });
    this.changeFoucus(1);
  };

  handleSubmit = e => {
    if (e) e.preventDefault();
    if (isEmpty(this.props.form.getFieldValue('spec'))) {
      this.changeFoucus(1);
      return;
    }
    if (isEmpty(this.props.form.getFieldValue('color'))) {
      this.changeFoucus(3);
      return;
    }
    if (isEmpty(this.props.form.getFieldValue('lotCount'))) {
      this.changeFoucus(2);
      return;
    }
    this.handleChange();
  };

  changeFoucus = i => {
    if (this[`i_${i}`]) this[`i_${i}`].focus();
  };

  hanleConfirm = index => {
    const list = [].concat(this.props.list);
    list.splice(index, 1);
    this.props.setList(list);
  };

  render() {
    const { info, spec, color, supplylist } = this.props.base;
    const { getFieldDecorator } = this.props.form;
    const { hanleConfirm } = this;
    const confirm = record => {
      Modal.confirm({
        title: '是否删除该条码?',
        okType: 'waring',
        okText: '是',
        cancelText: '否',
        onOk() {
          hanleConfirm(record);
        },
      });
    };

    return (
      <React.Fragment>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem label="规格">
                  {getFieldDecorator('spec', {})(
                    <Select
                      ref={e => {
                        this.i_1 = e;
                      }}
                      disabled={!isEmpty(info.orderCode)}
                      showSearch
                      onChange={() => this.changeFoucus(3)}
                      placeholder="载具规格"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(spec)
                        ? spec.map(item => (
                            <Option key={item.dic_code} value={item.dic_code}>
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="颜色">
                  {getFieldDecorator('color', {})(
                    <Select
                      ref={e => {
                        this.i_3 = e;
                      }}
                      disabled={!isEmpty(info.orderCode)}
                      showSearch
                      onChange={() => this.changeFoucus(2)}
                      placeholder="颜色"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(color)
                        ? color.map(item => (
                            <Option key={item.dic_code} value={item.dic_code}>
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="数量">
                  {getFieldDecorator('lotCount', {})(
                    <InputNumber
                      min={1}
                      precision={0}
                      disabled={!isEmpty(info.orderCode)}
                      ref={e => {
                        this.i_2 = e;
                      }}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
              {!isEmpty(info.orderCode) ? null : (
                <Col md={3} sm={24}>
                  <FormItem label={<div>&nbsp;</div>}>
                    <Button type="primary" htmlType="submit">
                      确认
                    </Button>
                  </FormItem>
                </Col>
              )}

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
            <Table
              status={isEmpty(info.orderCode)}
              delete={confirm}
              formatList={{ spec, supplylist, color }}
              list={this.props.list}
            />
          </Form>
          <Sound url="/sound/alarm.mp3" loop playStatus={this.state.playing} />
        </Card>
      </React.Fragment>
    );
  }
}
