import api from './axios';

export const getIncomes = () => api.get('incomes/');
export const addIncome = (data) => api.post('incomes/', data);
export const deleteIncome = (id) => api.delete(`incomes/${id}/`);