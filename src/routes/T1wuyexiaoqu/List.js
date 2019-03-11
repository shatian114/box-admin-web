/*
 * @Author: zouwendi 
 * @Date: 2018-05-14 18:56:24 
 * @Last Modified by: zouwendi
 * @Last Modified time: 2018-06-11 18:09:55
 * @Description: 用户管理列表
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, InputNumber, Button, Modal, Card, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import styles from '../../styles/list.less';
import List from '../../components/List';
import Operate from '../../components/Oprs';
import { isEmpty } from '../../utils/utils';
import { formItemLayout, formItemGrid } from '../../utils/Constant';
import cache from '../../utils/cache';
import Importer from '../../components/Importer';
import {shengShiQu} from '../../utils/shengShiQu';

const FormItem = Form.Item;
const { Option } = Select;
//const routerUrl = cache.keysMenu.T1wuyexiaoqu;
const routerUrl ='/T1wuyexiaoqu';
const url = 'T1wuyexiaoqu';
const rowKey = 't_1wuyexiaoqu_id';
const DateFormat = 'YYYY-MM-DD';

@connect(({ base }) => ({ base }))
@Form.create()
@List.create()
export default class T1wuyexiaoquList extends Component {
  state = {
    scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
  };

  componentDidMount() {
		window.addEventListener('resize', this.resize);
		this.props.dispatch({
			type: 'base/save',
			payload: {
				shengCode: '',
				shiCode: ''
			}
		})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(200)
  resize() {
    this.setState({
      scrollY: document.body.clientHeight > 768 ? 430 + document.body.clientHeight - 768 : 430,
    });
  }

  handleSearch = e => {
    if(e) e.preventDefault();
    const { form, list } = this.props;
    const { setList } = list;
    form.validateFieldsAndScroll((err, values) => {
      let temp = {};
      if (!isEmpty(values.start_create_date))
				temp = {
				  ...temp,
				  start_create_date: values.start_create_date.format(DateFormat),
				};
			if (!isEmpty(values.end_create_date))
				temp = {
				  ...temp,
				  end_create_date: values.end_create_date.format(DateFormat),
				};
      setList({
        current: 1,
        queryMap: { ...values, ...temp },
      });
    });
  };


  handleFormReset = () => {
    const { form, list } = this.props;
    const { setList } = list;
    setList({
      current: 1,
      queryMap: {},
    });
    form.resetFields();
  };

  // 删除后调用list
  hanleDelete = info => {
    const { dispatch, list } = this.props;
    const { setList } = list;
    dispatch({
      type: 'base/delete',
      payload: {
        // 主键id
        id: info[rowKey],
      },
      url,
      callback: () => setList(),
    });
  };

  handleExport = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
    const date = {};
    if (values.startDate) date.startDate = values.startDate.format(DateFormat);
    if (values.endDate) date.endDate = values.endDate.format(DateFormat);
    dispatch({
        type: `list/exportExcel`,
        payload: {
        filename: '小区.xls',
        queryMap: { ...values, ...date } || {},
        },
        url,
        });
    });
  };

	changeSheng = (v, v2) => {
		if(v2 != undefined){
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shengCode: v2.key}
				}
			);
			this.props.form.setFields({
				shi: {value: ''}
			});
		}else{
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shengCode: ''}
				}
			);
			this.props.form.setFields({
				shi: {value: ''}
			});
		}
		let v3 = {};
		v3.key = '';
		this.changeShi(undefined, v3);
	}

	changeShi = (v, v2) => {
		if(v2 != undefined){
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shiCode: v2.key}
				}
			);
			this.props.form.setFields({
				qu: {value: ''}
			});
		}else{
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shiCode: ''}
				}
			);
			this.props.form.setFields({
				qu: {value: ''}
			});
		}
	}

	testSpringBoot = () => {
		this.props.dispatch({
			type: 'base/uploadImg',
			payload: {
				url: '/getCosAuth',
				signType: 'img',
				imgKey: '123'
			}
		})
	}

  render() {
    const { form, base } = this.props;
    const { getFieldDecorator } = form;
    const { hanleDelete } = this;
    const showConfirm = record => {
      Modal.confirm({
        title: '确定想要删除吗?',
        okType: 'danger',
        okText: '是',
        cancelText: '否',
        onOk() {
          hanleDelete(record);
        },
      });
    };

    const columns = [
      {
        title: '操作',
        key: 'action',
        width: 160,
        align: 'center',
        render: (text, record) => (
          <Row type="flex" justify="space-around">
            <Operate operateName="UPDATE">
              <Link
                to={{
                  pathname: `${routerUrl}/info`,
                  state: { id: record[rowKey] },
                }}
              >
                <Button type="primary" icon="edit" ghost size="small">
                  编辑
                </Button>
              </Link>
            </Operate>
            <Operate operateName="DELETE">
              <Button
                type="danger"
                icon="delete"
                ghost
                size="small"
                onClick={() => showConfirm(record)}
              >
                删除
              </Button>
            </Operate>
          </Row>
        ),
      },
      {  title: '小区ID',   dataIndex: 't_1wuyexiaoqu_id',     width: 150,     sorter: false,      },
			{  title: '物业id',   dataIndex: 'wyid',     width: 150,     sorter: false,      },
			{  title: '小区编号',   dataIndex: 'xqbh',     width: 150,     sorter: false,      },
			{  title: '小区名称',   dataIndex: 'xqmc',     width: 150,     sorter: false,      },
			{  title: '省',   dataIndex: 'sheng',     width: 150,     sorter: false,      },
			{  title: '市',   dataIndex: 'shi',     width: 150,     sorter: false,      },
			{  title: '区',   dataIndex: 'qu',     width: 150,     sorter: false,      },
			{  title: '详细地址',   dataIndex: 'dz',     width: 150,     sorter: false,      },
			{  title: '楼栋数',   dataIndex: 'lds',     width: 150,     sorter: false,      },
			{  title: '户型数',   dataIndex: 'hxs',     width: 150,     sorter: false,      },
			{  title: '固定车数量',   dataIndex: 'gdc',     width: 150,     sorter: false,      },
			{  title: '临时车数量',   dataIndex: 'lsc',     width: 150,     sorter: false,      },
			{  title: '路段',   dataIndex: 'ld',     width: 150,     sorter: false,      },
			{  title: '物业费价格',   dataIndex: 'wyf',     width: 150,     sorter: false,      },
			{  title: '水费价格',   dataIndex: 'sf',     width: 150,     sorter: false,      },
			{  title: '电费价格',   dataIndex: 'df',     width: 150,     sorter: false,      },
			{  title: '地库车价格',   dataIndex: 'dkc',     width: 150,     sorter: false,      },
			{  title: '地面车价格',   dataIndex: 'dmc',     width: 150,     sorter: false,      },
			{  title: '开发商',   dataIndex: 'kfs',     width: 150,     sorter: false,      },
			{  title: '小区图片',   dataIndex: 'piclink',     width: 150,     sorter: false,  render: (val, record, index) => (
				<img src={val} width={80} height={80} alt="暂无图片" />
					)    },
			{  title: '创建时间',   dataIndex: 'create_date',     width: 150,     sorter: false,      },
		];

    const listConfig = {
      url: '/api/T1wuyexiaoqu/queryT1wuyexiaoquList', // 必填,请求url
      scroll: { x: 2850, y: this.state.scrollY }, // 可选配置,同antd table
      rowKey, // 必填,行key
      columns, // 必填,行配置
    };

    return (
      <div className={styles.tableListForm}>
        <Card bordered={false} style={{ marginBottom: 24 }} hoverable>
				{/*<Button onClick={this.testSpringBoot}>测试springboot</Button>*/}
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col {...formItemGrid}>  <FormItem {...formItemLayout} label='小区ID'>{getFieldDecorator('t_1wuyexiaoqu_id',{initialValue: this.props.list.queryMap.t_1wuyexiaoqu_id, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业id(起始)'>{getFieldDecorator('start_wyid',{initialValue: this.props.list.queryMap.start_wyid  ? moment(this.props.list.queryMap.start_wyid): null, })
							 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业id(结束)'>{getFieldDecorator('end_wyid',{initialValue: this.props.list.queryMap.end_wyid  ? moment(this.props.list.queryMap.end_wyid): null, })
							 (<InputNumber  placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>
								<FormItem {...formItemLayout} label='省'>{getFieldDecorator('sheng',{initialValue: this.props.list.queryMap.sheng, })(<Select dropdownMatchSelectWidth={true} onChange={this.changeSheng} allowClear>
						 				{
										 shengShiQu['86'].map(v => (
											<Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
										 ))
										}
						 			</Select>)}
								</FormItem>
							</Col>
							<Col {...formItemGrid}>
								<FormItem {...formItemLayout} label='市'>{getFieldDecorator('shi',{initialValue: this.props.list.queryMap.shi, })(<Select dropdownMatchSelectWidth={true} onChange={this.changeShi} allowClear>
										{
											shengShiQu[this.props.base.shengCode] ? shengShiQu[this.props.base.shengCode].map(v => (
												<Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
											 )) : ''
										}
									</Select>)}
								</FormItem>
							</Col>
							<Col {...formItemGrid}>
								<FormItem {...formItemLayout} label='区'>{getFieldDecorator('qu',{initialValue: this.props.list.queryMap.qu, })(<Select dropdownMatchSelectWidth={true} allowClear>
										{
											shengShiQu[this.props.base.shiCode] ? shengShiQu[this.props.base.shiCode].map(v => (
												<Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
											 )) : ''
										}
									</Select>)}
								</FormItem>
							</Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='详细地址'>{getFieldDecorator('dz',{initialValue: this.props.list.queryMap.dz, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='小区编号'>{getFieldDecorator('xqbh',{initialValue: this.props.list.queryMap.xqbh, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='小区名称'>{getFieldDecorator('xqmc',{initialValue: this.props.list.queryMap.xqmc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='楼栋数'>{getFieldDecorator('lds',{initialValue: this.props.list.queryMap.lds, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='户型数'>{getFieldDecorator('hxs',{initialValue: this.props.list.queryMap.hxs, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='固定车数量'>{getFieldDecorator('gdc',{initialValue: this.props.list.queryMap.gdc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='临时车数量'>{getFieldDecorator('lsc',{initialValue: this.props.list.queryMap.lsc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='路段'>{getFieldDecorator('ld',{initialValue: this.props.list.queryMap.ld, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='物业费价格'>{getFieldDecorator('wyf',{initialValue: this.props.list.queryMap.wyf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='水费价格'>{getFieldDecorator('sf',{initialValue: this.props.list.queryMap.sf, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='电费价格'>{getFieldDecorator('df',{initialValue: this.props.list.queryMap.df, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地库车价格'>{getFieldDecorator('dkc',{initialValue: this.props.list.queryMap.dkc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='地面车价格'>{getFieldDecorator('dmc',{initialValue: this.props.list.queryMap.dmc, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='开发商'>{getFieldDecorator('dmc',{initialValue: this.props.list.queryMap.kfs, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='小区图片'>{getFieldDecorator('piclink',{initialValue: this.props.list.queryMap.piclink, })(<Input placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(起始)'>{getFieldDecorator('start_create_date',{initialValue: this.props.list.queryMap.start_create_date ? moment(this.props.list.queryMap.start_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
							<Col {...formItemGrid}>  <FormItem {...formItemLayout} label='创建时间(结束)'>{getFieldDecorator('end_create_date',{initialValue: this.props.list.queryMap.end_create_date? moment(this.props.list.queryMap.end_create_date) : null, })(<DatePicker format={DateFormat} placeholder='请输入' />)} </FormItem> </Col>
							<Col md={12} sm={24}>
                <span className={styles.submitButtons}>
                  <Button icon="search" type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <Operate operateName="NEW">
                    <Button
                      icon="plus"
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={() => this.props.dispatch(routerRedux.push(`${routerUrl}/info`))}
                    >
                      新建
                    </Button>
                  </Operate>
                  <Operate operateName="import">
            			  <Importer
            			  	style={{
            			  		marginLeft: 8,
            			  		color: '#fff',
            			  		backgroundColor: '#f0ad4e',
            			  		borderColor: '#eea236',
											}}
											uploadName={`${url}Impoter`}
											uploadUrl={url}
											reload={this.handleSearch}
											rowId="t1wuyexiaoquId"
            			  />
            			</Operate>
                  <Operate operateName="export">
              			<Button
              				icon="export"
              				type="primary"
              				style={{ marginLeft: 8 }}
              				loading={this.props.base.exporting}
              				onClick={this.handleExport}
              			>
              				导出
              			</Button>
              		</Operate>
                </span>
              </Col>
            </Row>
          </Form>
        </Card>
        <List {...listConfig} />
      </div>
    );
  }
}
