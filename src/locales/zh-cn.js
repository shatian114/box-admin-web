import numeral from 'numeral';

numeral.register('locale', 'zh-cn', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: '千',
    million: '百万',
    billion: '十亿',
    trillion: '兆',
  },
  ordinal() {
    return '.';
  },
  currency: {
    symbol: '¥',
  },
});
