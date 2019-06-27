import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { getPiclink } from "../utils/utils";

class DelImg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
    }
  }

  componentDidMount = () => {
    this.isgetpiclink();
  }

  isgetpiclink = async () => {
    if (this.props.istagindex) {
      this.setState({
        imgUrl: await getPiclink(this.props.imgUrl),
      });
    }else{
      this.setState({
        imgUrl: this.props.imgUrl,
      });
    }
  }

  render() {
    return (
      <div style={{ position: 'relative', float: 'left' }}>
        <Icon
          onClick={this.props.goDel.bind(this, this.props.imgUrl)}
          size="small"
          type="delete"
          style={{ zIndex: 100, position: 'absolute', right: '5px', top: '5px' }}
        />
        <img
          height="102px"
          width="auto"
          style={{ zIndex: 99, paddingRight: '8px' }}
          src={`${this.state.imgUrl}?${Math.random()}`}
          alt="暂无图片"
        />
      </div>
    );
  }
}

export default DelImg;
