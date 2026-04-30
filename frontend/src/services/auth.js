import apiClient from './apiClient';

export function loginUser(credentials) {
  return apiClient.post('auth/token/', {
    email: credentials.email,
    password: credentials.password,
    remember_me: credentials.remember_me,
  });
}

export function signupUser(payload) {
  return apiClient.post('auth/signup/', payload);
}

export function getCurrentUser() {
  return apiClient.get('auth/me/');
}

export function getGoogleAuthConfig() {
  return apiClient.get('auth/google/config/');
}
