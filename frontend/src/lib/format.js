export function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
