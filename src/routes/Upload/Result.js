import React from 'react';
import { Button, Card, Upload, Modal, Row } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import Result from 'components/Result';
import styles from './style.less';

@connect(({ upload }) => ({
  upload,
}))
export default class RoomResult extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  render() {
    const { previewVisible, previewImage } = this.state;
    const { dispatch, upload } = this.props;
    const { status, msg, files } = upload;

    const onFinish = () => {
      dispatch(routerRedux.push('/upload/formUpload'));
    };
    // const information = <div className={styles.information} />;
    const actions = (
      <Button type="primary" onClick={onFinish}>
        继续上传
      </Button>
    );
    const uploadProps = {
      beforeUpload: () => false,
      listType: 'picture-card',
      onPreview: this.handlePreview,
      showUploadList: {
        showRemoveIcon: false,
      },
      fileList: Object.keys(files).map(item => ({
        uid: files[item],
        name: item,
        status: 'done',
        url: `/api/storage/f/${files[item]}`,
      })),
    };
    const information = (
      <Row type="flex" justify="space-around">
        <Upload {...uploadProps} />
      </Row>
    );
    return (
      <Card bordered={false}>
        <Result
          type={status}
          title={msg}
          extra={information}
          actions={actions}
          className={styles.result}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    );
  }
}
