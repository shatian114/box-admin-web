import { request, requestModels } from '../utils/request';
import db from '../utils/db';

var SERVER_ADDR="";

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return db.get('currentUser');
}

export async function getUserInfo(params) {
  return requestModels(`${SERVER_ADDR}/api/user/getobj`, {
    method: 'POST',
    body: params,
  });
}

export async function saveUser(params) {
  return requestModels(`${SERVER_ADDR}/api/user/updateobj`, {
    method: 'POST',
    body: params,
  });
}

export async function addUser(params) {
  return requestModels(`${SERVER_ADDR}/api/user/addobj`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteUser(params) {
  return requestModels(`${SERVER_ADDR}/api/user/deleteobj`, {
    method: 'POST',
    body: params,
  });
}

export async function newUser() {
  return requestModels(`${SERVER_ADDR}/api/user/newObj`, {
    method: 'POST',
  });
}

export async function changePassword(params) {
  return requestModels(`${SERVER_ADDR}/api/user/updatePassword`, {
    method: 'POST',
    body: params,
  });
}

export async function cancelobj(params) {
  return requestModels(`${SERVER_ADDR}/api/user/cancelobj`, {
    method: 'POST',
    body: params,
  });
}
export async function recoveryobj(params) {
  return requestModels(`${SERVER_ADDR}/api/user/recoveryobj`, {
    method: 'POST',
    body: params,
  });
}
export async function restPassword(params) {
  return requestModels(`${SERVER_ADDR}/api/user/restPassword`, {
    method: 'POST',
    body: params,
  });
}
export async function queryRoleList() {
  return requestModels(`${SERVER_ADDR}/api/user/queryRoleList`, {
    method: 'POST',
  });
}
export async function updateSubware(params) {
  return requestModels(`${SERVER_ADDR}/api/tuserInfo/updateSubware`, {
    method: 'POST',
    body: params,
  });
}

export async function addMoney(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/addMoney`, {
    method: 'POST',
    body: params,
  });
}

export async function subtractMoney(params, url) {
  return requestModels(`${SERVER_ADDR}/api/${url}/subtractMoney`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrentInfo() {
  return request(`${SERVER_ADDR}/api/tuserInfo/queryCurrentInfo`, {
    method: 'POST',
  });
}
export async function queryScanInfo(params) {
  return requestModels(`${SERVER_ADDR}/api/user/queryScanInfo`, {
    method: 'POST',
    body: params,
  });
}
