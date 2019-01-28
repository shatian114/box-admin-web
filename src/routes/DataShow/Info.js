/*
 * @Author: lbb 
 * @Date: 2018-05-21 18:56:24 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-21 23:04:56
 * @Description: 系统用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Modal, Card } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import styles from '../DataShow/Info.less';

import List from '../../components/List';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;
const url = 'dataShow';
@Form.create()
@List.create()
export default class TuserList extends Component {
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
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { imgUrl } = this.props.location.params.args;
    const urlImg = this.props.location.params.args.img;
    return (
      <div>
        <img src={urlImg} className={styles.Imge} />
      </div>
    );
  }
}
