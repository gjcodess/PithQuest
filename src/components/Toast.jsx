import React from 'react';
import { useGame } from '../context/GameContext';

export const Toast = () => {
  const { toast, hideToast } = useGame();

  if (!toast.visible) return null;

  const icon =
    toast.type === 'danger' || toast.type === 'error'
      ? '⚠️'
      : toast.type === 'warning'
      ? '💡'
      : toast.type === 'info'
      ? '🧭'
      : '✨';

  return (
    <div
      className={`feedback-toast ${toast.type || 'success'}`}
      onClick={hideToast}
      title="Click to dismiss"
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon-box">
        <span className="toast-icon">{icon}</span>
      </div>
      <div className="toast-body">
        <h4>{toast.title}</h4>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <button
        type="button"
        className="toast-dismiss-btn"
        onClick={(e) => {
          e.stopPropagation();
          hideToast();
        }}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

