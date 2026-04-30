import Card from './Card';
import Icon from './Icon';

export default function EmptyState({ title, description, icon = 'dashboard', action }) {
  return (
    <Card className="border-dashed text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </Card>
  );
}
