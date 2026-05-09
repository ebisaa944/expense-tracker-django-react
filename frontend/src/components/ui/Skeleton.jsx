export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-10 w-72" />
        <SkeletonBlock className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[28px] border border-white/70 bg-[var(--surface-strong)]/80 p-6 shadow-sm">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-5 h-8 w-32" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <SkeletonBlock className="h-[420px] rounded-[28px]" />
        <SkeletonBlock className="h-[420px] rounded-[28px]" />
      </div>
    </div>
  );
}
