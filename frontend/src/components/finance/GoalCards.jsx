import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { clampPercentage, formatCurrency, formatDate } from '../../lib/format';

export default function GoalCards({ goals, onDelete }) {
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

        return (
          <Card key={goal.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{goal.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Target date: {formatDate(goal.deadline)}</p>
              </div>
              <Button tone="secondary" onClick={() => onDelete(goal.id)}>
                Remove
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <span>{formatCurrency(goal.current_amount)} saved</span>
              <span>{formatCurrency(goal.target_amount)} target</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">{progress.toFixed(0)}% complete</p>
          </Card>
        );
      })}
    </div>
  );
}
