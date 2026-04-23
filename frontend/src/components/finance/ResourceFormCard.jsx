import Button from '../ui/Button';
import Card from '../ui/Card';

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100';

export default function ResourceFormCard({
  fields,
  footer,
  helper,
  onSubmit,
  submitLabel,
  title,
}) {
  return (
    <Card className="h-fit">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <Field key={field.name} label={field.label}>
                <select
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  required={field.required}
                  className={inputClassName}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            );
          }

          return (
            <Field key={field.name} label={field.label}>
              <input
                className={inputClassName}
                name={field.name}
                onChange={field.onChange}
                placeholder={field.placeholder}
                required={field.required}
                step={field.step}
                type={field.type || 'text'}
                value={field.value}
              />
            </Field>
          );
        })}
        {footer}
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}
