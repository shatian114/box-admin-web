import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import zwdRouterConfig from './routerzwd';
import lbbRouterConfig from './routerlbb';
import cwRouterConfig from './routercw';
import lyRouterConfig from './routerly';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'setting', 'list', 'base', 'listb'], () =>
        import('../layouts/LoadingPage')
      ),
    },
    '/warHouseSettting/wareHouse': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouse')),
    },
    '/warHouseSettting/wareHouse/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouse/List')),
    },
    '/warHouseSettting/wareHouse/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouse/Info')),
    },
    // '/userManager': {
    //   component: dynamicWrapper(app, ['userManager'], () => import('../routes/UserManager')),
    // },
    // '/userManager/list': {
    //   component: dynamicWrapper(app, [], () => import('../routes/UserManager/UserList')),
    // },
    // '/userManager/info': {
    //   component: dynamicWrapper(app, [], () => import('../routes/UserManager/UserInfo')),
    // },
    '/setting/dicManager': {
      component: dynamicWrapper(app, [], () => import('../routes/DicManager')),
    },
    '/setting/dicManager/list': {
      component: dynamicWrapper(app, [], () => import('../routes/DicManager/List')),
    },
    '/setting/dicManager/info': {
      component: dynamicWrapper(app, [], () => import('../routes/DicManager/Info')),
    },

    '/warHouseSettting/wareHouseType': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouseType')),
    },
    '/warHouseSettting/wareHouseType/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouseType/List')),
    },
    '/warHouseSettting/wareHouseType/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/WareHouseType/Info')),
    },
    '/basicInfo/location': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Location')),
    },
    '/basicInfo/location/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Location/List')),
    },
    '/basicInfo/location/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Location/Info')),
    },
    '/warHouseSettting/subWareHouse': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/SubWareHouse')),
    },
    '/warHouseSettting/subWareHouse/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/SubWareHouse/List')),
    },
    '/warHouseSettting/subWareHouse/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/SubWareHouse/Info')),
    },
    '/boxManager/spec': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Spec')),
    },
    '/boxManager/spec/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Spec/List')),
    },
    '/boxManager/spec/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Spec/Info')),
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
    '/locationType': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/LocationType')),
    },
    '/locationType/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/LocationType/List')),
    },
    '/locationType/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/LocationType/Info')),
    },
    '/boxManager/color': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Color')),
    },
    '/boxManager/color/list': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Color/List')),
    },
    '/boxManager/color/info': {
      component: dynamicWrapper(app, [], () => import('../routes/BaseInfo/Color/Info')),
    },

    '/boxManager/supply': {
      component: dynamicWrapper(app, [], () => import('../routes/Supply')),
    },
    '/boxManager/supply/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Supply/List')),
    },
    '/boxManager/supply/info': {
      component: dynamicWrapper(app, ['supply'], () => import('../routes/Supply/Info')),
    },

    '/user': {
      component: dynamicWrapper(app, [], () => import('../routes/User/List')),
    },
    // '/upload/formUpload/': {
    //   component: dynamicWrapper(app, ['upload'], () => import('../routes/Upload/FormUpload')),
    // },
    // '/upload/formUpload/result': {
    //   component: dynamicWrapper(app, ['upload'], () => import('../routes/Upload/Result')),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    '/changePassword': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ChangePassword')),
    },
    // '/forms': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Forms')),
    // },
    '/currentUser': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/currentUser/login': {
      component: dynamicWrapper(app, [], () => import('../routes/User/Login')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/deving': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/Deving')),
    },
    ...lyRouterConfig(app, dynamicWrapper),
    ...lbbRouterConfig(app, dynamicWrapper),
    ...cwRouterConfig(app, dynamicWrapper),
    ...zwdRouterConfig(app, dynamicWrapper),
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
