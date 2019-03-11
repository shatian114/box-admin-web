export const formItemLayout = {
	labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export const formItemGrid = {
	span: 8
};

export function geneImportColumn(column){
  let column2 = column;
  column2.shift();
  return column2;
}

export const webConfig = {
	webName: '智慧社区',
	webPreName: 'cpzhsq',
	companyName: '海南邦邻易家',
	Bucket: 'pet-1252596634',
  Region: 'ap-chengdu',
  tpUriPre: 'http://pet-1252596634.cos.ap-chengdu.myqcloud.com/',
}