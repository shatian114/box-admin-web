/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 15:30:39
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import styles from './list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmscoderecordSC';
const routerUrl = '/wmscoderecordSC';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';
@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class WmsCoderecordSCList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 200 + document.body.clientHeight - 800 : 200,
  };

  componentDidMount() {
    const { dispatch } = this.props;
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
      if (values.startDate) date.startDate = values.startDate.format(DateFormat);
      if (values.endDate) date.endDate = values.endDate.format(DateFormat);
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
        id: info.record_id, // 主键
      },
      callback: () => setList(),
      url,
    });
  };

  render() {
    const { form, base } = this.props;
    const { getFieldDecorator } = form;
    const { hanleDelete } = this;
    const { color, spec, supplylist, SubwareList, Location } = this.props.base;

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
      //   title: '操作',
      //   key: 'record_id',
      //   align: 'center',
      //   width: 250,
      //   render: (text, record) => (
      //     <Row type="flex" justify="space-around">
      //       <Operate operateName="UPDATE">
      //         <Link
      //           to={{
      //             pathname: `${routerUrl}/info`,
      //             state: { id: record.record_id }, // 主键
      //           }}
      //         >
      //           <Button type="primary" icon="edit" ghost size="small">
      //             编辑
      //           </Button>
      //         </Link>
      //       </Operate>
      //       <Operate operateName="DELETE">
      //         <Button
      //           type="danger"
      //           icon="delete"
      //           ghost
      //           size="small"
      //           onClick={() => showConfirm(record)}
      //         >
      //           删除
      //         </Button>
      //       </Operate>
      //     </Row>
      //   ),
      // },

      {
        title: '动作',
        dataIndex: 'action',
        width: 100,
      },
      {
        title: '操作时间',
        dataIndex: 'create_date',
        width: 150,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
      {
        title: '条码编码',
        dataIndex: 'code_code',
        width: 150,
        sorter: true,
      },
      {
        title: '条码状态',
        dataIndex: 'code_status',
        width: 110,
        sorter: true,
        render: text => {
          if (Array.isArray(base.codestatus)) {
            const temp = base.codestatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '最后所在仓库',
        dataIndex: 'last_subware',
        width: 140,
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
        title: '农户',
        dataIndex: 'farmer_name',
        width: 100,
      },
      {
        title: '车辆',
        dataIndex: 'vehicle_number',
        width: 100,
      },
      {
        title: '供应商',
        width: 120,
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
        width: 120,
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
        width: 120,
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
        title: '单据编码',
        dataIndex: 'order_code',
        width: 150,
        sorter: true,
      },
      {
        title: '单据类型',
        dataIndex: 'order_type',
        width: 150,
        sorter: true,
        render: text => {
          if (Array.isArray(base.ordertype)) {
            const temp = base.ordertype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        width: 150,
        sorter: true,
        render: text => {
          if (Array.isArray(base.codetype)) {
            const temp = base.codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '中转仓',
        dataIndex: 'outware_id',
        width: 150,
      },
      {
        title: '批次条码',
        dataIndex: 'lot_code',
        sorter: true,
      },

      // {
      //   title: '创建人',
      //   dataIndex: 'create_user',
      //   width: 200,
      // },
      // {
      //   title: '创建时间',
      //   dataIndex: 'create_date',
      //   width: 230,
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
      //   width: 230,
      //   render: text => {
      //     const m = moment(text);
      //     return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
      //   },
      // },
    ];

    const listConfig = {
      url: '/api/query/queryWmsCoderecordSCList', // 必填,请求url
      scroll: { x: 3000, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        startDate: moment().format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD 23:59:59'),
      },
    };
    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="单据编码">
                  {getFieldDecorator('order_code', {
                    initialValue: this.props.list.queryMap.order_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="单据类型">
                  {getFieldDecorator('order_type', {
                    initialValue: this.props.list.queryMap.order_type,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(base.ordertype)
                        ? base.ordertype.map(item => (
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
                      {Array.isArray(base.codetype)
                        ? base.codetype.map(item => (
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
                      {Array.isArray(base.codestatus)
                        ? base.codestatus.map(item => (
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
                <FormItem label="所在仓库">
                  {getFieldDecorator('last_subware', {
                    initialValue: this.props.list.queryMap.last_subware,
                  })(
                    <Select
                      showSearch
                      placeholder="选择"
                      optionFilterProp="children"
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
              <Col md={8} sm={24}>
                <FormItem label="操作时间从">
                  {getFieldDecorator('startDate', {
                    initialValue: this.props.list.queryMap.startDate
                      ? moment(this.props.list.queryMap.startDate)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="操作时间到">
                  {getFieldDecorator('endDate', {
                    initialValue: this.props.list.queryMap.endDate
                      ? moment(this.props.list.queryMap.endDate)
                      : null,
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="动作">
                  {getFieldDecorator('action', {
                    initialValue: this.props.list.queryMap.action,
                  })(<Input placeholder="请输入" />)}
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
