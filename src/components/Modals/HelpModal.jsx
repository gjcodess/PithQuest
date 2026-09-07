import React from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../../context/GameContext';

const HELP_SECTIONS = [
  {
    icon: '🥼',
    title: '1. Diagnostic Pre-Test Assessment',
    description:
      'Before entering the commercial laboratory, complete 4 essential safety and knowledge evaluations: PPE attire verification, 7-step sanitary handwashing reordering, tool safety inspection, and ingredient quality clearance.',
  },
  {
    icon: '🧪',
    title: '2. Interactive Laboratory Workstations (Stages 1–8)',
    description:
      'Progress through each standardized production stage from raw coconut pith preparation to final packaging. Follow Teacher Mia’s guidance, interact with workstation equipment, and monitor temperature, ratios, and timers.',
  },
  {
    icon: '👩‍🏫',
    title: '3. Teacher Mia Companion & Guidance',
    description:
      'Look for the floating circular avatar in the bottom-left corner. When she has a new tip or standard procedure, a glowing indicator will appear. Click her avatar anytime to view step notes, safety hints, and science insights.',
  },
  {
    icon: '🧩',
    title: '4. Post-Test Process Sequencing',
    description:
      'After completing all 8 processing stages, demonstrate mastery by arranging the full coconut pith cracker production chain in correct chronological order.',
  },
  {
    icon: '📊',
    title: '5. Comprehensive Audit & Certificate',
    description:
      'Review your diagnostic pre-test vs. post-test improvements, PPE safety audit, stage-by-stage performance metrics, and receive your official Certificate of Completion.',
  },
  {
    icon: '⚙️',
    title: '6. Audio, Zoom & Navigation Controls',
    description:
      'Click the top-right Menu button at any time to toggle sound effects and voice, adjust the screen zoom scale (50%–150%) to fit your display, restart a stage, or access recipe standards.',
  },
];

export const HelpModal = () => {
  const { activeModal, closeModal } = useGame();

  if (activeModal !== 'help') return null;

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card help-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>❓ How to Play & Laboratory User Guide</h2>
          <button className="close-btn" onClick={closeModal} title="Close Modal">&times;</button>
        </div>

        <div className="modal-body help-modal-body">
          <p className="help-intro-text">
            Welcome to <strong>PithQuest</strong>! This interactive virtual laboratory simulates the scientific preparation 
            and commercial manufacturing of <strong>Coconut Pith (Ubod) Crackers</strong>. Here is your quick start guide:
          </p>

          <div className="help-sections-grid">
            {HELP_SECTIONS.map((sec, idx) => (
              <div key={idx} className="help-card-item">
                <div className="help-card-icon">{sec.icon}</div>
                <div className="help-card-content">
                  <h4 className="help-card-title">{sec.title}</h4>
                  <p className="help-card-desc">{sec.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="help-tip-box">
            <span className="tip-icon">💡</span>
            <div className="tip-content">
              <strong>Need instant assistance during a stage?</strong>
              <p>Click Teacher Mia’s floating avatar in the bottom-left corner at any time to check lab hints or standard operating procedures.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={closeModal}>
            Got It! Back to Lab
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
