import { createContext, useCallback, useMemo, useState } from 'react';

const NotificationsContext = createContext(null);

let sequence = 0;

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((payload) => {
    const id = ++sequence;
    const item = {
      id,
      tone: payload.tone || 'info',
      title: payload.title,
      message: payload.message || '',
    };

    setNotifications((current) => [...current, item]);

    window.setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== id));
    }, payload.duration ?? 4500);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      notify,
      dismiss,
    }),
    [dismiss, notifications, notify]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export default NotificationsContext;
