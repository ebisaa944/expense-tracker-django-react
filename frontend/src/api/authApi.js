import api from './axios';

export const loginUser = (credentials) => api.post('auth/token/', credentials);