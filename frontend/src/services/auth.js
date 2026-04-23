import apiClient from './apiClient';

export function loginUser(credentials) {
  return apiClient.post('auth/token/', credentials);
}
