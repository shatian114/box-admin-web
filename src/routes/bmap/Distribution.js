import React, { PureComponent } from 'react';

export default class Distribution extends PureComponent {
  render() {
    return (
      <div style={{ border: 0, width: '100%', height: '100%' }}>
        <iframe
          title="Distribution"
          src="/noreact/bmapDistribution.html"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </div>
    );
  }
}
