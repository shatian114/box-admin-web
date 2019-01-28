import React from 'react';
import { Input, Card, Row, Col, Popover, Button, Spin, Divider, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import styles from './Info.less';
import Table from './Table';
import { isEmpty } from '../../utils/utils';

const cnNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

@connect(({ loading }) => ({ loading: loading.global }))
export default class OrderCommon extends React.PureComponent {
  state = {
    value: null,
    visibleTooTip: false,
    oldListCount: 0,
    list: [],
    currentList: [],
    info: {},
    current: {},
    count: 0,
  };

  componentDidMount() {
    const { init } = this.props;
    if (init) init(this.props, this.state, this);
  }

  setmsg = msg => {
    this.msg = msg;
  };
  setValue = value => {
    this.setState({
      value,
    });
    this.msg = null;
  };

  deleteList = rowIndex => {
    const { currentList, list } = this.state;
    let temp = [];
    if (rowIndex < currentList.length) {
      temp = temp.concat(currentList);
      temp.splice(rowIndex, 1);
      this.setState({
        currentList: temp,
      });
      temp = null;
      return;
    }
    temp = temp.concat(list);
    temp.splice(rowIndex - currentList.length, 1);
    this.setState({
      list: temp,
    });
    temp = null;
  };

  handleVisibleChange = visibleTooTip => {
    this.setState({ visibleTooTip });
  };

  push = (obj, callback) => {
    if (obj.codeCode) {
      const temp1 = this.state.currentList.find(item => item.codeCode === obj.codeCode);
      if (!isEmpty(temp1)) {
        this.msg = `条码编号重复${obj.codeCode}`;
        return;
      }
      const temp2 = this.state.list.find(item => item.codeCode === obj.codeCode);
      if (!isEmpty(temp2)) {
        this.msg = `条码编号重复${obj.codeCode}`;
        return;
      }
    }
    this.setState(
      {
        currentList: [obj].concat(this.state.currentList),
      },
      () => {
        if (callback) callback(this.state);
      }
    );
  };

  confirm = count => {
    const list = this.state.currentList.concat(this.state.list);
    this.setState({
      list,
      currentList: [],
      current: {},
      count,
    });
  };

  commit = count => {
    const list = this.state.list.concat(this.state.currentList);
    this.setState({
      list: [],
      currentList: [],
      current: {},
      count,
      oldListCount: this.state.oldListCount + list.length,
    });
  };

  back = () => {
    if (this.state.count > 0)
      this.setState({
        count: this.state.count - 1,
      });
  };

  next = () => {
    if (this.state.count < this.props.fucStep.length - 1)
      this.setState({
        count: this.state.count + 1,
      });
  };

  stepFuc = e => {
    const { value } = e.target;
    const callback = () =>
      this.setState({
        value: null,
      });
    switch (value.toLowerCase()) {
      case 'ok':
        this.props.onOk(this);
        callback();
        return;
      // case 'back':
      //   this.back();
      //   callback();
      //   return;
      case 'cancel':
        this.setState({
          count: 0,
          current: {},
          currentList: [],
        });
        callback();
        return;
      case 'exit':
        this.props.dispatch(routerRedux.goBack());
        callback();
        return;
      case 'help':
        this.handleVisibleChange(true);
        callback();
        return;
      default:
        this.props.fucStep[this.state.count].function(value, callback, this);
    }
  };

  render() {
    const { title, currentArea, totalArea, fucStep, extraTip, loading } = this.props;
    const { info, current, count, value } = this.state;
    const { deleteList } = this;
    const deleteModal = rowIndex => {
      Modal.confirm({
        title: '是否删除该条码?',
        okType: 'waring',
        okText: '是',
        cancelText: '否',
        onOk() {
          deleteList(rowIndex);
        },
      });
    };
    const column = [
      {
        label: '操作',
        dataKey: 'operate',
        width: 60,
        cellRenderer: ({ rowIndex }) => (
          <Button
            type="danger"
            icon="delete"
            ghost
            size="small"
            onClick={() => deleteModal(rowIndex)}
          >
            删除
          </Button>
        ),
      },
    ].concat(this.props.column);
    const contentTip = (
      <div>
        {fucStep.map((item, index) => (
          <p key={`stepTip-${index}`}>
            第{cnNumber[index + 1]}步: {item.message}
          </p>
        ))}
        {extraTip}
        <Divider />
        <p style={{ color: '#f00' }}>指令不区分大小写</p>
        <p>输入回车确认</p>
        <p>输入 ok 保存整个采购单</p>
        <p>输入 cancel 取消当前批次的采集，重新提示输入批号</p>
        {/* <p>输入 back 返回上一步骤</p> */}
        <p>输入 exit 取消当前采购单操作，返回查询界面</p>
        <p>输入 help 弹出说明</p>
      </div>
    );
    const areaTo1 = isEmpty(this.msg) ? (
      currentArea.map(item => (
        <span key={`currentArea${item.dataKey}`}>
          {item.label}:
          {item.render ? item.render(current[item.dataKey], this.state) : current[item.dataKey]}
        </span>
      ))
    ) : (
      <span style={{ fontSize: 100, color: '#f00' }}>{this.msg}</span>
    );
    const areaTo2 = totalArea.map(item => (
      <div key={`area1${item.dataKey}`}>
        {item.label}:
        {item.render ? item.render(info[item.dataKey], this.state) : info[item.dataKey]}
      </div>
    ));

    return (
      <div className={styles.orderCommon}>
        <div className={styles.orderTitle}>{title}</div>
        <div className={styles.tooltip}>
          <Popover
            visible={this.state.visibleTooTip}
            onVisibleChange={this.handleVisibleChange}
            content={contentTip}
            placement="bottomRight"
            title="操作提示"
            trigger="click"
          >
            <Button shape="circle" icon="question-circle" />
          </Popover>
        </div>

        <Card className={styles.card}>
          <div className={styles.area1}>{areaTo1}</div>
          <Row className={styles.content}>
            <Col className={styles.contentLeft} lg={14}>
              <Row>
                <div className={styles.prompt}>当前步骤: {fucStep[count].message}</div>
              </Row>
              <Row>
                <Spin spinning={loading}>
                  {loading ? (
                    value
                  ) : (
                    <Input
                      size="large"
                      autoFocus
                      value={value}
                      onChange={e => this.setValue(e.target.value)}
                      className={styles.input}
                      placeholder={`${fucStep[count].message}或者输入操作指令`}
                      onPressEnter={this.stepFuc}
                    />
                  )}
                </Spin>
              </Row>
              <Row>
                <Table list={this.state.list.concat(this.state.currentList)} column={column} />
              </Row>
            </Col>
            <Col lg={10} className={styles.contentRight}>
              {areaTo2}
              <div>
                已操作总数:
                {this.state.oldListCount + this.state.list.length + this.state.currentList.length}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
