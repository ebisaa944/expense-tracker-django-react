import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../../context/useAuth';

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login({ username, password });
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.32),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.16),_transparent_26%),linear-gradient(160deg,_#fffdf8_0%,_#f8fafc_58%,_#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[36px] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.8)] md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">Finance OS</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
            Clean visibility for your money, goals, and day-to-day decisions.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            This workspace is now structured to feel more like a professional financial dashboard:
            focused layouts, stronger hierarchy, and smoother backend integration.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Cash flow', 'Track income and expenses with one consistent data flow.'],
              ['Budget control', 'Spot overspending windows before they become bigger problems.'],
              ['Savings goals', 'Keep important targets visible and measurable.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-600">Welcome back</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use your account to continue managing your dashboard and records.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                className={inputClassName}
                onChange={(event) => setUsername(event.target.value)}
                required
                type="text"
                value={username}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                className={inputClassName}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
