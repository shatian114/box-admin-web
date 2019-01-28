const lbbRouterConfig = (app, dynamicWrapper) => ({
  '/farmer': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmer')),
  },
  '/farmer/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmer/List')),
  },
  '/farmer/info': {
    component: dynamicWrapper(app, ['farmer'], () => import('../routes/Farmer/Info')),
  },
  '/subware': {
    component: dynamicWrapper(app, [], () => import('../routes/Subware')),
  },
  '/subware/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Subware/List')),
  },
  '/subware/info': {
    component: dynamicWrapper(app, ['subware'], () => import('../routes/Subware/Info')),
  },
  '/market': {
    component: dynamicWrapper(app, [], () => import('../routes/Market')),
  },
  '/market/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Market/List')),
  },
  '/market/info': {
    component: dynamicWrapper(app, ['market'], () => import('../routes/Market/Info')),
  },
  '/vehicle': {
    component: dynamicWrapper(app, [], () => import('../routes/Vehicle')),
  },
  '/vehicle/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Vehicle/List')),
  },
  '/vehicle/info': {
    component: dynamicWrapper(app, ['vehicle'], () => import('../routes/Vehicle/Info')),
  },
  '/wmslot': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsLot')),
  },
  '/wmslot/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsLot/List')),
  },
  '/wmslot/info': {
    component: dynamicWrapper(app, ['wmslot'], () => import('../routes/WmsLot/Info')),
  },
  '/wmscode': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCode')),
  },
  '/wmscode/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCode/List')),
  },
  '/wmscode/info': {
    component: dynamicWrapper(app, ['wmscode'], () => import('../routes/WmsCode/Info')),
  },
  '/tuserInfo': {
    component: dynamicWrapper(app, [], () => import('../routes/TuserInfo')),
  },
  '/tuserInfo/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TuserInfo/List')),
  },
  '/tuserInfo/info': {
    component: dynamicWrapper(app, ['tuserInfo'], () => import('../routes/TuserInfo/Info')),
  },
  '/dataShow': {
    component: dynamicWrapper(app, [], () => import('../routes/DataShow/Info.js')),
  },
  '/orderCommon': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPackSK/SingleOrder')),
  },
  '/wmscoderecord': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecord')),
  },
  '/wmscoderecord/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecord/List')),
  },
  '/wmscoderecord/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecord/Info')),
  },
  '/wmscoderecordNH': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecordNH')),
  },
  '/wmscoderecordNH/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecordNH/List')),
  },
  '/wmscoderecordSC': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecordSC')),
  },
  '/wmscoderecordSC/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCoderecordSC/List')),
  },
  '/wmslostrecord': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsLostrecord')),
  },
  '/wmslostrecord/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsLostrecord/List')),
  },
  '/wmslostrecord/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsLostrecord/Info')),
  },
  '/wmsbaofeirecord': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsBaofeirecord')),
  },
  '/wmsbaofeirecord/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsBaofeirecord/List')),
  },
  '/wmsbaofeirecord/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsBaofeirecord/Info')),
  },
  // '/wmsQingxirecord': {
  //   component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecord')),
  // },
  // '/wmsQingxirecord/list': {
  //   component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecord/List')),
  // },
  // '/wmsQingxirecord/info': {
  //   component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecord/Info')),
  // },
  '/wmsQingxirecord': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecordOne')),
  },
  '/wmsQingxirecord/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecordOne/List')),
  },
  '/wmsQingxirecord/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsQingxirecordOne/Info')),
  },
  '/wmsinventoryorder': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorder')),
  },
  '/wmsinventoryorder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorder/List')),
  },
  '/wmsinventoryorder/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorder/Info')),
  },
  '/wmsinventory2order': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorderN')),
  },
  '/wmsinventory2order/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorderN/List')),
  },
  '/wmsinventory2order/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsInventoryorderN/Info')),
  },
  '/wmsfarmerget': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmerget')),
  },
  '/wmsfarmerget/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmerget/List')),
  },
  '/wmsfarmerget/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmerget/Info')),
  },
  '/wmsfarmergetnew': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmergetnew')),
  },
  '/wmsfarmergetnew/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmergetnew/List')),
  },
  '/wmsfarmergetnew/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmergetnew/Info')),
  },
  '/wmsfarmersend': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmersend')),
  },
  '/wmsfarmersend/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Farmersend/Info')),
  },
  '/wmsmarketsend': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketsend')),
  },
  '/wmsmarketsend/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketsend/List')),
  },
  '/wmsmarketsend/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketsend/Info')),
  },
  '/wmsmarketsendCX': {
    component: dynamicWrapper(app, [], () => import('../routes/MarketsendCX')),
  },
  '/wmsmarketsendCX/list': {
    component: dynamicWrapper(app, [], () => import('../routes/MarketsendCX/List')),
  },

  '/wmsmarketget': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketget')),
  },
  '/wmsmarketget/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketget/Info')),
  },
  '/wmsmarketgetCX': {
    component: dynamicWrapper(app, [], () => import('../routes/Marketget/List')),
  },
  '/wmscommonorder': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsCommonOrder/Info')),
  },
  '/PlanMarketboxneed': {
    component: dynamicWrapper(app, [], () => import('../routes/PlanMarketboxneed')),
  },
  '/PlanMarketboxneed/list': {
    component: dynamicWrapper(app, [], () => import('../routes/PlanMarketboxneed/List')),
  },
});

export default lbbRouterConfig;
