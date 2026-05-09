import Button from '../ui/Button';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { clampPercentage, formatCurrency, formatDate } from '../../lib/format';

export default function GoalCards({ goals, onDelete, onEdit }) {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="No goals yet"
        description="Set a savings target with a deadline so your dashboard can track progress and focus."
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {goals.map((goal) => {
        const progress = clampPercentage((Number(goal.current_amount) / Number(goal.target_amount || 1)) * 100);
        const deadline = new Date(goal.deadline);
        const today = new Date();
        const createdBase = new Date(today.getFullYear(), 0, 1);
        const elapsed = Math.max(today - createdBase, 0);
        const total = Math.max(deadline - createdBase, 1);
        const expectedProgress = clampPercentage((elapsed / total) * 100);
        const status = progress >= expectedProgress ? 'On track' : 'Delayed';

        return (
          <Card key={goal.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-main)]">{goal.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Target date: {formatDate(goal.deadline)}</p>
              </div>
              <div className="flex gap-2">
                <Button tone="secondary" onClick={() => onEdit?.(goal)}>
                  Edit
                </Button>
                <Button tone="secondary" onClick={() => onDelete(goal.id)}>
                  Remove
                </Button>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-[var(--text-muted)]">
              <span>{formatCurrency(goal.current_amount)} saved</span>
              <span>{formatCurrency(goal.target_amount)} target</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text-main)]">{progress.toFixed(0)}% complete</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${status === 'On track' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {status}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
