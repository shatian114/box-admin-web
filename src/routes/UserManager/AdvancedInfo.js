/*
 * @Author: zouwendi 
 * @Date: 2018-05-15 08:44:39 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-15 14:05:10
 * @Description: 高级表单，上传身份证及图片
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Modal, Icon, Button, Form, Progress, Input, Message } from 'antd';

import { getToken } from '../../utils/authority';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 10, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ userManager, loading }) => ({
  userManager,
  submitting: loading.effects['userManager/saveDetailInfo'],
  loading: loading.effects['userManager/detailInfo'],
}))
@Form.create()
export default class AdvancedInfo extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    status: 'active',
    percent: 0,
    identityFZ: [],
    identityFF: [],
    loading: false,
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList, name }) => {
    return this.setState({
      [name]: fileList,
    });
  };

  normFile = (e, name) => {
    const myFile = new File([e.fileList[0].originFileObj], `${name}.jpg`, { type: 'image/jpeg' });
    return e.fileList.map(file => ({
      ...file,
      originFileObj: myFile,
    }));
  };

  validator = (rule, value, callback) => {
    const pat = /^image\//;
    if (Array.isArray(value) && !value.every(item => pat.test(item.originFileObj.type))) {
      callback('请上传图片格式的文件！');
    }
    callback();
  };

  removeImage = name => {
    this.props.dispatch({
      type: 'userManager/clearDetailInfo',
      payload: {
        [name]: null,
      },
    });
  };

  handleUpload = (fileList, values) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/storage/f');
    xhr.setRequestHeader('token', getToken());
    xhr.onerror = () => {
      this.setState({
        status: 'exception',
        loading: false,
      });
    };
    xhr.onload = () => {
      let status;
      let response;
      if (xhr.status === 200) {
        response = JSON.parse(xhr.response);
        if (response.code === '0') {
          status = 'success';
          const { dispatch, userManager } = this.props;
          const temp = {};
          if (response.data['identityFZ.jpg']) temp.identityFZ = response.data['identityFZ.jpg'];
          if (response.data['identityFF.jpg']) temp.identityFF = response.data['identityFF.jpg'];

          dispatch({
            type: 'userManager/saveDetailInfo',
            payload: {
              ...userManager.detailInfo,
              userId: userManager.userInfo.userId,
              identity: values.identity,
              ...temp,
            },
          });
        } else {
          status = 'exception';
        }
      } else {
        status = 'exception';
      }
      this.setState({
        status,
        loading: false,
      });
    };
    // 获取上传进度
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percent = Math.floor(event.loaded / event.total * 100);
        this.setState({
          percent,
        });
      }
    };
    this.setState({
      loading: true,
      percent: 0,
      status: 'active',
    });
    xhr.send(fileList);
  };

  handleSubmit = e => {
    const { form, userManager, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (userManager.userInfo.userId) {
          if (Array.isArray(values.identityFZ) || Array.isArray(values.identityFF)) {
            const formData = new FormData();
            if (Array.isArray(values.identityFZ))
              values.identityFZ.forEach(file => {
                formData.append(file.uid, file.originFileObj);
              });
            if (Array.isArray(values.identityFF))
              values.identityFF.forEach(file => {
                formData.append(file.uid, file.originFileObj);
              });
            this.handleUpload(formData, values);
          } else {
            dispatch({
              type: 'userManager/saveDetailInfo',
              payload: {
                ...userManager.detailInfo,
                userId: userManager.userInfo.userId,
                identity: values.identity,
              },
            });
          }
        } else {
          Message.error('请先保存基础信息');
        }
      }
    });
  };

  render() {
    const { form, submitting, userManager } = this.props;
    const { detailInfo } = userManager;
    const {
      previewVisible,
      previewImage,
      percent,
      status,
      identityFZ,
      identityFF,
      loading,
    } = this.state;
    const { getFieldDecorator } = form;

    const init = {
      identityFZ: detailInfo.identityFZ
        ? [
            {
              uid: detailInfo.identityFZ,
              name: `${detailInfo.identityFZ}.jpg`,
              status: 'done',
              url: `/api/storage/f/${detailInfo.identityFZ}`,
            },
          ]
        : [],
      identityFF: detailInfo.identityFF
        ? [
            {
              uid: detailInfo.identityFF,
              name: `${detailInfo.identityFF}.jpg`,
              status: 'done',
              url: `/api/storage/f/${detailInfo.identityFF}`,
            },
          ]
        : [],
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const uploadProps = {
      beforeUpload: () => false,
      accept: 'image/*',
      listType: 'picture-card',
      onPreview: this.handlePreview,
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} hasFeedback label="身份证号码">
          {getFieldDecorator('identity', {
            initialValue: userManager.detailInfo.identity,
            rules: [
              {
                required: true,
                message: '身份证号码必填!',
              },
              {
                len: 18,
                message: '身份证号码18位!',
              },
            ],
          })(<Input placeholder="请输入18位身份证" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上传身份证正面">
          {detailInfo.identityFZ ? (
            <Upload
              {...uploadProps}
              onRemove={() => this.removeImage('identityFZ')}
              fileList={init.identityFZ}
            >
              {null}
            </Upload>
          ) : (
            getFieldDecorator('identityFZ', {
              valuePropName: 'fileList',
              getValueFromEvent: e => this.normFile(e, 'identityFZ'),
              rules: [
                {
                  validator: this.validator,
                },
              ],
            })(
              <Upload
                onChange={({ fileList }) =>
                  this.handleChange({
                    fileList,
                    name: 'identityFZ',
                  })
                }
                {...uploadProps}
              >
                {identityFZ.length >= 1 ? null : uploadButton}
              </Upload>
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="上传身份证反面">
          {detailInfo.identityFF ? (
            <Upload
              {...uploadProps}
              onRemove={() => this.removeImage('identityFF')}
              fileList={init.identityFF}
            >
              {null}
            </Upload>
          ) : (
            getFieldDecorator('identityFF', {
              valuePropName: 'fileList',
              getValueFromEvent: e => this.normFile(e, 'identityFF'),
              rules: [
                {
                  validator: this.validator,
                },
              ],
            })(
              <Upload
                onChange={({ fileList }) =>
                  this.handleChange({
                    fileList,
                    name: 'identityFF',
                  })
                }
                {...uploadProps}
              >
                {identityFF.length >= 1 ? null : uploadButton}
              </Upload>
            )
          )}
          <Progress percent={percent} status={status} />
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Operate operateName="UPLOAD">
            <Button
              loading={loading || submitting}
              style={{ marginLeft: 12 }}
              type="primary"
              htmlType="submit"
            >
              上传
            </Button>
          </Operate>
        </FormItem>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form>
    );
  }
}
