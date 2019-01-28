/*
 * @Author: zouwendi 
 * @Date: 2018-05-15 17:25:02 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-05 11:13:44
 * @Description: 字典表管理model
 */
import { Message } from 'antd';
import { getChartData } from '../services/api';
import { isEmpty } from '../utils/utils';

export default {
  namespace: 'chart',

  state: {
    codeAnalysis: [],
    queryMap: [],
    farmerAnalysis: [],
  },

  effects: {
    *query({ url, payload }, { call, put }) {
      const response = yield call(getChartData, payload, url);
      if (isEmpty(response)) {
        Message.error('系统繁忙');
        return;
      }
      if (response.code === '0') {
        yield put({
          type: 'save',
          payload: {
            [url]: response.data,
            queryMap: payload || [],
          },
        });
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
        codeAnalysis: [],
        farmerAnalysis: [],
        queryMap: [],
      };
    },
  },
};
