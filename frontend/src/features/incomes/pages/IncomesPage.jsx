import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Spinner from '../../../components/ui/Spinner';
import { formatCurrency, formatDate, getToday } from '../../../lib/format';
import { useResource } from '../../../hooks/useResource';
import { categoriesService, incomesService } from '../../../services/finance';

export default function IncomesPage() {
  const incomes = useResource(incomesService.list, []);
  const categories = useResource(categoriesService.list, []);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    source: '',
    date: getToday(),
  });

  const incomeCategories = categories.data.filter((category) => category.type === 'income');
  const totalIncome = incomes.data.reduce((total, item) => total + Number(item.amount), 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await incomesService.create({
      ...form,
      amount: Number(form.amount),
    });

    setForm({
      category: '',
      amount: '',
      source: '',
      date: getToday(),
    });
    await incomes.refresh();
  };

  const handleDelete = async () => {
    await incomesService.remove(deleteId);
    setDeleteId(null);
    await incomes.refresh();
  };

  if (incomes.loading || categories.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Income"
        title="Keep incoming cash flow organized"
        description="Record every income stream with the same clean structure so summaries and forecasts stay dependable."
        highlights={[
          {
            label: 'Entries',
            value: incomes.data.length,
            helpText: 'Recorded income transactions.',
          },
          {
            label: 'Total income',
            value: formatCurrency(totalIncome),
            helpText: 'Combined value of all income records.',
          },
          {
            label: 'Sources',
            value: incomeCategories.length,
            helpText: 'Available categories for salary, freelance work, and more.',
          },
        ]}
        form={
          <ResourceFormCard
            title="Add income"
            helper="Keep the source label short and recognizable so tables remain easy to scan."
            onSubmit={handleSubmit}
            submitLabel="Save Income"
            footer={
              incomeCategories.length === 0 ? (
                <p className="text-sm text-amber-700">
                  No income categories available yet. Open the Categories page to add or review them.
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
              },
              {
                name: 'source',
                label: 'Source',
                value: form.source,
                onChange: handleChange,
                placeholder: 'Salary, contract work, bonus...',
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
          emptyTitle="No incomes recorded"
          emptyDescription="Once income is added, this table will reflect it with cleaner spacing and a more professional presentation."
          columns={[
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'category_name', label: 'Category' },
            { key: 'source', label: 'Source', render: (row) => row.source || '--' },
            {
              key: 'amount',
              label: 'Amount',
              render: (row) => <span className="font-semibold text-emerald-600">{formatCurrency(row.amount)}</span>,
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
          rows={incomes.data}
        />
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
