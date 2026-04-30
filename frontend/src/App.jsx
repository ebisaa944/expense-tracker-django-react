import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './app/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ExpensesPage from './features/expenses/pages/ExpensesPage';
import IncomesPage from './features/incomes/pages/IncomesPage';
import BudgetsPage from './features/budgets/pages/BudgetsPage';
import GoalsPage from './features/goals/pages/GoalsPage';
import CategoriesPage from './features/categories/pages/CategoriesPage';
import SettingsPage from './features/settings/pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
