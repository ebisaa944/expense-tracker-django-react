import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { categoriesService, expensesService, incomesService } from '../../services/finance';
import { useResource } from '../../hooks/useResource';
import { getToday } from '../../lib/format';
import { validateTransactionForm } from '../../lib/validation';
import { useNotifications } from '../../context/useNotifications';

const inputClassName =
  'w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

function initialForm() {
  return {
    category: '',
    amount: '',
    description: '',
    source: '',
    date: getToday(),
  };
}

export default function QuickEntryModal({ isOpen, onClose }) {
  const categories = useResource(categoriesService.list, []);
  const { notify } = useNotifications();
  const [kind, setKind] = useState('expense');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const availableCategories = useMemo(
    () => categories.data.filter((item) => item.type === kind),
    [categories.data, kind]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateTransactionForm(form, kind === 'expense' ? 'description' : 'source');
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      is_recurring: false,
      recurrence_frequency: '',
      ...(kind === 'expense' ? { description: form.description } : { source: form.source }),
    };

    if (kind === 'expense') {
      await expensesService.create(payload);
    } else {
      await incomesService.create(payload);
    }

    notify({
      tone: 'success',
      title: `${kind === 'expense' ? 'Expense' : 'Income'} saved`,
      message: 'Your quick entry was added successfully.',
    });
    setForm(initialForm());
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title="Quick entry"
      description="Capture a new income or expense from anywhere in the workspace."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmLabel={`Save ${kind === 'expense' ? 'expense' : 'income'}`}
      tone={kind === 'expense' ? 'danger' : 'success'}
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button tone={kind === 'expense' ? 'primary' : 'secondary'} className="flex-1" onClick={() => setKind('expense')}>
            Expense
          </Button>
          <Button tone={kind === 'income' ? 'primary' : 'secondary'} className="flex-1" onClick={() => setKind('income')}>
            Income
          </Button>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Category</span>
          <select className={inputClassName} name="category" value={form.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <p className="mt-2 text-xs text-rose-600">{errors.category}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Amount</span>
          <input className={inputClassName} name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} />
          {errors.amount ? <p className="mt-2 text-xs text-rose-600">{errors.amount}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">
            {kind === 'expense' ? 'Description' : 'Source'}
          </span>
          <input
            className={inputClassName}
            name={kind === 'expense' ? 'description' : 'source'}
            value={kind === 'expense' ? form.description : form.source}
            onChange={handleChange}
          />
          {errors[kind === 'expense' ? 'description' : 'source'] ? (
            <p className="mt-2 text-xs text-rose-600">{errors[kind === 'expense' ? 'description' : 'source']}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">Date</span>
          <input className={inputClassName} name="date" type="date" value={form.date} onChange={handleChange} />
        </label>
      </div>
    </Modal>
  );
}
