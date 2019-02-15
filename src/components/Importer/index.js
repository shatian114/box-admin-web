/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-17 23:03:53
 * @Description: 字典详情
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Upload, Icon, Modal, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';
import db from '../../utils/db';
import { getToken } from '../../utils/authority';
import { METHODS } from 'http';
import { cancel } from 'redux-saga/effects';
import { webConfig } from '../../utils/Constant';
import styles from './index.less';
@connect(({ base }) => ({
  base,
}))
export default class Importer extends Component {
  state = {
    uploadState: 'none',
    uid: '',
    list: [],
  };
  render() {
    return (
      <Fragment>
        <Upload
          action={'/' + webConfig.webPreName + "/api/storage/f"}
          name={this.props.uploadName}
          showUploadList={false}
          beforeUpload={() => {
            this.setState({
              uploadState: 'importing',
            });
          }}
          headers={getToken() ? { token: getToken() } : {}}
          disabled={this.state.uploadState !== 'none'}
          onChange={({ file, fileList, event }) => {
            if (file.status === 'done' && file.response && file.response.code === '0') {
              for (let key in file.response.data) {
                if (file.response.data[key]) {
                  this.setState(
                    {
                      uid: file.response.data[key],
                    },
                    () => {
                      const { dispatch } = this.props;
                      dispatch({
                        type: `base/importExcel`,
                        uid: this.state.uid,
                        callback: () => {
                          this.setState(
                            {
                              list: this.props.base.resList || [],
                              uploadState: 'uploaded',
                            },
                            () => {
                              this.props.reload();
                            }
                          );
                        },
                        url: this.props.uploadUrl,
                      });
                    }
                  );
                }
              }
            }
          }}
        >
          <Button style={this.props.style}>
            <Icon type={this.state.uploadState === 'importing' ? 'loading' : 'upload'} />
            {this.state.uploadState === 'importing' ? '导入中' : '导入'}
          </Button>
        </Upload>
        <Modal
          visible={this.state.uploadState === 'uploaded'}
          onCancel={() => {
            this.setState({
              uploadState: 'none',
            });
          }}
          footer={null}
        >
          {(this.state.list && this.state.list.length) || this.props.base.importMsg ? (
            this.props.base.importMsg ? (
              <div>
                <Icon type="close" style={{ color: 'red' }} />
                {this.props.base.importMsg}
              </div>
            ) : (
              <div className={styles.content}>
                <Row className={`${styles.header} ${styles.row}`}>
                  <Col sm={8} md={8}>
                    农户姓名
                  </Col>
                  <Col sm={8} md={8}>
                    农户账户
                  </Col>
                  <Col sm={8} md={8}>
                    导入结果
                  </Col>
                </Row>
                {this.state.list.map(function(item) {
                  return (
                    <Row className={styles.row}>
                      <Col sm={8} md={8}>
                        {item.realname}
                      </Col>
                      <Col sm={8} md={8}>
                        {item.userAccount}
                      </Col>
                      <Col sm={8} md={8}>
                        {item.importMsg ? (
                          <span style={{ color: '#f00' }}>{item.importMsg}</span>
                        ) : (
                          <span style={{ color: 'green' }}>导入成功</span>
                        )}
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )
          ) : (
            <div>
              <Icon type="check" style={{ color: 'green' }} />导入成功
            </div>
          )}
        </Modal>
      </Fragment>
    );
  }
}
