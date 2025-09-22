import React, { useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useExpenses } from '../hooks/useExpenses';
import { sumBy, formatCurrency } from '../utils/math';
import { BarByCategory, BudgetVsSpend, CategoryPie } from '../components/common/Charts';

export default function Insights() {
  const { items: categories, totalBudget } = useCategories();
  const { items: expenses, total: totalSpent } = useExpenses();

  const spendByCategory = useMemo(() => {
    const map = new Map();
    for (const e of expenses) {
      const name = e.categories?.name || 'Uncategorized';
      map.set(name, (map.get(name) || 0) + Number(e.amount || 0));
    }
    return Array.from(map.entries()).map(([name, amount]) => ({ name, amount: Number(amount.toFixed(2)) }));
  }, [expenses]);

  const budgetVsSpend = useMemo(() => {
    return categories.map((c) => {
      const spent = sumBy(expenses.filter((e) => e.category_id === c.id), (e) => Number(e.amount || 0));
      return { name: c.name, budget: Number(c.budget || 0), spent: Number(spent) };
    });
  }, [categories, expenses]);

  const topCategory = useMemo(() => {
    if (!spendByCategory.length) return null;
    return spendByCategory.slice().sort((a,b) => b.amount - a.amount)[0];
  }, [spendByCategory]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid three">
        <div className="card card-accent">
          <div className="muted">Total Budget</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatCurrency(totalBudget)}</div>
        </div>
        <div className="card card-accent">
          <div className="muted">Total Spent</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{formatCurrency(totalSpent)}</div>
        </div>
        <div className="card card-accent">
          <div className="muted">Top Category</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{topCategory ? `${topCategory.name} (${formatCurrency(topCategory.amount)})` : '—'}</div>
        </div>
      </div>

      <div className="grid two">
        <BarByCategory data={spendByCategory} />
        <CategoryPie data={spendByCategory} />
      </div>

      <BudgetVsSpend data={budgetVsSpend} />
    </div>
  );
}
