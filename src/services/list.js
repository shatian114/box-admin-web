import { request } from '../utils/request';

export async function queryList(params) {
  const { page, len, queryMap, url, columnProp, columnOrder } = params;
  return request(url, {
    method: 'POST',
    body: {
      page,
      len,
      ...queryMap,
      columnProp,
      columnOrder,
    },
  });
}
