import { useState } from 'react';
import GoalCards from '../../../components/finance/GoalCards';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import Spinner from '../../../components/ui/Spinner';
import Modal from '../../../components/ui/Modal';
import { formatCurrency } from '../../../lib/format';
import { validateGoalForm } from '../../../lib/validation';
import { useResource } from '../../../hooks/useResource';
import { useNotifications } from '../../../context/useNotifications';
import { goalsService } from '../../../services/finance';

export default function GoalsPage() {
  const goals = useResource(goalsService.list, []);
  const { notify } = useNotifications();
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
  });

  const totalTarget = goals.data.reduce((total, item) => total + Number(item.target_amount), 0);
  const totalSaved = goals.data.reduce((total, item) => total + Number(item.current_amount), 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateGoalForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      notify({
        tone: 'warning',
        title: 'Goal details need attention',
        message: 'Check the name, target amount, and deadline before saving.',
      });
      return;
    }

    const payload = {
      ...form,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount),
    };

    if (editingId) {
      await goalsService.update(editingId, payload);
    } else {
      await goalsService.create(payload);
    }

    setForm({
      name: '',
      target_amount: '',
      current_amount: '0',
      deadline: '',
    });
    setEditingId(null);
    setErrors({});
    notify({ tone: 'success', title: editingId ? 'Goal updated' : 'Goal created', message: 'Savings progress is now part of your plan.' });
    await goals.refresh();
  };

  const handleDelete = async () => {
    await goalsService.remove(deleteId);
    setDeleteId(null);
    notify({ tone: 'success', title: 'Goal deleted', message: 'The selected goal was removed.' });
    await goals.refresh();
  };

  const startEdit = (goal) => {
    setEditingId(goal.id);
    setForm({
      name: goal.name,
      target_amount: String(goal.target_amount),
      current_amount: String(goal.current_amount),
      deadline: goal.deadline,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrors({});
    setForm({
      name: '',
      target_amount: '',
      current_amount: '0',
      deadline: '',
    });
  };

  if (goals.loading) {
    return <Spinner />;
  }

  return (
    <>
      <ResourcePage
        eyebrow="Goals"
        title="Turn savings targets into visible progress"
        description="Create savings milestones with deadlines so the dashboard reflects what you are working toward, not just what you spent."
        tone="var(--page-goals)"
        highlights={[
          {
            label: 'Goals',
            value: goals.data.length,
            helpText: 'Active savings targets in the workspace.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(219,234,254,0.86))',
          },
          {
            label: 'Target total',
            value: formatCurrency(totalTarget),
            helpText: 'Combined target amount across all goals.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,245,249,0.86))',
          },
          {
            label: 'Saved so far',
            value: formatCurrency(totalSaved),
            helpText: 'Total current amount already assigned to goals.',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(220,252,231,0.86))',
          },
        ]}
        form={
          <ResourceFormCard
            title={editingId ? 'Edit goal' : 'Create a goal'}
            helper="Goals work best when the target is specific and the deadline is realistic."
            onSubmit={handleSubmit}
            onCancel={editingId ? cancelEdit : undefined}
            submitLabel={editingId ? 'Update Goal' : 'Save Goal'}
            fields={[
              {
                name: 'name',
                label: 'Goal name',
                value: form.name,
                onChange: handleChange,
                required: true,
                placeholder: 'Emergency fund, travel, equipment...',
                error: errors.name,
              },
              {
                name: 'target_amount',
                label: 'Target amount',
                type: 'number',
                step: '0.01',
                value: form.target_amount,
                onChange: handleChange,
                required: true,
                error: errors.target_amount,
              },
              {
                name: 'current_amount',
                label: 'Current amount',
                type: 'number',
                step: '0.01',
                value: form.current_amount,
                onChange: handleChange,
                error: errors.current_amount,
              },
              {
                name: 'deadline',
                label: 'Deadline',
                type: 'date',
                value: form.deadline,
                onChange: handleChange,
                required: true,
                error: errors.deadline,
              },
            ]}
          />
        }
      >
        <GoalCards goals={goals.data} onDelete={setDeleteId} onEdit={startEdit} />
      </ResourcePage>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete goal"
        description="This action removes the selected savings goal and its dashboard progress card."
      />
    </>
  );
}
