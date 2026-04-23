import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/dashboardApi';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_expenses: 0,
    total_incomes: 0,
    budget_alerts: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then(res => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const balance = summary.total_incomes - summary.total_expenses;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Income (this month)</h3>
          <p className="text-2xl font-bold text-green-600">${summary.total_incomes.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses (this month)</h3>
          <p className="text-2xl font-bold text-red-600">${summary.total_expenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Budget Alerts */}
      {summary.budget_alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">⚠️ Budget Alerts</h2>
          <div className="space-y-3">
            {summary.budget_alerts.map(alert => (
              <div key={alert.id} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <strong>{alert.category}</strong>: You've spent ${alert.spent.toFixed(2)} of your ${alert.limit.toFixed(2)} limit.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Progress */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🎯 Goals</h2>
        {summary.goals.length === 0 ? (
          <p className="text-gray-500">No goals set.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.goals.map(goal => {
              const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
              return (
                <div key={goal.id} className="bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-medium text-gray-800">{goal.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>${goal.current_amount}</span>
                    <span>${goal.target_amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Deadline: {goal.deadline}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}