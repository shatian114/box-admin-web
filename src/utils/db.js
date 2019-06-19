export default {
  currentUser: undefined,
  subwareCode: '',
  get(key) {
    if (localStorage.getItem(key + 'clz')) return JSON.parse(localStorage.getItem(key + 'clz'));
  },
  set(key, value) {
    localStorage.setItem(key + 'clz', JSON.stringify(value));
  },
  menusFlat: {},
  kv: {},
  oldhistory: undefined,
  history: undefined,
};
