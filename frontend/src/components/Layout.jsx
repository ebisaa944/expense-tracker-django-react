import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Incomes', href: '/incomes' },
  { name: 'Budgets', href: '/budgets' },
  { name: 'Goals', href: '/goals' },
];

export default function Layout() {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">ExpenseTracker</h1>
          <p className="text-sm text-gray-500 mt-1">Personal Finance</p>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
                location.pathname === item.href ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{user?.username || 'User'}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}