import { formatCurrency, formatDate } from './format';

export function openMonthlyReportPdf({ currency, generatedAt, insights, summary }) {
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=960,height=720');

  if (!popup) {
    return;
  }

  popup.document.write(`
    <html>
      <head>
        <title>Monthly Financial Report</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1, h2 { margin-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 24px 0; }
          .card { border: 1px solid #dbe3ef; border-radius: 18px; padding: 18px; background: #f8fafc; }
          ul { padding-left: 18px; }
        </style>
      </head>
      <body>
        <h1>Expense Tracker Monthly Report</h1>
        <p>Generated ${formatDate(generatedAt)} · Display currency ${currency}</p>
        <div class="grid">
          <div class="card"><strong>Income</strong><div>${formatCurrency(summary.total_incomes, currency)}</div></div>
          <div class="card"><strong>Expenses</strong><div>${formatCurrency(summary.total_expenses, currency)}</div></div>
          <div class="card"><strong>Net Balance</strong><div>${formatCurrency(Number(summary.total_incomes) - Number(summary.total_expenses), currency)}</div></div>
          <div class="card"><strong>Savings Rate</strong><div>${summary.savings_rate.toFixed(1)}%</div></div>
        </div>
        <h2>Insights</h2>
        <ul>${insights.map((item) => `<li>${item}</li>`).join('')}</ul>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}
