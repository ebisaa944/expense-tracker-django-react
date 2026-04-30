import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useSettings } from '../context/useSettings';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import ToastTray from '../components/ui/ToastTray';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { expensesService, incomesService } from '../services/finance';
import QuickEntryModal from '../components/finance/QuickEntryModal';

const navigation = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Categories', to: '/categories', icon: 'category' },
  { label: 'Expenses', to: '/expenses', icon: 'expense' },
  { label: 'Incomes', to: '/incomes', icon: 'income' },
  { label: 'Budgets', to: '/budgets', icon: 'budget' },
  { label: 'Goals', to: '/goals', icon: 'goal' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
];

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      end={item.to === '/'}
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-24px_rgba(79,70,229,0.6)]'
            : 'text-slate-600 hover:bg-white hover:text-slate-950'
        }`
      }
    >
      <Icon name={item.icon} className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ expenses: [], incomes: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const { logout, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const shouldSearch = searchOpen && query.trim().length >= 2;

  useEffect(() => {
    if (!shouldSearch) {
      return;
    }

    let active = true;

    const timeout = window.setTimeout(async () => {
      try {
        const [expensesResponse, incomesResponse] = await Promise.all([
          expensesService.list({ q: query }),
          incomesService.list({ q: query }),
        ]);

        if (!active) {
          return;
        }

        setResults({
          expenses: expensesResponse.data.slice(0, 5),
          incomes: incomesResponse.data.slice(0, 5),
        });
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query, shouldSearch]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(5,150,105,0.12),_transparent_22%),linear-gradient(180deg,_#eef4fb_0%,_#f8fafc_42%,_#f3f6fb_100%)]">
      <ToastTray />
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-80 shrink-0 rounded-[32px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)] backdrop-blur lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">Finance OS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Expense Tracker
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A production-style workspace for cash flow, spending controls, savings goals, and reporting.
            </p>
          </div>

          <nav className="mt-10 grid gap-2">
            {navigation.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-auto rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Signed in</p>
            <p className="mt-2 text-lg font-semibold">{user?.full_name || user?.username || 'User'}</p>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm">
              <span className="text-slate-300">Display currency</span>
              <span className="font-semibold text-white">{settings.currency}</span>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Keep records current so insights, budget warnings, and exported reports stay trustworthy.
            </p>
            <Button tone="secondary" className="mt-5 w-full" onClick={() => setLogoutOpen(true)}>
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">Finance OS</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">Expense Tracker</p>
              </div>
              <div className="hidden flex-1 items-center justify-center lg:flex">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 transition hover:bg-white"
                >
                  <Icon name="search" className="h-4 w-4" />
                  Search expenses and incomes
                  <span className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">Ctrl K</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden rounded-2xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 md:block">
                  {settings.currency}
                </div>
                <Button tone="secondary" icon="plus" onClick={() => setQuickEntryOpen(true)}>
                  Quick add
                </Button>
                <Button className="lg:hidden" tone="secondary" onClick={() => setMenuOpen((current) => !current)}>
                  {menuOpen ? 'Close' : 'Menu'}
                </Button>
              </div>
            </div>
            {menuOpen && (
              <div className="mt-4 grid gap-2 lg:hidden">
                {navigation.map((item) => (
                  <NavItem key={item.to} item={item} onNavigate={() => setMenuOpen(false)} />
                ))}
                <Button tone="secondary" className="mt-2" onClick={() => setLogoutOpen(true)}>
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
      <QuickEntryModal isOpen={quickEntryOpen} onClose={() => setQuickEntryOpen(false)} />
      <Modal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          logout();
          setLogoutOpen(false);
          navigate('/login');
        }}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmLabel="Logout"
        tone="danger"
      />
      <ModalSearch
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchLoading(false);
        }}
        onNavigate={(path) => {
          navigate(path);
          setSearchOpen(false);
          setSearchLoading(false);
        }}
        query={query}
        setQuery={setQuery}
        setSearchLoading={setSearchLoading}
        results={results}
        loading={searchLoading && shouldSearch}
      />
    </div>
  );
}

function ModalSearch({ isOpen, onClose, onNavigate, query, setQuery, setSearchLoading, results, loading }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 p-4 pt-16 backdrop-blur-sm">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Icon name="search" className="h-4 w-4 text-slate-500" />
          <input
            autoFocus
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search transactions by category, description, or source"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              setSearchLoading(nextQuery.trim().length >= 2);
            }}
          />
          <button type="button" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SearchColumn
            title="Expenses"
            type="expense"
            rows={results.expenses}
            loading={loading}
            onNavigate={onNavigate}
          />
          <SearchColumn
            title="Incomes"
            type="income"
            rows={results.incomes}
            loading={loading}
            onNavigate={onNavigate}
          />
        </div>
      </Card>
    </div>
  );
}

function SearchColumn({ title, type, rows, loading, onNavigate }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon name={type} className="h-4 w-4" />
        {title}
      </div>
      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-slate-500">Searching...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No matching transactions yet.</p> : null}
        {rows.map((row) => (
          <button
            key={`${type}-${row.id}`}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left transition hover:bg-indigo-50"
            onClick={() => onNavigate(type === 'expense' ? '/expenses' : '/incomes')}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.category_name}</p>
              <p className="mt-1 text-xs text-slate-500">{row.description || row.source || row.date}</p>
            </div>
            <Icon name="search" className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
