import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/math';
import Modal from '../components/common/Modal';

export default function Categories() {
  const { items, pending, error, add, update, remove } = useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      budget: Number(form.get('budget') || 0)
    };
    if (editing) {
      await update(editing.id, payload);
    } else {
      await add(payload);
    }
    setOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 className="section-title" style={{ flex: 1, margin: 0 }}>Categories</h3>
          <button className="btn btn-secondary" onClick={() => { setEditing(null); setOpen(true); }}>+ Add Category</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Budget</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{formatCurrency(c.budget)}</td>
                <td className="row-actions">
                  <button className="btn btn-outline" onClick={() => { setEditing(c); setOpen(true); }}>Edit</button>
                  <button className="btn btn-outline" onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !pending && (
              <tr><td colSpan="3" className="muted">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
        {pending && <div className="muted" style={{ marginTop: 8 }}>Loading…</div>}
        {error && <div style={{ color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
      </div>

      <Modal open={open} title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn" form="category-form" type="submit">{editing ? 'Save' : 'Create'}</button>
          </>
        }>
        <form id="category-form" onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <label>
            <div className="muted">Name</div>
            <input className="input" name="name" required defaultValue={editing?.name ?? ''} />
          </label>
          <label>
            <div className="muted">Budget</div>
            <input className="input" name="budget" type="number" min="0" step="0.01" defaultValue={editing?.budget ?? 0} />
          </label>
        </form>
      </Modal>
    </div>
  );
}
