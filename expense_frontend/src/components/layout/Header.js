import React, { useMemo } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/math';

export default function Header() {
  const { items: cats, totalBudget } = useCategories();
  const { total: totalSpent } = useExpenses();
  const remaining = useMemo(() => Number(totalBudget) - Number(totalSpent), [totalBudget, totalSpent]);

  return (
    <header className="header">
      <div className="summary">
        <KPI label="Total Budget" value={formatCurrency(totalBudget)} />
        <KPI label="Total Spent" value={formatCurrency(totalSpent)} />
        <KPI label="Remaining" value={formatCurrency(remaining)} highlight={remaining >= 0 ? 'good' : 'bad'} />
      </div>
      <div>
        <span className="badge">Categories: {cats.length}</span>
      </div>
    </header>
  );
}

function KPI({ label, value, highlight }) {
  const color = highlight === 'good' ? 'var(--secondary)' : highlight === 'bad' ? 'var(--danger)' : 'var(--text)';
  return (
    <div className="kpi card card-accent" style={{ minWidth: 160 }}>
      <span className="label">{label}</span>
      <span className="value" style={{ color }}>{value}</span>
    </div>
  );
}
