import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

export default function ResourceTable({ columns, emptyDescription, emptyTitle, rows }) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-950 text-xs uppercase tracking-[0.22em] text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-amber-50/60"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-middle">
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
