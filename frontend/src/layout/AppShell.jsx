import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import Button from '../components/ui/Button';

const navigation = [
  { label: 'Dashboard', to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Incomes', to: '/incomes' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Goals', to: '/goals' },
];

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      end={item.to === '/'}
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-slate-950 text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.65)]'
            : 'text-slate-600 hover:bg-white hover:text-slate-950'
        }`
      }
    >
      {item.label}
    </NavLink>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_40%,_#eef2ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-80 shrink-0 rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Finance OS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Expense Tracker
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A clearer workspace for cash flow, spending controls, and savings goals.
            </p>
          </div>

          <nav className="mt-10 grid gap-2">
            {navigation.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-auto rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Signed in</p>
            <p className="mt-2 text-lg font-semibold">{user?.username || 'User'}</p>
            <p className="mt-2 text-sm text-slate-300">
              Keep records current so dashboards and budget alerts stay trustworthy.
            </p>
            <Button tone="secondary" className="mt-5 w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Finance OS</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">Expense Tracker</p>
              </div>
              <Button tone="secondary" onClick={() => setMenuOpen((current) => !current)}>
                {menuOpen ? 'Close' : 'Menu'}
              </Button>
            </div>
            {menuOpen && (
              <div className="mt-4 grid gap-2">
                {navigation.map((item) => (
                  <NavItem key={item.to} item={item} onNavigate={() => setMenuOpen(false)} />
                ))}
                <Button tone="secondary" className="mt-2" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
          </header>

          <main className="flex-1 py-6 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
