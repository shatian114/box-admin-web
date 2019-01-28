import { Message } from 'antd';
import { getUserInfo, newUser, deleteUser, addUser, saveUser } from '../services/user';
import { saveUserDetailInfo, getUserDetailInfo } from '../services/api';

export default {
  namespace: 'userManager',

  state: {
    userInfo: {},
    newInfo: {},
    detailInfo: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const temp = payload;
      delete temp.createDate;
      delete temp.modifyDate;
      const response = yield call(saveUser, temp);
      if (response.code === '203') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }
      yield put({
        type: 'save',
        payload: {
          userInfo: response.data || {},
        },
      });
    },

    *fetchAdd({ payload }, { call, put }) {
      const temp = payload;
      delete temp.createDate;
      delete temp.modifyDate;
      const response = yield call(addUser, temp);
      if (response.code === '201') {
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }
      yield put({
        type: 'save',
        payload: {
          userInfo: response.data || {},
        },
      });
    },

    *info({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data || {},
          },
        });
      }
    },

    *detailInfo({ payload }, { call, put }) {
      const response = yield call(getUserDetailInfo, payload);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: {
            detailInfo: response.data || {},
          },
        });
      }
    },

    *saveDetailInfo({ payload }, { call, put }) {
      const response = yield call(saveUserDetailInfo, payload);
      if (response.code === '203') {
        yield put({
          type: 'save',
          payload: {
            detailInfo: response.data || {},
          },
        });
        Message.success(response.msg);
      } else {
        Message.error(response.msg);
      }
    },

    *new(_, { call, put }) {
      const response = yield call(newUser);
      if (response.code !== '200') Message.error(`${response.msg}`);
      yield put({
        type: 'save',
        payload: {
          newInfo: response.data || {},
        },
      });
    },

    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteUser, {
        id: payload.user_id,
      });
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

    clear(state) {
      return {
        ...state,
        userInfo: {},
        newInfo: {},
        detailInfo: {},
      };
    },
    clearDetailInfo(state, { payload }) {
      return {
        ...state,
        detailInfo: {
          ...state.detailInfo,
          ...payload,
        },
      };
    },
  },
};
