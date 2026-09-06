import React from 'react';
import { useGame } from '../../context/GameContext';

export const RecipeModal = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'recipe') return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🥥 Coconut Pith Crackers Standard Recipe (Ubod Crunch)</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="recipe-grid">
            <div className="recipe-col">
              <h3>📋 Ingredients & Formulations</h3>
              <ul>
                <li><strong>Fresh Coconut Pith (Ubod):</strong> 2 Cups (washed, cut, boiled & pureed)</li>
                <li><strong>Erawan Brand Finest Rice Flour:</strong> 2 Cups (1:1 ratio with boiled ubod paste)</li>
                <li><strong>Pure Sea Salt:</strong> 1 teaspoon per 1 cup boiled ubod (2 tsp total)</li>
                <li><strong>Potable Water:</strong> 4 cups for boiling + gradual paste hydration</li>
                <li><strong>Baguio Orchids Vegetable Oil:</strong> 5 cups (for deep frying)</li>
                <li><strong>Portioning Rule:</strong> 3 Teaspoons per cavity in 24-slot silicone mold</li>
              </ul>
            </div>
            <div className="recipe-col">
              <h3>🔬 Processing Science Standards</h3>
              <div className="pillar-item">
                <span className="p-badge">1. Pureeing & Mixing ⚙️</span>
                <p>Pureeing boiled ubod with salt breaks cellulose fibers. Mixing 1:1 with rice flour creates an elastic paste matrix.</p>
              </div>
              <div className="pillar-item">
                <span className="p-badge">2. Steaming (10 min) ♨️</span>
                <p>Steaming gelatinizes the rice starches at 100°C, locking the molded rectangular shapes so they don't crumble.</p>
              </div>
              <div className="pillar-item">
                <span className="p-badge">3. Dehydration (90°C / 12h) 💨</span>
                <p>Reduces moisture to &lt;10% on spaced mesh trays, producing translucent glassy cracker pellets.</p>
              </div>
              <div className="pillar-item">
                <span className="p-badge">4. Flash Frying (10 sec) 🍳</span>
                <p>180°C oil flash-vaporizes residual moisture into steam, puffing the pellets into airy golden crackers!</p>
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
