import React from 'react';

export default function Alert({ alert, onClose }) {
  if (!alert) return null;
  return (
    <div className={`alert ${alert.type}`} role="alert">
      <span>{alert.text}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
