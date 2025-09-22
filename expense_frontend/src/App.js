import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';
import './styles/layout.css';
import './styles/receipts.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import Insights from './pages/Insights';
import Receipts from './pages/Receipts';
import AuthPage from './pages/AuthPage';

// PUBLIC_INTERFACE
export default function App() {
  /** Root App with providers and routing */
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="screen-center">
        <div className="spinner" />
        <p className="muted">Loading...</p>
      </div>
    );
  }

  // If not authenticated show Auth page
  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="app-root ocean-pro">
      <Sidebar />
      <main className="main-area">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
