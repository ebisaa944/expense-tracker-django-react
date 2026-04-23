export default function Spinner({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
    </div>
  );
}
