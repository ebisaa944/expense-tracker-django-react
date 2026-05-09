import PageHeader from '../ui/PageHeader';

export default function ResourcePage({
  action,
  eyebrow,
  title,
  description,
  highlights = [],
  form,
  children,
  tone = 'var(--page-dashboard)',
}) {
  return (
    <div className="space-y-8 rounded-[32px] p-1" style={{ background: tone }}>
      <PageHeader eyebrow={eyebrow} title={title} description={description} action={action} />

      {highlights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.18)]"
              style={{ background: item.background || 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))', borderColor: 'var(--border-soft)' }}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--text-main)]">{item.value}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{item.helpText}</p>
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
