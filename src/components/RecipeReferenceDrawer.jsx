import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { soundManager } from '../audio/soundManager';

/**
 * RecipeReferenceDrawer:
 * A sleek floating badge ("📋 Recipe & Safety Reference") in the upper corner of the countertop.
 * When clicked, it opens a clean slide-down modal card showing the mise en place ratios and safety rules.
 */
export const RecipeReferenceDrawer = ({
  stageTitle = 'Stage Guide',
  recipeItems = [],
  safetyNotes = [],
  culinaryTip = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="btn-recipe-guide-trigger"
        onClick={() => {
          soundManager.playClick();
          setIsOpen(!isOpen);
        }}
        title="View Recipe Standards & Safety Guidelines"
      >
        <span className="trigger-icon">📋</span>
        <span className="trigger-label">Recipe & Safety Reference</span>
      </button>

      {/* Modal / Drawer Overlay Rendered on Top of Everything via Portal */}
      {isOpen &&
        createPortal(
          <div className="recipe-drawer-backdrop" onClick={() => setIsOpen(false)}>
            <div className="recipe-drawer-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="recipe-drawer-header">
              <div className="drawer-title-group">
                <span className="drawer-badge">Home Economics Guide</span>
                <h4 className="drawer-title">{stageTitle} Reference</h4>
              </div>
              <button
                className="btn-drawer-close"
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="recipe-drawer-body">
              {/* Recipe Ratios */}
              {recipeItems && recipeItems.length > 0 && (
                <div className="drawer-section">
                  <h5 className="drawer-section-title">🥥 Standard Recipe Measurements</h5>
                  <div className="drawer-recipe-grid">
                    {recipeItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`drawer-recipe-pill ${item.isCompleted ? 'is-completed' : ''} ${item.isCurrent ? 'is-current' : ''}`}
                      >
                        <span className="pill-emoji">{item.icon || '🥣'}</span>
                        <div className="pill-details">
                          <span className="pill-name">{item.name}</span>
                          <strong className="pill-amount">{item.measure || item.amount}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Rules */}
              {safetyNotes && safetyNotes.length > 0 && (
                <div className="drawer-section">
                  <h5 className="drawer-section-title">🛡️ Laboratory Safety & Quality Check</h5>
                  <div className="drawer-safety-list">
                    {safetyNotes.map((note, idx) => (
                      <div key={idx} className="drawer-safety-row">
                        <span className="safety-icon">{note.icon || '🛡️'}</span>
                        <div className="safety-text">
                          <strong>{note.title}: </strong>
                          <span>{note.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Culinary Tip */}
              {culinaryTip && (
                <div className="drawer-tip-box">
                  <span className="tip-icon">💡</span>
                  <div className="tip-text">
                    <strong>Food Technology Principle:</strong>
                    <p>{culinaryTip}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="recipe-drawer-footer">
              <button
                className="btn-drawer-ok"
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
