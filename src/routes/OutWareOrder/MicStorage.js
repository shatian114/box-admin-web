import React from 'react';
import { Card, Row, Col, Form, Input, Button, notification, Modal, InputNumber } from 'antd';
import { connect } from 'dva';
import Sound from 'react-sound';
import styles from '../../styles/storage.less';
import Table from './Table';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;

@connect(({ base }) => ({
  base,
}))
@Form.create()
export default class MicStorage extends React.PureComponent {
  state = {
    playing: 'STOPPED', // PLAYING报警声
    lot: new Set(),
  };
  componentDidMount() {
    this.changeFoucus(1);
  }

  getLot = () => {
    const lotCode = this.props.form.getFieldValue('lotCode');
    if (!isEmpty(lotCode)) {
      this.props.dispatch({
        type: 'base/getLotbyCode',
        payload: { lotCode },
        callback: data => {
          if (data) {
            this.props.form.setFieldsValue({
              lotCount: data.lotCount,
            });
            this.changeFoucus(3);
          } else {
            this.msg = '无该批次';
            this.hadnleErr();
          }
        },
        error: msg => {
          this.msg = msg;
          this.hadnleErr();
        },
      });
    }
  };

  msg = '系统错误';

  verifyCode = lotCode => {
    if (lotCode === null || lotCode === undefined) {
      this.msg = '批号为空';
      return true;
    }
    if (this.state.lot.has(lotCode)) {
      this.msg = '批号重复';
      return true;
    }

    return false;
  };

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

  handleSubmit = e => {
    e.preventDefault();
    if (isEmpty(this.props.form.getFieldValue('lotCode'))) {
      this.changeFoucus(1);
      return;
    }
    if (isEmpty(this.props.form.getFieldValue('lotCount'))) {
      this.changeFoucus(2);
      return;
    }
    this.changeFoucus(3);
  };

  handleChange = () => {
    const lotCode = this.props.form.getFieldValue('lotCode');
    if (!this.verifyCode(lotCode)) {
      this.props.dispatch({
        type: 'base/getLotbyCode',
        payload: { lotCode },
        callback: data => {
          if (data) {
            this.setState(
              {
                lot: this.state.lot.add(lotCode),
              },
              () => {
                this.props.setList(
                  this.props.list.concat([
                    {
                      ...data,
                      // lotCount: this.props.form.getFieldValue('lotCount'),
                    },
                  ])
                );
                this.props.form.setFieldsValue({
                  lotCode: null,
                });
                this.changeFoucus(1);
              }
            );
          } else {
            this.msg = '无该批次';
            this.hadnleErr();
          }
        },
        error: msg => {
          this.msg = msg;
          this.hadnleErr();
        },
      });
    } else {
      this.hadnleErr();
    }
  };

  changeFoucus = i => {
    this[`i_${i}`].focus();
  };

  hanleConfirm = record => {
    const list = [].concat(this.props.list);
    list.splice(list.findIndex(item => item.orderCode === record.orderCode), 1);
    const set = new Set();
    list.forEach(item => set.add(item.orderCode));
    this.props.setList(list, () => {
      this.setState({
        lot: set,
      });
    });
  };

  render() {
    const { info, spec, supplylist } = this.props.base;
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
                <FormItem label="批号">
                  {getFieldDecorator('lotCode', {})(
                    <Input
                      disabled={!isEmpty(info.orderCode)}
                      ref={e => {
                        this.i_1 = e;
                      }}
                      onPressEnter={e => {
                        e.preventDefault();
                        this.handleChange();
                      }}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
              {/**
               <Col md={3} sm={24}>
               <FormItem label="目标数量">
                 {getFieldDecorator('lotCount', {})(
                   <InputNumber
                     ref={e => {
                       this.i_2 = e;
                     }}
                     disabled
                     placeholder="请输入"
                   />
                 )}
                 <Input
                   style={{ zIndex: -1 }}
                   ref={e => {
                     this.i_3 = e;
                   }}
                   onPressEnter={e => {
                     e.preventDefault();
                     this.handleChange();
                   }}
                   disabled={!isEmpty(info.orderCode)}
                   placeholder="请输入"
                 />
               </FormItem>
             </Col>
               */}
              {!isEmpty(info.orderCode) ? null : (
                <Col md={3} sm={24}>
                  <FormItem label={<div>&nbsp;</div>}>
                    <Button type="primary" htmlType="submit" onClick={this.handleChange}>
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
              formatList={{ spec, supplylist }}
              list={this.props.list}
            />
          </Form>
          <Sound url="/sound/alarm.mp3" loop playStatus={this.state.playing} />
        </Card>
      </React.Fragment>
    );
  }
}
