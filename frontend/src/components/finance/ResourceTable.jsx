import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { useSettings } from '../../context/useSettings';

export default function ResourceTable({ columns, emptyDescription, emptyTitle, rows, toolbar }) {
  const { settings } = useSettings();

  if (rows.length === 0) {
    return (
      <Card className="overflow-hidden p-0">
        {toolbar ? <div className="border-b border-slate-100 px-5 py-4">{toolbar}</div> : null}
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      {toolbar ? <div className="border-b border-slate-100 px-5 py-4">{toolbar}</div> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-950 text-xs uppercase tracking-[0.22em] text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`font-medium ${settings.compactTables ? 'px-4 py-3' : 'px-5 py-4'}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-indigo-50/70"
              >
                {columns.map((column) => (
                  <td key={column.key} className={`align-middle ${settings.compactTables ? 'px-4 py-3' : 'px-5 py-4'}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
