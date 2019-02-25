/*
 * @Author: lbb 
 * @Date: 2018-05-18 17:25:02 
 * @Last Modified by: lbb
 * @Last Modified time: 2018-05-18 21:44:05
 * @Description: 车辆
 */
import { Message } from 'antd';
import { updateobj, addobj, getobj, newoObj, deleteobj, queryDic } from '../services/api';

export default {
  namespace: 'vehicle',

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
      const temp = payload;
      for (const key in temp) {
        if (temp[key] === null && temp[key] === undefined) delete temp[key];
      }
      const response = yield call(addobj, temp, url);
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
