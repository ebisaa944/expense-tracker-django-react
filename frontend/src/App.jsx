import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './app/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ExpensesPage from './features/expenses/pages/ExpensesPage';
import IncomesPage from './features/incomes/pages/IncomesPage';
import BudgetsPage from './features/budgets/pages/BudgetsPage';
import GoalsPage from './features/goals/pages/GoalsPage';
import CategoriesPage from './features/categories/pages/CategoriesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
