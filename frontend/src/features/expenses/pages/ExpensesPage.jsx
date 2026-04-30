import { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import Icon from '../../../components/ui/Icon';
import { formatCurrency, formatDate, getToday } from '../../../lib/format';
import { useResource } from '../../../hooks/useResource';
import { downloadCsv } from '../../../lib/export';
import { validateTransactionForm } from '../../../lib/validation';
import { useNotifications } from '../../../context/useNotifications';
import { categoriesService, expensesService, generateRecurringEntries } from '../../../services/finance';

const initialFilters = {
  q: '',
  category: '',
  date_from: '',
  date_to: '',
  min_amount: '',
  max_amount: '',
  recurring: '',
};

function createForm(lastCategory = '') {
  return {
    category: lastCategory,
    amount: '',
    description: '',
    date: getToday(),
    is_recurring: false,
    recurrence_frequency: '',
  };
}

function ExpenseCards({ rows, onDelete, onEdit }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="expense"
        title="No expenses recorded"
        description="Quick-add your first expense to start building a cleaner spending history."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <Card key={row.id} className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">{row.category_name}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{row.description || 'Expense entry'}</h3>
            </div>
            <span className="text-lg font-bold text-rose-600">{formatCurrency(row.amount)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{formatDate(row.date)}</span>
            {row.is_recurring ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                {row.recurrence_frequency}
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button tone="secondary" className="flex-1" onClick={() => onEdit(row)}>
              Edit
            </Button>
            <Button tone="secondary" className="flex-1" onClick={() => onDelete(row.id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function ExpensesPage() {
  const categories = useResource(categoriesService.list, []);
  const { notify } = useNotifications();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState(initialFilters);
  const [errors, setErrors] = useState({});
  const [lastCategory, setLastCategory] = useState(localStorage.getItem('expense:lastCategory') || '');
  const [form, setForm] = useState(() => createForm(localStorage.getItem('expense:lastCategory') || ''));

  const expenseCategories = categories.data.filter((category) => category.type === 'expense');
  const totalExpenses = expenses.reduce((total, item) => total + Number(item.amount), 0);

  const loadExpenses = async (activeFilters = filters, showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await expensesService.list(activeFilters);
      setExpenses(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filteredInsights = useMemo(
    () => [
      {
        label: 'Entries',
        value: expenses.length,
        helpText: 'Filtered expense transactions in view.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(238,242,255,0.88))',
      },
      {
        label: 'Total spent',
        value: formatCurrency(totalExpenses),
        helpText: 'Combined value of the current filtered result set.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,226,226,0.82))',
      },
      {
        label: 'Recurring plans',
        value: expenses.filter((item) => item.is_recurring).length,
        helpText: 'Saved recurring expense templates in your ledger.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,249,195,0.86))',
      },
    ],
    [expenses, totalExpenses]
  );

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: type === 'checkbox' ? checked : value };
      if (name === 'is_recurring' && !checked) {
        next.recurrence_frequency = '';
      }
      return next;
    });
    setErrors((current) => ({ ...current, [event.target.name]: '' }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setErrors({});
    setForm(createForm(lastCategory));
  };

  const saveExpense = async (mode = 'default') => {
    const validationErrors = validateTransactionForm(form, 'description');
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      notify({
        tone: 'warning',
        title: 'Complete the required fields',
        message: 'Add a category, amount, date, and short description to continue.',
      });
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      recurrence_frequency: form.is_recurring ? form.recurrence_frequency : '',
    };

    if (editingId) {
      await expensesService.update(editingId, payload);
      notify({ tone: 'success', title: 'Expense updated', message: 'The transaction details were saved.' });
    } else {
      await expensesService.create(payload);
      notify({ tone: 'success', title: 'Expense added', message: 'Your transaction is now in the ledger.' });
    }

    localStorage.setItem('expense:lastCategory', payload.category);
    setLastCategory(payload.category);
    setEditingId(null);
    setErrors({});
    setForm(mode === 'continue' ? createForm(payload.category) : createForm(payload.category));
    await loadExpenses(filters, false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveExpense();
  };

  const handleQuickAdd = async () => {
    await saveExpense('continue');
  };

  const handleDelete = async () => {
    await expensesService.remove(deleteId);
    setDeleteId(null);
    notify({ tone: 'success', title: 'Expense deleted', message: 'The selected transaction was removed.' });
    await loadExpenses(filters, false);
  };

  const handleGenerateRecurring = async () => {
    const created = await generateRecurringEntries({
      entries: expenses,
      service: expensesService,
      textKey: 'description',
    });

    notify({
      tone: created > 0 ? 'success' : 'info',
      title: created > 0 ? 'Recurring expenses generated' : 'No recurring expenses due',
      message: created > 0 ? `${created} due expense entries were added automatically.` : 'Your recurring expense list is already up to date.',
    });
    await loadExpenses(filters, false);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setErrors({});
    setForm({
      category: String(row.category),
      amount: String(row.amount),
      description: row.description || '',
      date: row.date,
      is_recurring: Boolean(row.is_recurring),
      recurrence_frequency: row.recurrence_frequency || '',
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const exportRows = () => {
    downloadCsv(
      'expenses.csv',
      [
        { label: 'Date', value: (row) => row.date },
        { label: 'Category', value: (row) => row.category_name },
        { label: 'Description', value: (row) => row.description },
        { label: 'Amount', value: (row) => row.amount },
        { label: 'Recurring', value: (row) => (row.is_recurring ? row.recurrence_frequency || 'Yes' : 'No') },
      ],
      expenses
    );
  };

  if (loading || categories.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Spending"
        title="Track expenses with confidence"
        description="Fast-add transactions, reuse common categories, review recurring charges, and switch between table and card views depending on the task."
        tone="var(--page-expenses)"
        highlights={filteredInsights}
        action={
          <>
            <Button tone="secondary" icon={viewMode === 'table' ? 'grid' : 'list'} onClick={() => setViewMode((current) => (current === 'table' ? 'cards' : 'table'))}>
              {viewMode === 'table' ? 'Card view' : 'Table view'}
            </Button>
            <Button tone="warning" icon="plus" onClick={handleGenerateRecurring}>
              Generate due recurring
            </Button>
          </>
        }
        form={
          <ResourceFormCard
            title={editingId ? 'Edit expense' : 'Fast-add expense'}
            helper="Minimal clicks, clear labels, and recurring support make daily entry feel much faster."
            onSubmit={handleSubmit}
            onCancel={editingId ? resetForm : undefined}
            onSecondarySubmit={!editingId ? handleQuickAdd : undefined}
            secondarySubmitLabel="Save and add another"
            submitLabel={editingId ? 'Update expense' : 'Save expense'}
            footer={
              <div className="space-y-3">
                {lastCategory ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-700 transition hover:text-indigo-800"
                    onClick={() => setForm((current) => ({ ...current, category: lastCategory || current.category }))}
                  >
                    Use last category again
                  </button>
                ) : null}
                {expenseCategories.length === 0 ? (
                  <p className="text-sm text-amber-700">
                    No expense categories available yet. Open the Categories page to add or review them.
                  </p>
                ) : null}
              </div>
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
                name: 'amount',
                label: 'Amount',
                type: 'number',
                step: '0.01',
                value: form.amount,
                onChange: handleChange,
                required: true,
                error: errors.amount,
              },
              {
                name: 'description',
                label: 'Description',
                value: form.description,
                onChange: handleChange,
                placeholder: 'Groceries, transport, subscriptions...',
                error: errors.description,
              },
              {
                name: 'date',
                label: 'Date',
                type: 'date',
                value: form.date,
                onChange: handleChange,
                required: true,
                error: errors.date,
              },
              {
                name: 'is_recurring',
                label: 'Recurring expense',
                type: 'checkbox',
                checked: form.is_recurring,
                onChange: handleChange,
                description: 'Useful for rent, subscriptions, school fees, and other repeated payments.',
              },
              ...(form.is_recurring
                ? [
                    {
                      name: 'recurrence_frequency',
                      label: 'Repeat every',
                      type: 'select',
                      value: form.recurrence_frequency,
                      onChange: handleChange,
                      required: true,
                      error: errors.recurrence_frequency,
                      options: [
                        { label: 'Weekly', value: 'weekly' },
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Yearly', value: 'yearly' },
                      ],
                    },
                  ]
                : []),
            ]}
          />
        }
      >
        <ResourceTable
          emptyTitle="No expenses recorded"
          emptyDescription="Once you add expenses, they’ll show up here with cleaner filtering, exports, and smarter recurring support."
          toolbar={
            <Card className="rounded-[20px] border border-slate-100 bg-slate-50 p-4 shadow-none">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative">
                  <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm"
                    name="q"
                    onChange={handleFilterChange}
                    placeholder="Search description or category"
                    value={filters.q}
                  />
                </div>
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="category"
                  onChange={handleFilterChange}
                  value={filters.category}
                >
                  <option value="">All categories</option>
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="date_from"
                  onChange={handleFilterChange}
                  type="date"
                  value={filters.date_from}
                />
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="date_to"
                  onChange={handleFilterChange}
                  type="date"
                  value={filters.date_to}
                />
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="min_amount"
                  onChange={handleFilterChange}
                  placeholder="Min amount"
                  step="0.01"
                  type="number"
                  value={filters.min_amount}
                />
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="max_amount"
                  onChange={handleFilterChange}
                  placeholder="Max amount"
                  step="0.01"
                  type="number"
                  value={filters.max_amount}
                />
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  name="recurring"
                  onChange={handleFilterChange}
                  value={filters.recurring}
                >
                  <option value="">All entries</option>
                  <option value="true">Recurring only</option>
                  <option value="false">One-time only</option>
                </select>
                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1" icon="download" onClick={exportRows} tone="secondary">
                    Export CSV
                  </Button>
                  <Button className="flex-1" icon="filter" onClick={clearFilters} tone="secondary">
                    Clear filters
                  </Button>
                </div>
              </div>
            </Card>
          }
          columns={[
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'category_name', label: 'Category' },
            { key: 'description', label: 'Description', render: (row) => row.description || '--' },
            {
              key: 'recurring',
              label: 'Recurring',
              render: (row) =>
                row.is_recurring ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                    {row.recurrence_frequency}
                  </span>
                ) : (
                  '--'
                ),
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (row) => <span className="font-semibold text-rose-600">{formatCurrency(row.amount)}</span>,
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
          rows={viewMode === 'table' ? expenses : []}
        />
        {viewMode === 'cards' ? <ExpenseCards rows={expenses} onDelete={setDeleteId} onEdit={startEdit} /> : null}
      </ResourcePage>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete expense"
        description="This action removes the selected expense from your records."
      />
    </>
  );
}
