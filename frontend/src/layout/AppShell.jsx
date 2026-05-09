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
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
          isActive
            ? 'bg-[var(--primary-600)] text-[var(--text-inverse)] shadow-lg shadow-[var(--primary-500)]/30'
            : 'text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-main)] hover:shadow-md'
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
    <div className="min-h-screen bg-[var(--app-bg)] transition-colors duration-500 ease-in-out">
      <ToastTray />
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-80 shrink-0 animate-slide-in-right rounded-[32px] border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-[var(--shadow-premium)] backdrop-blur-xl transition-all duration-500 lg:flex lg:flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--primary-600)]">Finance OS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-main)]">
              Expense Tracker
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              A production-style workspace for cash flow, spending controls, savings goals, and reporting.
            </p>
          </div>

          <nav className="mt-10 grid gap-2">
            {navigation.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-auto rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-strong)] p-5 transition-colors">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Signed in</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">{user?.full_name || user?.username || 'User'}</p>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--primary-50)] px-4 py-3 text-sm">
              <span className="text-[var(--text-muted)]">Display currency</span>
              <span className="font-semibold text-[var(--text-main)]">{settings.currency}</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Keep records current so insights, warnings, and reports stay trustworthy.
            </p>
            <Button tone="secondary" className="mt-5 w-full hover:shadow-[var(--shadow-glow)]" onClick={() => setLogoutOpen(true)}>
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-4 z-40 animate-fade-in rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface)]/90 p-4 shadow-[var(--shadow-premium)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary-600)]">Finance OS</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text-main)]">Expense Tracker</p>
              </div>
              <div className="hidden flex-1 items-center justify-center lg:flex">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-muted)] transition-all hover:border-[var(--primary-500)] hover:shadow-md"
                >
                  <Icon name="search" className="h-4 w-4" />
                  Search expenses and incomes
                  <span className="ml-auto rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-2 py-1 text-xs">Ctrl K</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden rounded-2xl bg-[var(--primary-100)] px-3 py-2 text-sm font-semibold text-[var(--primary-600)] transition-colors md:block">
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
              <div className="mt-4 animate-slide-up grid gap-2 lg:hidden">
                {navigation.map((item) => (
                  <NavItem key={item.to} item={item} onNavigate={() => setMenuOpen(false)} />
                ))}
                <Button tone="secondary" className="mt-2" onClick={() => setLogoutOpen(true)}>
                  Logout
                </Button>
              </div>
            )}
          </header>

          <main className="flex-1 animate-slide-up py-6 lg:py-8">
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--text-main)]/40 p-4 pt-16 backdrop-blur-sm">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
          <Icon name="search" className="h-4 w-4 text-[var(--text-muted)]" />
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
          <button type="button" className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]" onClick={onClose}>
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
    <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
        <Icon name={type} className="h-4 w-4" />
        {title}
      </div>
      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-[var(--text-muted)]">Searching...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-[var(--text-muted)]">No matching transactions yet.</p> : null}
        {rows.map((row) => (
          <button
            key={`${type}-${row.id}`}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-left transition hover:bg-[var(--primary-50)]"
            onClick={() => onNavigate(type === 'expense' ? '/expenses' : '/incomes')}
          >
            <div>
              <p className="text-sm font-semibold text-[var(--text-main)]">{row.category_name}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{row.description || row.source || row.date}</p>
            </div>
            <Icon name="search" className="h-4 w-4 text-[var(--text-muted)]" />
          </button>
        ))}
      </div>
    </div>
  );
}
