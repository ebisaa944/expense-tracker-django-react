import { useEffect, useState } from 'react';
import { getBudgets, addBudget, deleteBudget } from '../api/budgetApi';
import { getCategories } from '../api/categoryApi';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: '',
    limit_amount: '',
    period: 'monthly',
    start_date: '',
    end_date: '',
  });
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchData = async () => {
    try {
      const [budRes, catRes] = await Promise.all([getBudgets(), getCategories()]);
      setBudgets(budRes.data);
      setCategories(catRes.data.filter(cat => cat.type === 'expense'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit_amount) return;
    try {
      await addBudget({ ...form, limit_amount: Number(form.limit_amount) });
      setForm({ category: '', limit_amount: '', period: 'monthly', start_date: '', end_date: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteModal) {
      await deleteBudget(deleteModal);
      setDeleteModal(null);
      fetchData();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Budgets</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required>
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Limit *</label>
          <input name="limit_amount" type="number" step="0.01" value={form.limit_amount} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Period</label>
          <select name="period" value={form.period} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="flex items-end md:col-span-5">
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Add Budget</button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {budgets.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No budgets set.</td></tr>
            ) : (
              budgets.map(bud => (
                <tr key={bud.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{bud.category_name || bud.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${bud.limit_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{bud.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{bud.start_date} to {bud.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => setDeleteModal(bud.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Delete this budget?</p>
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