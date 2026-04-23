import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Spinner from '../../../components/ui/Spinner';
import { formatCurrency, formatDate, getToday } from '../../../lib/format';
import { useResource } from '../../../hooks/useResource';
import { categoriesService, expensesService } from '../../../services/finance';

export default function ExpensesPage() {
  const expenses = useResource(expensesService.list, []);
  const categories = useResource(categoriesService.list, []);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    description: '',
    date: getToday(),
  });

  const expenseCategories = categories.data.filter((category) => category.type === 'expense');
  const totalExpenses = expenses.data.reduce((total, item) => total + Number(item.amount), 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await expensesService.create({
      ...form,
      amount: Number(form.amount),
    });

    setForm({
      category: '',
      amount: '',
      description: '',
      date: getToday(),
    });
    await expenses.refresh();
  };

  const handleDelete = async () => {
    await expensesService.remove(deleteId);
    setDeleteId(null);
    await expenses.refresh();
  };

  if (expenses.loading || categories.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Spending"
        title="Track expenses with more clarity"
        description="Capture daily spending in one clean workflow and keep every record consistent for reporting and budgeting."
        highlights={[
          {
            label: 'Entries',
            value: expenses.data.length,
            helpText: 'Recorded expense transactions.',
          },
          {
            label: 'Total spent',
            value: formatCurrency(totalExpenses),
            helpText: 'Combined value of all expense records.',
          },
          {
            label: 'Categories',
            value: expenseCategories.length,
            helpText: 'Available expense categories to classify spending.',
          },
        ]}
        form={
          <ResourceFormCard
            title="Add an expense"
            helper="Use a category and short description so reports stay readable later."
            onSubmit={handleSubmit}
            submitLabel="Save Expense"
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
                name: 'amount',
                label: 'Amount',
                type: 'number',
                step: '0.01',
                value: form.amount,
                onChange: handleChange,
                required: true,
              },
              {
                name: 'description',
                label: 'Description',
                value: form.description,
                onChange: handleChange,
                placeholder: 'Groceries, transport, subscriptions...',
              },
              {
                name: 'date',
                label: 'Date',
                type: 'date',
                value: form.date,
                onChange: handleChange,
                required: true,
              },
            ]}
          />
        }
      >
        <ResourceTable
          emptyTitle="No expenses recorded"
          emptyDescription="Once you add expenses, they’ll show up here with cleaner formatting and easier scanning."
          columns={[
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'category_name', label: 'Category' },
            { key: 'description', label: 'Description', render: (row) => row.description || '--' },
            {
              key: 'amount',
              label: 'Amount',
              render: (row) => <span className="font-semibold text-rose-600">{formatCurrency(row.amount)}</span>,
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
          rows={expenses.data}
        />
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
