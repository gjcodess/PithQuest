import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

const STAGE_CONFIG = {
  orientation: { num: 'Prep', title: 'Lab Safety & Intro', step: 0 },
  mission1: { num: 'Stage 1', title: 'Raw Prep & Slicing', step: 1 },
  mission2: { num: 'Stage 2', title: 'Boiling & Softening', step: 2 },
  mission3: { num: 'Stage 3', title: 'Formulation & Mixing', step: 3 },
  mission4: { num: 'Stage 4', title: 'Dehydration', step: 4 },
  mission5: { num: 'Stage 5', title: 'Deep Frying', step: 5 },
  evaluation: { num: 'Mastery', title: 'Sensory & Certificate', step: 6 },
};

export const HeaderHUD = () => {
  const { scene, setScene, score, openModal, isMuted, toggleSound, resetGame, requestConfirm, hideDialogue } = useGame();

  if (scene === 'title') return null;

  const currentStage = STAGE_CONFIG[scene] || { num: 'Lab', title: 'Activity', step: 1 };

  const handleHomeClick = () => {
    soundManager.playClick();
    requestConfirm({
      title: 'Return to Main Menu?',
      message: 'Your progress in this session will be preserved. Would you like to return to the title screen?',
      confirmText: 'Return to Menu',
      cancelText: 'Stay in Lab',
      icon: '🏠',
      onConfirm: () => {
        hideDialogue();
        setScene('title');
      },
    });
  };

  return (
    <header className="game-hud">
      <div className="hud-left">
        <button className="hud-btn" onClick={handleHomeClick} title="Main Menu">
          <span className="icon">🏠</span>
          <span className="label">Menu</span>
        </button>
        <div className="mission-pill">
          <span className="pill-badge">{currentStage.num}</span>
          <span className="pill-title">{currentStage.title}</span>
        </div>
      </div>

      {/* Stepper (1 to 5) */}
      <div className="hud-stepper">
        {[1, 2, 3, 4, 5].map((stepNum, idx) => {
          const isCompleted = currentStage.step > stepNum;
          const isActive = currentStage.step === stepNum;
          const nodeClass = `step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
          const lineClass = `step-line ${currentStage.step > stepNum ? 'filled' : ''}`;

          return (
            <React.Fragment key={stepNum}>
              <div className={nodeClass} title={`Stage ${stepNum}`}>
                <span>{stepNum}</span>
              </div>
              {idx < 4 && <div className={lineClass} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="hud-right">
        <div className="score-display">
          <span className="star-icon">⭐</span>
          <span>{score}</span>
          <span className="pts-label">PTS</span>
        </div>

        <button className="hud-btn" onClick={() => openModal('recipe')} title="View Recipe">
          <span className="icon">📖</span>
          <span className="label">Recipe</span>
        </button>

        <button className="hud-btn" onClick={toggleSound} title={isMuted ? 'Unmute Audio' : 'Mute Audio'}>
          <span className="icon">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>
    </header>
  );
};
