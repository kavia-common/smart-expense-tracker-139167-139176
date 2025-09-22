import React from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from '../../services/authService';

const routes = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/expenses', label: 'Expenses', icon: '💳' },
  { to: '/categories', label: 'Categories', icon: '🏷️' },
  { to: '/insights', label: 'Insights', icon: '📈' },
  { to: '/receipts', label: 'Receipts', icon: '🧾' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo" />
        <div className="title">
          <span>Ocean Spend</span>
          <span className="subtitle">Expense Tracker</span>
        </div>
      </div>
      <nav className="nav">
        {routes.map((r) => (
          <NavLink key={r.to} to={r.to} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon" aria-hidden>{r.icon}</span>
            <span>{r.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn btn-outline" onClick={() => signOut()}>Sign out</button>
        <div className="muted" style={{ fontSize: 12 }}>Theme: Ocean Professional</div>
      </div>
    </aside>
  );
}
