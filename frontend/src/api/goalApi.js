import api from './axios';

export const getGoals = () => api.get('goals/');
export const addGoal = (data) => api.post('goals/', data);
export const deleteGoal = (id) => api.delete(`goals/${id}/`);