import Card from '../ui/Card';

export default function AuthCard({ children, eyebrow, title, description }) {
  return (
    <Card className="mx-auto w-full max-w-md p-8 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-600)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-main)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      <div className="mt-8">{children}</div>
    </Card>
  );
}
