/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 15:05:40 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-15 14:05:27
 */
import { routerRedux } from 'dva/router';
import React, { PureComponent } from 'react';
import { Upload, Icon, Form, Button, Card, Modal, Spin, Progress } from 'antd';
import { connect } from 'dva';
import { getToken } from '../../utils/authority';
import Operate from '../../components/Oprs';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['upload/save'],
}))
@Form.create()
@Operate.create('formUpload')
export default class FormUpload extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    loading: false,
    percent: 0,
    status: 'active',
  };

  UploadTest = fileList => {
    const { dispatch, form } = this.props;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/storage/f');
    xhr.setRequestHeader('token', getToken());
    xhr.onerror = () => {
      this.setState({
        loading: false,
        status: 'exception',
      });
      dispatch({
        type: 'upload/save',
        payload: {
          files: [],
          status: 'error',
          msg: '文件上传失败',
        },
      });
      dispatch(routerRedux.push('/upload/formUpload/result'));
    };
    xhr.onload = () => {
      let status;
      let msg;
      let response;
      if (xhr.status === 200) {
        response = JSON.parse(xhr.response);
        if (response.code === '0') {
          status = 'success';
          msg = '文件上传成功';
        } else {
          status = 'error';
          msg = '文件上传失败';
        }
      } else {
        status = 'error';
        msg = '文件上传失败';
      }
      this.setState({
        loading: false,
        status: status === 'success' ? 'success' : 'exception',
      });
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'upload/save',
            payload: {
              files: response ? response.data || [] : [],
              status,
              msg,
            },
          });

          dispatch(routerRedux.push('/upload/formUpload/result', { fileList: values.files }));
        }
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
    });
    xhr.send(fileList);
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = new FormData();
        values.files.forEach(file => {
          formData.append(file.uid, file.originFileObj);
        });
        this.UploadTest(formData);
      }
    });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  validator = (rule, value, callback) => {
    const pat = /^image\//;
    if (!Array.isArray(value) || value.length < 1) {
      callback('请选择想要上传图片！');
    } else if (!value.every(item => pat.test(item.originFileObj.type))) {
      callback('请上传图片格式的文件！');
    }
    callback();
  };

  render() {
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
    const { form } = this.props;
    const { previewVisible, previewImage, loading, percent, status } = this.state;
    const { getFieldDecorator } = form;
    const uploadProps = {
      beforeUpload: () => false,
      accept: 'image/*',
      listType: 'picture-card',
      onPreview: this.handlePreview,
      multiple: true,
    };

    const tip = (
      <div>
        <Progress type="circle" percent={percent} />
      </div>
    );

    return (
      <Spin spinning={loading} tip={tip} indicator={<div />} status={status}>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="上传文件">
              <div className="dropbox">
                {getFieldDecorator('files', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [
                    {
                      validator: this.validator,
                    },
                  ],
                })(
                  <Upload.Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">在这个区域点击或拖拽文件</p>
                  </Upload.Dragger>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Operate operateName="UPLOAD">
                <Button style={{ marginLeft: 12 }} type="primary" htmlType="submit">
                  上传
                </Button>
              </Operate>
            </FormItem>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Card>
      </Spin>
    );
  }
}
