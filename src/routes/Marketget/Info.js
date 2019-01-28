/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 09:24:27
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker, Message } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import ScanInfo from 'components/ScanInfo';

import db from '../../utils/db';
import styles from '../../styles/list.less';

import List from '../../components/Listb';
import Operate from '../../components/Oprs';
import moment from 'moment';
import SupplyList from '../Supply/List';
import { isEmpty } from '../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsmarketget';
const routerUrl = '/wmsmarketget';
const DateFormat = 'YYYY-MM-DD';
const DateFormat1 = 'YYYY-MM-DD HH:mm:ss';
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

    dispatch({
      type: `base/new`,
      url,
      callback: () => {
        this.setState({
          showList: true,
        });
      },
    });
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.props.dispatch({
      type: 'listb/clear',
    });
    this.props.dispatch({
      type: 'base/clear',
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
    const { form, listb } = this.props;
    const { setList } = listb;
    form.validateFieldsAndScroll((err, values) => {
      let temp = {};
      if (!isEmpty(values.getDate))
        temp = {
          ...temp,
          getDate: values.getDate.format(DateFormat),
        };
      setList({
        current: 1,
        queryMap: { ...values, ...temp, vehicleId: e.vehicleId } || {},
      });
    });
  };
  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, listb } = this.props;
    const { setList } = listb;
    dispatch({
      type: 'base/delete',
      payload: {
        id: info.record_id,
      },
      url,
      callback: () => setList(),
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        let temp = {};
        if (!isEmpty(values.getDate))
          temp = {
            ...temp,
            getDate: values.getDate.format(DateFormat1),
          };
        dispatch({
          type: `base/fetchAdd`,
          payload: {
            ...this.props.base.newInfo,
            ...values,
            ...temp,
          },
          callback: () => {
            this.props.form.setFieldsValue({
              codeCode: '',
            });
            this.props.listb.setList();
            dispatch({
              type: `base/new`,
              url,
            });
            this.handleSearch(values);
          },
          url,
        });
      }
    });
  };
  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist, newInfo, codetype } = this.props.base;
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
      {
        title: '操作',
        key: 'action',
        width: 160,
        align: 'center',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="DELETE">
              <Button
                type="danger"
                icon="delete"
                ghost
                size="small"
                onClick={() => showConfirm(record)}
              >
                删除
              </Button>
            </Operate>
          </Row>
        ),
      },
      {
        title: '条码编码',
        dataIndex: 'code_code',
        width: 150,
      },
      {
        title: '商超',
        dataIndex: 'marketName',
        width: 100,
      },
      {
        title: '车辆',
        dataIndex: 'vehicleName',
        width: 90,
      },
      {
        title: '农户',
        dataIndex: 'farmerName',
        width: 100,
      },
      {
        title: '农产品',
        dataIndex: 'product',
        width: 100,
      },
      {
        title: '农产品数量',
        dataIndex: 'product_count',
        width: 100,
      },
      {
        title: '中转仓',
        dataIndex: 'outware_id',
        width: 100,
      },
      {
        title: '领用时间',
        dataIndex: 'get_date',
        width: 200,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
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
        width: 150,
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
        title: '条码类型',
        width: 120,
        dataIndex: 'code_type',
        render: text => {
          if (Array.isArray(codetype)) {
            const temp = codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}` + '(' + temp.dic_code + ')';
            return text;
          }
        },
      },
    ];

    const listConfig = {
      url: `/api/${url}/queryWmsMarketgetDList`, // 必填,请求url
      scroll: { x: 2000, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        getDate: moment().format(DateFormat),
      },
    };
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem label="车辆">
                  {getFieldDecorator('vehicleId', {
                    initialValue: newInfo.vehicleId,
                    rules: [
                      {
                        required: true,
                        message: '必须选择车辆',
                      },
                    ],
                  })(
                    <ScanInfo
                      userType="vehicle"
                      rowKey="vehicleNumber"
                      success={this.handleSearch}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="商超">
                  {getFieldDecorator('marketId', {
                    initialValue: newInfo.marketId,
                  })(<ScanInfo disabled userType="market" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="领用时间">
                  {getFieldDecorator('getDate', {
                    initialValue: newInfo.getDate ? moment(newInfo.getDate) : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" disabled />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="条码编码">
                  {getFieldDecorator('codeCode', {
                    rules: [
                      {
                        required: true,
                        message: '必须输入条码编码',
                      },
                    ],
                  })(<Input placeholder="请填入条码编码" onPressEnter={this.handleSubmit} />)}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <span className={styles.submitButtons}>
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
