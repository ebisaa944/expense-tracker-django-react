export default function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-[28px] border p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)] backdrop-blur ${className}`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border-soft)' }}
    >
      {children}
    </section>
  );
}
