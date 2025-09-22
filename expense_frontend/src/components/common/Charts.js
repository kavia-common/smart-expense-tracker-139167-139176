import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

export function BarByCategory({ data }) {
  return (
    <div className="card">
      <h3 className="section-title">Spending by Category</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip contentStyle={{ background: '#0b0f14', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <Bar dataKey="amount" fill="var(--primary)" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BudgetVsSpend({ data }) {
  const colors = ['var(--secondary)', 'var(--primary)'];
  return (
    <div className="card">
      <h3 className="section-title">Budget vs Spent</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip contentStyle={{ background: '#0b0f14', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <Line type="monotone" dataKey="budget" stroke={colors[0]} strokeWidth={3} />
            <Line type="monotone" dataKey="spent" stroke={colors[1]} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryPie({ data }) {
  const palette = ['#F97316','#10B981','#3B82F6','#A855F7','#EF4444','#F59E0B','#22D3EE','#84CC16'];
  return (
    <div className="card">
      <h3 className="section-title">Category Share</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip contentStyle={{ background: '#0b0f14', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <Pie data={data} dataKey="amount" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {data.map((_, i) => (<Cell key={i} fill={palette[i % palette.length]} />))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
