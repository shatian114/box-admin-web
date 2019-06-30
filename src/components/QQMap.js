import React, { PureComponent } from 'react';

const maps = require('qqmap');

let map;

class QQMap extends PureComponent {

  componentDidMount = () => {

    maps.init('B74BZ-7GNLP-QKJDV-VMPPR-FHXPF-6EBYB', () => {
      map = new qq.maps.Map(document.getElementById('QQMapDiv'), {
        zoom: 16,
        center: new qq.maps.LatLng(39.90736606309809, 116.39774322509766),
        mapTypeId: qq.maps.MapTypeId.ROADMAP,
      });
      qq.maps.event.addListener(map, 'click', (pointInfo) => {
        // this.props.setLatLng(pointInfo.latLng)
        // 设置表单的经纬度值++
        if (this.props.form && this.props.latFieldName && this.props.lngFieldName) {
          const latLng = {};
          latLng[this.props.latFieldName] = String(pointInfo.latLng.lat);
          latLng[this.props.lngFieldName] = String(pointInfo.latLng.lng);
          this.props.form.setFieldsValue(latLng);
        }
      });
      // 如果指定了位置，则定位到指定的位置，否则自动根据ip定位
      if(this.props.lat) {
        map.setCenter(new qq.maps.LatLng(this.props.lat, this.props.lng));
      }else {
        const citylocation = new qq.maps.CityService({
          complete: (result) => {
            map.setCenter(result.detail.latLng);
          },
        });
        citylocation.searchLocalCity();
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (map && nextProps.lat && nextProps.lng) {
      map.setCenter(new qq.maps.LatLng(nextProps.lat, nextProps.lng));
    }

  }

  render() {
    return <div id="QQMapDiv" style={{ width: '100%', height: 400, border: '1px solid' }} />;
  }
}

export default QQMap;
