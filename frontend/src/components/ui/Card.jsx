export default function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-[28px] border border-white/55 bg-white/80 p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}
