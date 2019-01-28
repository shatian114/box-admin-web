import React from 'react';
import {
  Select,
  Card,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Modal,
  Alert,
  notification,
} from 'antd';
import Sound from 'react-sound';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../../styles/storage.less';
import store from '../../index';

import TableForm from './TableForm';
import { isEmpty } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
// 该模块后端url
const url = 'inorder';
// 查询打印表url
const queryCodeUrl = 'codeprint';
// 保存类型新建即保存
const saveType = 'db';
// 是否返回
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};
const OKCODE = 'ok';
const current_input = undefined;
@connect(({ base, listb }) => ({
  base,
  listb,
}))
@Form.create()
export default class Storage extends React.PureComponent {
  state = {
    cVisible: false,
    visible: false,
    playing: 'STOPPED', // PLAYING报警声
    splaying: 'STOPPED',
    lotCount: 50, // 手动录入当前批次数量
    codeCount: 0, // 当前批次临时库数量
  };

  componentDidMount() {
    // 获取焦点
    const _this = this;
    // const clock = setInterval(() => {
    //   const lotCode = _this.props.form.getFieldValue('lotCode');
    //   const codeCode = _this.props.form.getFieldValue('codeCode');
    //   if (_this.i_3) {
    //     _this.i_3.focus();
    //   } else if (_this.state.cVisible) {
    //     if (_this.i_1 && isEmpty(lotCode)) {
    //       _this.i_1.focus();
    //     } else if (_this.i_2 && isEmpty(codeCode)) {
    //       _this.i_2.focus();
    //     }
    //   }
    // }, 2000);
    const { dispatch } = this.props;
    // 如果有详情获取详情
    if (
      this.props.base.info.orderCode ||
      (this.props.location.state && this.props.location.state.id)
    ) {
      dispatch({
        type: 'base/info',
        payload: {
          id: this.props.location.state.id,
        },
        url,
        callback: () => {
          // this.showCollect(this.props.base.info.orderStatus === 'new')
        },
      });
    } else {
      // 没有详情创建并保存
      dispatch({
        type: 'base/new',
        url,
        callback: () => {
          this.props.dispatch({
            type: 'base/fetchAdd',
            payload: {
              ...this.props.base.newInfo,
              saveType,
            },
            url,
          });
        },
      });
      this.showCollect(true);
    }

    // 获取字典表转义
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/clear',
    });
  }
  // 保存临时表数据
  setTable = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { codeInfo } = this.props.base;
      // 验证是否可以保存
      if (!err && codeInfo && this.verifyCode(values.codeCode)) {
        const { dispatch } = this.props;
        dispatch({
          type: 'base/inWare',
          payload: {
            ...values,
            ...this.props.base.newInfo,
            ...this.props.base.info,
            ...this.props.base.newOther,
            lotCount: 1,
          },
          url: 'tmporder2code',
          errback: msg => {
            this.msg = msg;
            this.hadnleErr();
          },
          callback: () => {
            dispatch({
              type: 'base/newOther',
              url: 'tmporder2code',
            });
            dispatch({
              type: 'listb/list',
              payload: {},
            });
          },
        });

        this.props.form.setFieldsValue({
          codeCode: null,
        });
      } else if (isEmpty(codeInfo)) {
        const temp = this.props.form.getFieldValue('lotCode');
        this.props.dispatch({
          type: 'base/queryCode',
          payload: {
            code: temp,
          },
          url: queryCodeUrl,
          success: () => {
            this.setTable();
          },
          failed: msg => {
            this.msg = msg;
            this.hadnleErr();
          },
        });
      } else {
        this.msg = '条码编号必填';
        this.hadnleErr();
      }
    });
  };
  // 触发报错
  hadnleErr = () => {
    this.setState({
      playing: 'PLAYING',
    });
    const btn = (
      <Button
        type="primary"
        size="large"
        onClick={() => {
          notification.close('not');
          this.setState({
            playing: 'STOPPED',
          });
        }}
      >
        返回确认
      </Button>
    );
    const _this = this;
    const goBackBtn = (
      <div>
        <Input
          style={{ zIndex: -1 }}
          onKeyDown={event => {
            if (event.target.value && event.target.value.match(OKCODE)) {
              notification.destroy();
            }
          }}
          ref={e => {
            this.i_3 = e;
          }}
        />
        {this.msg},请检查原因
      </div>
    );
    notification.open({
      placement: 'topLeft',
      className: styles.notification,
      message: '条码导入失败',
      description: goBackBtn,
      key: 'not',
      duration: 0,
      onClose: () => {
        this.setState({
          playing: 'STOPPED',
        });
      },
      btn,
    });
  };

  verifyNul = item => {
    return item === null && item === undefined;
  };

  // 验证条码编号
  verifyCode = () => {
    const { codeInfo } = this.props.base;
    if (this.verifyNul(codeInfo.codeCount)) {
      this.msg = '批次信息暂无';
      return false;
    }
    if (
      this.props.base.newOther.recordId === null &&
      this.props.base.newOther.recordId === undefined
    ) {
      this.msg = '临时表初始化数据失败,刷新页面';
      return false;
    }
    // 验证条码数量是否小于该批次数量或手动录入数量
    return this.handleChange();
  };

  queryCodeRule = () => {
    const temp = this.props.form.getFieldValue('lotCode');
    const ordertemp = this.props.form.getFieldValue('orderCode');
    if (temp) {
      // 不需要访问服务器这么多次 todo ？？？？？？
      // 查询该批次打印表规则
      this.props.dispatch({
        type: 'base/queryCode',
        payload: {
          code: temp,
        },
        url: queryCodeUrl,
        failed: msg => {
          this.msg = msg;
          this.hadnleErr();
        },
      });

      // 查询该批次临时表数量
      this.props.dispatch({
        type: 'base/queryCodeCount',
        payload: {
          orderCode: ordertemp,
          lotCode: temp,
        },
        callback: count => {
          this.setState({
            codeCount: count,
          });
        },
      });
    }
  };

  // 判断该批次临时表数量小于录入数量或打印表规则数量
  // 如果相等清空批次,焦点放在批次输入框
  handleChange = () => {
    const { codeInfo } = this.props.base;
    if (this.state.codeCount >= this.state.lotCount) {
      this.setState({
        codeCount: 0,
      });
      this.props.dispatch({
        type: 'base/save',
        payload: {
          codeInfo: null,
        },
      });
      this.changeFoucus(1);
      // this.props.form.setFieldsValue({
      //   lotCode: null,
      // });
      this.msg = '该批次载具数量不能超过目标数量';
      return false;
    } else if (this.state.codeCount >= this.state.lotCount - 1) {
      this.setState({
        codeCount: 0,
      });
      this.props.dispatch({
        type: 'base/save',
        payload: {
          codeInfo: null,
        },
      });
      this.changeFoucus(1);
      // this.props.form.setFieldsValue({
      //   lotCode: null,
      // });
      this.setState({
        splaying: 'PLAYING',
      });
      return true;
    } else {
      this.setState({
        codeCount: Number(this.state.codeCount) + 1,
      });
      return true;
    }
  };

  // 切换焦点
  changeFoucus = i => {
    this[`i_${i}`].focus();
  };
  // 更新入库单
  handleOk = () => {
    const { dispatch } = this.props;
    const { orderCode } = this.props.base.info;
    if (this.props.base.info.orderCode) {
      dispatch({
        type: 'base/fetch',
        payload: {
          ...this.props.base.info,
          caigouCode: this.props.form.getFieldValue('caigouCode'),
        },
        url,
        ...saveConfig.one,
        callback: () => {
          dispatch({
            type: 'base/confirmOrder',
            payload: {
              id: orderCode,
            },
            url,
            callback: () => {
              this.props.dispatch(routerRedux.goBack());
            },
          });
          this.setState({
            visible: false,
          });
        },
      });
    } else {
      this.msg = '入库单初始化失败';
      this.hadnleErr();
    }
    this.setState({
      visible: false,
    });
  };

  showCollect = arg => {
    this.setState({
      cVisible: arg,
    });
  };
  // 关闭模态窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 关闭模态窗
  handleSave = () => {
    const caigouCode = this.props.form.getFieldValue('caigouCode');
    this.props.dispatch({
      type: 'base/fetch',
      payload: {
        ...this.props.base.info,
        caigouCode,
      },
      url,
    });
  };

  // 打开模态窗
  handleSubmit = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { SubwareList, newInfo, info } = this.props.base;
    return (
      <div>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="vertical">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem label="单据编号">
                  {getFieldDecorator('orderCode', {
                    initialValue: info.orderCode || newInfo.orderCode,
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(<Input disabled placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="仓库">
                  {getFieldDecorator('inSubware', {
                    initialValue: info.inSubware || newInfo.inSubware,
                    rules: [
                      {
                        required: true,
                        message: '必选',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="选择仓库"
                      optionFilterProp="children"
                      disabled
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(SubwareList)
                        ? SubwareList.map(item => (
                            <Option key={item.dic_code} value={item.dic_code}>
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="入库时间">
                  {getFieldDecorator('lastInware', {
                    initialValue: moment(info.lastInware || newInfo.lastInware),
                    rules: [
                      {
                        required: true,
                        message: '不能忽略',
                      },
                    ],
                  })(
                    <DatePicker disabled showTime format="YYYY-MM-DD HH:mm" placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="采购单号">
                  {getFieldDecorator('caigouCode', {
                    initialValue: info.caigouCode || newInfo.caigouCode,
                  })(<Input disabled={info.orderStatus !== 'new'} placeholder="请输入" />)}
                </FormItem>
              </Col>

              <Col md={24} sm={24}>
                <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={24} sm={24} className={styles.ctlBtn}>
                    <Button
                      icon="left"
                      onClick={() => {
                        this.props.dispatch(routerRedux.goBack());
                      }}
                    >
                      返回
                    </Button>

                    {info.orderStatus === 'new' ? (
                      <React.Fragment>
                        <Button
                          style={{ backgroundColor: '#5cb85c', borderColor: '#4cae4c' }}
                          icon="upload"
                          type="primary"
                          onClick={this.handleSubmit}
                        >
                          确认入库
                        </Button>
                        <Button
                          style={{ backgroundColor: '#5bc0de', borderColor: '#46b8da' }}
                          icon="check"
                          type="primary"
                          onClick={this.handleSave}
                        >
                          保存
                        </Button>
                        {this.state.cVisible ? (
                          ''
                        ) : (
                          <Button
                            icon="caret-right"
                            type="primary"
                            onClick={() => {
                              this.showCollect(true);
                            }}
                          >
                            继续录入
                          </Button>
                        )}
                      </React.Fragment>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>

        <Modal
          title="入库采集中..."
          width="256px"
          style={{ marginLeft: '1px', marginTop: '10px' }}
          visible={this.state.cVisible}
          onCancel={() => {
            this.showCollect(false);
          }}
          mask={false}
          maskClosable
          footer={null}
          okText="确认"
        >
          <div style={{ height: '60vh' }}>
            <Row>
              <Col>
                {this.props.base.info.orderStatus === 'new' ? (
                  <div className={styles.total}>载具总数:{this.props.listb.total}</div>
                ) : null}
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="批号">
                  {getFieldDecorator('lotCode', {
                    rules: [
                      {
                        required: true,
                        message: '批号必填',
                      },
                    ],
                  })(
                    <Input
                      ref={e => {
                        this.i_1 = e;
                      }}
                      onChange={() =>
                        this.setState({
                          splaying: 'STOPPED',
                        })
                      }
                      onBlur={this.queryCodeRule}
                      className={styles.imeDisabled}
                      onPressEnter={() => this.changeFoucus(2)}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>

              <Col md={24} sm={24}>
                <FormItem label="条码编号">
                  {getFieldDecorator('codeCode', {
                    rules: [
                      {
                        required: true,
                        message: '条码编号必填',
                      },
                    ],
                  })(
                    <Input
                      ref={e => {
                        this.i_2 = e;
                      }}
                      className={styles.imeDisabled}
                      onPressEnter={this.setTable}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <Row type="flex" justify="space-around" align="middle">
                  <Col>
                    <FormItem label="目标数量">
                      <InputNumber
                        value={this.state.lotCount}
                        onChange={e =>
                          this.setState({
                            lotCount: e,
                          })
                        }
                        placeholder="请输入"
                      />
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem label={<div />} colon={false}>
                      <Button onClick={this.setTable} icon="play-circle" type="primary">
                        输入
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Sound url="/sound/alarm.mp3" loop playStatus={this.state.playing} />
              <Sound url="/sound/pcsuccess.mp3" playStatus={this.state.splaying} />
            </Row>
          </div>
        </Modal>
        {info.orderCode ? (
          <TableForm
            orderStatus={info.orderStatus}
            format={{ spec: this.props.base.spec, supplylist: this.props.base.supplylist }}
            orderCode={info.orderCode}
          />
        ) : (
          <Card loading="true" />
        )}
        <Modal
          title="确认入库"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Alert
            message="警告"
            description={
              <div>
                <span className={styles.total}>当前载具总数:{this.props.listb.total}</span>,确认数量后不可更改.
              </div>
            }
            type="warning"
            showIcon
          />
        </Modal>
      </div>
    );
  }
}
