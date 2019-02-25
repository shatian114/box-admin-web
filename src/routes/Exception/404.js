import React from 'react';
import { Link } from 'dva/router';
import Exception from 'components/Exception';

export default () => (
  <Exception
    style={{ minHeight: 500, height: '80%' }}
    title="正在开发中"
    linkElement={Link}
    desc="工程师正在开发"
  />
);
