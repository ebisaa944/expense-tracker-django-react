export function validateTransactionForm(form, labelKey) {
  const errors = {};

  if (!form.category) {
    errors.category = 'Choose a category.';
  }
  if (!form.amount || Number(form.amount) <= 0) {
    errors.amount = 'Enter an amount greater than zero.';
  }
  if (!form.date) {
    errors.date = 'Select a valid date.';
  }
  if (form.is_recurring && !form.recurrence_frequency) {
    errors.recurrence_frequency = 'Choose how often this repeats.';
  }
  if (labelKey && !form[labelKey]?.trim()) {
    errors[labelKey] = 'This field helps keep records readable.';
  }

  return errors;
}

export function validateBudgetForm(form) {
  const errors = {};

  if (!form.category) {
    errors.category = 'Choose a category.';
  }
  if (!form.limit_amount || Number(form.limit_amount) <= 0) {
    errors.limit_amount = 'Budget limit must be greater than zero.';
  }
  if (!form.start_date) {
    errors.start_date = 'Select the budget start date.';
  }
  if (!form.end_date) {
    errors.end_date = 'Select the budget end date.';
  }
  if (form.start_date && form.end_date && form.end_date < form.start_date) {
    errors.end_date = 'End date must be after the start date.';
  }

  return errors;
}

export function validateGoalForm(form) {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = 'Add a clear goal name.';
  }
  if (!form.target_amount || Number(form.target_amount) <= 0) {
    errors.target_amount = 'Target amount must be greater than zero.';
  }
  if (Number(form.current_amount || 0) < 0) {
    errors.current_amount = 'Current amount cannot be negative.';
  }
  if (!form.deadline) {
    errors.deadline = 'Select a deadline.';
  }

  return errors;
}
