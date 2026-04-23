import { useEffect, useState } from 'react';
import { getIncomes, addIncome, deleteIncome } from '../api/incomeApi';
import { getCategories } from '../api/categoryApi';

export default function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchData = async () => {
    try {
      const [incRes, catRes] = await Promise.all([getIncomes(), getCategories()]);
      setIncomes(incRes.data);
      setCategories(catRes.data.filter(cat => cat.type === 'income'));
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
    if (!form.category || !form.amount) return;
    try {
      await addIncome({ ...form, amount: Number(form.amount) });
      setForm({ category: '', amount: '', source: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteModal) {
      await deleteIncome(deleteModal);
      setDeleteModal(null);
      fetchData();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Incomes</h1>

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
          <label className="block text-sm text-gray-600 mb-1">Amount *</label>
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Source</label>
          <input name="source" value={form.source} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date *</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">Add Income</button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incomes.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No incomes yet.</td></tr>
            ) : (
              incomes.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{inc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{inc.category_name || inc.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{inc.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${inc.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => setDeleteModal(inc.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}