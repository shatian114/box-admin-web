/*
 * @Author: cuiwei 
 * @Date: 2018-05-24 15:24:07 
 * @Last Modified by: cuiwei
 * @Last Modified time: 2018-05-19 21:43:42
 * @Description: 批次
 */
import { Message } from 'antd';
import {
  updateobj,
  addobj,
  getobj,
  newoObj,
  deleteobj,
  addNewDetail,
  queryWmsRecoverinorderDetailList,
  deleteDetail,
} from '../services/api';

export default {
  namespace: 'wmsrecoverinorder',

  state: {
    newInfo: {},
    info: {},
  },

  effects: {
    *queryDetail({ orderCode, callback }, { call, put }) {
      const response = yield call(queryWmsRecoverinorderDetailList, orderCode);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            list: response.data,
          },
        });
        if (callback) callback();
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
    *addNewDetail({ payload, callback, orderCode }, { call, put }) {
      const response = yield call(addNewDetail, payload, orderCode);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            detail: response.data || {},
          },
        });
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
    },
    *deleteDetail({ payload, callback }, { call, put }) {
      const response = yield call(deleteDetail, payload);
      if (response.code === '200') {
        yield put({
          type: 'save',
        });
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
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
