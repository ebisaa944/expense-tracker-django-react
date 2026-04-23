import api from './axios';

export const getExpenses = () => api.get('expenses/');
export const addExpense = (data) => api.post('expenses/', data);
export const deleteExpense = (id) => api.delete(`expenses/${id}/`);