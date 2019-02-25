/*
 * @Author: zouwendi 
 * @Date: 2018-05-15 17:25:02 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 10:49:38
 * @Description: 字典表管理model
 */
import { Message, message } from 'antd';
import {
  updateobj,
  addobj,
  getobj,
  newoObj,
  deleteobj,
  queryDic,
  queryCode,
  getSuplySList,
  queryWmsLot,
  confirmobj,
  queryCodeCount,
  querySubwareList,
  getobjbyCode,
  getobjbyLCode,
  queryVehicleList,
  queryFarmerList,
  queryMarketList,
  fetchCount,
  queryVehicleCodeNum,
  getobjbyLotCode,
  queryPList,
  importExcel,
  addobjCount,
  queryLocation,
  queryAllDic,
  getCosSigner,
} from '../services/api';
import { queryList } from '../services/list';
import { isEmpty } from '../utils/utils';

export default {
  namespace: 'base',

  state: {
    isSelectImg: false,
		importResTitleArr: [],
		shengCode: '130000',
		shiCode: '130100',
		isEdit: true,
		exporting: false,
		upperId: [],
    newInfo: {},
    info: {},
    otherInfo: {},
    newOther: {},
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
      if (response) {
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
      } else {
        Message.error('系统繁忙');
      }
		},
		*getUpperId({ payload, url }, { call, put }) {
      const temp = {
        page: 1,
        len: 100000,
        queryMap: {},
        url: url,
        columnProp: undefined,
        columnOrder: undefined,
			};
			
			const response = yield call(queryList, temp);
			if(response){
				let list = response.data.list;
				
			}else{
				message.error('获取上级id失败');
			}
    },
    *fetchAdd({ payload, callback, url, silent, success, error }, { call, put }) {
      const response = yield call(addobj, payload, url);
      if (response) {
        if (response.code === '201') {
          if (!silent) Message.success(response.msg);
          yield put({
            type: 'save',
            payload: {
              info: response.data || {},
            },
          });
          if (callback) callback();
          if (success) success(response.data);
        } else {
          if (error) {
            error(response.msg);
            return;
          }
          Message.error(response.msg);
        }
      } else {
        if (error) {
          error('系统繁忙');
          return;
        }
        Message.error('系统繁忙');
      }
    },
    *fetchAddC({ payload, callback, url, silent }, { call, put }) {
      const temp = payload;
      for (const key in temp) {
        if (temp[key] === null && temp[key] === undefined) delete temp[key];
      }
      const response = yield call(addobjCount, temp, url);
      if (response) {
        if (response.code === '201') {
          if (!silent) Message.success(response.msg);
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
      } else {
        Message.error('系统繁忙');
      }
    },
    *inWare({ payload, callback, url, errback }, { call }) {
      const temp = payload;
      for (const key in temp) {
        if (temp[key] === null && temp[key] === undefined) delete temp[key];
      }
      const response = yield call(addobj, temp, url);
      if (response) {
        if (response.code === '201') {
          Message.success(response.msg);
          if (callback) callback();
        } else {
          Message.error(response.msg);
          errback(response.msg);
        }
      } else {
        Message.error('入库出错');
        errback('入库出错');
      }
    },

    *info({ payload, url, callback }, { call, put }) {
      const response = yield call(getobj, payload, url);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            info: response.data || {},
          },
        });
        if (callback) callback(response.data);
      } else {
        Message.error(response.msg);
      }
    },
    *confirmobj({ payload, callback, url }, { call }) {
      const response = yield call(confirmobj, payload, url);
      if (isEmpty(response)) {
        Message.error('系统繁忙');
        return;
      }
      if (response.code === '200') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }

      if (callback) callback();
    },
    *otherInfo({ payload, url, callback }, { call, put }) {
      const response = yield call(getobj, payload, url);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            otherInfo: response.data || {},
          },
        });
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
    },
    *getobjbyCode({ payload, callback, error, success }, { call, put }) {
      const response = yield call(getobjbyCode, payload, 'wmscode');
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              infoByCode: response.data || {},
            },
          });
          if (callback) callback(response.data);
          if (success) success(response.data);
        } else {
          if (error) error(response.msg);
          Message.error(response.msg);
        }
      } else if (error) {
        error('系统繁忙');
      }
    },
    *getobjbyLCode({ payload, callback, error }, { call, put }) {
      const response = yield call(getobjbyLCode, payload, 'wmslot');
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              infoByCode: response.data || {},
            },
          });
          if (callback) callback(response.data);
        } else {
          if (error) error(response.msg);
          Message.error(response.msg);
        }
      } else if (error) {
        error('系统错误');
      }
    },
    *getLotbyCode({ payload, callback, error }, { call, put }) {
      const response = yield call(getobjbyLotCode, payload, 'wmslot');
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              infoByCode: response.data || {},
            },
          });
          if (callback) callback(response.data);
        } else {
          if (error) error(response.msg);
          Message.error(response.msg);
        }
      } else if (error) {
        error('系统错误');
      }
    },
    *new({ url, callback, objName }, { call, put }) {
      const response = yield call(newoObj, url);
      if (response && response.code === '200') {
        const payload = {};
        if (objName) {
          payload[objName] = response.data || {};
        } else {
          payload.newInfo = response.data || {};
        }
        yield put({
          type: 'save',
          payload,
        });
        if (callback) callback(response.data);
      } else {
        Message.error(response.msg);
      }
    },

    *newOther({ url }, { call, put }) {
      const response = yield call(newoObj, url);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            newOther: response.data || {},
          },
        });
      } else {
        Message.error(response.msg);
      }
    },

    *delete({ payload, callback, url }, { call }) {
      const response = yield call(deleteobj, payload, url);
      if (response && response.code === '202') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }

      if (callback) callback();
    },

    *queryCode({ payload, url, success, failed }, { call, put }) {
      const response = yield call(queryCode, payload, url);
      if (response && response.data && response.data) {
        yield put({
          type: 'save',
          payload: {
            codeInfo: response.data,
          },
        });
        if (success) success(response.data);
      } else if (failed) {
        failed('批次编码错误');
      }
    },
    *supplylist({ payload }, { call, put }) {
      const response = yield call(getSuplySList, payload);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            supplylist: response.data,
          },
        });
      } else {
        Message.error(response.msg);
      }
    },
    *queryWmsLot({ payload }, { call, put }) {
      const response = yield call(queryWmsLot, payload);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            WmsLots: response.data,
          },
        });
      } else {
        Message.error(response.msg);
      }
    },
    *queryCodeCount({ payload, callback }, { call, put }) {
      const response = yield call(queryCodeCount, payload);
      if (response && response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            codeCount: response.data,
          },
        });
        if (callback) callback(response.data);
      } else {
        Message.error(response.msg);
      }
    },
    *confirmOrder({ payload, callback, url }, { call }) {
      const response = yield call(confirmobj, payload, url);
      if (response) {
        if (response.code === '200') {
          Message.success(response.msg);
        } else {
          Message.error(response.msg);
        }
      }

      if (callback) callback();
    },
    *confirmInVOrder({ payload, callback, url }, { call }) {
      const response = yield call(confirmobj, payload, url);
      if (response && response.code === '200') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }

      if (callback) callback();
    },
    *fetchCount({ payload, callback, url }, { call }) {
      const response = yield call(fetchCount, payload, url);
      if (response && response.code === '200') {
        Message.success(response.msg);
        if (callback) callback();
      } else {
        Message.error(response.msg);
      }
    },
    *queryVehicleCodeNum({ payload, callback, url }, { call }) {
      const response = yield call(queryVehicleCodeNum, payload, url);
      if (response && response.code === '200') {
        Message.success(response.msg);
        if (callback) callback(response.data);
      } else {
        Message.error(response.msg);
      }
    },
    *queryPList({ callback, url }, { call, put }) {
      const response = yield call(queryPList, url);
      if (response && response.code === '200') {
        // Message.success(response.msg);
        yield put({
          type: 'save',
          payload: {
            isExistP: response.data,
          },
        });
        if (callback) callback();
      } else {
        // Message.error(response.msg);
      }
    },
    *querySubwareList({ payload, callback }, { call, put }) {
      const response = yield call(querySubwareList, payload);
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              SubwareList: response.data,
            },
          });
          if (callback) callback();
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error('系统繁忙');
      }
    },
    *getVehicleList(_, { call, put }) {
      const response = yield call(queryVehicleList);
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              vehicleList: response.data,
            },
          });
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error('系统异常');
      }
    },
    *queryMarketList(_, { call, put }) {
      const response = yield call(queryMarketList);
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              marketList: response.data,
            },
          });
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error(response.msg);
      }
    },
    *queryFarmerList(_, { call, put }) {
      const response = yield call(queryFarmerList);
      if (response) {
        if (response.code === '200') {
          yield put({
            type: 'save',
            payload: {
              farmerList: response.data,
            },
          });
        } else {
          Message.error(response.msg);
        }
      } else {
        Message.error(response.msg);
      }
    },
    *importExcel({ url, uid, callback }, { call, put }) {
      const response = yield call(importExcel, url, uid);
      if (response.code === '0') {
        yield put({
          type: 'save',
          payload: {
            resList: response.data,
            importMsg: undefined,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            resList: undefined,
            importMsg: response.msg,
          },
        });
      }
      if (callback) callback();
    },
    *queryLocation(_, { call, put }) {
      const response = yield call(queryLocation);
      if (isEmpty(response)) return;
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            TLocation: response.data,
          },
        });
      } else {
        Message.error(response.msg);
      }
    },
    *queryAllDic(_, { call, put }) {
      const response = yield call(queryAllDic);
      if (response.code === '200') {
        const key = new Set();
        const map = {};
        response.data.forEach(item => key.add(item.dic_type));
        key.forEach(item => {
          const temp = response.data.filter(item2 => item2.dic_type === item);
          map[item] = temp;
        });
        yield put({
          type: 'save',
          payload: map,
        });
      } else {
        Message.error(response.msg);
      }
    },
    *uploadImg({payload}, { call, put }) {
      const response = yield call(getCosSigner, {...payload});
      if(response) {
        
      }
      console.log('get cos signer: ', response);
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    clear(state) {
      return {
        ...state,
        newInfo: {},
        info: {},
      };
    },
  },
};
