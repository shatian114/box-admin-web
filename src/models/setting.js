import { Message } from 'antd';
import { getMenuData, getOprs } from '../services/api';
import { setMenuData } from '../common/menu';
import finish from '../utils/finishModules';
import { containsAdv } from '../utils/utils';
import db from '../utils/db';

export default {
  namespace: 'setting',

  state: {
    collapse: false,
    silderTheme: 'dark',
    themeColor: '#1890FF',
    layout: 'sidemenu',
    grid: 'Fluid',
    fixedHeader: false,
    autoHideHeader: false,
    fixSiderbar: false,
    colorWeak: 'close',
    menuData: [],
    keysMenu: {},
    oprs: null,
  },
  effects: {
    *getMenuData({ callback }, { call, put }) {
      const response = yield call(getMenuData);
      if (response) {
        // response.data[0].menus.push({args: {moduleCode: 'T1kaimentongji'}, iconOrder: '', isMenu: true, menuIcon: '', menuid: 4621, menuname: '掌上开门统计', menus: [], type: 'ZJ', url: '/T1kaimentongji'})
        let menuData = [];
        const clear = () => {
          finish.splice(0, finish.length);
        };
        clear();
        const formatMenu = (item, PID) => {
          if (item.url && item.url !== '/deving') {
            if (!containsAdv(finish, item, 'menuid')) finish.push(item);
          }
          return {
            name: item.menuname,
            icon: item.menuIcon,
            PID,
            path:
              item.url.split('/').pop() !== 'deving'
                ? item.url || `/${item.menuid}`
                : `/${item.menuid}`,
            moduleCode: item.args.moduleCode,
            args: item.args,
            menuid: item.menuid,
            children: Array.isArray(item.menus)
              ? item.menus.map(item2 => formatMenu(item2, item.menuid))
              : [],
          };
        };
        let keysMenu = {};
        const formatKeysMenu = item => {
          keysMenu = {
            ...keysMenu,
            [item.path]: {
              moduleCode: item.moduleCode,
              PID: item.PID,
              menuid: item.menuid,
            },
          };
          if (Array.isArray(item.children) && item.children.length > 0) {
            item.children.forEach(formatKeysMenu);
          }
        };

        // key : menuid; value : pid
        let kv = {};
        const menuidToPid = item => {
          kv = {
            ...kv,
            [item.menuid]: item.PID,
          };
          if (Array.isArray(item.children) && item.children.length > 0) {
            item.children.forEach(menuidToPid);
          }
        };

        if (Array.isArray(response.data)) {
          menuData = response.data.map(item => formatMenu(item));
          menuData.forEach(formatKeysMenu);
          menuData.forEach(menuidToPid);
          db.menusFlat = keysMenu;
          db.kv = kv;
        }

        setMenuData(menuData);
        yield put({
          type: 'save',
          payload: {
            menuData,
            keysMenu,
          },
        });
        if (callback) callback();
      } else {
        Message.error('加载菜单失败，请刷新界面');
      }
    },
    *getOprs({ payload }, { call, put }) {
      const response = yield call(getOprs, {
        moduleCode: payload.moduleCode,
      });
      yield put({
        type: 'save',
        payload: {
          oprs: response.data,
        },
      });
    },
  },

  reducers: {
    changeSetting(state, { payload }) {
      const urlParams = new URL(window.location.href);
      let urlParamsString = '';
      Object.keys(payload).forEach(key => {
        if (payload[key] && state[key] !== undefined && key !== 'collapse') {
          urlParamsString += `${key}:${payload[key]};`;
        }
      });
      urlParams.searchParams.set('setting', urlParamsString);
      window.history.replaceState(null, 'setting', urlParams.href);
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

