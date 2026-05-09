export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary-600)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-main)] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)] md:text-base">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  );
}
