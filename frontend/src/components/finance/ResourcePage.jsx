import PageHeader from '../ui/PageHeader';

export default function ResourcePage({
  eyebrow,
  title,
  description,
  highlights = [],
  form,
  children,
}) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      {highlights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border border-white/60 bg-gradient-to-br from-white to-amber-50 p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.helpText}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.7fr]">
        {form}
        <div>{children}</div>
      </div>
    </div>
  );
}
