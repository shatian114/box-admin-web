/*
 * @Author: cuiwei 
 * @Date: 2018-05-24 15:24:07 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:01:52
 * @Description: 批次
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, DatePicker, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';
import Ellipsis from '../../components/Ellipsis';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const url = 'wmsPackSK';
const routerUrl = '/wmsPackSK';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
@connect(({ wmslot, base }) => ({
  wmslot,
  base,
}))
@Form.create()
@List.create()
export default class WmsPackList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${url}/query`,
      payload: {
        type: 'codeType',
      },
    });

    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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
    const { form, list } = this.props;
    const { setList } = list;
    form.validateFieldsAndScroll((err, values) => {
      const date = {};
      if (values.start_create_date)
        date.start_create_date = values.start_create_date.format(DateFormat);
      if (values.end_create_date) date.end_create_date = values.end_create_date.format(DateFormat);
      setList({
        current: 1,
        queryMap: { ...values, ...date } || {},
      });
    });
  };

  handleFormReset = () => {
    const { form, list } = this.props;
    const { setList } = list;
    setList({
      current: 1,
      queryMap: {},
    });
    form.resetFields();
  };

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: `base/delete`,
      payload: {
        id: info.lot_id, // 主键
      },
      callback: () => setList(),
      url,
    });
  };

  render() {
    const { form } = this.props;
    const { color, spec, supplylist, Location } = this.props.base;
    const { getFieldDecorator } = form;
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
        align: 'center',
        width: 100,
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
        title: '备料编号',
        dataIndex: 'lot_id',
        width: 120,
        align: 'center',
        sorter: true,
      },
      {
        title: '批号',
        dataIndex: 'lot_code',
        width: 140,
        align: 'center',
        sorter: true,
      },
      {
        title: '条码编号',
        dataIndex: 'codes',
        width: 120,
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '条码数量',
        align: 'center',
        dataIndex: 'lot_count',
        width: 80,
        sorter: true,
      },

      {
        title: '供应商',
        align: 'center',
        width: 200,
        dataIndex: 'supply_code',
        render: text => {
          if (Array.isArray(supplylist)) {
            const temp = supplylist.find(item => item.supply_code === text);
            if (temp) return `${temp.supply_name}(${temp.supply_sx})`;
            return text;
          }
        },
      },
      {
        title: '载具规格',
        width: 150,
        dataIndex: 'spec',
        align: 'center',
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
        align: 'center',
        render: text => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '货位',
        width: 100,
        dataIndex: 'location',
        align: 'center',
        render: text => {
          if (Array.isArray(Location)) {
            const temp = Location.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },

      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: 200,
        align: 'center',
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
    ];

    const listConfig = {
      url: '/api/query/queryWmsPackList', // 必填,请求url
      scroll: { x: 1500, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'lot_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_create_date: moment()
          .subtract(6, 'day')
          .format('YYYY-MM-DD 00:00:00'),
        end_create_date: moment().format('YYYY-MM-DD 23:59:59'),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="批号">
                  {getFieldDecorator('lot_code', {
                    initialValue: this.props.list.queryMap.lot_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码数量从">
                  {getFieldDecorator('start_lot_count', {
                    initialValue: this.props.list.queryMap.start_lot_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码数量到">
                  {getFieldDecorator('end_lot_count', {
                    initialValue: this.props.list.queryMap.end_lot_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间从">
                  {getFieldDecorator('start_create_date', {
                    initialValue: this.props.list.queryMap.start_create_date
                      ? moment(this.props.list.queryMap.start_create_date)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="创建时间到">
                  {getFieldDecorator('end_create_date', {
                    initialValue: this.props.list.queryMap.end_create_date
                      ? moment(this.props.list.queryMap.end_create_date)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Button icon="search" type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.props.dispatch(routerRedux.push(`${routerUrl}/info`))}
                    >
                      新建
                    </Button>
                  </Operate>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
