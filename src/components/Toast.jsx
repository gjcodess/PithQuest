import React from 'react';
import { useGame } from '../context/GameContext';

export const Toast = () => {
  const { toast } = useGame();

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
    <div className={`feedback-toast ${toast.type || 'success'}`}>
      <div className="toast-icon-box">
        <span className="toast-icon">{icon}</span>
      </div>
      <div className="toast-body">
        <h4>{toast.title}</h4>
        {toast.message && <p>{toast.message}</p>}
      </div>
    </div>
  );
};

