import React from 'react';
import { Card, Row, Col, Form, Input, Button, InputNumber, Icon, Modal } from 'antd';
import { connect } from 'dva';
import Sound from 'react-sound';
import styles from '../../styles/storage.less';
import Table from './Table';
import { isThisQuarter } from 'date-fns';
import Operate from '../../components/Oprs';
import { Bind } from 'lodash-decorators/bind';

const FormItem = Form.Item;
const OKCODE = 'OK';
@connect(({ base, wmsrecoverinorder }) => ({
  base,
  wmsrecoverinorder,
}))
@Form.create()
export default class ReturninorderDetail extends React.PureComponent {
  state = {
    lotCount: 10,
    lotCode: '',
    playing: 'STOPPED', // PLAYING报警声
    tip: '',
    list: [],
  };
  componentDidMount() {
    const _this = this;
    setInterval(() => {
      if (_this.state.playing && _this.i_2) {
        _this.i_2.focus();
      }
    }, 200);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.base.info &&
      nextProps.base.info.orderCode &&
      nextProps.base.info.orderCode !== this.props.base.info.orderCode
    ) {
      this.refreshList(nextProps.base.info.orderCode);
    }
  }
  refreshList = orderCode => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wmsrecoverinorder/queryDetail',
      orderCode,
      callback: () => {
        this.setState({
          list: this.props.wmsrecoverinorder.list,
        });
      },
    });
  };
  deleteRow = record => {
    const { dispatch } = this.props;
    const { info } = this.props.base;
    const { refreshList } = this;
    Modal.confirm({
      title: '确定想要删除吗?',
      okType: 'danger',
      okText: '是',
      cancelText: '否',
      onOk() {
        dispatch({
          type: 'wmsrecoverinorder/deleteDetail',
          payload: {
            lotId: record.lotId,
            orderCode: info.orderCode,
          },
          callback: () => {
            dispatch({
              type: 'wmsrecoverinorder/queryDetail',
              orderCode: info.orderCode,
              callback: () => {
                refreshList(info.orderCode);
              },
            });
          },
        });
      },
    });
  };

  addRow = () => {
    const { dispatch } = this.props;
    const code = this.state.lotCode;
    this.setState(
      {
        tip: '',
      },
      () => {
        if (code) {
          dispatch({
            type: `base/otherInfo`,
            payload: {
              id: this.state.lotCode,
            },
            url: 'wmscode',
            callback: () => {
              const oi = this.props.base.otherInfo;
              if (!oi || !oi.codeCode) {
                this.setState({
                  tip: <span style={{ color: '#f00' }}>查找不到{code}该条码！</span>,
                });
              } else {
                dispatch({
                  type: `base/new`,
                  objName: 'wmslot',
                  url: 'wmslot',
                  callback: () => {
                    const { wmslot } = this.props.base;
                    dispatch({
                      type: 'wmsrecoverinorder/addNewDetail',
                      url: 'wmslot',
                      payload: {
                        ...wmslot,
                        lotCode: wmslot.lotId,
                        lotCount: this.state.lotCount,
                        spec: oi.spec,
                        color: oi.color,
                        supplyCode: oi.supplyCode,
                        subwareCode: this.props.base.info.subwareCode,
                      },
                      orderCode: this.props.base.info.orderCode,
                      callback: () => {
                        this.setState({
                          list: [].concat(this.state.list, [
                            {
                              ...this.props.wmsrecoverinorder.detail.wmslot,
                            },
                          ]),
                          lotCode: '',
                        });
                      },
                    });
                  },
                });
              }
            },
          });
        }
      }
    );
  };

  render() {
    const { info, color, spec, supplylist } = this.props.base;
    return (
      <React.Fragment>
        <Modal
          title={<span style={{ color: '#f00' }}>警告</span>}
          visible={this.state.playing === 'PLAYING'}
        >
          <h1 style={{ color: '#f00' }}>{this.state.tip}</h1>
          <Sound url="/sound/alarm.mp3" loop playStatus={this.state.playing} />
          <Input
            style={{ zIndex: '-1' }}
            ref={e => {
              this.i_2 = e;
            }}
            onPressEnter={e => {
              const data = e.target.value;
              if (data && data.match(OKCODE)) {
                this.setState({
                  playing: false,
                  tip: '',
                });
              }
            }}
            placeholder="请输入"
          />
        </Modal>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="vertical">
            <Row>
              <Col sm={22} md={8}>
                <FormItem hasFeedback extra={this.state.tip} label="扫码自动填入信息">
                  <Input
                    onPressEnter={e => {
                      if (this.i_1) this.i_1.focus();
                    }}
                    value={this.state.lotCode}
                    placeholder="扫码自动填入信息"
                    onChange={e => {
                      this.setState({
                        lotCode: e.target.value,
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col sm={22} md={8} offset={2}>
                <FormItem label="数量">
                  <InputNumber
                    style={{ width: '100%' }}
                    value={this.state.lotCount}
                    onChange={e =>
                      this.setState({
                        lotCount: e,
                      })
                    }
                    onKeyDown={e => {
                      if (e.keyCode == 13) {
                        // enter后的操作
                        this.addRow();
                      }
                    }}
                    ref={e => {
                      this.i_1 = e;
                    }}
                    placeholder="请输入"
                  />
                </FormItem>
              </Col>
              <Col sm={22} md={4} offset={2}>
                <FormItem label={<div>&nbsp;</div>}>
                  {info.orderStatus === 'new' ? (
                    <Operate operateName="UPDATE">
                      <Button type="primary" onClick={this.addRow}>
                        输入
                      </Button>
                    </Operate>
                  ) : (
                    ''
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              formatList={{ color, spec, supplylist }}
              list={this.state.list}
              recoverinorder={info}
              deleteRow={this.deleteRow}
            />
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}
