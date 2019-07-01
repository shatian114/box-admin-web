export const formItemLayout = {
	labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};

export const formItemGrid = {
	span: 8
};
8
export function geneImportColumn(column){
  let column2 = column;
  column2.shift();
  return column2;
}

export const webConfig = {
	webName: '海南菜篮子',
	webPreName: 'clz',
	companyName: '海南环宇信息技术有限公司',
	Bucket: 'pet-1252596634',
  Region: 'ap-chengdu',
  tpUriPre: 'http://pet-1252596634.cos.ap-chengdu.myqcloud.com/',
  foodunitNameArr: ['斤', '两', '个', '升'],
  textAreaAutoSize: {minRows: 1, maxRows: 10},
}

export const ordergetstatusArr = ['下单成功等调配', '调配好等自提', '自提成功', '自提延期保留', '自提延期过期销毁', '调配好等配送', '配送中等签收', '签收成功', '签收失败退回', '配送签收失败退回过期销毁'];
export const ordergetstatusdesArr = ['调配好等配菜', '配菜结束等自提', '自提成功', '未及时自提配菜点先保留', '未及时自提配菜点保留段时间后销毁', '配菜结束等配送', '配送中等签收', '配送签收成功', '配送签收失败退回', '配送签收失败退回过期销毁'];
