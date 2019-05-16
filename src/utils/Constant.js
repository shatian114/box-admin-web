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
	companyName: '海南菜篮子',
	Bucket: 'pet-1252596634',
  Region: 'ap-chengdu',
  tpUriPre: 'http://pet-1252596634.cos.ap-chengdu.myqcloud.com/',
}