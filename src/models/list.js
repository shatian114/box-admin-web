import { queryList } from '../services/list';
import { exportExcel } from '../services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    total: 0,
    queryMap: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    url: undefined,
    sorter: {},
  },

  effects: {
    *list({ payload }, { call, put, select }) {
      const list = yield select(state => state.list);
      const { current, pageSize, url, queryMap, sorter } = payload;
      const path = url || list.url;

      const columnSorter = sorter || list.sorter;
      const len = pageSize || list.pagination.pageSize;
      const page = current || list.pagination.current;
      const query = queryMap || list.queryMap;

      const temp = {
        page,
        len,
        queryMap: query || {},
        url: path,
        columnProp: columnSorter.field,
        columnOrder: columnSorter.order,
      };
      const response = yield call(queryList, temp);
      if (response) {

				//之前的api没有data元素，现在的data元素里面都是在上一级，现在提到上一级
				for(let k in response.data){
					response[k] = response.data[k];
				}

        yield put({
          type: 'save',
          payload: {
            list: response.list,
            total: response.totalitem,
            pagination: {
              current: page,
              pageSize: len,
            },
            queryMap: query || {},
            url: path,
            sorter: columnSorter,
          },
        });
      }
    },
    *exportExcel({ payload, url }, { call }) {
      yield call(exportExcel, payload, url);
    },
  },

  reducers: {
    save(state, { payload }) {
			console.log('payload', payload);
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        list: [],
        total: 0,
        queryMap: {},
        pagination: {
          current: 1,
          pageSize: 10,
        },
        url: undefined,
        sorter: {},
      };
    },
  },
};
