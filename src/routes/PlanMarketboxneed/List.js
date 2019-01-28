/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
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
import { isEmpty } from '../../utils/utils';
import SelectList from '../SelectList';
import Distribution from './Distribution';
import Info from './Info';
const FormItem = Form.Item;
const { Option } = Select;
const routerUrl = '/PlanMarketboxneed';
const url = 'PlanMarketboxneed';
const rowKey = 'need_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base, user }) => ({
  base,
  user,
}))
@Form.create()
@List.create()
export default class PlanMarketboxneedList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
    selectedRowKeys: [],
    visible: false,
    visibleb: false,
    info: {},
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
      console.log(values);
      let temp = {};
      if (!isEmpty(values.start_need_time))
        temp = {
          ...temp,
          start_need_time: values.start_need_time.format(DateFormat),
        };
      if (!isEmpty(values.end_need_time))
        temp = {
          ...temp,
          end_need_time: values.end_need_time.format(DateFormat),
        };
      if (!isEmpty(values.start_create_date))
        temp = {
          ...temp,
          start_create_date: values.start_create_date.format(DateFormat),
        };
      if (!isEmpty(values.end_create_date))
        temp = {
          ...temp,
          end_create_date: values.end_create_date.format(DateFormat),
        };

      setList({
        current: 1,
        queryMap: {
          ...values,
          ...temp,
        },
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
      type: 'base/delete',
      payload: {
        // 主键id
        id: info[rowKey],
      },
      url,
      callback: () => setList(),
    });
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  showModalb = record => {
    this.setState({
      visibleb: true,
      info: record,
      selectedRowKeys: [],
    });
  };
  showModals = () => {
    this.setState({
      visibleb: true,
      info: {},
    });
  };

  closeModal = callback => {
    this.setState(
      {
        visible: false,
      },
      () => {
        if (callback) callback();
      }
    );
  };
  closeModalb = callback => {
    this.setState(
      {
        visibleb: false,
        selectedRowKeys: [],
      },
      () => {
        if (callback) callback();
      }
    );
  };
  render() {
    const { form, base, user: { userInfo } } = this.props;
    const { SubwareList, spec, orderstatus } = base;
    const { selectedRowKeys } = this.state;
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
        width: 200,
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
            <Operate operateName="UPDATE">
              <Button
                type="primary"
                icon="swap"
                ghost
                size="small"
                onClick={() => this.showModalb(record)}
              >
                分配
              </Button>
            </Operate>
          </Row>
        ),
      },
      {
        title: '超市名称',
        dataIndex: 'market_name',
        width: 200,
        sorter: false,
      },
      {
        title: '超市地址',
        dataIndex: 'address',
        width: 200,
        sorter: false,
      },
      {
        title: '超市联系电话',
        dataIndex: 'phone',
        width: 200,
        sorter: false,
      },
      {
        title: '车牌号',
        dataIndex: 'vehicle_number',
        width: 200,
        sorter: false,
      },
      {
        title: '回收仓库代码',
        dataIndex: 'subware_code',
        width: 200,
        sorter: false,
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '规格',
        dataIndex: 'spec',
        width: 200,
        sorter: false,
        render: text => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '数量',
        dataIndex: 'need_count',
        width: 200,
        sorter: false,
      },
      {
        title: '需求时间',
        dataIndex: 'need_time',
        width: 200,
        sorter: false,
      },
      {
        title: '是否分配',
        dataIndex: 'need_status',
        width: 200,
        sorter: false,
        render: text => {
          if (Array.isArray(orderstatus)) {
            const temp = orderstatus.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'need_desc',
        width: 200,
        sorter: false,
      },
      {
        title: '创建时间',
        dataIndex: 'create_date',
        width: 150,
        sorter: false,
      },
    ];
    const queryMap =
      userInfo.role === 'market' || userInfo.role === 'vehicle'
        ? {
            start_create_date: moment()
              .subtract(6, 'day')
              .format(DateFormat),
            end_create_date: moment().format(DateFormat),
          }
        : {
            start_create_date: moment()
              .subtract(6, 'day')
              .format(DateFormat),
            end_create_date: moment().format(DateFormat),
            need_status: 'wfp',
          };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.need_status === 'yfp', // Column configuration not to be checked
      }),
    };
    const listConfig = {
      url: '/api/PlanMarketboxneed/queryPlanMarketboxneedList', // 必填,请求url
      scroll: {
        x: 2000,
        y: this.state.scrollY,
      }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
      rowSelection,
    };

    return (
      <div className={styles.tableListForm}>
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
          }}
          hoverable
        >
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="超市名称">
                  {getFieldDecorator('market_name', {
                    initialValue: this.props.list.queryMap.market_name,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="超市地址">
                  {getFieldDecorator('address', {
                    initialValue: this.props.list.queryMap.address,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="车牌号">
                  {getFieldDecorator('vehicle_number', {
                    initialValue: this.props.list.queryMap.vehicle_number,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="回收仓库代码">
                  {getFieldDecorator('subware_code', {
                    initialValue: this.props.list.queryMap.subware_code,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="回收仓库代码"
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
                <FormItem label="规格">
                  {getFieldDecorator('spec', {
                    initialValue: this.props.list.queryMap.spec,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="规格"
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
                <FormItem label="数量(起始)">
                  {getFieldDecorator('start_need_count', {
                    initialValue: this.props.list.queryMap.start_need_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="数量(结束)">
                  {getFieldDecorator('end_need_count', {
                    initialValue: this.props.list.queryMap.end_need_count,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="需求时间(起始)">
                  {getFieldDecorator('start_need_time', {
                    initialValue: this.props.list.queryMap.start_need_time
                      ? moment(this.props.list.queryMap.start_need_time)
                      : null,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="需求时间(结束)">
                  {getFieldDecorator('end_need_time', {
                    initialValue: this.props.list.queryMap.end_need_time
                      ? moment(this.props.list.queryMap.start_need_time)
                      : null,
                    // getValueFromEvent : (end_need_time,dateString) =>  dateString,
                  })(<DatePicker format={DateFormat} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="是否分配">
                  {getFieldDecorator('need_status', {
                    initialValue: this.props.list.queryMap.need_status,
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="是否分配"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Array.isArray(orderstatus)
                        ? orderstatus.map(item => (
                            <Option key={item.dic_code} value={item.dic_code}>
                              {`${item.dic_name}(${item.dic_code})`}
                            </Option>
                          ))
                        : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Button icon="search" type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    icon="sync"
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.handleFormReset}
                  >
                    重置
                  </Button>
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.showModal()}
                    >
                      新建
                    </Button>
                  </Operate>
                  <Operate operateName="UPDATE">
                    <Button
                      style={{ marginLeft: 8 }}
                      type="primary"
                      icon="swap"
                      ghost
                      onClick={() => this.showModals()}
                    >
                      分配
                    </Button>
                  </Operate>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <Modal
          destroyOnClose
          title="新建农户需求订单"
          visible={this.state.visible}
          onCancel={() => this.closeModal()}
          okText="保存"
          footer={null}
        >
          <Info setList={this.props.list.setList} closeModal={this.closeModal} />
        </Modal>
        <Modal
          destroyOnClose
          title="新建农户需求订单"
          visible={this.state.visibleb}
          onCancel={() => this.closeModalb()}
          okText="保存"
          footer={null}
        >
          <Distribution
            info={this.state.info}
            selectedRowKeys={selectedRowKeys}
            setList={this.props.list.setList}
            closeModal={this.closeModalb}
          />
        </Modal>
        <List {...listConfig} />
      </div>
    );
  }
}
