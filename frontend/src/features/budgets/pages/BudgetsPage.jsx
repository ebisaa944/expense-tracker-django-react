import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Spinner from '../../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../../lib/format';
import { useResource } from '../../../hooks/useResource';
import { budgetsService, categoriesService } from '../../../services/finance';

export default function BudgetsPage() {
  const budgets = useResource(budgetsService.list, []);
  const categories = useResource(categoriesService.list, []);
  const [deleteId, setDeleteId] = useState(null);
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await budgetsService.create({
      ...form,
      limit_amount: Number(form.limit_amount),
    });

    setForm({
      category: '',
      limit_amount: '',
      period: 'monthly',
      start_date: '',
      end_date: '',
    });
    await budgets.refresh();
  };

  const handleDelete = async () => {
    await budgetsService.remove(deleteId);
    setDeleteId(null);
    await budgets.refresh();
  };

  if (budgets.loading || categories.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Budgets"
        title="Set cleaner guardrails for spending"
        description="Define budget windows and category caps in a format that works better with dashboard alerts and review workflows."
        highlights={[
          {
            label: 'Active budgets',
            value: budgets.data.length,
            helpText: 'Budget rules currently stored in the system.',
          },
          {
            label: 'Tracked categories',
            value: expenseCategories.length,
            helpText: 'Expense categories available for budget assignments.',
          },
          {
            label: 'Typical cadence',
            value: 'Monthly',
            helpText: 'A strong default for household-style budgeting.',
          },
        ]}
        form={
          <ResourceFormCard
            title="Create a budget"
            helper="Use clear start and end dates so dashboard alerts stay accurate and timely."
            onSubmit={handleSubmit}
            submitLabel="Save Budget"
            fields={[
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                value: form.category,
                onChange: handleChange,
                required: true,
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
              },
              {
                name: 'end_date',
                label: 'End date',
                type: 'date',
                value: form.end_date,
                onChange: handleChange,
                required: true,
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
              render: (row) => <span className="font-semibold text-slate-950">{formatCurrency(row.limit_amount)}</span>,
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
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Button tone="secondary" onClick={() => setDeleteId(row.id)}>
                  Delete
                </Button>
              ),
            },
          ]}
          rows={budgets.data}
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
