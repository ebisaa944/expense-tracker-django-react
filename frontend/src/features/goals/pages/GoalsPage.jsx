import { useState } from 'react';
import GoalCards from '../../../components/finance/GoalCards';
import ResourceFormCard from '../../../components/finance/ResourceFormCard';
import ResourcePage from '../../../components/finance/ResourcePage';
import Spinner from '../../../components/ui/Spinner';
import Modal from '../../../components/ui/Modal';
import { formatCurrency } from '../../../lib/format';
import { useResource } from '../../../hooks/useResource';
import { goalsService } from '../../../services/finance';

export default function GoalsPage() {
  const goals = useResource(goalsService.list, []);
  const [deleteId, setDeleteId] = useState(null);
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await goalsService.create({
      ...form,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount),
    });

    setForm({
      name: '',
      target_amount: '',
      current_amount: '0',
      deadline: '',
    });
    await goals.refresh();
  };

  const handleDelete = async () => {
    await goalsService.remove(deleteId);
    setDeleteId(null);
    await goals.refresh();
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
        highlights={[
          {
            label: 'Goals',
            value: goals.data.length,
            helpText: 'Active savings targets in the workspace.',
          },
          {
            label: 'Target total',
            value: formatCurrency(totalTarget),
            helpText: 'Combined target amount across all goals.',
          },
          {
            label: 'Saved so far',
            value: formatCurrency(totalSaved),
            helpText: 'Total current amount already assigned to goals.',
          },
        ]}
        form={
          <ResourceFormCard
            title="Create a goal"
            helper="Goals work best when the target is specific and the deadline is realistic."
            onSubmit={handleSubmit}
            submitLabel="Save Goal"
            fields={[
              {
                name: 'name',
                label: 'Goal name',
                value: form.name,
                onChange: handleChange,
                required: true,
                placeholder: 'Emergency fund, travel, equipment...',
              },
              {
                name: 'target_amount',
                label: 'Target amount',
                type: 'number',
                step: '0.01',
                value: form.target_amount,
                onChange: handleChange,
                required: true,
              },
              {
                name: 'current_amount',
                label: 'Current amount',
                type: 'number',
                step: '0.01',
                value: form.current_amount,
                onChange: handleChange,
              },
              {
                name: 'deadline',
                label: 'Deadline',
                type: 'date',
                value: form.deadline,
                onChange: handleChange,
                required: true,
              },
            ]}
          />
        }
      >
        <GoalCards goals={goals.data} onDelete={setDeleteId} />
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
