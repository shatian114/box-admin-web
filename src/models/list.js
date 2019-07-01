import { queryList } from '../services/list';
import { message } from 'antd';
import {s2ab} from '../utils/utils';
import xlsx from 'xlsx';
import { exportExcel, exportTomorrowExcel, exportFoodDeliveryDatailExcel, exportTodayMatchExcel, setDeliveryList } from '../services/api';

export default {
  namespace: 'list',

  state: {
    sumtotal: 0,
    response: {},
		list: [],
    total: 0,
    queryMap: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    url: undefined,
    sorter: {},
    exporting: false,
    searching: false,
    selectRecordArr: [],
    queryTClzAssignfoodList: [],    //配菜点tlis
    queryTClzDeliveryclerkList: [], //配送员list
    searchqueryTClzDeliveryclerkList: [], //搜索的配送员list
    setqueryTClzDeliveryclerkList: [], //设置的配送员list
    queryTClzFoodList: [], //菜品list
    queryTClzOrderList: [], //订单list
    queryTClzBigtypeList: [], //菜品大类list
    queryTClzSmalltypeList: [], //菜品小类list
    queryTClzUserList: [], // 客户的用户信息list
    queryTClzUseraddressList: [], // 客户的地址list
  },

  effects: {
    *list({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          searching: true,
        },
      });
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
        // 之前的api没有data元素，现在的data元素里面都是在上一级，现在提到上一级
        for (let k in response.data) {
          response[k] = response.data[k];
        }
      
        yield put({
          type: 'save',
          payload: {
            sumtotal: response.sumtotal || 0,
            'response': response,
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
      yield put({
        type: 'save',
        payload: {
          searching: false,
        },
      });
    },
    *listsaveinfo({ payload, callback }, { call, put}) {
      const response = yield call(queryList, {
        page: 1,
        len: 100000,
        ...payload,
        queryMap: {
          ...payload.queryMap,
        },
      });

      if (response && response.code.startsWith('2') && response.data) {
        // 之前的api没有data元素，现在的data元素里面都是在上一级，现在提到上一级
        for (let k in response.data) {
          response[k] = response.data[k];
        }

        const saveinfokey = payload.url.split('/').pop();
        const payload2 = {};
        payload2[saveinfokey] = response.list || [];
        yield put({
          type: 'save',
          'payload': payload2,
        });
        if(callback) {
          if(saveinfokey === 'queryTClzUseraddressList') {
            callback(payload.userid);
          }else{
            callback();
          }
        }
      }
    },
		*exportExcel2({payload}, {call}) {
			const temp = {
        page: 1,
        len: 100000,
        queryMap: payload.queryMap,
        url: payload.url,
        columnProp: undefined,
        columnOrder: undefined,
			};
			
			const response = yield call(queryList, temp);

			if(response){
				let {columns} = payload;
				columns.shift();
				let xlsArr = [];
				let colTitleArr = [];
				columns.map(v => {
					colTitleArr.push(v.title);
				});
				xlsArr.push(colTitleArr);

				response.data.list.map(v => {
					let rowArr = [];
					columns.map(columnsV => {
						rowArr.push(v[columnsV.dataIndex]);
					});
					xlsArr.push(rowArr);
				});

				let worksheet = xlsx.utils.aoa_to_sheet(xlsArr);
				let new_workbook = xlsx.utils.book_new();
				xlsx.utils.book_append_sheet(new_workbook, worksheet, payload.filename);
				const defaultCellStyle = { font: { name: "Verdana", sz: 13, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
    		let wopts = { bookType: 'biff8', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
				let wbout = xlsx.write(new_workbook, wopts);
				let blob = new Blob([s2ab(wbout), {type: 'application/octet-stream'}]);
				const a = document.createElement('a');
        const turl = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = turl;
				a.download = payload.filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
        window.URL.revokeObjectURL(turl);
			}else{
				message.error('服务器错误');
      }
		},
		*exportExcel({ payload, url }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          exporting: true,
        },
      });
      const payloadTmp = {
        ...payload,
        ...payload.queryMap,
      };
      yield call(exportExcel, payloadTmp, url);
      yield put({
        type: 'save',
        payload: {
          exporting: false,
        },
      });
    },

    *exportFoodDeliveryDatailExcel({ payload, url }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          exporting: true,
        },
      });
      yield call(exportFoodDeliveryDatailExcel, payload, url);
      yield put({
        type: 'save',
        payload: {
          exporting: false,
        }
      });
    },
    *exportTodayMatchOrderExcel({ payload, url }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          exporting: true,
        },
      });
      yield call(exportTodayMatchExcel, payload, url);
      yield put({
        type: 'save',
        payload: {
          exporting: false,
        }
      });
    },
    *setDeliveryList({ payload, url }, { call }) {
      const response = yield call(setDeliveryList, payload, url);
      if(response && response.code === '200' && response.msg === '操作成功') {
        message.success(response.msg);
        yield call(payload.callback);
      }else if(response.msg) {
        message.error(response.msg);
      }
      
    },
		*exportTomorrowExcel({ payload, url }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          exporting: true,
        }
      });
      yield call(exportTomorrowExcel, payload, url);
      yield put({
        type: 'save',
        payload: {
          exporting: false,
        }
      });
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
        sumtotal: 0,
        response: {},
        list: [],
        total: 0,
        queryMap: {},
        pagination: {
          current: 1,
          pageSize: 10,
        },
        url: undefined,
        sorter: {},
        queryTClzAssignfoodList: [],    // 配菜点tlis
        queryTClzDeliveryclerkList: [], //配送员list
        searchqueryTClzDeliveryclerkList: [], //搜索的配送员list
        setqueryTClzDeliveryclerkList: [], //设置的配送员list
        queryTClzFoodList: [], // 菜品list
        queryTClzOrderList: [], // 订单list
        queryTClzBigtypeList: [], // 菜品大类list
        queryTClzSmalltypeList: [], // 菜品小类list
        queryTClzUserList: [], // 客户的用户信息list
        queryTClzUseraddressList: [], // 客户的地址list
      };
		}
  },
};
