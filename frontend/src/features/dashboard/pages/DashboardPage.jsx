import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import PageHeader from '../../../components/ui/PageHeader';
import Spinner from '../../../components/ui/Spinner';
import { clampPercentage, formatCurrency, formatDate } from '../../../lib/format';
import { getDashboardSummary } from '../../../services/dashboard';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    total_expenses: 0,
    total_incomes: 0,
    budget_alerts: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((response) => setSummary(response.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const balance = Number(summary.total_incomes) - Number(summary.total_expenses);
  const stats = [
    {
      label: 'Income this month',
      value: formatCurrency(summary.total_incomes),
      detail: 'Money added during the current month.',
    },
    {
      label: 'Expenses this month',
      value: formatCurrency(summary.total_expenses),
      detail: 'Spending recorded during the current month.',
    },
    {
      label: 'Net balance',
      value: formatCurrency(balance),
      detail: balance >= 0 ? 'You are currently ahead this month.' : 'Expenses are outpacing income.',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="A calmer view of your financial momentum"
        description="Monitor income, spending, budget pressure, and savings goals from one place with clearer visual priorities."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-gradient-to-br from-white via-white to-amber-50">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-500">{stat.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
        <Card className="bg-gradient-to-br from-slate-950 to-slate-800 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Budget alerts</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Where spending needs attention</h2>
          <div className="mt-6 space-y-4">
            {summary.budget_alerts.length === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                No active budget is over its limit right now.
              </div>
            ) : (
              summary.budget_alerts.map((alert) => (
                <div key={alert.id} className="rounded-[24px] border border-rose-400/30 bg-rose-400/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-white">{alert.category}</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
                      Over limit
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    Spent {formatCurrency(alert.spent)} against a budget of {formatCurrency(alert.limit)}.
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Savings goals</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Progress in motion</h2>
          <div className="mt-6 space-y-4">
            {summary.goals.length === 0 ? (
              <EmptyState
                title="No goals created yet"
                description="Create a goal so progress bars and savings milestones can show up here."
              />
            ) : (
              summary.goals.map((goal) => {
                const progress = clampPercentage(
                  (Number(goal.current_amount) / Number(goal.target_amount || 1)) * 100
                );

                return (
                  <div key={goal.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-950">{goal.name}</p>
                        <p className="text-sm text-slate-500">Deadline {formatDate(goal.deadline)}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">{progress.toFixed(0)}% complete</p>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-white">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-slate-500">
                      <span>{formatCurrency(goal.current_amount)}</span>
                      <span>{formatCurrency(goal.target_amount)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
