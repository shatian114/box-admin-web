const commonroute = (app, dynamicWrapper) => ({
  '/setting/dicManager': {
    component: dynamicWrapper(app, [], () => import('../routes/DicManager')),
  },
  '/setting/dicManager/list': {
    component: dynamicWrapper(app, [], () => import('../routes/DicManager/List')),
  },
  '/setting/dicManager/info': {
    component: dynamicWrapper(app, [], () => import('../routes/DicManager/Info')),
  },
  '/sqldebug': {
    component: dynamicWrapper(app, [], () => import('../routes/SqlDebug')),
  },
  '/sysFnc/oprLog': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog')),
  },
  '/sysFnc/oprLog/list': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog/List')),
  },
  '/sysFnc/oprLog/info': {
    component: dynamicWrapper(app, [], () => import('../routes/OprLog/Info')),
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
  '/changePassword': {
    component: dynamicWrapper(app, [], () => import('../routes/User/ChangePassword')),
  },
  '/userInfo': {
    component: dynamicWrapper(app, [], () => import('../routes/User/UserInfo')),
  },
  '/user': {
    component: dynamicWrapper(app, [], () => import('../routes/User/List')),
  },
  '/usertype': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/UserType')),
  },
  '/usertype/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/UserType/List')),
  },
  '/usertype/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/UserType/Info')),
  },
  '/T1wuyeyezhu': {
    component: dynamicWrapper(app, [], () => import('../routes/T1wuyeyezhu')),
  },
  '/T1wuyeyezhu/list': {
    component: dynamicWrapper(app, [], () => import('../routes/T1wuyeyezhu/List')),
  },
  '/T1wuyeyezhu/info': {
    component: dynamicWrapper(app, [], () => import('../routes/T1wuyeyezhu/Info')),
  },
  '/TArroundshopandservice': {
    component: dynamicWrapper(app, [], () => import('../routes/TArroundshopandservice')),
  },
  '/TArroundshopandservice/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TArroundshopandservice/List')),
  },
  '/TArroundshopandservice/info': {
    component: dynamicWrapper(app, [], () => import('../routes/TArroundshopandservice/Info')),
  },
  '/TProduct': {
    component: dynamicWrapper(app, [], () => import('../routes/TProduct')),
  },
  '/TProduct/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TProduct/List')),
  },
  '/TProduct/info': {
    component: dynamicWrapper(app, [], () => import('../routes/TProduct/Info')),
  },
  '/TProducttype': {
    component: dynamicWrapper(app, [], () => import('../routes/TProducttype')),
  },
  '/TProducttype/list': {
    component: dynamicWrapper(app, [], () => import('../routes/TProducttype/List')),
  },
  '/TProducttype/info': {
    component: dynamicWrapper(app, [], () => import('../routes/TProducttype/Info')),
  },
});

export default commonroute;
