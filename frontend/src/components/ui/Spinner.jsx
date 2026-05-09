export default function Spinner({ fullScreen = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border-soft)] border-t-indigo-500" />
      <p className="text-sm font-medium text-[var(--text-muted)]">Loading your workspace...</p>
    </div>
  );
}
