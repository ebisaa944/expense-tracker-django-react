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
import { categoriesService, generateRecurringEntries, incomesService } from '../../../services/finance';

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
    source: '',
    date: getToday(),
    is_recurring: false,
    recurrence_frequency: '',
  };
}

function IncomeCards({ rows, onDelete, onEdit }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="income"
        title="No incomes recorded"
        description="Add a recurring salary, bonus, or contract payment to start seeing cleaner cash flow patterns."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <Card key={row.id} className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--success-500)]">{row.category_name}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--text-main)]">{row.source || 'Income entry'}</h3>
            </div>
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(row.amount)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>{formatDate(row.date)}</span>
            {row.is_recurring ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
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

export default function IncomesPage() {
  const categories = useResource(categoriesService.list, []);
  const { notify } = useNotifications();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState(initialFilters);
  const [errors, setErrors] = useState({});
  const [lastCategory, setLastCategory] = useState(localStorage.getItem('income:lastCategory') || '');
  const [form, setForm] = useState(() => createForm(localStorage.getItem('income:lastCategory') || ''));

  const incomeCategories = categories.data.filter((category) => category.type === 'income');
  const totalIncome = incomes.reduce((total, item) => total + Number(item.amount), 0);

  const loadIncomes = async (activeFilters = filters, showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await incomesService.list(activeFilters);
      setIncomes(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const highlights = useMemo(
    () => [
      {
        label: 'Entries',
        value: incomes.length,
        helpText: 'Filtered income transactions in view.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(224,231,255,0.88))',
      },
      {
        label: 'Total income',
        value: formatCurrency(totalIncome),
        helpText: 'Combined value of the current filtered result set.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(220,252,231,0.84))',
      },
      {
        label: 'Recurring paydays',
        value: incomes.filter((item) => item.is_recurring).length,
        helpText: 'Saved recurring income templates in your ledger.',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(219,234,254,0.82))',
      },
    ],
    [incomes, totalIncome]
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

  const saveIncome = async () => {
    const validationErrors = validateTransactionForm(form, 'source');
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      notify({
        tone: 'warning',
        title: 'Complete the required fields',
        message: 'Add a category, amount, date, and clear income source to continue.',
      });
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      recurrence_frequency: form.is_recurring ? form.recurrence_frequency : '',
    };

    if (editingId) {
      await incomesService.update(editingId, payload);
      notify({ tone: 'success', title: 'Income updated', message: 'The transaction details were saved.' });
    } else {
      await incomesService.create(payload);
      notify({ tone: 'success', title: 'Income added', message: 'Your transaction is now in the ledger.' });
    }

    localStorage.setItem('income:lastCategory', payload.category);
    setLastCategory(payload.category);
    setEditingId(null);
    setErrors({});
    setForm(createForm(payload.category));
    await loadIncomes(filters, false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveIncome();
  };

  const handleQuickAdd = async () => {
    await saveIncome();
  };

  const handleDelete = async () => {
    await incomesService.remove(deleteId);
    setDeleteId(null);
    notify({ tone: 'success', title: 'Income deleted', message: 'The selected transaction was removed.' });
    await loadIncomes(filters, false);
  };

  const handleGenerateRecurring = async () => {
    const created = await generateRecurringEntries({
      entries: incomes,
      service: incomesService,
      textKey: 'source',
    });

    notify({
      tone: created > 0 ? 'success' : 'info',
      title: created > 0 ? 'Recurring incomes generated' : 'No recurring incomes due',
      message: created > 0 ? `${created} due income entries were added automatically.` : 'Your recurring income list is already up to date.',
    });
    await loadIncomes(filters, false);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setErrors({});
    setForm({
      category: String(row.category),
      amount: String(row.amount),
      source: row.source || '',
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
      'incomes.csv',
      [
        { label: 'Date', value: (row) => row.date },
        { label: 'Category', value: (row) => row.category_name },
        { label: 'Source', value: (row) => row.source },
        { label: 'Amount', value: (row) => row.amount },
        { label: 'Recurring', value: (row) => (row.is_recurring ? row.recurrence_frequency || 'Yes' : 'No') },
      ],
      incomes
    );
  };

  if (loading || categories.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Income"
        title="Keep incoming cash flow organized"
        description="Track salary, freelance work, bonuses, and recurring payouts with a cleaner, faster finance workflow."
        tone="var(--page-incomes)"
        highlights={highlights}
        action={
          <>
            <Button tone="secondary" icon={viewMode === 'table' ? 'grid' : 'list'} onClick={() => setViewMode((current) => (current === 'table' ? 'cards' : 'table'))}>
              {viewMode === 'table' ? 'Card view' : 'Table view'}
            </Button>
            <Button tone="success" icon="plus" onClick={handleGenerateRecurring}>
              Generate due recurring
            </Button>
          </>
        }
        form={
          <ResourceFormCard
            title={editingId ? 'Edit income' : 'Fast-add income'}
            helper="Keep inflows clean and recognizable so trends, forecasts, and exports stay readable later."
            onSubmit={handleSubmit}
            onCancel={editingId ? resetForm : undefined}
            onSecondarySubmit={!editingId ? handleQuickAdd : undefined}
            secondarySubmitLabel="Save and add another"
            submitLabel={editingId ? 'Update income' : 'Save income'}
            footer={
              <div className="space-y-3">
                {lastCategory ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--primary-600)] transition hover:text-indigo-800"
                    onClick={() => setForm((current) => ({ ...current, category: lastCategory || current.category }))}
                  >
                    Use last category again
                  </button>
                ) : null}
                {incomeCategories.length === 0 ? (
                  <p className="text-sm text-amber-700">
                    No income categories available yet. Open the Categories page to add or review them.
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
                options: incomeCategories.map((category) => ({
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
                name: 'source',
                label: 'Source',
                value: form.source,
                onChange: handleChange,
                placeholder: 'Salary, contract work, bonus...',
                error: errors.source,
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
                label: 'Recurring income',
                type: 'checkbox',
                checked: form.is_recurring,
                onChange: handleChange,
                description: 'Useful for salaries, stipends, weekly payouts, and similar repeated inflows.',
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
          emptyTitle="No incomes recorded"
          emptyDescription="Once income is added, this page becomes your cleaner review space for cash coming in."
          toolbar={
            <Card className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-none">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative">
                  <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-11 py-3 text-sm"
                    name="q"
                    onChange={handleFilterChange}
                    placeholder="Search source or category"
                    value={filters.q}
                  />
                </div>
                <select
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                  name="category"
                  onChange={handleFilterChange}
                  value={filters.category}
                >
                  <option value="">All categories</option>
                  {incomeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                  name="date_from"
                  onChange={handleFilterChange}
                  type="date"
                  value={filters.date_from}
                />
                <input
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                  name="date_to"
                  onChange={handleFilterChange}
                  type="date"
                  value={filters.date_to}
                />
                <input
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                  name="min_amount"
                  onChange={handleFilterChange}
                  placeholder="Min amount"
                  step="0.01"
                  type="number"
                  value={filters.min_amount}
                />
                <input
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
                  name="max_amount"
                  onChange={handleFilterChange}
                  placeholder="Max amount"
                  step="0.01"
                  type="number"
                  value={filters.max_amount}
                />
                <select
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm"
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
            { key: 'source', label: 'Source', render: (row) => row.source || '--' },
            {
              key: 'recurring',
              label: 'Recurring',
              render: (row) =>
                row.is_recurring ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    {row.recurrence_frequency}
                  </span>
                ) : (
                  '--'
                ),
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (row) => <span className="font-semibold text-emerald-600">{formatCurrency(row.amount)}</span>,
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
          rows={viewMode === 'table' ? incomes : []}
        />
        {viewMode === 'cards' ? <IncomeCards rows={incomes} onDelete={setDeleteId} onEdit={startEdit} /> : null}
      </ResourcePage>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete income"
        description="This action removes the selected income entry from your records."
      />
    </>
  );
}
