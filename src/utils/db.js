export default {
  currentUser: undefined,
  subwareCode: '',
  get(key) {
    if (localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key));
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  menusFlat: {},
  kv: {},
  oldhistory: undefined,
  history: undefined,
};
