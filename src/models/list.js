import { queryList } from '../services/list';
import { message } from 'antd';
import {s2ab} from '../utils/utils';
import xlsx from 'xlsx';
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
        for (let k in response.data) {
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
				//console.log('xls arr', xlsArr);

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
				console.log(blob);

				payload.dispatch({
					type: `base/save`,
					payload: {
						exporting: false,
					}
				});
			}else{
				message.error('服务器错误');
			}
		},
		*exportExcel({ payload, url }, { call }) {
      yield call(exportExcel, payload, url);
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
		}
  },
};
