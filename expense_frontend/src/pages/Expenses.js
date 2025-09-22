import React, { useMemo, useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { displayDate, toISODateInput } from '../utils/date';
import { formatCurrency } from '../utils/math';
import Modal from '../components/common/Modal';
import { uploadReceipt } from '../services/expenseService';

export default function Expenses() {
  const [categoryId, setCategoryId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filters = useMemo(() => ({ categoryId: categoryId || undefined, from: from || undefined, to: to || undefined }), [categoryId, from, to]);
  const { items, pending, error, add, update, remove, refetch } = useExpenses(filters);
  const { items: cats } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setModalOpen(true); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      amount: Number(form.get('amount')),
      note: form.get('note') || '',
      date: form.get('date'),
      category_id: form.get('category_id') || null,
      receipt_url: null
    };

    // Handle optional receipt upload
    const receipt = form.get('receipt');
    if (receipt && receipt.size > 0) {
      payload.receipt_url = await uploadReceipt(null, receipt); // userId is resolved in service path using provided arg; here null -> will use auth user in service.
    }

    if (editing) {
      await update(editing.id, payload);
    } else {
      await add(payload);
    }
    setModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220 }}>
            <div className="muted">Category</div>
            <select className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <div className="muted">From</div>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <div className="muted">To</div>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button className="btn" onClick={() => refetch()}>Apply</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={openAdd}>+ Add Expense</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Receipt</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>{displayDate(row.date)}</td>
                <td>{row.categories?.name || '—'}</td>
                <td>{row.note}</td>
                <td>{formatCurrency(row.amount)}</td>
                <td>{row.receipt_url ? <a className="badge" href={row.receipt_url} target="_blank" rel="noreferrer">View</a> : <span className="muted">—</span>}</td>
                <td className="row-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(row)}>Edit</button>
                  <button className="btn btn-outline" onClick={() => remove(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !pending && (
              <tr><td colSpan="6" className="muted">No expenses yet.</td></tr>
            )}
          </tbody>
        </table>
        {pending && <div className="muted" style={{ marginTop: 8 }}>Loading…</div>}
        {error && <div style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Expense' : 'Add Expense'} onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn" form="expense-form" type="submit">{editing ? 'Save' : 'Create'}</button>
          </>
        }
      >
        <form id="expense-form" onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <label>
            <div className="muted">Amount</div>
            <input className="input" name="amount" type="number" min="0" step="0.01" required defaultValue={editing?.amount ?? ''} />
          </label>
          <div className="grid two">
            <label>
              <div className="muted">Date</div>
              <input className="input" name="date" type="date" required defaultValue={editing?.date ?? toISODateInput()} />
            </label>
            <label>
              <div className="muted">Category</div>
              <select className="select" name="category_id" defaultValue={editing?.category_id ?? ''}>
                <option value="">—</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <label>
            <div className="muted">Note</div>
            <input className="input" name="note" type="text" placeholder="What was this for?" defaultValue={editing?.note ?? ''} />
          </label>
          <label>
            <div className="muted">Receipt (optional)</div>
            <input className="input" name="receipt" type="file" accept="image/*,application/pdf" />
          </label>
        </form>
      </Modal>
    </div>
  );
}
