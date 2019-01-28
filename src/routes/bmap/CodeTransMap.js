import React, { PureComponent } from 'react';

export default class CodeTransMap extends PureComponent {
  render() {
    return (
      <div style={{ border: 0, width: '100%', height: '100%' }}>
        <iframe
          title="bmapTrans"
          src="/noreact/bmapTrans.html"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </div>
    );
  }
}
