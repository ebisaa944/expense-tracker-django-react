import apiClient from './apiClient';

export function fetchSettings() {
  return apiClient.get('settings/');
}

export function updateSettings(payload) {
  return apiClient.put('settings/', payload);
}
