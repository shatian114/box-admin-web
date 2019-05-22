export const FormValid = 
{
  search_zone: (rule, value, callback) => {
    const reg = /^\d{0,6}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('必须是0-6位数字');
    }
  },
  add_zone: (rule, value, callback) => {
    const reg = /^\d{6}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('必须是6位数字');
    }
  },
  mobilePhone: (rule, value, callback) => {
    const reg = /^\d{11}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('必须是合法手机号');
    }
  },
  telePhone: (rule, value, callback) => {
    const reg = /^\d{3,4}-\d{7,8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('必须是合法的座机号');
    }
  },
  onlyNumber: (rule, value, callback) => {
    const reg = /^\d*$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback('只能是数字');
    }
  },
  jine: (rule, value, callback) => {
    const reg = /^\d*\.{0,1}\d{0,2}$/;
    if (reg.test(value) || value === '' || value === null) {
      callback();
    } else {
      callback('必须是合法金额');
    }
  },
}

// export default FormValid;