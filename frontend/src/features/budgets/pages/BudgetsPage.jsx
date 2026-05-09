import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Spinner from '../../../components/ui/Spinner';
import { formatCurrency, formatDate, getRelativeBudgetTone } from '../../../lib/format';
import { validateBudgetForm } from '../../../lib/validation';
import { useResource } from '../../../hooks/useResource';
import { useNotifications } from '../../../context/useNotifications';
import { budgetsService, categoriesService, expensesService } from '../../../services/finance';

export default function BudgetsPage() {
  const budgets = useResource(budgetsService.list, []);
  const categories = useResource(categoriesService.list, []);
  const expenses = useResource(expensesService.list, []);
  const { notify } = useNotifications();
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    category: '',
    limit_amount: '',
    period: 'monthly',
    start_date: '',
    end_date: '',
  });

  const expenseCategories = categories.data.filter((category) => category.type === 'expense');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateBudgetForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      notify({
        tone: 'warning',
        title: 'Budget details need attention',
        message: 'Check the limit and date range fields before saving.',
      });
      return;
    }

    const payload = {
      ...form,
      limit_amount: Number(form.limit_amount),
    };

    if (editingId) {
      await budgetsService.update(editingId, payload);
    } else {
      await budgetsService.create(payload);
    }

    setForm({
      category: '',
      limit_amount: '',
      period: 'monthly',
      start_date: '',
      end_date: '',
    });
    setEditingId(null);
    setErrors({});
    notify({ tone: 'success', title: editingId ? 'Budget updated' : 'Budget created', message: 'Budget rules were saved successfully.' });
    await budgets.refresh();
  };

  const handleDelete = async () => {
    await budgetsService.remove(deleteId);
    setDeleteId(null);
    notify({ tone: 'success', title: 'Budget deleted', message: 'The selected budget rule was removed.' });
    await budgets.refresh();
  };

  const startEdit = (budget) => {
    setEditingId(budget.id);
    setForm({
      category: String(budget.category),
      limit_amount: String(budget.limit_amount),
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm({
      category: '',
      limit_amount: '',
      period: 'monthly',
      start_date: '',
      end_date: '',
    });
  };

  const enrichedBudgets = useMemo(
    () =>
      budgets.data.map((budget) => {
        const spent = expenses.data
          .filter(
            (expense) =>
              String(expense.category) === String(budget.category) &&
              expense.date >= budget.start_date &&
              expense.date <= budget.end_date
          )
          .reduce((sum, expense) => sum + Number(expense.amount), 0);

        const percent = budget.limit_amount ? (spent / Number(budget.limit_amount)) * 100 : 0;

        return {
          ...budget,
          spent,
          percent,
          tone: getRelativeBudgetTone(percent),
          remaining: Math.max(Number(budget.limit_amount) - spent, 0),
        };
      }),
    [budgets.data, expenses.data]
  );

  if (budgets.loading || categories.loading || expenses.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Budgets"
        title="Set smarter guardrails for spending"
        description="See limit progress clearly, catch 80% warning zones early, and review overspending before it spreads across the month."
        tone="var(--page-budgets)"
        highlights={[
          {
            label: 'Active budgets',
            value: budgets.data.length,
            helpText: 'Budget rules currently stored in the system.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,249,195,0.88))',
          },
          {
            label: 'Tracked categories',
            value: expenseCategories.length,
            helpText: 'Expense categories available for budget assignments.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))',
          },
          {
            label: 'Warning zones',
            value: enrichedBudgets.filter((budget) => budget.percent >= 80).length,
            helpText: 'Budgets already near or above their limit.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,226,226,0.82))',
          },
        ]}
        form={
          <ResourceFormCard
            title={editingId ? 'Edit budget' : 'Create a budget'}
            helper="Use clear start and end dates so dashboard alerts stay accurate and timely."
            onSubmit={handleSubmit}
            onCancel={editingId ? cancelEdit : undefined}
            submitLabel={editingId ? 'Update Budget' : 'Save Budget'}
            footer={
              expenseCategories.length === 0 ? (
                <p className="text-sm text-amber-700">
                  Budgets need expense categories. Open the Categories page to add or review them.
                </p>
              ) : null
            }
            fields={[
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                value: form.category,
                onChange: handleChange,
                required: true,
                error: errors.category,
                options: expenseCategories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              },
              {
                name: 'limit_amount',
                label: 'Limit amount',
                type: 'number',
                step: '0.01',
                value: form.limit_amount,
                onChange: handleChange,
                required: true,
                error: errors.limit_amount,
              },
              {
                name: 'period',
                label: 'Period',
                type: 'select',
                value: form.period,
                onChange: handleChange,
                required: true,
                placeholder: 'Select a period',
                options: [
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                  { label: 'Yearly', value: 'yearly' },
                ],
              },
              {
                name: 'start_date',
                label: 'Start date',
                type: 'date',
                value: form.start_date,
                onChange: handleChange,
                required: true,
                error: errors.start_date,
              },
              {
                name: 'end_date',
                label: 'End date',
                type: 'date',
                value: form.end_date,
                onChange: handleChange,
                required: true,
                error: errors.end_date,
              },
            ]}
          />
        }
      >
        <ResourceTable
          emptyTitle="No budgets created"
          emptyDescription="Create a budget to start seeing overspend alerts and cleaner spending controls."
          columns={[
            { key: 'category_name', label: 'Category' },
            {
              key: 'limit_amount',
              label: 'Limit',
              render: (row) => (
                <div>
                  <p className="font-semibold text-[var(--text-main)]">{formatCurrency(row.limit_amount)}</p>
                  <p className="text-xs text-[var(--text-muted)]">Spent {formatCurrency(row.spent)}</p>
                </div>
              ),
            },
            {
              key: 'period',
              label: 'Period',
              render: (row) => <span className="capitalize">{row.period}</span>,
            },
            {
              key: 'window',
              label: 'Date range',
              render: (row) => `${formatDate(row.start_date)} - ${formatDate(row.end_date)}`,
            },
            {
              key: 'progress',
              label: 'Progress',
              render: (row) => (
                <div className="min-w-[180px]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{Math.round(row.percent)}% used</span>
                    <span>{formatCurrency(row.remaining)} left</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${row.tone === 'danger' ? 'bg-rose-500' : row.tone === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(row.percent, 100)}%` }}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Button tone="secondary" onClick={() => startEdit(row)}>
                    Edit
                  </Button>
                  <Button tone="secondary" onClick={() => setDeleteId(row.id)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          rows={enrichedBudgets}
        />
      </ResourcePage>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete budget"
        description="This action removes the selected budget and its related alert coverage."
      />
    </>
  );
}
