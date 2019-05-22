/*
 * @Author: zouwendi 
 * @Date: 2019-03-12 09:49:55 
 * @Last Modified by: peng
 * @Last Modified time: 2019-03-12 09:49:55 
 * @Description: 省市区的联动
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Select } from 'antd';
import styles from './index.less';
import { formItemLayout, formItemGrid } from '../../utils/Constant';
import {shengShiQu} from '../../utils/shengShiQu';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ list }) => ({
  list,
}))

export default class ShengShiQu extends Component {

  changeSheng = (v, v2) => {
		if(v2 !== undefined){
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shengCode: v2.key},
				}
			);
			this.props.form.setFields({
				shi: {value: ''},
			});
		}else{
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shengCode: ''},
				}
			);
			this.props.form.setFields({
				shi: {value: ''},
			});
		}
		let v3 = {};
		v3.key = '';
		this.changeShi(undefined, v3);
	}

	changeShi = (v, v2) => {
		if(v2 !== undefined){
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shiCode: v2.key},
				}
			);
			this.props.form.setFields({
				qu: {value: ''},
			});
		}else{
			this.props.dispatch({
				type: 'base/save', 
				payload: 
					{shiCode: ''},
				}
			);
			this.props.form.setFields({
				qu: {value: ''},
			});
		}
	}

  render() {

    const { getFieldDecorator, base, form, gridType } = this.props;

    return (
      (gridType === 'list') ? (<span className={styles.submitButtons}>
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
    </span>) : (<span>
        <FormItem {...this.props.formItemLayoutInfo} hasFeedback label='省'>{getFieldDecorator('sheng',{initialValue: base.info.sheng || base.newInfo.sheng, rules: [
    {
      required: true,
      message: '省不能缺失!',
    },{ max: 255,message: '省必须小于255位!',   },
  ],})(<Select dropdownMatchSelectWidth={true} onChange={this.changeSheng} allowClear>
            {
             shengShiQu['86'].map(v => (
              <Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
             ))
            }
          </Select>)}
        </FormItem>
        <FormItem {...this.props.formItemLayoutInfo} hasFeedback label='市'>{getFieldDecorator('shi',{initialValue: base.info.shi || base.newInfo.shi, rules: [
    {
      required: true,
      message: '市不能缺失!',
    },{ max: 255,message: '市必须小于255位!',   },
  ],})(<Select dropdownMatchSelectWidth={true} onChange={this.changeShi} allowClear>
            {
              shengShiQu[this.props.base.shengCode] ? shengShiQu[this.props.base.shengCode].map(v => (
                <Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
               )) : ''
            }
          </Select>)}
        </FormItem>
        <FormItem {...this.props.formItemLayoutInfo} hasFeedback label='区'>{getFieldDecorator('qu',{initialValue: base.info.qu || base.newInfo.qu, rules: [
    {
      required: true,
      message: '区不能缺失!',
    },{ max: 255,message: '区必须小于255位!',   },
  ],})(<Select dropdownMatchSelectWidth={true} allowClear>
            {
              shengShiQu[this.props.base.shiCode] ? shengShiQu[this.props.base.shiCode].map(v => (
                <Option key={v.code} value={v.name} title={v.name}>{v.name}</Option>
               )) : ''
            }
          </Select>)}
        </FormItem>
    </span>)
    );
  }
}
