const STORAGE_MODE_KEY = 'expense-tracker:storage-mode';
const USER_KEY = 'expense-tracker:user';

function getStorage(mode) {
  return mode === 'local' ? window.localStorage : window.sessionStorage;
}

export function getStorageMode() {
  return window.localStorage.getItem(STORAGE_MODE_KEY) || 'session';
}

export function storeSession({ access, refresh, remember }) {
  const mode = remember ? 'local' : 'session';
  const targetStorage = getStorage(mode);
  const otherStorage = getStorage(mode === 'local' ? 'session' : 'local');

  otherStorage.removeItem('accessToken');
  otherStorage.removeItem('refreshToken');
  window.localStorage.setItem(STORAGE_MODE_KEY, mode);
  targetStorage.setItem('accessToken', access);
  targetStorage.setItem('refreshToken', refresh);
}

export function getAccessToken() {
  return getStorage(getStorageMode()).getItem('accessToken');
}

export function getRefreshToken() {
  return getStorage(getStorageMode()).getItem('refreshToken');
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_MODE_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.sessionStorage.removeItem('accessToken');
  window.sessionStorage.removeItem('refreshToken');
}

export function storeUser(user) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_KEY);
}
