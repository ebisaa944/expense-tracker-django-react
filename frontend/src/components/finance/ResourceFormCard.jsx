import Button from '../ui/Button';
import Card from '../ui/Card';

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  'w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

export default function ResourceFormCard({
  fields,
  footer,
  helper,
  onSubmit,
  onCancel,
  submitLabel,
  secondarySubmitLabel,
  onSecondarySubmit,
  title,
}) {
  return (
    <Card className="h-fit">
      <h2 className="text-xl font-semibold text-[var(--text-main)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{helper}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {fields.map((field) => {
          if (field.type === 'checkbox') {
            return (
              <label
                key={field.name}
                className="flex items-start gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-main)]"
              >
                <input
                  checked={Boolean(field.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-amber-500 focus:ring-amber-400"
                  name={field.name}
                  onChange={field.onChange}
                  type="checkbox"
                />
                <span>
                  <span className="block font-medium text-[var(--text-main)]">{field.label}</span>
                  {field.description ? (
                    <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{field.description}</span>
                  ) : null}
                </span>
              </label>
            );
          }

          if (field.type === 'select') {
            return (
              <Field key={field.name} label={field.label}>
                <div>
                  <select
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    required={field.required}
                    className={`${inputClassName} ${field.error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                  >
                    <option value="">{field.placeholder || 'Select an option'}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {field.error ? <p className="mt-2 text-xs text-rose-600">{field.error}</p> : null}
                </div>
              </Field>
            );
          }

          return (
            <Field key={field.name} label={field.label}>
              <input
                className={`${inputClassName} ${field.error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                name={field.name}
                onChange={field.onChange}
                placeholder={field.placeholder}
                required={field.required}
                step={field.step}
                type={field.type || 'text'}
                value={field.value}
              />
              {field.error ? <p className="mt-2 text-xs text-rose-600">{field.error}</p> : null}
            </Field>
          );
        })}
        {footer}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
          {onSecondarySubmit ? (
            <Button type="button" tone="secondary" className="w-full" onClick={onSecondarySubmit}>
              {secondarySubmitLabel || 'Save and add another'}
            </Button>
          ) : null}
          {onCancel ? (
            <Button type="button" tone="secondary" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
