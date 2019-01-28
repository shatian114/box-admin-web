import React from 'react';
import { connect } from 'dva';
import { Input, Modal } from 'antd';

import OrderCommon from '../OrderCommon';

const url = 'wmsPackSK';

@connect(({ base }) => ({ base }))
export default class SingleOrder extends React.PureComponent {
  init = (_1, _2, obj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/new',
      url,
      callback: data => {
        obj.setState({
          info: data || {},
        });
      },
    });
  };

  step1 = (value, callback, obj) => {
    const { Location } = this.props.base;
    if (Array.isArray(Location)) {
      const temp = Location.find(item => item.dic_code === value);
      if (temp) {
        obj.setState({
          info: {
            ...obj.state.info,
            location: value,
          },
        });
        obj.next();
        callback();
        return;
      }
      obj.setmsg('无该货位');
      callback();
      return;
    }
    obj.setmsg('货位查询失败,请刷新界面');
    callback();
  };
  step2 = (value, callback, obj) => {
    this.props.dispatch({
      type: 'base/queryCode',
      url: 'codeprint',
      payload: {
        code: value,
      },
      success: data => {
        obj.setState({
          current: {
            codeCount: data.codeCount,
            lotCode: value,
          },
        });
        obj.next();
        callback();
      },
      failed: msg => {
        obj.setmsg(msg);
        callback();
      },
    });
    // obj.next();
    // callback();
  };
  step3 = (value, callback, obj) => {
    if (obj.state.currentList.length >= obj.state.current.codeCount) {
      obj.setmsg(
        <React.Fragment>
          <div style={{ fontSize: '60px' }}>请确认当前批次: ok保存,或执行其他命令</div>
          <div style={{ fontSize: '60px', color: '#000' }}>
            当前批目标数量: {obj.state.current.codeCount}
          </div>
          <div style={{ fontSize: '60px', color: '#000' }}>
            当前批次数量: {obj.state.currentList.length}
          </div>
        </React.Fragment>
      );
      callback();
      return;
    }
    this.props.dispatch({
      type: 'base/getobjbyCode',
      payload: {
        codeCode: value,
      },

      success: data => {
        obj.push(
          {
            ...data,
            lotCount: 1,
            lotCode: obj.state.current.lotCode,
            codeCode: value,
          },
          state => {
            if (state.currentList.length >= state.current.codeCount) {
              obj.setmsg(
                <React.Fragment>
                  <div style={{ fontSize: '60px' }}>请确认当前批次: ok保存,cancel取消</div>
                  <div style={{ fontSize: '60px', color: '#000' }}>
                    当前批目标数量: {state.current.codeCount}
                  </div>
                  <div style={{ fontSize: '60px', color: '#000' }}>
                    当前批次数量: {state.currentList.length}
                  </div>
                </React.Fragment>
              );
            }
          }
        );
        callback();
      },
      error: msg => {
        obj.setmsg(msg);
        callback();
      },
    });
    obj.next();
    callback();
  };

  handleOk = obj => {
    // 参数代表回到i - 1 步
    const { dispatch } = this.props;
    dispatch({
      type: 'base/fetchAdd',
      payload: {
        ...this.props.base.newInfo,
        ...obj.state.info,
        lotCode: obj.state.current.lotCode,
        codes: obj.state.currentList.map(item => item.codeCode).join(','),
        location: obj.state.info.location,
      },
      success: () => {
        obj.commit(1);
        dispatch({
          type: 'base/new',
          url,
          callback: data => {
            obj.setState({
              info: {
                ...data,
                location: obj.state.info.location,
              },
            });
          },
        });
      },
      error: msg => obj.setmsg(msg),
      url,
    });
  };

  render() {
    const { base: { SubwareList, Location, spec, color } } = this.props;
    const column = [
      {
        dataKey: 'lotCode',
        label: '批次编号',
        width: 100,
      },
      {
        dataKey: 'codeCode',
        label: '条码编号',
        width: 100,
      },
      {
        dataKey: 'lotCount',
        label: '载具数量',
        width: 60,
      },
      {
        dataKey: 'spec',
        label: '载具规格',
        width: 100,
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(spec)) {
            const temp = spec.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
        },
      },
      {
        dataKey: 'color',
        label: '载具颜色',
        width: 100,
        cellRenderer: ({ cellData }) => {
          if (Array.isArray(color)) {
            const temp = color.find(item => item.dic_code === cellData);
            if (temp) return `${temp.dic_name}(${cellData})`;
            return cellData;
          }
        },
      },
    ];
    const currentArea = [
      { label: '当前批号', dataKey: 'lotCode' },
      { label: '当前批目标数量', dataKey: 'codeCount' },
      {
        label: '当前批次数量',
        dataKey: 'currentCount',
        render: (text, state) => (
          <span style={{ fontSize: 100, lineHeight: 0 }}>{state.currentList.length}</span>
        ),
      },
    ];
    const totalArea = [
      { label: '备料编号', dataKey: 'lotId' },
      {
        label: '仓库',
        dataKey: 'subwareCode',
        render: text => {
          if (Array.isArray(SubwareList)) {
            const temp = SubwareList.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
      {
        label: '货位',
        dataKey: 'location',
        render: text => {
          if (Array.isArray(Location)) {
            const temp = Location.find(item => item.dic_code === text);
            if (temp) return `${temp.dic_name}(${text})`;
            return text;
          }
        },
      },
    ];

    const fucStep = [
      {
        message: '请扫描货位',
        function: this.step1,
      },
      {
        message: '请采集批号（托盘号）',
        function: this.step2,
      },
      {
        message: '请采集托盘上每一个载具的条码',
        function: this.step3,
      },
    ];

    return (
      <OrderCommon
        fucStep={fucStep}
        extraTip={
          <React.Fragment>
            <p>当载具采集到目标数量时，会提示您确认</p>
            <p>确认后，会重复第二步采集批号</p>
            <p>当你采集完所有托盘后，请扫描OK，保存整个备料单</p>
          </React.Fragment>
        }
        init={this.init}
        onOk={this.handleOk}
        currentArea={currentArea}
        totalArea={totalArea}
        title="备料记录"
        column={column}
      />
    );
  }
}
