import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import ResourceTable from '../../../components/finance/ResourceTable';
import Spinner from '../../../components/ui/Spinner';
import { useResource } from '../../../hooks/useResource';
import { categoriesService } from '../../../services/finance';

export default function CategoriesPage() {
  const categories = useResource(categoriesService.list, []);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: 'expense',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await categoriesService.create(form);
    setForm({
      name: '',
      type: 'expense',
    });
    await categories.refresh(false);
  };

  const handleDelete = async () => {
    await categoriesService.remove(deleteId);
    setDeleteId(null);
    await categories.refresh(false);
  };

  if (categories.loading) {
    return <Spinner />;
  }

  const incomeCount = categories.data.filter((category) => category.type === 'income').length;
  const expenseCount = categories.data.filter((category) => category.type === 'expense').length;

  return (
    <>
      <ResourcePage
        eyebrow="Categories"
        title="Manage the options used across your finance records"
        description="Expenses, incomes, and budgets rely on categories. You can now review, add, and remove them in one place."
        highlights={[
          {
            label: 'Total categories',
            value: categories.data.length,
            helpText: 'All category options available to the current user.',
          },
          {
            label: 'Expense types',
            value: expenseCount,
            helpText: 'Used by expenses and budgets.',
          },
          {
            label: 'Income types',
            value: incomeCount,
            helpText: 'Used by income records.',
          },
        ]}
        form={
          <ResourceFormCard
            title="Add a category"
            helper="Create categories here when you want more specific options in forms."
            onSubmit={handleSubmit}
            submitLabel="Save Category"
            fields={[
              {
                name: 'name',
                label: 'Category name',
                value: form.name,
                onChange: handleChange,
                required: true,
                placeholder: 'Groceries, Rent, Consulting...',
              },
              {
                name: 'type',
                label: 'Category type',
                type: 'select',
                value: form.type,
                onChange: handleChange,
                required: true,
                options: [
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' },
                ],
              },
            ]}
          />
        }
      >
        <ResourceTable
          emptyTitle="No categories found"
          emptyDescription="The app needs categories before you can create expenses, incomes, or budgets."
          columns={[
            { key: 'name', label: 'Name' },
            {
              key: 'type',
              label: 'Type',
              render: (row) => <span className="capitalize">{row.type}</span>,
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
          rows={categories.data}
        />
      </ResourcePage>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete category"
        description="Deleting a category may affect records that currently depend on it."
      />
    </>
  );
}
