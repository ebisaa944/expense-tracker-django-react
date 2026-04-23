import Card from './Card';

export default function EmptyState({ title, description }) {
  return (
    <Card className="border-dashed text-center">
      <div className="mx-auto max-w-md">
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
    </Card>
  );
}
