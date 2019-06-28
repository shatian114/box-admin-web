import moment from 'moment';
import { getobj } from '../services/api';
import {queryList} from "../services/list";

const UUID = require('uuidjs');

const DateFormat = 'YYYY-MM-DD';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getTimeLimit({ limit, type, format }) {
  const formatSwitch = {
    day: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    year: 'YYYY',
  };
  let nowFormat = formatSwitch[type];
  if (!isEmpty(format)) nowFormat = format;
  const startTime = moment(limit[0]);
  const endTime = moment(limit[1]);
  const nowTime = moment(limit[0]);
  const allTime = [];
  if (type === 'day') {
    while (true) {
      if (
        nowTime.isSame(startTime, 'day') ||
        nowTime.isSame(endTime, 'day') ||
        (nowTime.isAfter(startTime, 'day') && nowTime.isBefore(endTime, 'day'))
      ) {
        allTime.push(nowTime.format(nowFormat));
        nowTime.add(1, 'd');
      } else {
        return allTime;
      }
    }
  }
  if (type === 'month') {
    while (true) {
      if (
        nowTime.isSame(startTime, 'month') ||
        nowTime.isSame(endTime, 'month') ||
        (nowTime.isAfter(startTime, 'month') && nowTime.isBefore(endTime, 'month'))
      ) {
        allTime.push(nowTime.format(nowFormat));
        nowTime.add(1, 'M');
      } else {
        return allTime;
      }
    }
  }
  if (type === 'year') {
    while (true) {
      if (
        nowTime.isSame(startTime, 'year') ||
        nowTime.isSame(endTime, 'year') ||
        (nowTime.isAfter(startTime, 'year') && nowTime.isBefore(endTime, 'year'))
      ) {
        allTime.push(nowTime.format(nowFormat));
        nowTime.add(1, 'y');
      } else {
        return allTime;
      }
    }
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function containsAdv(arr, item, attr) {
  for (let i = 0; i !== arr.length; i += 1) {
    if (arr[i][attr] === item[attr]) {
      return true;
    }
    return false;
  }
}
export function findItem(code, arr, attr) {
  if (arr && arr.length) {
    for (const item of arr) {
      if (attr && item[attr] === code) {
        return item;
      } else if (item.dic_code === code) {
        return item;
      }
    }
  }
  return undefined;
}

export function isEmpty(item) {
  return item === null || item === undefined || item === '';
}

export function handleExportXls(props, xlsName, url, columns) {
	const { dispatch, form } = props;
	dispatch({
		type: `base/save`,
		payload: {
			exporting: true,
		}
	});
  form.validateFieldsAndScroll((err, values) => {
    const date = {};
    if (values.startDate) date.startDate = values.startDate.format(DateFormat);
		if (values.endDate) date.endDate = values.endDate.format(DateFormat);
		
		let temp = {};
		if (!isEmpty(values.start_create_date)){
			temp = {
				...temp,
				start_create_date: values.start_create_date.format(DateFormat),
			};
		}
		if (!isEmpty(values.end_create_date)){
			temp = {
				...temp,
				end_create_date: values.end_create_date.format(DateFormat),
			};
		}
		let queryMap = { ...values, ...temp };

    dispatch({
      type: `list/exportExcel`,
      payload: {
        filename: xlsName,
				queryMap: { ...values, ...date } || {},
				queryMap: queryMap,
				url: url,
				columns: columns,
				dispatch: dispatch,
      },
		});
	});
}

export function s2ab(s) {
	if (typeof ArrayBuffer !== 'undefined') {
			var buf = new ArrayBuffer(s.length)
			var view = new Uint8Array(buf)
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
			return buf
	} else {
			var buf = new Array(s.length);
			for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
			return buf;
	}
}

// 表格里面显示是否
export function viewBoolean(val, record, index) {
  return <span>{val == "1" ? "是" : "否"}</span>;
}

// 根据值来删除数组元素
export function delArrEle(arr, val) {
  if (arr.indexOf(val) !== -1) {
    arr.splice(arr.indexOf(val), 1);
  }
  return arr;
}

// 生成uuid数组
export function geneUuidArr(arrNum) {
  const uuidArr = [];
  for (let i = 0; i < arrNum; i+=1) {
    uuidArr.push(UUID.generate());
  }
  return uuidArr;
}

// 根据t_picture里面的id获取piclink
export async function getPiclink(t_picture_id) {
  const response = await getobj({
    id: t_picture_id,
  }, 'TPicture');
  if (response && response.code.startsWith('2')){
    return response.data.piclink;
  }
  return '';
}

// 根据t_picture里面的id获取piclink
export function getPiclink2(t_picture_id) {
  return new Promise(async resolve => {
    const response = await getobj({
      id: t_picture_id,
    }, 'TPicture');
    if (response && response.code.startsWith('2') && response.data){
     resolve(response.data.piclink);
    }
    resolve('')
  });
}

// 根据字段名获取对应的piclink的list
export async function getPiclinkList(fieldName, fieldValue) {
  if (fieldValue && fieldValue.length > 0) {
    const queryMap = {};
    queryMap[fieldName] = fieldValue;
    const response = await queryList({
      page: 1,
      len:1000,
      'queryMap': queryMap,
      url: '/api/TPicture/queryTPictureList',
    });
    if (response && response.code.startsWith('2')) {
      return response.data.list;
    }
  }
  return [];
}
