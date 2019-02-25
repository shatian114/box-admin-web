import React from 'react';
import { Card, Row, Col, Badge } from 'antd';
import { connect } from 'dva';

import numeral from 'numeral';
import Operate from '../../components/Oprs';
import styles from './UserInfo.less';
import Barcode from '../../components/Barcode';

const isactive = [<Badge status="error" text="异常" />, <Badge status="success" text="正常" />];

@Operate.create('/userInfo')
@connect(({ user, loading }) => ({ user, loading: loading.effects['user/info'] }))
export default class UserInfo extends React.PureComponent {
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'user/info',
    });*/
  }

  render() {
    const { user: { userInfo, userAccount }, loading } = this.props;

    const Info = () => {
      switch (userInfo.userType) {
        case 'farmer':
          return null;
        case 'market':
          return (
            <React.Fragment>
              <Row gutter={18}>
                <Col md={12} className={styles.label}>
                  超市名称:
                </Col>
                <Col md={12}>{userInfo.marketName}</Col>
              </Row>
            </React.Fragment>
          );
        case 'vehicle':
          return (
            <React.Fragment>
              <Row gutter={18}>
                <Col md={12} className={styles.label}>
                  车牌号:
                </Col>
                <Col md={12}>{userInfo.vehicleNumber}</Col>
              </Row>
            </React.Fragment>
          );
        default:
          return null;
      }
    };
    return (
      <Card loading={loading}>
        <Row type="flex" justify="center" gutter={18}>
          {/* <Barcode code={userAccount.accountCode} /> */}
          <Barcode code={userInfo.userAccount} />
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            姓名:
          </Col>
          <Col md={12}>{userInfo.realname}</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            电话号码:
          </Col>
          <Col md={12}>{userInfo.phone}</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            地址:
          </Col>
          <Col md={12}>{userInfo.address}</Col>
        </Row>
        <Info />
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            余额:
          </Col>
          <Col md={12}>{numeral(userAccount.nowMoney).format('$ 0,0.00')}</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            押金:
          </Col>
          <Col md={12}>{numeral(userAccount.payMoney).format('$ 0,0.00')}</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            实际领用箱数:
          </Col>
          <Col md={12}>{userAccount.boxCount}个</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            允许领用箱数:
          </Col>
          <Col md={12}>{userAccount.allowCount}个</Col>
        </Row>
        <Row gutter={18}>
          <Col md={12} className={styles.label}>
            账户状态:
          </Col>
          <Col md={12}>{isactive[userAccount.isactive]}</Col>
        </Row>
      </Card>
    );
  }
}
