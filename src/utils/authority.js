// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('authority', authority);
}

export function getToken() {
  const token =
    localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;
  return token;
}

export function setToken(token) {
  return localStorage.setItem('token', token);
}
