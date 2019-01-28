/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 17:57:55
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsbaofeirecord';
const routerUrl = '/wmsbaofeirecord';
const DateFormat = 'YYYY-MM-DD';
@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class WmsBaofeirecordList extends Component {
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
      type: `base/delete`,
      payload: {
        id: info.record_id, //主键
      },
      callback: () => setList(),
      url,
    });
  };

  render() {
    const { form, base } = this.props;
    const { color, spec, supplylist, SubwareList } = this.props.base;
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
        width: 250,
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            {record.ishandle == 1 ? (
              ''
            ) : (
              <Operate operateName="UPDATE">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record.record_id, ishandleE: false }, //主键
                  }}
                >
                  <Button type="primary" icon="edit" ghost size="small">
                    编辑
                  </Button>
                </Link>
              </Operate>
            )}
            {record.ishandle == 1 ? (
              ''
            ) : (
              <Operate operateName="DEAL">
                <Link
                  to={{
                    pathname: `${routerUrl}/info`,
                    state: { id: record.record_id, ishandleE: true }, //主键
                  }}
                >
                  <Button type="primary" icon="save" ghost size="small">
                    处理
                  </Button>
                </Link>
              </Operate>
            )}
            {record.ishandle == 1 ? (
              ''
            ) : (
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
            )}
          </Row>
        ),
      },
      {
        title: '条码编码',
        dataIndex: 'code_code',
        width: 150,
        sorter: true,
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
        title: '责任人',
        dataIndex: 'baofei_user',
        width: 150,
      },
      {
        title: '报废原因',
        dataIndex: 'baofei_desc',
        width: 150,
      },
      {
        title: '供应商',
        width: 200,
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
        width: 150,
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
        title: '处理人',
        dataIndex: 'handle_user',
        width: 150,
      },
      {
        title: '处理记录',
        dataIndex: 'handle_desc',
        width: 150,
      },
      {
        title: '是否处理',
        dataIndex: 'ishandle',
        width: 230,
        render: text => {
          const m = moment(text);
          return m == 1 ? '是' : '否';
        },
      },
      {
        title: '损失金额',
        dataIndex: 'baofei_moeny',
        width: 150,
      },
      {
        title: '报废数量',
        dataIndex: 'baofei_count',
        width: 150,
      },
      {
        title: '记录时间',
        dataIndex: 'last_inware',
        width: 230,
        render: text => {
          const m = moment(text);
          return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '暂无';
        },
      },
      {
        title: '是否退换',
        dataIndex: 'isreturn',
        width: 230,
        render: text => {
          const m = moment(text);
          return m == 1 ? '是' : '否';
        },
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
      url: '/api/query/queryWmsBaofeirecordList', // 必填,请求url
      scroll: { x: 2400, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'record_id', // 必填,行key
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
                <FormItem label="责任人">
                  {getFieldDecorator('baofei_user', {
                    initialValue: this.props.list.queryMap.baofei_user,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="是否处理">
                  {getFieldDecorator('ishandle', {
                    initialValue: this.props.list.queryMap.ishandle,
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
                <FormItem label="供应商">
                  {getFieldDecorator('supply_code', {
                    initialValue: this.props.list.queryMap.supply_code,
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
                <FormItem label="记录时间从">
                  {getFieldDecorator('start_last_inware', {
                    initialValue: this.props.list.queryMap.start_last_inware
                      ? moment(this.props.list.queryMap.start_last_inware)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="记录时间到">
                  {getFieldDecorator('end_last_inware', {
                    initialValue: this.props.list.queryMap.end_last_inware
                      ? moment(this.props.list.queryMap.end_last_inware)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请选择" />)}
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
                      onClick={() =>
                        this.props.dispatch(
                          routerRedux.push(`${routerUrl}/info`, { ishandleE: false })
                        )
                      }
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
