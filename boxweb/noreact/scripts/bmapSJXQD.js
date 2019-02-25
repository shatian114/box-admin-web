var ICONS = {
  farmer: new BMap.Icon('/images/map/farmer.png', new BMap.Size(32, 32)),
  market: new BMap.Icon('/images/map/market.png', new BMap.Size(32, 32)),
  subware: new BMap.Icon('/images/map/warehouse.png', new BMap.Size(32, 32)),
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
  },
});
