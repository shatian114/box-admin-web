/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:59:42
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker, Message } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import db from '../../utils/db';
import styles from '../../styles/list.less';

import List from '../../components/Listb';
import Operate from '../../components/Oprs';
import SupplyList from '../Supply/List';
const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsinventoryorder';
const routerUrl = '/wmsinventoryorder';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
const saveConfig = {
  one: {
    callback: () => store.dispatch(routerRedux.goBack()),
  },
  two: {},
};
@connect(({ base, loading }) => ({
  base,
  submitting: loading.effects[`base/fetch`] || loading.effects[`base/fetchAdd`],
  loading: loading.effects[`base/info`] || loading.effects[`base/new`] || false,
}))
@Form.create()
@List.create()
export default class MyInfo extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
    showList: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.base.info.id || (this.props.location.state && this.props.location.state.id)) {
      dispatch({
        type: `base/info`,
        payload: {
          id: this.props.location.state.id,
        },
        url,
        callback: () => {
          this.setState({
            showList: true,
          });
        },
      });
    } else {
      dispatch({
        type: `base/new`,
        url,
        callback: () => {
          this.setState({
            showList: true,
          });
        },
      });
    }
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.props.dispatch({
      type: 'listb/clear',
    });
  }

  @Bind()
  @Debounce(200)
  resize() {
    this.setState({
      scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, listb } = this.props;
    const { setList } = listb;
    form.validateFieldsAndScroll((err, values) => {
      const date = {};
      if (values.start_outware_date)
        date.start_outware_date = values.start_outware_date.format(DateFormat);
      if (values.end_outware_date)
        date.end_outware_date = values.end_outware_date.format(DateFormat);
      setList({
        current: 1,
        queryMap: { ...values, ...date } || {},
      });
    });
  };

  handleFormReset = () => {
    const { form, listb } = this.props;
    const { setList } = listb;
    // setList({
    //   current: 1,
    //   queryMap: {},
    // });
    form.resetFields();
  };
  @Bind()
  getInfoByCode() {
    const codeCode = this.props.form.getFieldValue('codeCode');
    const { dispatch } = this.props;
    const this1 = this;
    dispatch({
      type: `base/getobjbyCode`,
      payload: {
        codeCode,
      },
      callback: () => {
        const { infoByCode } = this1.props.base;
        if (infoByCode.codeType === undefined) Message.error('不存在该编号');
        this1.props.base.info.supplyCode = infoByCode.supplyCode;
        this1.props.base.info.spec = infoByCode.spec;
        this1.props.base.info.color = infoByCode.color;
        this.props.form.setFieldsValue(this1.props.base.info);
      },
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        if (this.props.base.newInfo.orderCode || this.props.base.info.orderCode) {
          const value = {
            orderCode: this.props.base.newInfo.orderCode || this.props.base.info.orderCode,
            supplyCode: values.supplyCode,
            spec: values.spec,
            color: values.color,
            curCount: values.curCount,
          };
          dispatch({
            type: `base/fetchCount`,
            payload: {
              value: value,
            },
            url,
            callback: () => {
              this.props.listb.setList();
              this.handleFormReset();
              Message.success('请继续确认其他箱子数量');
            },
          });
        }
      }
    });
  };
  render() {
    const { form, wmscode, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist, SubwareList, info, newInfo } = this.props.base;
    const { hanleDelete } = this;
    const showConfirm = record => {
      Modal.confirm({
        title: '确定想要删除吗?',
        okType: 'danger',
        okText: '是',
        cancelText: '否',
        onOk() {
          hanleDelete(record);
        },
      });
    };

    const columns = [
      // {
      //   title: '单据类型',
      //   dataIndex: 'order_type',
      //   width: 100,
      // },
      // {
      //   title: '批次条码',
      //   dataIndex: 'lot_code',
      //   width: 100,
      //   sorter: true,
      // },
      // {
      //   title: '是否包含载具条码',
      //   dataIndex: 'iscodes',
      //   width: 150,
      //   render: text => {

      //   },
      // },
      // {
      //   title: '载具条码',
      //   dataIndex: 'codes',
      //   width: 150,
      //   sorter: true,
      // },
      {
        title: '供应商',
        width: 100,
        dataIndex: 'supply_code',
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === text);
            if (temp) return `${temp.supply_name}` + '(' + temp.supply_sx + ')';
            return text;
          }
        },
      },
      {
        title: '载具规格',
        width: 100,
        dataIndex: 'spec',
        render: text => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '载具颜色',
        width: 100,
        dataIndex: 'color',
        render: text => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '应存载具数量',
        dataIndex: 'code_count',
        width: 100,
      },
      {
        title: '实际载具数量',
        dataIndex: 'cur_count',
        width: 100,
      },
      {
        title: '损毁载具数量',
        dataIndex: 'baofei_count',
        width: 100,
      },
      {
        title: '丢失载具数量',
        dataIndex: 'lost_count',
        width: 100,
      },
      // {
      //   title: '创建人',
      //   dataIndex: 'create_user',
      //   width: 200,
      // },
      // {
      //   title: '创建时间',
      //   dataIndex: 'create_date',
      //   width: 200,
      //   render: text => {
      //     const m = moment(text);
      //     return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
      //   },
      // },
      // {
      //   title: '修改人',
      //   dataIndex: 'modify_user',
      //   width: 200,
      // },
      // {
      //   title: '修改时间',
      //   dataIndex: 'modify_date',
      //   render: text => {
      //     const m = moment(text);
      //     return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
      //   },
      // },
    ];

    const listConfig = {
      url: '/api/query/queryWmsInventoryorder2LotList', // 必填,请求url
      scroll: { x: 800, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'order_lot_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        order_code: newInfo.orderCode == null ? info.orderCode : newInfo.orderCode,
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="箱子编码">
                  {getFieldDecorator('codeCode', {})(
                    <Input
                      placeholder="请扫任意箱子编码"
                      onPressEnter={() => {
                        this.getInfoByCode();
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="盘点时间从">
                  {getFieldDecorator('start_outware_date', {
                    initialValue:
                      newInfo.outwareSDate || info.outwareSDate
                        ? moment(newInfo.outwareSDate || info.outwareSDate)
                        : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" disabled />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="盘点时间到">
                  {getFieldDecorator('end_outware_date', {
                    initialValue:
                      newInfo.outwareDate || info.outwareDate
                        ? moment(newInfo.outwareDate || info.outwareDate)
                        : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" disabled />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="供应商编码">
                  {getFieldDecorator('supplyCode', {
                    initialValue: info.supplyCode,
                    rules: [
                      {
                        required: true,
                        message: '必须输入实际数量',
                      },
                      {
                        max: 64,
                        message: '地址必须小于64位!',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(supplylist)
                        ? supplylist.map(item => (
                            <Option key={item.supply_code} value={item.supply_code}>
                              {`${item.supply_name}(${item.supply_sx})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="载具规格">
                  {getFieldDecorator('spec', {
                    initialValue: info.spec,
                    rules: [
                      {
                        required: true,
                        message: '必须输入实际数量',
                      },
                      {
                        max: 64,
                        message: '载具规格必须小于64位!',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
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
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="载具颜色">
                  {getFieldDecorator('color', {
                    initialValue: info.color,
                    rules: [
                      {
                        required: true,
                        message: '必须输入实际数量',
                      },
                      {
                        max: 64,
                        message: '地址必须小于64位!',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
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
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="该规格实际数量">
                  {getFieldDecorator('curCount', {
                    rules: [
                      {
                        required: true,
                        message: '必须输入实际数量',
                      },
                    ],
                  })(<Input placeholder="请填入实际数量" />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <span className={styles.submitButtons}>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.props.dispatch(routerRedux.goBack());
                    }}
                  >
                    返回
                  </Button>
                  {info.orderStatus == 'confirm' || info.orderStatus == 'close' ? (
                    ''
                  ) : (
                    <Operate operateName="SAVE">
                      <Button
                        style={{ marginLeft: 8 }}
                        type="primary"
                        onClick={this.handleSubmit}
                        loading={submitting}
                      >
                        确定
                      </Button>
                    </Operate>
                  )}
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        {this.state.showList ? <List {...listConfig} /> : ''}
      </div>
    );
  }
}
