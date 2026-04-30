export const currencyOptions = [
  { code: 'ETB', label: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR' },
  { code: 'GBP', label: 'British Pound', symbol: 'GBP' },
];

export function getPreferredCurrency() {
  try {
    const raw = localStorage.getItem('expense-tracker:settings');
    if (!raw) {
      return 'ETB';
    }

    return JSON.parse(raw).currency || 'ETB';
  } catch {
    return 'ETB';
  }
}

export function formatCurrency(value, currency = getPreferredCurrency()) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value) {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function clampPercentage(value) {
  return Math.max(0, Math.min(Number(value || 0), 100));
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function formatPercentage(value) {
  return `${Number(value || 0).toFixed(0)}%`;
}

export function getRelativeBudgetTone(percent) {
  if (percent >= 100) {
    return 'danger';
  }

  if (percent >= 80) {
    return 'warning';
  }

  return 'success';
}
