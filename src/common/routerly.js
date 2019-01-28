const lyRouterConfig = (app, dynamicWrapper) => ({
  '/codetype': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeType')),
  },
  '/codetype/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeType/List')),
  },
  '/codetype/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeType/Info')),
  },
  '/coderule': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeRule')),
  },
  '/coderule/list': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeRule/List')),
  },
  '/coderule/info': {
    component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/CodeRule/Info')),
  },
});

export default lyRouterConfig;
