import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Spinner from '../components/ui/Spinner';
import AppShell from '../layout/AppShell';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner fullScreen />;
  }

  return user ? <AppShell /> : <Navigate to="/login" replace />;
}
