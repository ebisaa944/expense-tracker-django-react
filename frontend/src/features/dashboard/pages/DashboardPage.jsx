import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import PageHeader from '../../../components/ui/PageHeader';
import { PageSkeleton } from '../../../components/ui/Skeleton';
import Icon from '../../../components/ui/Icon';
import { clampPercentage, formatCurrency, formatDate } from '../../../lib/format';
import { openMonthlyReportPdf } from '../../../lib/report';
import { getDashboardSummary } from '../../../services/dashboard';
import { exportExpensesCSV } from '../../../services/reports';
import { useNotifications } from '../../../context/useNotifications';
import { useSettings } from '../../../context/useSettings';

function DonutChart({ items }) {
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const colors = ['#4f46e5', '#059669', '#dc2626', '#f59e0b', '#0f766e', '#7c3aed'];

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[24px] border border-dashed border-[var(--border-soft)] text-sm text-[var(--text-muted)]">
        No spending data this month.
      </div>
    );
  }

  const segments = items.slice(0, 6).reduce(
    (collection, item, index) => {
      const value = Number(item.amount || 0);
      const dash = (value / total) * 100;
      const offset = collection.cursor;

      collection.cursor += dash;
      collection.items.push({
        category: item.category,
        dash,
        offset,
        color: colors[index % colors.length],
      });

      return collection;
    },
    { cursor: 0, items: [] }
  ).items;

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
      <svg viewBox="0 0 42 42" className="mx-auto h-48 w-48 -rotate-90">
        <circle cx="21" cy="21" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="6" />
        {segments.map((segment) => (
          <circle
            key={segment.category}
            cx="21"
            cy="21"
            r="15.915"
            fill="none"
            stroke={segment.color}
            strokeDasharray={`${segment.dash} ${100 - segment.dash}`}
            strokeDashoffset={-segment.offset}
            strokeWidth="6"
          />
        ))}
      </svg>
      <div className="space-y-3">
        {items.slice(0, 6).map((item, index) => {
          const share = total ? ((Number(item.amount || 0) / total) * 100).toFixed(0) : 0;
          return (
            <div key={item.category} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="font-medium text-[var(--text-main)]">{item.category}</span>
              </div>
              <span className="text-[var(--text-muted)]">
                {formatCurrency(item.amount)} · {share}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrendChart({ points }) {
  const values = points.flatMap((point) => [Number(point.expenses || 0), Number(point.incomes || 0)]);
  const maxValue = Math.max(...values, 1);
  const width = 100;
  const height = 44;
  const buildPath = (key) =>
    points
      .map((point, index) => {
        const x = (index / Math.max(points.length - 1, 1)) * width;
        const y = height - (Number(point[key] || 0) / maxValue) * height;
        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
      })
      .join(' ');

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full overflow-visible">
        {[0.25, 0.5, 0.75].map((marker) => (
          <line
            key={marker}
            x1="0"
            x2={width}
            y1={height * marker}
            y2={height * marker}
            stroke="#e2e8f0"
            strokeDasharray="2 3"
          />
        ))}
        <path d={buildPath('expenses')} fill="none" stroke="#dc2626" strokeWidth="2.4" />
        <path d={buildPath('incomes')} fill="none" stroke="#059669" strokeWidth="2.4" />
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
        <span>{formatDate(points[0]?.date)}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            Expenses
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            Income
          </span>
        </div>
        <span>{formatDate(points[points.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { notify } = useNotifications();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    total_expenses: 0,
    total_incomes: 0,
    expense_change_percent: 0,
    income_change_percent: 0,
    savings_rate: 0,
    budget_alerts: [],
    budget_statuses: [],
    goals: [],
    category_breakdown: [],
    top_spending_category: null,
    trend: [],
    insights: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((response) => {
        setSummary(response.data);

        if (response.data.budget_alerts.length > 0) {
          notify({
            tone: 'warning',
            title: 'Budget attention needed',
            message: `${response.data.budget_alerts.length} budget areas need review.`,
          });
        }

        const balance = Number(response.data.total_incomes) - Number(response.data.total_expenses);
        if (balance < 0) {
          notify({
            tone: 'danger',
            title: 'Low balance warning',
            message: 'Expenses are currently ahead of income this month.',
          });
        }
      })
      .catch(() => {
        notify({
          tone: 'danger',
          title: 'Dashboard unavailable',
          message: 'We could not load your latest summary right now.',
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await exportExpensesCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      notify({ tone: 'danger', title: 'Export failed', message: 'Could not export expenses.' });
    }
  };

  const balance = Number(summary.total_incomes) - Number(summary.total_expenses);
  const stats = useMemo(
    () => [
      {
        label: 'Income this month',
        value: formatCurrency(summary.total_incomes),
        detail: `${summary.income_change_percent >= 0 ? '+' : ''}${summary.income_change_percent}% vs last month`,
        icon: 'income',
      },
      {
        label: 'Expenses this month',
        value: formatCurrency(summary.total_expenses),
        detail: `${summary.expense_change_percent >= 0 ? '+' : ''}${summary.expense_change_percent}% vs last month`,
        icon: 'expense',
      },
      {
        label: 'Net balance',
        value: formatCurrency(balance),
        detail: balance >= 0 ? 'You are currently ahead this month.' : 'Expenses are outpacing income.',
        icon: 'wallet',
      },
      {
        label: 'Savings rate',
        value: `${summary.savings_rate.toFixed(1)}%`,
        detail: 'Share of this month’s income still available after expenses.',
        icon: 'goal',
      },
    ],
    [balance, summary]
  );

  if (loading) {
    return <PageSkeleton />;
  }

  const showChart = settings.dashboard_show_income_expense_chart;
  const showBudgetSummary = settings.dashboard_show_budget_summary;
  const showTopCategories = settings.dashboard_show_top_categories;

  return (
    <div className="space-y-8 rounded-[32px] p-1 bg-[var(--page-dashboard)] transition-colors duration-500">
      <PageHeader
        eyebrow="Overview"
        title="A clearer command center for your money"
        description="Review what changed this month, spot pressure points early, and take action without leaving the dashboard."
        action={
          <>
            <Button icon="plus" onClick={() => navigate('/expenses')}>
              Add expense
            </Button>
            <Button icon="plus" tone="success" onClick={() => navigate('/incomes')}>
              Add income
            </Button>
            <Button icon="download" tone="secondary" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button icon="download" tone="secondary" onClick={() => openMonthlyReportPdf({ currency: settings.currency, generatedAt: new Date().toISOString(), insights: summary.insights, summary })}>
              Export PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4 group">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="bg-[var(--surface-strong)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary-500)]" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">{stat.label}</p>
              <span className="rounded-full bg-[var(--primary-50)] p-2 text-[var(--primary-600)] transition-colors">
                <Icon name={stat.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-main)]">{stat.value}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{stat.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        {showTopCategories ? (
        <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300 border-[var(--border-soft)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-600)]">Category breakdown</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-main)]">Where this month’s spending went</h2>
            <div className="text-right text-sm text-[var(--text-muted)]">
              <p>Top category</p>
              <p className="font-semibold text-[var(--text-main)]">{summary.top_spending_category?.category || 'No data yet'}</p>
            </div>
          </div>
          <div className="mt-6">
            <DonutChart items={summary.category_breakdown} />
          </div>
        </Card>
        ) : null}

        {showChart ? (
        <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300 border-[var(--border-soft)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-600)]">14 day trend</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-main)]">
            {settings.dashboard_chart_type === 'pie' ? 'Daily mix of income and spending' : 'Daily income vs spending'}
          </h2>
          <div className="mt-6">
            <TrendChart points={summary.trend} />
          </div>
        </Card>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
        {showBudgetSummary ? (
        <Card className="bg-[var(--surface-strong)] shadow-[var(--shadow-glow)] border-[var(--border-strong)] transition-all">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-600)]">Budget alerts</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-main)]">Where spending needs attention</h2>
          <div className="mt-6 space-y-4">
            {summary.budget_alerts.length === 0 ? (
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 text-sm text-[var(--text-muted)]">
                No active budget is over or near its limit right now.
              </div>
            ) : (
              summary.budget_alerts.map((alert) => (
                <div key={alert.id} className="rounded-[24px] border border-rose-300/30 bg-[var(--surface-strong)]/7 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-white">{alert.category}</p>
                    <span className="rounded-full bg-[var(--surface-strong)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--warning-500)]">
                      {alert.warning || 'Over limit'}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-[var(--text-muted)]">
                    Spent {formatCurrency(alert.spent)} against a budget of {formatCurrency(alert.limit)}.
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        ) : null}

        <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-600)]">Smart insights</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-main)]">Signals worth acting on</h2>
          <div className="mt-6 space-y-4">
            {summary.insights.map((insight) => (
              <div key={insight} className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 text-sm leading-6 text-[var(--text-muted)] shadow-sm">
                {insight}
              </div>
            ))}
            {summary.budget_statuses.slice(0, 3).map((budget) => (
              <div key={budget.id} className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[var(--text-main)]">{budget.category}</p>
                  <span className="text-sm text-[var(--text-muted)]">{budget.percent_used}% used</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-[var(--surface)] overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${budget.status === 'over_limit' ? 'bg-[var(--danger-500)]' : budget.status === 'near_limit' ? 'bg-[var(--warning-500)]' : 'bg-[var(--success-500)]'}`}
                    style={{ width: `${Math.min(budget.percent_used, 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm text-[var(--text-muted)]">
                  <span>{formatCurrency(budget.spent)}</span>
                  <span>{formatCurrency(budget.limit)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary-600)]">Savings goals</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-main)]">Progress in motion</h2>
        <div className="mt-6 space-y-4">
          {summary.goals.length === 0 ? (
            <EmptyState
              icon="goal"
              title="No goals created yet"
              description="Create a goal so progress bars and milestone status can show up here."
              action={
                <Button tone="secondary" onClick={() => navigate('/goals')}>
                  Create a goal
                </Button>
              }
            />
          ) : (
            summary.goals.map((goal) => {
              const progress = clampPercentage((Number(goal.current_amount) / Number(goal.target_amount || 1)) * 100);

              return (
                <div key={goal.id} className="group rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 transition-colors hover:border-[var(--primary-500)]">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-[var(--text-main)]">{goal.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">Deadline {formatDate(goal.deadline)}</p>
                    </div>
                    <p className="text-sm font-medium text-[var(--primary-600)]">{progress.toFixed(0)}% complete</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-[var(--surface)] overflow-hidden">
                    <div className="h-3 rounded-full bg-[var(--primary-500)] transition-all duration-1000 shadow-[var(--shadow-glow)]" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-[var(--text-muted)]">
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
  );
}
