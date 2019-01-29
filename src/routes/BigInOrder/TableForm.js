import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import List from '../../components/Listb';
import Operate from '../../components/Oprs';
import styles from '../../styles/list.less';

const FormItem = Form.Item;
// 临时表url
const url = 'tmporder2code';

@connect(({ base }) => ({
  base,
}))
@Form.create()
@List.create()
export default class TableForm extends PureComponent {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 创建临时表对象
    dispatch({
      type: 'base/newOther',
      url,
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
    const { form, listb } = this.props;
    const { setList } = listb;
    form.validateFieldsAndScroll((err, values) => {
      setList({
        current: 1,
        queryMap: { ...values, order_code: this.props.orderCode || 'nth' },
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

  handleFormReset = () => {
    const { form, listb } = this.props;
    const { setList } = listb;
    setList({
      current: 1,
      queryMap: {
        order_code: this.props.orderCode || 'nth',
      },
    });
    form.resetFields();
  };

  render() {
    const { form, orderStatus } = this.props;
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
        width: 80,
        align: 'center',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            {orderStatus === 'new' ? (
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
            ) : null}
          </Row>
        ),
      },
      {
        title: '单据类型',
        dataIndex: 'order_type',
        width: 110,
        align: 'center',
      },
      {
        title: '批次编码',
        dataIndex: 'lot_code',
        width: 160,
        align: 'center',
      },
      {
        title: '条码编号',
        dataIndex: 'code_code',
        width: 200,
        align: 'center',
      },
      {
        title: '条码类型',
        dataIndex: 'code_type',
        align: 'center',
        width: 110,
      },
      {
        title: '数量',
        dataIndex: 'code_count',
        width: 60,
        align: 'center',
        render: () => {
          return '1';
        },
      },
      {
        title: '载具颜色',
        dataIndex: 'color',
        align: 'center',
        width: 80,
      },
      {
        title: '载具规格',
        dataIndex: 'spec',
        width: 130,
        render: cellData => {
          if (Array.isArray(this.props.format.spec)) {
            const temp = this.props.format.spec.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
          return cellData;
        },
      },
      {
        title: '供应商',
        dataIndex: 'supply_code',
        render: cellData => {
          if (Array.isArray(this.props.format.supplylist)) {
            const temp = this.props.format.supplylist.find(item => item.supply_code === cellData);
            if (temp) return `${temp.supply_name}(${cellData})`;
            return cellData;
          }
          return cellData;
        },
      },
    ];

    const listConfig =
      orderStatus === 'new'
        ? {
            url: '/api/query/queryWmsTmpOrder2codeList', // 必填,请求url
            scroll: { x: 1100, y: this.state.scrollY }, // 可选配置,同antd table
            rowKey: 'record_id', // 必填,行key
            columns, // 必填,行配置
            queryMap: { order_code: this.props.orderCode || 'nth' },
          }
        : {
            url: '/api/query/queryWmsCoderecordList', // 必填,请求url
            scroll: { x: 1100, y: this.state.scrollY }, // 可选配置,同antd table
            rowKey: 'record_id', // 必填,行key
            columns, // 必填,行配置
            queryMap: { order_code: this.props.orderCode || 'nth' },
          };

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="条码编号">
                {getFieldDecorator('code_code', {
                  initialValue: this.props.listb.queryMap.code_code,
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
              </span>
            </Col>
          </Row>
        </Form>
        <List {...listConfig} />
      </div>
    );
  }
}
