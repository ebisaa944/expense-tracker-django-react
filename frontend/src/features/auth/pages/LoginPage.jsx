import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthButton from '../../../components/auth/AuthButton';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/useAuth';
import { useNotifications } from '../../../context/useNotifications';
import { getGoogleAuthConfig } from '../../../services/auth';

export default function LoginPage() {
  const { login, user } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember_me: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  useEffect(() => {
    getGoogleAuthConfig()
      .then((response) => setGoogleEnabled(Boolean(response.data.enabled)))
      .catch(() => {});
  }, []);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

    const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!form.email.trim()) validationErrors.email = 'Enter your email or username.';
    if (!form.password) validationErrors.password = 'Enter your password.';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (error) {
      setErrors({
        email: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(5,150,105,0.12),_transparent_26%),linear-gradient(160deg,_#eef4fb_0%,_#f8fafc_58%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[36px] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.8)] md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200">Finance OS</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
            Clean visibility for your money, goals, and daily decisions.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Sign in to a secure personal finance workspace with user-specific settings, smart dashboard insights, and cleaner mobile-first workflows.
          </p>
        </div>

        <AuthCard
          eyebrow="Welcome back"
          title="Sign in"
          description="Use your email and password to open your personalized financial dashboard."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email or Username"
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              icon="search"
            />
            <AuthInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              icon="settings"
              rightAction={
                <button type="button" className="text-xs font-semibold text-slate-500" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />
            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" name="remember_me" checked={form.remember_me} onChange={handleChange} />
                Remember me
              </label>
              <button type="button" className="font-medium text-indigo-600" onClick={() => notify({ tone: 'info', title: 'Forgot password', message: 'Password reset UI can be connected next without changing this screen.' })}>
                Forgot password?
              </button>
            </div>
            <AuthButton type="submit" loading={loading}>Sign in</AuthButton>
            <GoogleAuthButton
              disabled={!googleEnabled}
              onClick={() => notify({
                tone: googleEnabled ? 'success' : 'info',
                title: googleEnabled ? 'Google login configured' : 'Google OAuth ready',
                message: googleEnabled ? 'Connect your provider callback to complete the flow.' : 'Backend configuration endpoint is ready; provider credentials still need to be added.',
              })}
            />
          </form>
          <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
            <span>No account yet?</span>
            <Link to="/signup" className="font-semibold text-indigo-600">Create one</Link>
          </div>
          <div className="mt-4">
            <Button tone="ghost" className="w-full" onClick={() => notify({ tone: 'info', title: 'Demo hint', message: 'Use a registered email and password to sign in with JWT.' })}>
              Need help signing in?
            </Button>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
