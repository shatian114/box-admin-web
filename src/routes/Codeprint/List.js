/*
 * @Author: cuiwei
 * @Date: 2018-05-18
 * @Description: 条码打印列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, Popover } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const { Option } = Select;
const url = 'codeprint';
const routerUrl = '/codeprint';

@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class CodeprintList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    const { dispatch } = this.props;

    dispatch({
      type: `${url}/new`,
      url,
    });
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
      setList({
        current: 1,
        queryMap: { ...values } || {},
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
        id: info.codeprint_code,
      },
      callback: () => setList(),
      url,
    });
  };
  handlePrint = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: `${url}/printCode`,
      payload: {
        id: info.codeprint_code,
      },
      callback: () => setList(),
      url,
    });
    setList({});
  };

  handleExport = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      dispatch({
        type: `list/exportExcel`,
        payload: {
          filename: '条码打印记录.xls',
          ...values,
        },
        url,
      });
    });
  };

  render() {
    const { form } = this.props;
    const { codetype, color, spec, supplylist } = this.props.base;
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
        width: 160,
        render: (text, record) => {
          let opr = <span style={{ color: '#999999' }}>已关闭</span>;
          if (record.isprint != '1') {
            opr = (
              <Row type="flex" justify="space-around">
                <Operate operateName="PRINT">
                  <Button
                    type="primary"
                    icon="printer"
                    ghost
                    size="small"
                    onClick={() => this.handlePrint(record)}
                  >
                    打印
                  </Button>
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
            );
          }
          return opr;
        },
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        align: 'center',
        width: 250,
        render: (text, row) => {
          if (codetype && codetype.length) {
            for (var item of codetype) {
              if (text == item.dic_code) {
                return item.dic_name + '(' + item.dic_code + ')';
              }
            }
          }
          return text;
        },
      },
      {
        title: '条码起始编号',
        dataIndex: 'code_start',
        width: 200,
        align: 'center',
      },
      {
        title: '条码结束编号',
        dataIndex: 'code_end',
        width: 200,
        align: 'center',
      },
      {
        title: '条码数量',
        dataIndex: 'code_count',
        align: 'center',
        width: 110,
      },
      {
        title: '条码打印份数',
        dataIndex: 'code_times',
        align: 'center',
        width: 120,
      },
      {
        title: '是否已打印',
        dataIndex: 'isprint',
        align: 'center',
        width: 150,
        render: (text, row) => {
          return text == '1' ? '是' : '否';
        },
      },
      {
        title: '打印时间',
        dataIndex: 'print_date',
        sorter: true,
        width: 110,
      },
      {
        title: '供应商',
        dataIndex: 'supply_code',
        align: 'center',
        width: 180,
        render: (text, row) => {
          if (supplylist && supplylist.length) {
            for (var item of supplylist) {
              if (text == item.supply_code) {
                return item.supply_name + '(' + item.supply_sx + ')';
              }
            }
          }
          return text;
        },
      },
      {
        title: '规格',
        dataIndex: 'spec',
        align: 'center',
        width: 180,
        render: (text, row) => {
          if (spec && spec.length) {
            for (var item of spec) {
              if (text == item.dic_code) {
                return item.dic_name;
              }
            }
          }
          return text;
        },
      },
      {
        title: '颜色',
        dataIndex: 'color',
        align: 'center',
        width: 100,
        render: (text, row) => {
          if (color && color.length) {
            for (var item of color) {
              if (text == item.dic_code) {
                return item.dic_name;
              }
            }
          }
          return text;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        align: 'center',
        width: '120',
      },
      {
        title: '打印说明',
        dataIndex: 'code_desc',
        align: 'center',
        width: '200',
        render(text, record) {
          return (
            <Popover
              content={
                <span style={{ width: 200, display: 'inline-block', textIndent: '2em' }}>
                  {text}
                </span>
              }
              title="打印说明"
            >
              <span className={styles.longText}>{text}</span>
            </Popover>
          );
        },
      },
    ];

    const listConfig = {
      url: '/box/api/query/queryCodeprintList', // 必填,请求url
      scroll: { x: 2200, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'codeprint_code', // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="条码">
                  {getFieldDecorator('print_code', {
                    initialValue: this.props.list.queryMap.print_code,
                  })(<Input placeholder="请输入条码编号" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="条码类型">
                  {getFieldDecorator('code_type', {
                    initialValue: this.props.list.queryMap.code_type,
                  })(
                    <Select
                      showSearch
                      placeholder="全部"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(codetype)
                        ? codetype.map(item => (
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
                <FormItem label="是否已打印">
                  {getFieldDecorator('isprint', {
                    initialValue: this.props.list.queryMap.isprint,
                  })(
                    <Select
                      showSearch
                      placeholder="全部"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option key={'是'} value={1}>
                        是
                      </Option>
                      <Option key={'否'} value={0}>
                        否
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Operate operateName="QUERY">
                    <Button icon="search" type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Operate>
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
                  <Operate operateName="QUERY">
                    <Button
                      icon="export"
                      onClick={this.handleExport}
                      style={{ marginLeft: 8, backgroundColor: '#5bc0de', borderColor: '#46b8da' }}
                      type="primary"
                    >
                      导出
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
