import React, { PureComponent } from 'react';
export default class BMap extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <div style={{ border: 0, width: '100%', height: '100%' }}>
        <iframe src="/commonweb/noreact/sqldebug.html" style={{ border: 0, width: '100%', height: '100%' }} />
      </div>
    );
  }
}
