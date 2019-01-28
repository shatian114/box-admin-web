const cwRouterConfig = (app, dynamicWrapper) => ({
  '/modellist': {
    component: dynamicWrapper(app, [], () => import('../routes/SysBility')),
  },
  '/codeprint': {
    component: dynamicWrapper(app, ['codeprint'], () => import('../routes/Codeprint')),
  },
  '/codeprint/list': {
    component: dynamicWrapper(app, [], () => import('../routes/Codeprint/List')),
  },
  '/codeprint/info': {
    component: dynamicWrapper(app, [], () => import('../routes/Codeprint/Info')),
  },
  '/wmspack': {
    component: dynamicWrapper(app, ['wmspack'], () => import('../routes/WmsPack')),
  },
  '/wmspack/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPack/List')),
  },
  '/wmspack/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsPack/Info')),
  },
  '/wmsrecoverinorder': {
    component: dynamicWrapper(app, ['wmsrecoverinorder'], () =>
      import('../routes/WmsRecoverinorder')
    ),
  },
  '/wmsrecoverinorder/list': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsRecoverinorder/List')),
  },
  '/wmsrecoverinorder/info': {
    component: dynamicWrapper(app, [], () => import('../routes/WmsRecoverinorder/Info')),
  },
  '/bmap': {
    component: dynamicWrapper(app, [], () => import('../routes/bmap/Demo')),
  },
  '/sqldebug': {
    component: dynamicWrapper(app, [], () => import('../routes/SqlDebug')),
  },
  '/actdist': {
    component: dynamicWrapper(app, [], () => import('../routes/bmap/ActDist')),
  },
});

export default cwRouterConfig;
