import React from 'react';
import { Modal, Button } from 'antd';
import SelectList from './SelectList';

export default class Index extends React.PureComponent {
  state = {
    visible: false,
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    /**
     * 必填
     * handelInfo
     * type
     * text
     */
    const config = {
      width: this.props.width || '90%',
      title: this.props.title,
      onCancel: this.props.onCancel || this.handleCancel,
      visible: this.state.visible,
      footer: null,
      destroyOnClose: true,
    };
    return (
      <React.Fragment>
        <Button icon="search" type="primary" onClick={this.props.showModal || this.showModal}>
          {this.props.text}
        </Button>
        <Modal {...config}>
          <SelectList
            handelInfo={record => {
              this.props.handelInfo(record);
              this.handleCancel();
            }}
            type={this.props.type}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
