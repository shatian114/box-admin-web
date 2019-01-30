import { isUrl } from '../utils/utils';

let menuData = [
  // {
  //   name: '文件上传',
  //   icon: 'upload',
  //   path: 'upload',
  //   children: [
  //     {
  //       name: '表单上传',
  //       path: 'formUploadformUpload',
  //     },
  //   ],
  // },
];

export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export function setMenuData(newMenuData) {
  menuData = newMenuData;
}

export const getMenuData = () => menuData;
