import React from 'react';
import { useGame } from '../../context/GameContext';

export const ObjectivesModal = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'objectives') return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Learning Objectives & Competencies</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="objective-card cognitive">
            <h4>🧠 Cognitive Domain</h4>
            <p>Identify raw coconut pith properties, nutritional benefits (fiber & potassium), and explain the food-processing science of boiling, dehydration, and frying.</p>
          </div>
          <div className="objective-card psychomotor">
            <h4>🛠️ Psychomotor Domain</h4>
            <p>Virtually execute correct kitchen sanitation, knife handling, ingredient formulation, temperature control, and deep-frying timing.</p>
          </div>
          <div className="objective-card affective">
            <h4>🤝 Affective Domain</h4>
            <p>Demonstrate workplace safety, proper PPE adherence, food hygiene, and appreciate agricultural waste valorization into healthy snacks.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={closeModal}>Start Learning</button>
        </div>
      </div>
    </div>
  );
};
