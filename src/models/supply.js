/*
 * @Author: zouwendi 
 * @Date: 2018-05-15 17:25:02 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-05-17 21:44:05
 * @Description: 农户管理
 */
import { Message } from 'antd';
import { updateobj, addobj, getobj, newoObj, deleteobj, queryDic } from '../services/api';

export default {
  namespace: 'supply',

  state: {
    newInfo: {},
    info: {},
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(queryDic, payload);
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
    *fetch({ payload, callback, url }, { call, put }) {
      const response = yield call(updateobj, payload, url);
      if (response.code === '203') {
        Message.success(response.msg);
        yield put({
          type: 'save',
          payload: {
            info: response.data || {},
          },
        });
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
    },
    *fetchAdd({ payload, callback, url }, { call, put }) {
      const response = yield call(addobj, payload, url);
      if (response.code === '201') {
        Message.success(response.msg);
        yield put({
          type: 'save',
          payload: {
            info: response.data || {},
          },
        });
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
    },

    *info({ payload, url }, { call, put }) {
      const response = yield call(getobj, payload, url);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            info: response.data || {},
          },
        });
      } else {
        Message.error(response.msg);
      }
    },

    *new({ url }, { call, put }) {
      const response = yield call(newoObj, url);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            newInfo: response.data || {},
          },
        });
      } else {
        Message.error(response.msg);
      }
    },

    *delete({ payload, callback, url }, { call }) {
      const response = yield call(deleteobj, payload, url);
      if (response.code === '202') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }

      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {
        newInfo: {},
        info: {},
      };
    },
  },
};
