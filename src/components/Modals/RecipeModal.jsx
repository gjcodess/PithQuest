import React from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../../context/GameContext';

export const RecipeModal = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'recipe') return null;

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🥥 Coconut Pith Crackers Standard Recipe (Ubod Crunch)</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="recipe-grid recipe-grid-single">
            <div className="recipe-col">
              <h3>📋 Standard Ingredients & Ratios</h3>
              <ul className="recipe-ingredient-list">
                <li>
                  <strong>🥥 Ubod ng Niyog (Coconut Pith) — 1 Cup:</strong><br />
                  The main raw material. Provides dietary fiber, natural plant nutrients, structure, and the signature coconut-pith character of the cracker.
                </li>
                <li>
                  <strong>🌾 Rice Flour — 1 Cup (1:1 Ratio):</strong><br />
                  Acts as the primary starch binder holding ingredients together. Supplies carbohydrates and creates the firm, crispy fracture snap.
                </li>
                <li>
                  <strong>🧂 Pure Sea Salt — 1 Teaspoon (per cup):</strong><br />
                  Enhances and balances savory flavor; regulates moisture osmosis and supports cellular pureeing.
                </li>
                <li>
                  <strong>💧 Potable Water — 1 Cup (Gradual Hydration):</strong><br />
                  Provides moisture to hydrate starches and achieve uniform, workable dough consistency for molding.
                </li>
                <li>
                  <strong>🍳 Vegetable Oil — 5 Cups (Deep Frying):</strong><br />
                  Used for flash-frying dehydrated pellets; delivers dietary fat, golden-brown color, and characteristic puffing.
                </li>
                <li>
                  <strong>📐 Portioning Standard:</strong><br />
                  Approximately <strong>3 teaspoons per piece</strong> to ensure uniform dimensions, even steaming, and balanced dehydration.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={closeModal}>Got it!</button>
        </div>
      </div>
    </div>,
    document.body
  );
};
