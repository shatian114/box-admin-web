import React, { PureComponent } from 'react';

let map;

class AMap extends PureComponent {

  componentDidMount = () => {
    window.onload = () => {
      console.log(window.AMap);
    }
    console.log(window.AMap);
    const jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = `https://webapi.amap.com/maps?v=1.4.14&key=40f1ab46f14179ab29cead8c53a7d3e5&t=${Math.random()}`;
    document.head.appendChild(jsapi);
    // map = new window.AMap.Map('aMapDiv', {
    //   center: [116.397471, 39.908459],
    // });
    // map.on('click', (e) => {
    //   const { setMap } = this.props;
    //   if(setMap) {
    //     setMap(e.lnglat.lng, e.lnglat.lat);
    //   }
      
    // })
  }

  componentWillReceiveProps = (param) => {
    if(param.lng) {
      console.log(param);
      // map.setCenter([param.lng, param.lat]);
    }
  }

  render() {
    return <div id="aMapDiv" style={{ width: '100%', height: 400, border: '1px solid' }} />;
  }
}

export default AMap;
