import { queryList } from '../services/list';
import { message } from 'antd';
import {getPiclink2, getPiclink, s2ab} from '../utils/utils';
import xlsx from 'xlsx';
import {exportExcel, getobj} from '../services/api';

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
    exporting: false,
    searching: false,
    queryTProducttypeList: [], // 实物商品类别
    queryTProductList: [], // 实物商品
  },

  effects: {
    *list({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          searching: true,
        }
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
        for (const k in response.data) {
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
            searching: false,
          },
        });
        yield put({
          type: 'filtertagindex',
          'response': response,
        });
      }
    },
    *filtertagindex({response}, {call, put}) {
      if (response.list[0] && response.list[0].tagindex) {
        // 遍历list，如果里面有tagindex，需要将tagindex换成piclink
        for(let i=0; i<response.list.length; i+=1) {
          console.log(response.list[i].tagindex);
          if (response.list[i].tagindex && response.list[i].tagindex.length > 0) {
            const idArr = response.list[i].tagindex.split(',');
            const tagindexArr = [];
            for (let j=0; j<idArr.length; j+=1) {
              const piclink = yield call(getPiclink2, idArr[j])
              console.log('piclink: ', piclink);
              tagindexArr.push(piclink);
            }
            response.list[i].tagindex = tagindexArr.join(',');
          }
        }
        yield put({
          type: 'save',
          payload: {
            list: response.list,
          },
        });
      }
    },
    *listsaveinfo({ payload }, { call, put}) {
      const response = yield call(queryList, {
        page: 1,
        len: 100000,
        ...payload,
      });

      if (response) {
        // 之前的api没有data元素，现在的data元素里面都是在上一级，现在提到上一级
        for (let k in response.data) {
          response[k] = response.data[k];
        }
      
        const saveinfokey = payload.url.split('/').pop();
        const payload2 = {};
        payload2[saveinfokey] = response.list;
        yield put({
          type: 'save',
          'payload': payload2,
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
			}else{
				message.error('服务器错误');
      }
		},
		*exportExcel({ payload, url }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          exporting: true,
        }
      });
      yield call(exportExcel, payload, url);
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
        list: [],
        total: 0,
        queryMap: {},
        pagination: {
          current: 1,
          pageSize: 10,
        },
        url: undefined,
        sorter: {},
        queryTProducttypeList: [],
        queryTProductList: [],
      };
		},
  },
};
