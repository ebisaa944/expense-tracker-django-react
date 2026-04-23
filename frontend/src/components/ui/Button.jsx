export default function Button({
  children,
  className = '',
  tone = 'primary',
  type = 'button',
  ...props
}) {
  const tones = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    secondary: 'bg-white/80 text-slate-900 ring-1 ring-slate-200 hover:bg-white',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/70 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
