import { routerRedux } from 'dva/router';
import { Message } from 'antd';
import {
  queryCurrent,
  changePassword,
  cancelobj,
  recoveryobj,
  restPassword,
  queryRoleList,
  updateSubware,
  addMoney,
  subtractMoney,
  queryCurrentInfo,
  queryScanInfo,
} from '../services/user';
import { isEmpty } from '../utils/utils';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    userInfo: {},
    userAccount: {},
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            [payload.type]: response.data,
          },
        });
      } else {
        Message.error(response.msg);
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        yield put(routerRedux.push('/currentUser/login'));
      }
    },
    *info(_, { call, put }) {
      const response = yield call(queryCurrentInfo);
      if (isEmpty(response)) {
        Message.error('系统繁忙');
        return;
      }
      if (response && response.data) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data.userInfo || {},
            userAccount: response.data.account || {},
          },
        });
      } else {
        Message.error(response.msg);
      }
    },
    *changePassword({ payload, callback }, { call }) {
      const response = yield call(changePassword, payload);
      if (response) {
        if (response.code === '200') {
          Message.success(response.msg);
          if (callback) callback();
        } else {
          Message.error(response.msg);
        }
      }
    },
    *cancelobj({ payload, callback }, { call }) {
      const response = yield call(cancelobj, payload);
      if (response) {
        if (response.code === '200') {
          Message.success(response.msg);
          if (callback) callback();
        } else {
          Message.error(response.msg);
        }
      }
    },
    *recoveryobj({ payload, callback }, { call }) {
      const response = yield call(recoveryobj, payload);
      if (response) {
        if (response.code === '200') {
          Message.success(response.msg);
          if (callback) callback();
        } else {
          Message.error(response.msg);
        }
      }
    },
    *restPassword({ payload, callback }, { call }) {
      const response = yield call(restPassword, payload);
      if (response) {
        if (response.code === '200') {
          Message.success(response.msg);
          if (callback) callback();
        } else {
          Message.error(response.msg);
        }
      }
    },
    *updateSubware({ payload, callback }, { call, put }) {
      const response = yield call(updateSubware, payload);
      if (response && response.code === '201') {
        yield put({
          type: 'save',
        });
        if (callback) callback();
        Message.success('子库更新成功');
      } else {
        Message.error(response.msg);
      }
    },
    *addMoney({ payload, callback, url }, { call }) {
      const response = yield call(addMoney, payload, url);
      if (response) {
        if (response.code === '300') {
          if (callback) callback(response.data);
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error('系统繁忙');
      }
    },
    *subtractMoney({ payload, callback, url }, { call }) {
      const response = yield call(subtractMoney, payload, url);
      if (response) {
        if (response.code === '400') {
          if (callback) callback(response.data);
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error('系统繁忙');
      }
    },
    *queryScanInfo({ payload, success, error }, { call }) {
      const response = yield call(queryScanInfo, payload);
      if (isEmpty(response)) {
        if (error) error();
        return;
      }
      if (response.code === '200') {
        if (success) success(response.data);
      } else if (error) error(response.msg);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
