import Card from '../ui/Card';

export default function AuthCard({ children, eyebrow, title, description }) {
  return (
    <Card className="mx-auto w-full max-w-md p-8 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-8">{children}</div>
    </Card>
  );
}
