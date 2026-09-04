import React from 'react';
import { useGame } from '../../context/GameContext';

export const RecipeModal = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'recipe') return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🥥 Coconut Pith Crackers Standard Recipe</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="recipe-grid">
            <div className="recipe-col">
              <h3>📋 Ingredients (Standard Batch)</h3>
              <ul>
                <li><strong>Fresh Coconut Pith (Ubod):</strong> 200g (washed, sliced, boiled & pureed)</li>
                <li><strong>Tapioca Starch / Cornstarch:</strong> 100g (binder & puffing agent)</li>
                <li><strong>Water:</strong> 50ml (for starch hydration)</li>
                <li><strong>Iodized Salt:</strong> 1 teaspoon (flavor & moisture regulator)</li>
                <li><strong>Garlic & Onion Powder:</strong> 1 teaspoon (savory aromatics)</li>
                <li><strong>Refined Sugar:</strong> 1/2 teaspoon (flavor balance)</li>
                <li><strong>Vegetable Cooking Oil:</strong> 500ml (for deep frying)</li>
              </ul>
            </div>
            <div className="recipe-col">
              <h3>🔬 The 3 Core Processing Pillars</h3>
              <div className="pillar-item">
                <span className="p-badge">1. Boiling 🫕</span>
                <p>Hydrolyzes tough cellulose fibers of the ubod, softening it for smooth pureeing and even blending with starches.</p>
              </div>
              <div className="pillar-item">
                <span className="p-badge">2. Dehydration ☀️</span>
                <p>Reduces moisture content to under 10%. Creates glassy, hardened pellets suitable for prolonged storage.</p>
              </div>
              <div className="pillar-item">
                <span className="p-badge">3. Deep Frying 🍳</span>
                <p>180°C hot oil instantly flash-steams residual micro-moisture, puffing the starch matrix into crispy, light crackers!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={closeModal}>Got it!</button>
        </div>
      </div>
    </div>
  );
};
