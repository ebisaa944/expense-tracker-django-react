import apiClient from './apiClient';

function resource(path) {
  return {
    list: () => apiClient.get(path),
    create: (payload) => apiClient.post(path, payload),
    remove: (id) => apiClient.delete(`${path}${id}/`),
  };
}

export const categoriesService = {
  list: () => apiClient.get('categories/'),
  create: (payload) => apiClient.post('categories/', payload),
  remove: (id) => apiClient.delete(`categories/${id}/`),
};

export const expensesService = resource('expenses/');
export const incomesService = resource('incomes/');
export const budgetsService = resource('budgets/');
export const goalsService = resource('goals/');
