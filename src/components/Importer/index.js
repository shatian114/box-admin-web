/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:55:55 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-17 23:03:53
 * @Description: 字典详情
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Spin, Upload, Icon, Modal, Row, Col, Table } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../../index';
import db from '../../utils/db';
import { getToken } from '../../utils/authority';
import { METHODS } from 'http';
import { cancel } from 'redux-saga/effects';
import { webConfig } from '../../utils/Constant';
import styles from './index.less';
let importResTitleArr = [];
let colNum = 0;
@connect(({ base }) => ({
  base,
}))

export default class Importer extends Component {
  state = {
    uploadState: 'none',
    uid: '',
    list: [],
    importColumns: [],
  };

  componentDidMount = () => {
    let importColumns = [
      {title: '导入状态', dataIndex: 'importMsg', width: 150, render: (text, record) => {
        if(text == '导入成功'){
          return <span>{text}</span>
        }else{
          return <span style={{color: 'red'}}>{text}</span>
        }
      }},
      {title: 'id', dataIndex: this.props.rowId, width: 150}
    ]
    this.setState({
      importColumns: importColumns
    });
  }

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
          <Button style={{
            			  marginLeft: 8,
            			  color: '#fff',
            			  backgroundColor: '#e5b16c',
            			  borderColor: '#eea236',
									}}>
            <Icon type={this.state.uploadState === 'importing' ? 'loading' : 'upload'} />
            {this.state.uploadState === 'importing' ? '导入中' : '导入'}
          </Button>
        </Upload>
        <Modal
					width="80%"
          visible={this.state.uploadState === 'uploaded'}
          onCancel={() => {
            this.setState({
              uploadState: 'none',
            });
          }}
          footer={null}
        >
          <Table columns={this.state.importColumns} dataSource={this.state.list} />
          {/*(this.state.list && this.state.list.length) || this.props.base.importMsg ? (
            this.props.base.importMsg ? (
              <div>
                <Icon type="close" style={{ color: 'red' }} />
                {this.props.base.importMsg}
              </div>
            ) : (
              <div className={styles.content}>
                <Row className={`${styles.header} ${styles.row}`}>
									{
										importResTitleArr.map(v => {
											return (
												<Col key={v} sm={colNum} md={colNum}>
                	    		{v}
                	  		</Col>
											)
										})
									}
                </Row>
                {this.state.list.map(function(item) {
                  return (
                    <Row className={styles.row}>
											{
												Object.keys(item).map(k => {
													
													return (
														k === 'importMsg' ? (
															<Col key={k} sm={colNum} md={colNum}>
																<span style={{ color: '#f00' }}>{item[k]}</span>
															</Col>
														) : (
															<Col key={k} sm={colNum} md={colNum}>
																{item[k]}
															</Col>
														)
													)
												})
											}
											{
												item.importMsg ? '' : (
													<Col sm={colNum} md={colNum}>
                        		<span style={{ color: 'green' }}>导入成功</span>
													</Col>
												)
											}
                    </Row>
                  );
                })}
              </div>
            )
          ) : (
            <div>
              <Icon type="check" style={{ color: 'green' }} />导入成功
            </div>
          )*/}
        </Modal>
      </Fragment>
    );
  }
}
