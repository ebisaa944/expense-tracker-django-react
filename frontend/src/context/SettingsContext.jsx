import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchSettings, updateSettings as updateSettingsRequest } from '../services/settings';
import { useNotifications } from './useNotifications';

const STORAGE_KEY = 'expense-tracker:settings';

const defaultSettings = {
  currency: 'ETB',
  theme_mode: 'light',
  font_family: 'inter',
  font_size: 'medium',
  primary_color: 'indigo',
  compact_tables: false,
  dashboard_default_view: 'monthly',
  dashboard_chart_type: 'line',
  dashboard_show_income_expense_chart: true,
  dashboard_show_budget_summary: true,
  dashboard_show_top_categories: true,
  notifications_budget_alerts: true,
  notifications_goal_reminders: true,
  notifications_low_balance: true,
  budget_threshold: 80,
  export_data_ready: false,
  google_oauth_enabled: false,
};

function readStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const { notify } = useNotifications();
  const [settings, setSettings] = useState(readStoredSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.dataset.appearance = settings.theme_mode;
    document.documentElement.dataset.currency = settings.currency;
    document.documentElement.dataset.fontFamily = settings.font_family;
    document.documentElement.dataset.fontSize = settings.font_size;
  }, [settings]);

  useEffect(() => {
    if (user?.settings) {
      queueMicrotask(() => {
        setSettings({ ...defaultSettings, ...user.settings });
      });
      return;
    }

    if (!user) {
      queueMicrotask(() => {
        setSettings(defaultSettings);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchSettings()
      .then((response) => {
        setSettings({ ...defaultSettings, ...response.data });
      })
      .catch(() => {
        notify({
          tone: 'warning',
          title: 'Settings unavailable',
          message: 'Using your last saved local preferences for now.',
        });
      });
  }, [notify, user]);

  const updateSettings = useCallback(async (partial, options = {}) => {
    const next = { ...settings, ...partial };
    setSettings(next);

    if (!user) {
      return next;
    }

    if (options.localOnly) {
      return next;
    }

    setSaving(true);
    try {
      const response = await updateSettingsRequest(next);
      setSettings({ ...defaultSettings, ...response.data });
      if (!options.silent) {
        notify({
          tone: 'success',
          title: 'Preferences updated',
          message: 'Your workspace settings were saved.',
        });
      }
      return response.data;
    } catch (error) {
      notify({
        tone: 'danger',
        title: 'Could not save settings',
        message: 'Please try again in a moment.',
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }, [notify, settings, user]);

  const resetSettings = useCallback(async () => {
    await updateSettings(defaultSettings);
  }, [updateSettings]);

  const value = useMemo(
    () => ({
      settings,
      saving,
      updateSettings,
      resetSettings,
    }),
    [resetSettings, saving, settings, updateSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export default SettingsContext;
