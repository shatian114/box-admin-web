import React from 'react';
import store from '../../index';

// @connect(({ base }) => ({ base }))
// export default class Tranfer extends React.PureComponent {
//   render() {
//     const { type, base, code, pat } = this.props;
//     return (
//       <React.Fragment>
//         {Array.isArray(base[type])
//           ? pat
//             ? `${base[type].find(item => item.dic_code === code).dic_name}(${code})`
//             : base[type].find(item => item.dic_code === code).dic_name
//           : code}
//       </React.Fragment>
//     );
//   }
// }

function TransferCode(type, code, pat) {
  let base = {};
  if (store) base = store.getState().base;
  if (type === 'supplylist') {
    return Array.isArray(base[type])
      ? pat
        ? `${base[type].find(item => item.supply_code === code).supply_name}(${
            base[type].find(item => item.supply_code === code).supply_sx
          })`
        : base[type].find(item => item.supply_code === code).supply_name
      : code;
  }
  return Array.isArray(base[type])
    ? pat
      ? `${base[type].find(item => item.dic_code === code).dic_name}(${code})`
      : base[type].find(item => item.dic_code === code).dic_name
    : code;
}

export default TransferCode;
