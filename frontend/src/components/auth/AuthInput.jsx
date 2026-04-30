import Icon from '../ui/Icon';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

export default function AuthInput({
  error,
  label,
  icon,
  rightAction,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        {icon ? <Icon name={icon} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> : null}
        <input
          className={`${inputClassName} ${icon ? 'pl-11' : ''} ${rightAction ? 'pr-20' : ''} ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`}
          {...props}
        />
        {rightAction ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightAction}</div> : null}
      </div>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}
