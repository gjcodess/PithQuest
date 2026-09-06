import React from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../audio/soundManager';

export const ConfirmModal = () => {
  const { confirmDialog, closeConfirm } = useGame();

  if (!confirmDialog?.visible) return null;

  const handleConfirm = () => {
    soundManager.playSuccess();
    if (typeof confirmDialog.onConfirm === 'function') {
      confirmDialog.onConfirm();
    }
    closeConfirm();
  };

  const handleCancel = () => {
    closeConfirm();
  };

  return createPortal(
    <div className="modal-overlay confirm-modal-overlay" onClick={handleCancel}>
      <div
        className="modal-card confirm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <button
          className="close-btn confirm-close-btn"
          onClick={handleCancel}
          title="Close dialog"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="confirm-modal-header">
          <div className="confirm-icon-badge">
            <span className="confirm-icon">{confirmDialog.icon || '🏠'}</span>
          </div>
        </div>

        <div className="confirm-modal-body">
          <h2 id="confirm-modal-title" className="confirm-title">
            {confirmDialog.title}
          </h2>
          <p className="confirm-message">{confirmDialog.message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button
            type="button"
            className="btn-secondary confirm-btn-cancel"
            onClick={handleCancel}
          >
            {confirmDialog.cancelText || 'Stay in Lab'}
          </button>
          <button
            type="button"
            className="btn-gold confirm-btn-ok"
            onClick={handleConfirm}
            autoFocus
          >
            {confirmDialog.confirmText || 'Yes, Return'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
