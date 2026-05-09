import apiClient from './apiClient';

export const exportExpensesCSV = () =>
  apiClient.get('reports/export/expenses/', { responseType: 'blob' });
