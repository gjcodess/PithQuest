import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SequencingActivity } from '../components/SequencingActivity';

export const SequencingScene = () => {
  const { studentName, setScene, speak, hideDialogue } = useGame();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    speak(
      `Welcome to the Final Step before Graduation, ${studentName || 'Food Technologist'}! To prove your comprehensive mastery of the Coconut Pith Cracker (Ubod CRUNCH) processing technology, arrange all 8 manufacturing stages in their proper chronological sequence from left to right.`,
      'thinking',
      {
        badge: 'Final Examination',
        hint: 'Drag and re-order the cards from Stage 1 (Washing & Boiling) to Stage 8 (Packaging & Labeling), then click "Verify Chronological Order".',
        hideButton: true,
      }
    );
  }, []);

  const handleSequenceCompleted = () => {
    setIsCompleted(true);
    soundManager.playFanfare();
    speak(
      `Outstanding recall, ${studentName || 'Master Food Technologist'}! You have verified the complete 8-stage food processing pipeline without a flaw. You are now officially cleared for graduation! Click below to review your comprehensive sensory audit, earned achievements, and claim your official certificate!`,
      'happy',
      {
        badge: 'Mastery Validated',
        btnText: 'View Sensory Audit, Achievements & Certificate ➔',
        onNext: () => setScene('evaluation'),
      }
    );
  };

  const handleProceedToEvaluation = () => {
    soundManager.playClick();
    hideDialogue();
    setScene('evaluation');
  };

  return (
    <div className="sequencing-scene">
      <div className="sequencing-page-container">
        {/* Header Hero Banner */}
        <div className="sequencing-hero-header">
          <div className="hero-exam-badge">
            <span className="exam-icon">🧪</span>
            <span>FINAL STEP • PROCESS SEQUENCE VALIDATION EXAM</span>
          </div>
          <h2 className="hero-exam-title">Coconut Pith Crackers Pipeline Validation</h2>
          <p className="hero-exam-desc">
            Reconstruct the exact sequential lifecycle of <strong>Ubod ng Niyog - Ubod CRUNCH</strong> before accessing your final laboratory achievements, sensory quality audit, and official certification.
          </p>
        </div>

        {/* Interactive Sequencing Puzzle Card */}
        <div className="sequencing-puzzle-wrapper">
          <SequencingActivity onComplete={handleSequenceCompleted} />
        </div>

        {/* Post-Completion Glowing Call To Action */}
        {isCompleted && (
          <div className="sequencing-success-cta">
            <div className="success-badge-card">
              <span className="success-medal">🏅</span>
              <div className="success-text-info">
                <h3>Laboratory Validation Completed!</h3>
                <p>All 8 production stages verified. Your final sensory report and certificate are ready.</p>
              </div>
              <button className="btn-gold btn-proceed-mastery" onClick={handleProceedToEvaluation}>
                <span>View Final Achievements & Certificate ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom clearance spacer */}
        <div style={{ height: '40px', flexShrink: 0 }} />
      </div>
    </div>
  );
};
