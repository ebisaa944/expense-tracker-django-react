import { useEffect, useState } from 'react';
import { getGoals, addGoal, deleteGoal } from '../api/goalApi';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
  });
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchGoals = async () => {
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGoal({
        ...form,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount),
      });
      setForm({ name: '', target_amount: '', current_amount: '0', deadline: '' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteModal) {
      await deleteGoal(deleteModal);
      setDeleteModal(null);
      fetchGoals();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Goals</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Goal Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Target Amount *</label>
          <input name="target_amount" type="number" step="0.01" value={form.target_amount} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Current Amount</label>
          <input name="current_amount" type="number" step="0.01" value={form.current_amount} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Deadline *</label>
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="flex items-end md:col-span-4">
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Goal</button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No goals saved.</p>
        ) : (
          goals.map(goal => {
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            return (
              <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm relative">
                <button
                  onClick={() => setDeleteModal(goal.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  title="Delete goal"
                >
                  ×
                </button>
                <h3 className="font-medium text-gray-800 text-lg mb-2">{goal.name}</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${goal.current_amount}</span>
                  <span>${goal.target_amount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">Deadline: {goal.deadline}</p>
              </div>
            );
          })
        )}
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Goal</h3>
            <p className="text-gray-600 mb-4">Are you sure?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 border rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}