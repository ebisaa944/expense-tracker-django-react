import Icon from './Icon';
import { useNotifications } from '../../context/useNotifications';

const tones = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function ToastTray() {
  const { notifications, dismiss } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto rounded-[24px] border px-4 py-4 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] ${tones[notification.tone]}`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-[var(--surface-strong)]/80 p-2">
              <Icon name="bell" className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{notification.title}</p>
              {notification.message ? <p className="mt-1 text-sm opacity-80">{notification.message}</p> : null}
            </div>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100"
              onClick={() => dismiss(notification.id)}
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
