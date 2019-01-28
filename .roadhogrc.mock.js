import mockjs from 'mockjs';

import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  // 'GET /api/currentUser': {
  //   $desc: '获取当前用户接口',
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: {
  //     name: 'Serati Ma',
  //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  //     userid: '00000001',
  //     notifyCount: 12,
  //   },
  // },
  // 'POST /(.*)' : 'http://192.168.117.69:8082/',
  // 'POST /query/(.*)' : 'http://192.168.117.133:8082/query/',
};

export default (false ? {} : delay(proxy, 1000));
