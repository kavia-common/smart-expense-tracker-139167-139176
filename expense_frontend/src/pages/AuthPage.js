import React, { useState } from 'react';
import { signInWithMagicLink } from '../services/authService';

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Authentication screen using Supabase magic link */
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const redirectTo = window.location.origin;
      await signInWithMagicLink(email, redirectTo);
      setSent(true);
    } catch (e1) {
      setError(e1.message || 'Failed to send magic link');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen-center">
      <div className="card" style={{ width: 480, maxWidth: '92vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), #ffb34c)' }} />
          <h2 style={{ margin: 0 }}>Ocean Spend</h2>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>Sign in to continue using the Smart Expense Tracker</p>

        {sent ? (
          <div className="card card-accent">
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Check your inbox</div>
            <div className="muted">We sent a magic login link to <b>{email}</b>. Click it to sign in.</div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
            <label>
              <div className="muted" style={{ marginBottom: 4 }}>Email</div>
              <input className="input" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {error && <div style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</div>}
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send Magic Link'}</button>
          </form>
        )}
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          Uses Supabase Auth. Environment variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY
        </div>
      </div>
    </div>
  );
}
