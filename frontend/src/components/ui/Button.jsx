import Icon from './Icon';

export default function Button({
  children,
  className = '',
  icon,
  tone = 'primary',
  type = 'button',
  ...props
}) {
  const tones = {
    primary: 'bg-indigo-600 text-white shadow-[0_16px_34px_-20px_rgba(79,70,229,0.9)] hover:bg-[var(--primary-50)]0',
    success: 'bg-emerald-600 text-white shadow-[0_16px_34px_-20px_rgba(5,150,105,0.9)] hover:bg-emerald-500',
    danger: 'bg-rose-600 text-white shadow-[0_16px_34px_-20px_rgba(225,29,72,0.9)] hover:bg-rose-500',
    secondary: 'bg-[var(--surface-strong)] text-[var(--text-main)] ring-1 ring-slate-200 hover:bg-[var(--surface)]',
    ghost: 'bg-transparent text-[var(--text-main)] hover:bg-[var(--surface-strong)]/80',
    warning: 'bg-amber-500 text-[var(--text-main)] shadow-[0_16px_34px_-20px_rgba(245,158,11,0.85)] hover:bg-amber-400',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]} ${className}`}
      {...props}
    >
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
