import React from 'react';
import { Card, Row, Col, Form, Input, Button, InputNumber, notification, Icon, Modal } from 'antd';
import { connect } from 'dva';
import Sound from 'react-sound';
import styles from '../../styles/storage.less';

const FormItem = Form.Item;

@connect(({ base }) => ({
  base,
}))
@Form.create()
export default class MicStorage extends React.PureComponent {
  state = {
    lotCount: 50,
    codeCode: [],
    codes: [],
    playing: 'STOPPED', // PLAYING报警声
    splaying: 'STOPPED',
    lot: new Set(),
  };
  componentDidMount() {
    this.changeFoucus(1);
  }
  componentWillReceiveProps(nextProps) {
    if (Array.isArray(nextProps.base.WmsLots)) {
      const arr = [];
      const set = new Set();
      nextProps.base.WmsLots.forEach(item => {
        const temp = item.codes.split(',');
        set.add(item.lot_code);
        temp.forEach(item2 => {
          if (item2 !== '') arr.push(`${item.lot_code},${item2}`);
        });
      });
      this.setState({
        codeCode: arr,
        lot: set,
      });
      this.props.setCode(arr);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        WmsLots: {},
      },
    });
  }

  msg = '系统错误';

  verifyCode = (item, lotCode) => {
    if (lotCode === null || lotCode === undefined) {
      this.msg = '批号为空';
      return true;
    }
    if (item === null || item === undefined) {
      this.msg = '条码编号为空';
      return true;
    }
    if (this.state.codeCode.some(item2 => item === item2.split(',')[0])) {
      this.msg = '条码编号重复';
      return true;
    }
    return this.verifyLotCount(lotCode);
  };

  verifyLotCount = lotCode => {
    const t = this.state.codeCode.filter(item => item.split(',')[0] === lotCode);
    if (t.length === this.state.lotCount - 1) {
      this.props.form.setFieldsValue({
        lotCode: null,
      });
      this.setState({
        splaying: 'PLAYING',
      });
      this.changeFoucus(1);
      return false;
    }
    if (t.length <= this.state.lotCount - 1) {
      return false;
    }
    this.msg = '当前批号条码数量大于目标数量';
    return true;
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

  handleSubmit = () => {};
  handleChange = () => {
    const lotCode = this.props.form.getFieldValue('lotCode');
    if (!this.verifyCode(this.props.form.getFieldValue('codeCode'), lotCode)) {
      const temp = this.state.codeCode;
      const temp1 = this.state.codes;
      temp1.push(this.props.form.getFieldValue('codeCode'));
      temp.push(`${lotCode},${this.props.form.getFieldValue('codeCode')}`);

      this.setState(
        {
          codeCode: temp,
          codes: temp1,
        },
        () => {
          const set = new Set();
          this.state.codeCode.map(item => set.add(item.split(',')[0]));
          this.setState({
            lot: set,
          });
        }
      );
      this.props.setCode(temp);
    } else {
      this.hadnleErr();
    }

    this.props.form.setFieldsValue({
      codeCode: null,
    });
  };
  changeFoucus = i => {
    this[`i_${i}`].focus();
  };

  hanleConfirm = record => {
    const temp = this.state.codeCode;
    const temp1 = this.state.codes;
    temp.splice(temp.findIndex(item => item === record), 1);
    temp1.splice(temp1.findIndex(item => item === record.split(',')[1]), 1);
    this.setState(
      {
        codeCode: temp,
        codes: temp1,
      },
      () => {
        const set = new Set();
        this.state.codeCode.map(item => set.add(item.split(',')[0]));
        this.setState({
          lot: set,
        });
      }
    );
  };

  render() {
    const { info } = this.props.base;
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
          <Form layout="vertical">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem label="批号">
                  {getFieldDecorator('lotCode', {})(
                    <Input
                      disabled={info.orderCode !== undefined}
                      ref={e => {
                        this.i_1 = e;
                      }}
                      onChange={() =>
                        this.setState({
                          splaying: 'STOPPED',
                        })
                      }
                      onPressEnter={() => {
                        this.changeFoucus(2);
                      }}
                      onBlur={() =>
                        this.setState({
                          codes: this.state.codeCode
                            .filter(item => {
                              return (
                                item.split(',')[0] === this.props.form.getFieldValue('lotCode')
                              );
                            })
                            .map(item => item.split(',')[1]),
                        })
                      }
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
                <Col md={24}>
                  <FormItem label="目标数量">
                    <InputNumber
                      value={this.state.lotCount}
                      disabled={info.orderCode !== undefined}
                      onChange={e =>
                        this.setState({
                          lotCount: e,
                        })
                      }
                      placeholder="请输入"
                    />
                  </FormItem>
                  <div style={{ fontSize: 50, color: '#f5222d' }}>
                    当前载具总数:{this.state.codeCode.length}
                  </div>
                  <div style={{ fontSize: 50, color: '#f5222d' }}>
                    当前批数:{this.state.lot.size}
                  </div>
                </Col>
              </Col>

              <Col md={12} sm={24}>
                <FormItem label="条码编号">
                  {getFieldDecorator('codeCode', {})(
                    <Input
                      ref={e => {
                        this.i_2 = e;
                      }}
                      disabled={info.orderCode !== undefined}
                      onPressEnter={this.handleChange}
                      autosize={{ minRows: 10, maxRows: 20 }}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
                {this.state.codeCode.map(item => (
                  <Row key={item}>
                    {item}
                    {info.orderCode !== undefined ? null : (
                      <Icon
                        style={{ marginLeft: 20, color: '#cf1322' }}
                        onClick={() => confirm(item)}
                        type="delete"
                      />
                    )}
                  </Row>
                ))}
                <Sound url="/sound/alarm.mp3" loop playStatus={this.state.playing} />
                <Sound url="/sound/pcsuccess.mp3" playStatus={this.state.splaying} />
              </Col>
            </Row>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}
