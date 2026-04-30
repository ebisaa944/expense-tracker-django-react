import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthButton from '../../../components/auth/AuthButton';
import AuthCard from '../../../components/auth/AuthCard';
import AuthInput from '../../../components/auth/AuthInput';
import GoogleAuthButton from '../../../components/auth/GoogleAuthButton';
import { useAuth } from '../../../context/useAuth';
import { useNotifications } from '../../../context/useNotifications';

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function SignupPage() {
  const { signup } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.full_name.trim()) nextErrors.full_name = 'Enter your full name.';
    if (!form.email.trim()) nextErrors.email = 'Enter your email.';
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (strength < 3) nextErrors.password = 'Use a stronger password with upper-case letters, numbers, or symbols.';
    if (form.confirm_password !== form.password) nextErrors.confirm_password = 'Passwords do not match.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      notify({
        tone: 'success',
        title: 'Account created',
        message: 'Sign in to load your personalized workspace.',
      });
      navigate('/login');
    } catch (error) {
      const apiErrors = error.response?.data || {};
      setErrors((current) => ({ ...current, ...apiErrors }));
      notify({
        tone: 'danger',
        title: 'Signup failed',
        message: 'Please review your details and try again.',
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
            Build a personal finance workspace that adapts to you.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Create an account to unlock personalized currency, dashboard preferences, notifications, and finance views that follow your habits.
          </p>
        </div>

        <AuthCard
          eyebrow="Create account"
          title="Get started"
          description="Create your secure account to track income, expenses, budgets, and savings goals."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput label="Full name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} icon="goal" />
            <AuthInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} icon="search" />
            <AuthInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} icon="settings" />
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${strength >= 3 ? 'bg-emerald-500' : strength === 2 ? 'bg-amber-400' : 'bg-rose-500'}`}
                  style={{ width: `${Math.max(strength, 1) * 25}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">Password strength: {strength >= 3 ? 'Strong' : strength === 2 ? 'Medium' : 'Weak'}</p>
            </div>
            <AuthInput label="Confirm password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} error={errors.confirm_password} icon="settings" />
            <AuthButton type="submit" loading={loading}>Create account</AuthButton>
            <GoogleAuthButton onClick={() => notify({ tone: 'info', title: 'Google OAuth ready', message: 'Provider credentials and callback wiring can be added next without changing this UI.' })} />
          </form>
          <p className="mt-6 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600">Sign in</Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
