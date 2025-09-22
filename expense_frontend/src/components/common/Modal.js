import React from 'react';

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="modal-root" style={backdropStyle} onClick={onClose}>
      <div className="card" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 className="section-title" style={{ margin: 0 }}>{title}</h3>
          <button aria-label="Close" className="btn btn-outline" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginBottom: 12 }}>
          {children}
        </div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 50
};
const modalStyle = {
  width: 'min(720px, 92vw)'
};
