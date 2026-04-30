import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ResourcePage from '../../../components/finance/ResourcePage';
import { useSettings } from '../../../context/useSettings';
import { currencyOptions } from '../../../lib/format';
import { useNotifications } from '../../../context/useNotifications';

const selectClassName = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm';

function Section({ title, description, children }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </Card>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, saving } = useSettings();
  const { notify } = useNotifications();

  const update = (partial, options) => updateSettings(partial, options);

  return (
    <ResourcePage
      eyebrow="Settings"
      title="Personalize your financial workspace"
      description="Manage currency, visual preferences, dashboard behavior, alerts, and privacy controls from one connected settings center."
      tone="var(--page-settings)"
      highlights={[
        {
          label: 'Display currency',
          value: settings.currency,
          helpText: 'Applied globally across cards, tables, charts, and exports.',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(224,231,255,0.86))',
        },
        {
          label: 'Dashboard view',
          value: settings.dashboard_default_view,
          helpText: 'Default time horizon used when your dashboard loads.',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(219,234,254,0.86))',
        },
        {
          label: 'Budget threshold',
          value: `${settings.budget_threshold}%`,
          helpText: 'Warning level used for budget notifications and dashboard signals.',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(254,249,195,0.84))',
        },
      ]}
      action={
        <Button tone="secondary" onClick={resetSettings} disabled={saving}>
          Reset defaults
        </Button>
      }
      form={
        <div className="space-y-6">
          <Section
            title="Profile settings"
            description="Core profile fields are kept simple for now while the authenticated account structure stays stable."
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              Profile editing is ready for a follow-up API if you want name, avatar, and password management next.
            </div>
          </Section>

          <Section
            title="Currency settings"
            description="Choose how financial values are displayed across the entire product."
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Display currency</span>
              <select
                className={selectClassName}
                value={settings.currency}
                onChange={(event) => update({ currency: event.target.value })}
              >
                {currencyOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} · {option.label}
                  </option>
                ))}
              </select>
            </label>
          </Section>

          <Section
            title="Theme and typography"
            description="Control the overall look, font family, and readability scale used in the interface."
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Theme mode</span>
              <select
                className={selectClassName}
                value={settings.theme_mode}
                onChange={(event) => update({ theme_mode: event.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark (future-ready)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Font family</span>
              <select
                className={selectClassName}
                value={settings.font_family}
                onChange={(event) => update({ font_family: event.target.value })}
              >
                <option value="inter">Inter</option>
                <option value="poppins">Poppins</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Font size</span>
              <select
                className={selectClassName}
                value={settings.font_size}
                onChange={(event) => update({ font_size: event.target.value })}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                checked={settings.compact_tables}
                className="mt-1 h-4 w-4 rounded border-slate-300"
                type="checkbox"
                onChange={(event) => update({ compact_tables: event.target.checked })}
              />
              <span>
                <span className="block font-medium text-slate-900">Compact transaction tables</span>
                <span className="mt-1 block text-xs text-slate-500">
                  Useful when reviewing many ledger rows on desktop.
                </span>
              </span>
            </label>
          </Section>
        </div>
      }
    >
      <div className="space-y-6">
        <Section
          title="Dashboard preferences"
          description="Control the default time horizon, widget visibility, and chart style used on the dashboard."
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Default view</span>
            <select
              className={selectClassName}
              value={settings.dashboard_default_view}
              onChange={(event) => update({ dashboard_default_view: event.target.value })}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Default chart type</span>
            <select
              className={selectClassName}
              value={settings.dashboard_chart_type}
              onChange={(event) => update({ dashboard_chart_type: event.target.value })}
            >
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
              <option value="line">Line</option>
            </select>
          </label>
          {[
            ['dashboard_show_income_expense_chart', 'Show income vs expense chart'],
            ['dashboard_show_budget_summary', 'Show budget summary widget'],
            ['dashboard_show_top_categories', 'Show top categories widget'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                checked={settings[key]}
                className="h-4 w-4 rounded border-slate-300"
                type="checkbox"
                onChange={(event) => update({ [key]: event.target.checked })}
              />
              {label}
            </label>
          ))}
        </Section>

        <Section
          title="Notification settings"
          description="Configure which alerts matter to you and how early the budget system should warn you."
        >
          {[
            ['notifications_budget_alerts', 'Budget alerts'],
            ['notifications_goal_reminders', 'Goal reminders'],
            ['notifications_low_balance', 'Low balance warnings'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                checked={settings[key]}
                className="h-4 w-4 rounded border-slate-300"
                type="checkbox"
                onChange={(event) => update({ [key]: event.target.checked })}
              />
              {label}
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Budget threshold</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              min="1"
              max="100"
              type="number"
              value={settings.budget_threshold}
              onChange={(event) => update({ budget_threshold: Number(event.target.value) || 80 }, { silent: true })}
              onBlur={() => update({ budget_threshold: Number(settings.budget_threshold) || 80 })}
            />
          </label>
        </Section>

        <Section
          title="Data and privacy"
          description="Clear cached client data, reset preferences, and keep export hooks ready for future reporting flows."
        >
          <div className="flex flex-wrap gap-3">
            <Button
              tone="secondary"
              onClick={() => {
                localStorage.removeItem('expense-tracker:settings');
                notify({
                  tone: 'success',
                  title: 'Local cache cleared',
                  message: 'Fresh settings will load again from the server.',
                });
              }}
            >
              Clear local cache
            </Button>
            <Button
              tone="secondary"
              onClick={() =>
                notify({
                  tone: 'info',
                  title: 'Export structure ready',
                  message: 'CSV and PDF exports already work from finance pages and dashboard workflows.',
                })
              }
            >
              Export data
            </Button>
          </div>
        </Section>
      </div>
    </ResourcePage>
  );
}
