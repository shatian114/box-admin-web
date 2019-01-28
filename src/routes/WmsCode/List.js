/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 11:57:56
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmscode';
const routerUrl = '/wmscode';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
@connect(({ wmscode, base }) => ({
  wmscode,
  base,
}))
@Form.create()
@List.create()
export default class WmscodeList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };

  componentDidMount() {
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
      if (values.start_last_inware)
        date.start_last_inware = values.start_last_inware.format(DateFormat);
      if (values.end_last_inware) date.end_last_inware = values.end_last_inware.format(DateFormat);
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
      type: `${url}/delete`,
      payload: {
        id: info.code_code, // 主键
      },
      callback: () => setList(),
      url,
    });
  };

  render() {
    const { form, wmscode } = this.props;
    const { getFieldDecorator } = form;
    const {
      color,
      spec,
      supplylist,
      SubwareList,
      Location,
      codetype,
      codestatus,
    } = this.props.base;
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
        key: 'operate',
        align: 'center',
        width: 160,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="UPDATE">
              <Link
                to={{
                  pathname: `${routerUrl}/info`,
                  state: { id: record.code_code }, // 主键
                }}
              >
                <Button type="primary" icon="edit" ghost size="small">
                  编辑
                </Button>
              </Link>
            </Operate>
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
        width: 160,
        sorter: true,
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        width: 120,
        sorter: true,
        render: text => {
          if (Array.isArray(codetype)) {
            const temp = codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '条码状态',
        dataIndex: 'code_status',
        width: 120,
        sorter: true,
        render: text => {
          if (Array.isArray(codestatus)) {
            const temp = codestatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '最后所在仓库',
        dataIndex: 'last_subware',
        width: 200,
        sorter: true,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '最后所在货位',
        dataIndex: 'location',
        width: 140,
        sorter: true,
        render: text => {
          if (Array.isArray(Location)) {
            const temp = Location.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '最后所在批次编码',
        dataIndex: 'lot_code',
        width: 160,
      },
      {
        title: '最后入库时间',
        dataIndex: 'last_inware',
        width: 200,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
      {
        title: '是否清洗',
        dataIndex: 'isclear',
        width: 100,
        render: text => {
          return text == 1 ? '是' : '否';
        },
      },
      {
        title: '出库次数',
        dataIndex: 'outwaretimes',
        width: 100,
      },
      {
        title: '农户',
        dataIndex: 'farmer_name',
        width: 100,
      },
      {
        title: '商超',
        dataIndex: 'market_name',
        width: 100,
      },
      {
        title: '车辆',
        dataIndex: 'vehicle_number',
        width: 100,
      },
      {
        title: '中转仓',
        dataIndex: 'outware_id',
        width: 100,
      },
      {
        title: '供应商',
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
        title: '主营农产品',
        width: 150,
        dataIndex: 'product',
      },
      {
        title: '农产品数量',
        width: 100,
        dataIndex: 'product_count',
      },
      {
        title: '动作',
        dataIndex: 'action',
        width: 100,
      },
    ];

    const listConfig = {
      url: '/box/api/query/queryWmsCodeList', // 必填,请求url
      scroll: { x: 2400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'code_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        start_last_inware: moment()
          .subtract(6, 'day')
          .format('YYYY-MM-DD 00:00:00'),
        end_last_inware: moment().format('YYYY-MM-DD 23:59:59'),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="条码类型">
                  {getFieldDecorator('code_type', {
                    initialValue: this.props.list.queryMap.code_type,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(wmscode.codetype)
                        ? wmscode.codetype.map(item => (
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
                <FormItem label="条码状态">
                  {getFieldDecorator('code_status', {
                    initialValue: this.props.list.queryMap.code_status,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(wmscode.codestatus)
                        ? wmscode.codestatus.map(item => (
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
                <FormItem label="条码编码">
                  {getFieldDecorator('code_code', {
                    initialValue: this.props.list.queryMap.code_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="是否清洗">
                  {getFieldDecorator('isclear', {
                    initialValue: this.props.list.queryMap.isclear,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="所在仓库">
                  {getFieldDecorator('last_subware', {
                    initialValue: this.props.list.queryMap.last_subware,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="批次编码">
                  {getFieldDecorator('last_lot', {
                    initialValue: this.props.list.queryMap.last_lot,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>

              <Col md={8} sm={24}>
                <FormItem label="入库时间从">
                  {getFieldDecorator('start_last_inware', {
                    initialValue: this.props.list.queryMap.start_last_inware
                      ? moment(this.props.list.queryMap.start_last_inware)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="入库时间到">
                  {getFieldDecorator('end_last_inware', {
                    initialValue: this.props.list.queryMap.end_last_inware
                      ? moment(this.props.list.queryMap.end_last_inware)
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
