// import { stringify } from 'qs';
import md5 from 'js-md5';

import { request, requestModels, download, requestCosAuth } from '../utils/request';

var SERVER_ADDR="";

export async function getVerificationCode() {
  return request(`${SERVER_ADDR}/auth/getGuestUid`);
}

export async function getVerification(params) {
  return request(`${SERVER_ADDR}/auth/refresh/${params}`);
}

export async function upload(params) {
  return request(`${SERVER_ADDR}/api/storage/f`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogin(params) {
  const { username, password } = params;
  return requestModels(`${SERVER_ADDR}/auth/login`, {
    method: 'POST',
    headers: {
      verifyCode: params.verify_code,
      guestUid: params.guest_uid,
    },
    body: {
      username,
      password: md5(password),
    },
  });
}

export async function logout() {
  return request(`${SERVER_ADDR}/auth/logout`);
}

// 菜单与操作权限

export async function getMenuData() {
  // return request(`${SERVER_ADDR}/api/authority/getMenus`);
  return requestModels(`${SERVER_ADDR}/api/authority/getnewMenus`, {
    method: 'POST',
    body: {'sysid': 'Z2'},
  });
}

export async function getOprs(params) {
  return requestModels(`${SERVER_ADDR}/api/authority/getOprs`, {
    method: 'POST',
    body: params,
  });
}
export async function queryPList(params) {
  return requestModels(`${SERVER_ADDR}/api/wmsinventoryorder/queryPList`, {
    method: 'POST',
    body: params,
  });
}

// userInfo
export async function saveUserDetailInfo(params) {
  return requestModels(`${SERVER_ADDR}/api/userInfo/updateobj`, {
    method: 'POST',
    body: params,
  });
}
export async function getobjbyCode(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/getByCodeCode`, {
    method: 'POST',
    body: params,
  });
}
export async function getobjbyLCode(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/getobjbyCode`, {
    method: 'POST',
    body: params,
  });
}
export async function getobjbyLotCode(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/getobjbyCode`, {
    method: 'POST',
    body: params,
  });
}
export async function getUserDetailInfo(params) {
  return requestModels(`${SERVER_ADDR}/api/userInfo/getobj`, {
    method: 'POST',
    body: params,
  });
}

export async function getobj(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/getobj`, {
    method: 'POST',
    body: params,
  });
}

export async function queryDic(params) {
  return requestModels(`${SERVER_ADDR}/api/dic/getTDicListByType`, {
    method: 'POST',
    body: params,
  });
}
export async function queryAllDic() {
  return request(`${SERVER_ADDR}/api/dic/getTDicAllListByType`, {
    method: 'POST',
  });
}

export async function queryLocation() {
  return request(`${SERVER_ADDR}/api/dic/getLocation`, {
    method: 'POST',
  });
}

export async function updateobj(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/updateobj`, {
    method: 'POST',
    body: params,
  });
}
export async function queryVehicleCodeNum(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/queryVehicleCodeNum`, {
    method: 'POST',
    body: params,
  });
}
export async function addobj(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/addobj`, {
    method: 'POST',
    body: params,
  });
}
export async function addobjCount(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/addobjCount`, {
    method: 'POST',
    body: params,
  });
}
export async function deleteobj(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/deleteobj`, {
    method: 'POST',
    body: params,
  });
}

export async function newoObj(url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/newObj`, {
    method: 'POST',
  });
}

export async function queryCode(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/getCodeprintByCode`, {
    method: 'POST',
    body: params,
  });
}

export async function confirmobj(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/confirmobj`, {
    method: 'POST',
    body: params,
  });
}
export async function fetchCount(params, url) {
  return request(`${SERVER_ADDR}/api/${url}/fetchCount`, {
    method: 'POST',
    body: params,
  });
}

export async function getSuplySList() {
  return requestModels(`${SERVER_ADDR}/api/supply/querySupplySList`, {
    method: 'POST',
  });
}
export async function querySubwareList(params) {
  return requestModels(`${SERVER_ADDR}/api/subware/querySubwareList`, {
    method: 'POST',
    body: params,
  });
}
export async function queryWmsLot(params) {
  return requestModels(`${SERVER_ADDR}/api/inorder/queryWmsLot`, {
    method: 'POST',
    body: params,
  });
}

export async function printCode(params) {
  return requestModels(`${SERVER_ADDR}/api/codeprint/printCode`, {
    method: 'POST',
    body: params,
  });
}
export async function exportExcel(params, url) {
  return download(`${SERVER_ADDR}/api/${url}/exportExcel`, {
    method: 'POST',
    body: params,
  });
}
export async function queryCodeCount(params) {
  return requestModels(`${SERVER_ADDR}/api/tmporder2code/queryCodeCount`, {
    method: 'POST',
    body: params,
  });
}

export async function queryVehicleList() {
  return requestModels(`${SERVER_ADDR}/api/vehicle/getVehicleList`, {
    method: 'POST',
  });
}

export async function queryMarketList() {
  return requestModels(`${SERVER_ADDR}/api/market/queryMarketList`, {
    method: 'POST',
  });
}

export async function queryFarmerList() {
  return requestModels(`${SERVER_ADDR}/api/farmer/queryFarmerList`, {
    method: 'POST',
  });
}

export async function addNewDetail(params, orderCode) {
  return requestModels(`${SERVER_ADDR}/api/wmsrecoverinorder/addNewDetail/${orderCode}`, {
    method: 'POST',
    body: params,
  });
}
export async function addNewOutDetail(params, orderCode) {
  return requestModels(`${SERVER_ADDR}/api/fhck/addNewDetail/${orderCode}`, {
    method: 'POST',
    body: params,
  });
}
export async function queryWmsRecoverinorderDetailList(orderCode) {
  return requestModels(`${SERVER_ADDR}/api/query/queryWmsRecoverinorderDetailList/${orderCode}`, {
    method: 'POST',
  });
}

export async function deleteDetail(payload) {
  return requestModels(
    `${SERVER_ADDR}/api/wmsrecoverinorder/deleteDetail/${payload.orderCode}/${payload.lotId}`,
    {
      method: 'POST',
    }
  );
}
export async function importExcel(url, uid) {
  return requestModels(`${SERVER_ADDR}/api/${url}/importExcel/${uid}`, {
    method: 'POST',
  });
}

export async function getChartData(params, url) {
  return request(`${SERVER_ADDR}/api/query/chart/${url}`, {
    method: 'POST',
    body: params,
  });
}

export async function getCosSigner(params) {
  return requestCosAuth(`/cos/getCosSigner`, {
    method: 'POST',
    body: params,
  });
}
