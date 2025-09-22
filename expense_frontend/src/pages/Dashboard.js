import React, { useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useExpenses } from '../hooks/useExpenses';
import { sumBy, formatCurrency } from '../utils/math';
import { BarByCategory, BudgetVsSpend, CategoryPie } from '../components/common/Charts';

export default function Dashboard() {
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

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid three">
        <Stat title="Total Budget" value={formatCurrency(totalBudget)} />
        <Stat title="Total Spent" value={formatCurrency(totalSpent)} />
        <Stat title="Remaining" value={formatCurrency(Number(totalBudget) - Number(totalSpent))} />
      </div>

      <div className="grid two">
        <BarByCategory data={spendByCategory} />
        <CategoryPie data={spendByCategory} />
      </div>

      <BudgetVsSpend data={budgetVsSpend} />
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="card card-accent">
      <div className="muted" style={{ marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
    </div>
  );
}
