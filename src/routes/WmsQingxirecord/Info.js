/*
 * @Author: lbb 
 * @Date: 2018-05-19 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-12 11:31:14
 * @Description:条码
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import db from '../../utils/db';
import styles from '../../styles/list.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';
const FormItem = Form.Item;
const { Option } = Select;
const url = 'wmsQingxirecord';
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ base, loading, wmscode }) => ({
  base,
  wmscode,
  submitting: loading.effects[`base/fetch`] || loading.effects[`base/fetchAdd`],
  loading: loading.effects[`base/info`] || loading.effects[`base/new`] || false,
}))
@Form.create()
@List.create()
export default class WmsQingxiList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 800 : 430,
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
      });
    } else {
      dispatch({
        type: `base/new`,
        url,
      });
    }
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const mySaveV = this.props.base.newInfo;
        const mySaveV1 = {
          recordId: mySaveV.recordId,
          // recordStatus: values.code_status,
          subware: values.last_subware,
          clearCount: values.clear_count,
          inwareStartdate: moment(values.start_last_inware).format('YYYY-MM-DD HH:mm:ss'),
          inwareEnddate: moment(values.end_last_inware).format('YYYY-MM-DD HH:mm:ss'),
          supplyCode: values.supply_code,
          spec: values.spec,
          color: values.color,
          queryMap: JSON.stringify(values),
        };
        if (this.props.list.queryMap) {
          dispatch({
            type: `base/fetchAdd`,
            payload: {
              recordId: this.props.base.newInfo.recordId,
              ...mySaveV1,
            },
            callback: () => this.props.dispatch(routerRedux.goBack()),
            url,
          });
        }
      }
    });
  };
  render() {
    const { form, wmscode, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { color, spec, supplylist, SubwareList } = this.props.base;

    const columns = [
      {
        title: '条码编码',
        dataIndex: 'code_code',
        width: 150,
        sorter: true,
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        width: 100,
        sorter: true,
        render: text => {
          if (Array.isArray(wmscode.codetype)) {
            const temp = wmscode.codetype.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '条码状态',
        dataIndex: 'code_status',
        width: 100,
        sorter: true,
        render: text => {
          if (Array.isArray(wmscode.codestatus)) {
            const temp = wmscode.codestatus.find(item => item.dic_code === text);
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
        title: '最后所在批次编码',
        dataIndex: 'last_lot',
        width: 150,
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
      url: '/box/api/query/queryWmsCodeList', // 必填,请求url
      scroll: { x: 2300, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey: 'code_code', // 必填,行key
      columns, // 必填,行配置
      queryMap: {
        // code_status: 'inware',
        isclear: 0,
        last_subware: db.get('subwareCode'),
        start_last_inware: moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD 00:00:00'),
        end_last_inware: moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD 23:59:59'),
      },
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="颜色">
                  {getFieldDecorator('color', {
                    initialValue: this.props.list.queryMap.color,
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
                            <Option
                              key={`${item.dic_name}(${item.dic_code})`}
                              value={item.dic_code}
                            >
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
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
                              {`${item.supply_name}(${item.supply_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="规格">
                  {getFieldDecorator('spec', {
                    initialValue: this.props.list.queryMap.spec,
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
                            <Option
                              key={`${item.dic_name}(${item.dic_code})`}
                              value={item.dic_code}
                            >
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
                      disabled={this.props.list.queryMap.code_status !== undefined}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(wmscode.codestatus)
                        ? wmscode.codestatus.map(item => (
                            <Option
                              key={`${item.dic_name}(${item.dic_code})`}
                              value={item.dic_code}
                            >
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
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
                      disabled={this.props.list.queryMap.isclear !== undefined}
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
                  })(
                    <Input
                      disabled={this.props.list.queryMap.last_subware !== undefined}
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="入库时间从">
                  {getFieldDecorator('start_last_inware', {
                    initialValue: this.props.list.queryMap.start_last_inware
                      ? moment(this.props.list.queryMap.start_last_inware)
                      : null,
                    rules: [
                      {
                        required: true,
                        message: '必须输入入库时间',
                      },
                    ],
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="入库时间到">
                  {getFieldDecorator('end_last_inware', {
                    initialValue: this.props.list.queryMap.end_last_inware
                      ? moment(this.props.list.queryMap.end_last_inware)
                      : null,
                    rules: [
                      {
                        required: true,
                        message: '必须输入入库时间',
                      },
                    ],
                  })(<DatePicker showTime format={DateFormat} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="本次清洗总数">
                  {getFieldDecorator('clear_total', {
                    initialValue: this.props.list.total,
                  })(<Input disabled placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button icon="search" type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.props.dispatch(routerRedux.goBack());
                    }}
                  >
                    返回
                  </Button>
                </span>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="清洗数量">
                  {getFieldDecorator('clear_count', {
                    initialValue: this.props.list.queryMap.clear_count,
                    rules: [
                      {
                        required: true,
                        message: '必须输入清洗数量',
                      },
                      {
                        max: 16,
                        message: '清洗数量必须小于64位!',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
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
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
