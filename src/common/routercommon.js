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
});

export default commonroute;