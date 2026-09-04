import React from 'react';
import { useGame } from '../context/GameContext';

export const Toast = () => {
  const { toast } = useGame();

  if (!toast.visible) return null;

  const icon = toast.type === 'danger' ? '⚠️' : toast.type === 'warning' ? '💡' : '✨';

  return (
    <div className={`feedback-toast ${toast.type}`}>
      <div className="toast-icon">{icon}</div>
      <div className="toast-body">
        <h4>{toast.title}</h4>
        <p>{toast.message}</p>
      </div>
    </div>
  );
};
