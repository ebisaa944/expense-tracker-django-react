export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
