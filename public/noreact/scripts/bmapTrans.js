var ICONS = {
  farmer: new BMap.Icon('/images/map/farmer.png', new BMap.Size(32, 32)),
  market: new BMap.Icon('/images/map/market.png', new BMap.Size(32, 32)),
  subware: new BMap.Icon('/images/map/warehouse.png', new BMap.Size(32, 32)),
  car: new BMap.Icon('/images/map/car.png', new BMap.Size(32, 32), {imageOffset: new BMap.Size(0, 0)}),
};
// var farmers_style = [
//   {
//     url: '/images/map/farmers.png',
//     size: new BMap.Size(48, 48),
//     opt_anchor: [18, 18],
//     textColor: '#ff00ff',
//     opt_textSize: 12,
//   },
// ];


var app = new Vue({
  el: '#app',
  data: {
    USERTYPE: {
      farmer: '农户',
      market: '商超',
      subware: '仓库',
    },
    USERTYPECOLOR: {
      farmer: 'green',
      market: 'red',
      subware: 'blue',
    },
    token: localStorage.getItem('token'),
    map: undefined,
    list: [],
    tranList: [],
    cp: {},
    // famerList: [],
    // markectList: [],
    // subwareList: [],
  },
  methods: {
    loadData: function (callback) {
      $.ajax({
        url: '/api/query/map/prodist',
        method: 'POST',
        dataType: 'json',
        data: {},
        headers: {
          token: this.token,
        },
        context: this,
        success: function (res) {
          if (res && res.code === '0') {
            this.list = res.data;
            if (callback) {
              this.$nextTick(function () {
                callback();
              });
            }
          }
        },
      });
    },
    loadTransData: function (callback) {
      $.ajax({
        url: '/api/query/map/getTrans',
        method: 'POST',
        dataType: 'json',
        data: {},
        headers: {
          token: this.token,
        },
        context: this,
        success: function (res) {
          if (res && res.code === '0') {
            this.tranList = res.data;
            if (callback) {
              this.$nextTick(function () {
                callback();
              });
            }
          }
        },
      });
    },
    refreshMap: function () {

      if (this.list && this.list.length) {
        var _this = this;
        // var markers = [];
        for (var item of this.list) {
          if (item.longitude && item.latitude) {
            var pt = new BMap.Point(item.longitude, item.latitude);
            var mark = new BMap.Marker(pt, {icon: ICONS[item.usertype], data: item});


            mark.data = item;
            mark.context = this;
            if (item.box_count && Number(item.box_count) !== 0) {
              var laber = new BMap.Label(item.box_count + "个载具");
              laber.setStyles({color: 'red', fontSize: "12px", marginTop: '-20px', border: "none"});
              mark.setLabel(laber);
              var circle = new BMap.Circle(pt, (item.box_count || 0).toString().length * 100, {
                fillColor: "#aadaff",
                strokeWeight: 1,
                fillOpacity: 0.3,
                strokeOpacity: 0.3
              });

              this.map.addOverlay(circle);
            }
            mark.addEventListener('click', function (e) {
              var m = e.target;
              if (m && m.context && m.data) {
                m.context.showInfo(m);
              }
            });
            // markers.push(mark);
            this.map.addOverlay(mark);
          }
        }
        // console.log(markers);
        // var markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: markers });
        // markerClusterer.setStyles(farmers_style);
      }

    },
    showtransMap: function (item) {
      var _this = this;
      if (item.fromla && item.fromlo && item.latitude && item.longitude) {
        var start = new BMap.Point(item.fromlo, item.fromla);
        var end = new BMap.Point(item.longitude, item.latitude);
        //var driving2 = new BMap.DrivingRoute(this.map, {renderOptions: {map: this.map, autoViewport: true}});
        // driving2.search(start, end);    //显示一条公交线路
        var driving = new BMap.DrivingRoute(this.map);    //驾车实例


        driving.search(start, end);
        driving.setSearchCompleteCallback(function () {
          var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
          var paths = pts.length;    //获得有几个点
          var carMk = new BMap.Marker(pts[0], {icon: ICONS.car});
          carMk.data = item;
          var laber = new BMap.Label((item.fcount || 0) + "个载具");
          laber.setStyles({color: '#1890ff', fontSize: "12px", marginTop: '-20px', border: "none"});
          carMk.setLabel(laber);
          carMk.context = _this;
          carMk.addEventListener('click', function (e) {
            var m = e.target;
            if (m && m.context && m.data) {
              m.context.showTranInfo(m);
            }
          });
          _this.map.addOverlay(carMk);
          i = 0;

          function resetMkPoint(i) {
            carMk.setPosition(pts[i]);
            if (i < paths) {
              setTimeout(function () {
                i++;
                resetMkPoint(i);
              }, 500);
            } else {
              i = 0;
              resetMkPoint(i);

            }
          }

          setTimeout(function () {
            resetMkPoint(5)
          }, 1500);
        })
      }
    },
    transMap: function () {

      if (this.tranList && this.tranList.length) {
        var _this = this;
        // var markers = [];
        for (var item of this.tranList) {
          this.showtransMap(item);

        }

      }
    },
    showInfo: function (m) {
      var data = m.data;
      var geoc = new BMap.Geocoder();
      geoc.getLocation(m.getPosition(), function (rs) {
        if (rs) {
          var addComp = rs.addressComponents;
          data.address = rs.address;
          // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        }
        m.context.cp = data;
        m.context.$nextTick(function () {
          m.openInfoWindow(
            new BMap.InfoWindow(document.getElementById('infocard').innerHTML, {
              width: 140,
              height: m.context.cp.usertype == 'subware' ? 80 : 120,
              // title: data.realname,
            })
          );
        });
      });
    },
    showTranInfo: function (m) {
      var data = m.data;
      var geoc = new BMap.Geocoder();
      geoc.getLocation(m.getPosition(), function (rs) {
        if (rs) {
          var addComp = rs.addressComponents;
          data.address = rs.address;
        }
        m.context.cp = data;
        m.context.$nextTick(function () {
          m.openInfoWindow(
            new BMap.InfoWindow(document.getElementById('tranInfoCard').innerHTML, {
              width: 140,
              height: 60,
            })
          );
        });
      });
    },
  },
  mounted: function () {
    this.map = new BMap.Map('bmap');
    var pt = new BMap.Point(106.630112, 26.638283);
    this.map.centerAndZoom(pt, 14);
    this.map.enableDragging();
    this.map.enableScrollWheelZoom(true);
    // this.map.addEventListener('click', function (e) {
    //   console.log(e)
    // });
    this.loadData(this.refreshMap);
    this.loadTransData(this.transMap)
  },
});
