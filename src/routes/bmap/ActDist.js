import React, { PureComponent } from 'react';

export default class ActDist extends PureComponent {
  render() {
    return (
      <div style={{ border: 0, width: '100%', height: '100%' }}>
        <iframe
          title="map"
          src="/noreact/bmap.html"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </div>
    );
  }
}
