import React, { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { displayDate } from '../utils/date';

export default function Receipts() {
  const { items } = useExpenses();
  const withReceipts = useMemo(() => items.filter((e) => !!e.receipt_url), [items]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h3 className="section-title">Receipts</h3>
        <p className="muted">Upload receipts from the Expenses page when creating or editing an expense. They will appear here.</p>
      </div>

      <div className="grid two">
        {withReceipts.map((r) => (
          <div key={r.id} className="card">
            <div className="muted" style={{ marginBottom: 6 }}>{displayDate(r.date)} · {r.categories?.name || '—'}</div>
            <div className="receipt-frame">
              <a className="badge" href={r.receipt_url} target="_blank" rel="noreferrer">Open receipt</a>
            </div>
          </div>
        ))}
        {withReceipts.length === 0 && (
          <div className="card">
            <div className="muted">No receipts uploaded yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
