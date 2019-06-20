import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getVerificationCode, logout } from '../services/api';
import { setAuthority, setToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import db from '../utils/db';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    uid: undefined,
    msg: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response) {
        if (response.code === '204') {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              currentAuthority: 'login',
              status: 'ok',
              msg: response.msg,
              type: 'account',
              token: response.token,
            },
          });
          // Login successfully
          reloadAuthorized();
          db.set('currentUser', response.data);
          if (response.data.extendInfo && response.data.extendInfo.subwareCode) {
            db.set('subwareCode', response.data.extendInfo.subwareCode);
          }
          yield put(routerRedux.push('/'));
          // store.dispatch({ type: 'user/saveCurrentUser', payload: response });
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: 'error',
              msg: response.code === '-1' ? '系统繁忙' : response.msg,
              type: 'account',
              currentAuthority: 'guest',
              token: null,
            },
          });
          yield put({
            type: 'getCode',
          });
          reloadAuthorized();
        }
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            msg: '系统繁忙',
            type: 'account',
            currentAuthority: 'guest',
            token: null,
          },
        });
      }
    },
    *logout(_, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        yield call(logout);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        db.set('currentUser', undefined);
        yield put({
          type: 'user/saveCurrentUser',
          payload: {},
        });
        reloadAuthorized();
        yield put(routerRedux.push('/currentUser/login'));
      }
    },

    *getCode(_, { call, put }) {
      // const uid = yield call(getVerificationCode);
      // yield put({
      //   type: 'save',
      //   payload: {
      //     uid: uid ? uid.data : null,
      //   },
      // });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setToken(payload.token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        msg: payload.msg,
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
