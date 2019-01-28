const zwdRouterConfig = (app, dynamicWrapper) => ({
  '/sysFnc/oprLog': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog')),
  },
  '/sysFnc/oprLog/list': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog/List')),
  },
  '/sysFnc/oprLog/info': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog/Info')),
  },
  '/inwareOrder': {
    component: dynamicWrapper(app, [], () => import('../routes/InwareOrder')),
  },
  '/inwareOrder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/InwareOrder/List')),
  },
  '/inwareOrder/info': {
    component: dynamicWrapper(app, [], () => import('../routes/InwareOrder/Info')),
  },
  '/bigInOrder': {
    component: dynamicWrapper(app, [], () => import('../routes/BigInOrder')),
  },
  '/bigInOrder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BigInOrder/List')),
  },
  '/bigInOrder/storage': {
    component: dynamicWrapper(app, [], () => import('../routes/BigInOrder/Storage')),
  },

  '/ordertype': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderType')),
  },
  '/ordertype/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderType/List')),
  },
  '/ordertype/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderType/Info')),
  },
  '/orderstatus': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderStatus')),
  },
  '/orderstatus/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderStatus/List')),
  },
  '/orderstatus/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/OrderStatus/Info')),
  },
  '/codestatus': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeStatus')),
  },
  '/codestatus/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeStatus/List')),
  },
  '/codestatus/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeStatus/Info')),
  },
  '/dbrk': {
    component: dynamicWrapper(app, [], () => import('../routes/InTransferOrder')),
  },
  '/dbrk/list': {
    component: dynamicWrapper(app, [], () => import('../routes/InTransferOrder/List')),
  },
  '/dbrk/info': {
    component: dynamicWrapper(app, [], () => import('../routes/InTransferOrder/Info')),
  },
  '/dbck': {
    component: dynamicWrapper(app, [], () => import('../routes/OutTransferOrder')),
  },
  '/dbck/list': {
    component: dynamicWrapper(app, [], () => import('../routes/OutTransferOrder/List')),
  },
  '/dbck/info': {
    component: dynamicWrapper(app, [], () => import('../routes/OutTransferOrder/Info')),
  },
  '/fhck': {
    component: dynamicWrapper(app, [], () => import('../routes/OutWareOrder')),
  },
  '/fhck/list': {
    component: dynamicWrapper(app, [], () => import('../routes/OutWareOrder/List')),
  },
  '/fhck/info': {
    component: dynamicWrapper(app, [], () => import('../routes/OutWareOrder/Info')),
  },
  '/fhck/infoC': {
    component: dynamicWrapper(app, ['outwareorder'], () =>
      import('../routes/OutWareOrder/countInfo')
    ),
  },
  '/unpack': {
    component: dynamicWrapper(app, [], () => import('../routes/Unpack')),
  },
  '/unpack/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Unpack/List')),
  },
  '/unpack/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Unpack/Info')),
  },
  '/TAccount': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount')),
  },
  '/payCharge': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount/PayCharge')),
  },
  '/payDeduction': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount/PayDeduction')),
  },
  '/nowAdd': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount/NowAdd')),
  },
  '/nowSubtract': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount/NowSubtract')),
  },
  '/TAccount/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccount/List')),
  },
  '/TAccountrecord': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccountrecord')),
  },
  '/TAccountrecord/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TAccountrecord/List')),
  },
  '/paytype': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/PayType')),
  },
  '/paytype/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/PayType/List')),
  },
  '/paytype/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/PayType/Info')),
  },
  '/distribution': {
    component: dynamicWrapper(app, [], () => import('../routes/bmap/Distribution')),
  },
  '/codeTransMap': {
    component: dynamicWrapper(app, [], () => import('../routes/bmap/CodeTransMap')),
  },
  '/codeAnalysis': {
    component: dynamicWrapper(app, ['chart'], () => import('../routes/Charts/CodeAnalysis')),
  },
  '/farmerAnalysis': {
    component: dynamicWrapper(app, ['chart'], () => import('../routes/Charts/farmerAnalysis')),
  },
  '/userInfo': {
    component: dynamicWrapper(app, [], () => import('../routes/User/UserInfo')),
  },
  '/wmsPackSK': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPackSK')),
  },
  '/wmsPackSK/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPackSK/List')),
  },
  '/wmsPackSK/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPackSK/Info')),
  },
  '/ZJLYJL': {
    component: dynamicWrapper(app, [], () => import('../routes/RecordQuery/ZJLYJL')),
  },
  '/NPZCJL': {
    component: dynamicWrapper(app, [], () => import('../routes/RecordQuery/NPZCJL')),
  },
  '/PlanFarmerboxneed': {
    component: dynamicWrapper(app, [], () => import('../routes/Plan/PlanFarmerboxneed')),
  },
  '/WmsReturninorder': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturninorder')),
  },
  '/WmsReturninorder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturninorder/List')),
  },
  '/WmsReturninorder/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturninorder/Info')),
  },
  '/WmsReturnoutorder': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturnoutorder')),
  },
  '/WmsReturnoutorder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturnoutorder/List')),
  },
  '/WmsReturnoutorder/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsReturnoutorder/Info')),
  },
  '/SysMenu': { component: dynamicWrapper(app, [], () => import('../routes/SysMenu')) },
  '/SysMenu/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysMenu/list')),
  },
  '/SysMenu/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysMenu/info')),
  },
  '/SysModule': { component: dynamicWrapper(app, [], () => import('../routes/SysModule')) },
  '/SysModule/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysModule/list')),
  },
  '/SysModule/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysModule/info')),
  },
  '/SysOp': { component: dynamicWrapper(app, [], () => import('../routes/SysOp')) },
  '/SysOp/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysOp/list')),
  },
  '/SysOp/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysOp/info')),
  },
  '/SysRole': { component: dynamicWrapper(app, [], () => import('../routes/SysRole')) },
  '/SysRole/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole/list')),
  },
  '/SysRole/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole/info')),
  },
  '/SysRole2menu': { component: dynamicWrapper(app, [], () => import('../routes/SysRole2menu')) },
  '/SysRole2menu/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole2menu/list')),
  },
  '/SysRole2menu/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole2menu/info')),
  },
  '/SysRole2module': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole2module')),
  },
  '/SysRole2module/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole2module/list')),
  },
  '/SysRole2module/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysRole2module/info')),
  },
  '/SysSubsys': { component: dynamicWrapper(app, [], () => import('../routes/SysSubsys')) },
  '/SysSubsys/list': {
    component: dynamicWrapper(app, [], () => import('../routes/SysSubsys/list')),
  },
  '/SysSubsys/info': {
    component: dynamicWrapper(app, [], () => import('../routes/SysSubsys/info')),
  },
});

export default zwdRouterConfig;
