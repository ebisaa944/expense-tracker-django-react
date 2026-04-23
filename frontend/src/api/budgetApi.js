import api from './axios';

export const getBudgets = () => api.get('budgets/');
export const addBudget = (data) => api.post('budgets/', data);
export const deleteBudget = (id) => api.delete(`budgets/${id}/`);