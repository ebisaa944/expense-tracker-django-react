import apiClient from './apiClient';

function resource(path) {
  return {
    list: (params) => apiClient.get(path, { params }),
    create: (payload) => apiClient.post(path, payload),
    update: (id, payload) => apiClient.put(`${path}${id}/`, payload),
    remove: (id) => apiClient.delete(`${path}${id}/`),
  };
}

export const categoriesService = {
  list: (params) => apiClient.get('categories/', { params }),
  create: (payload) => apiClient.post('categories/', payload),
  update: (id, payload) => apiClient.put(`categories/${id}/`, payload),
  remove: (id) => apiClient.delete(`categories/${id}/`),
};

export const expensesService = resource('expenses/');
export const incomesService = resource('incomes/');
export const budgetsService = resource('budgets/');
export const goalsService = resource('goals/');

function nextDateFromFrequency(dateString, frequency) {
  const date = new Date(`${dateString}T00:00:00`);

  if (frequency === 'weekly') {
    date.setDate(date.getDate() + 7);
  } else if (frequency === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().split('T')[0];
}

export async function generateRecurringEntries({ entries, service, textKey }) {
  const today = new Date().toISOString().split('T')[0];
  let created = 0;

  for (const entry of entries.filter((item) => item.is_recurring && item.recurrence_frequency)) {
    let nextDate = nextDateFromFrequency(entry.date, entry.recurrence_frequency);

    while (nextDate <= today) {
      const exists = entries.some(
        (candidate) =>
          String(candidate.category) === String(entry.category) &&
          String(candidate.amount) === String(entry.amount) &&
          (candidate[textKey] || '') === (entry[textKey] || '') &&
          candidate.date === nextDate
      );

      if (!exists) {
        await service.create({
          category: entry.category,
          amount: Number(entry.amount),
          date: nextDate,
          is_recurring: true,
          recurrence_frequency: entry.recurrence_frequency,
          [textKey]: entry[textKey] || '',
        });
        created += 1;
      }

      nextDate = nextDateFromFrequency(nextDate, entry.recurrence_frequency);
    }
  }

  return created;
}
