import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { RestartIcon } from './Icons';

const STAGE_CONFIG = {
  orientation: { num: 'Prep', title: 'Orientation & Safety', step: 0 },
  mission1: { num: 'Stage 1', title: 'Washing & Boiling', step: 1 },
  mission2: { num: 'Stage 2', title: 'Pureeing & Grinding', step: 2 },
  mission3: { num: 'Stage 3', title: 'Dough Formulation', step: 3 },
  mission4: { num: 'Stage 4', title: 'Rectangular Molding', step: 4 },
  mission5: { num: 'Stage 5', title: 'Starch Steaming', step: 5 },
  mission6: { num: 'Stage 6', title: 'Cabinet Dehydration', step: 6 },
  mission7: { num: 'Stage 7', title: 'Deep Frying', step: 7 },
  mission8: { num: 'Stage 8', title: 'Packaging & Labeling', step: 8 },
  sequencing: { num: 'Final Exam', title: 'Process Sequencing Exam', step: 9 },
  evaluation: { num: 'Mastery', title: 'Sensory & Achievements', step: 10 },
};

export const HeaderHUD = () => {
  const {
    scene,
    setScene,
    score,
    openModal,
    isMuted,
    toggleSound,
    resetGame,
    requestConfirm,
    hideDialogue,
    restartStage,
    resetStageScore,
    maxUnlockedStage,
    setHoldingItem,
    showToast,
  } = useGame();

  if (scene === 'title') return null;

  const currentStage = STAGE_CONFIG[scene] || { num: 'Lab', title: 'Activity', step: 1 };
  const isStageScene = [
    'orientation',
    'mission1',
    'mission2',
    'mission3',
    'mission4',
    'mission5',
    'mission6',
    'mission7',
    'mission8',
  ].includes(scene);

  const handleStepClick = (stepNum) => {
    if (currentStage.step === stepNum) return;

    if (stepNum <= (maxUnlockedStage || 1)) {
      soundManager.playClick();
      hideDialogue();
      setHoldingItem(null);
      const targetScene = `mission${stepNum}`;
      // Deduct/reset previous score from that stage so player can replay and earn points fresh without double counting
      resetStageScore(targetScene);
      setScene(targetScene);
      const targetConfig = STAGE_CONFIG[targetScene];
      showToast(`Navigated to ${targetConfig?.num || `Stage ${stepNum}`}`, targetConfig?.title || '', 'info');
    } else {
      soundManager.playError();
      showToast('Stage Locked', `Complete Stage ${maxUnlockedStage || 1} first to unlock Stage ${stepNum}!`, 'warning');
    }
  };

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

  const handleRestartClick = () => {
    soundManager.playClick();
    requestConfirm({
      title: `Restart ${currentStage.title}?`,
      message: `Would you like to reset your progress on this workstation? The stage will be reset to the beginning so you can try again.`,
      confirmText: 'Yes, Restart Stage',
      cancelText: 'Continue Activity',
      icon: <RestartIcon size={38} strokeWidth={2.6} className="modal-restart-icon" />,
      onConfirm: () => {
        restartStage();
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

      {/* Stepper (1 to 8) - Interactive Stage Jumper */}
      <div className="hud-stepper">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNum, idx) => {
          const isCompleted = currentStage.step > stepNum;
          const isActive = currentStage.step === stepNum;
          const isUnlocked = stepNum <= (maxUnlockedStage || 1);
          const isClickable = isUnlocked && !isActive;

          const nodeClass = `step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''} ${!isUnlocked ? 'locked' : ''}`;
          const lineClass = `step-line ${currentStage.step > stepNum ? 'filled' : ''}`;

          const tooltipTitle = isActive
            ? `Current Stage: ${STAGE_CONFIG[`mission${stepNum}`]?.title || `Stage ${stepNum}`}`
            : isUnlocked
            ? `Jump to Stage ${stepNum}: ${STAGE_CONFIG[`mission${stepNum}`]?.title || ''}`
            : `Stage ${stepNum} (Locked - Complete earlier stages)`;

          return (
            <React.Fragment key={stepNum}>
              <div
                className={nodeClass}
                data-step={stepNum}
                title={tooltipTitle}
                onClick={() => handleStepClick(stepNum)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    handleStepClick(stepNum);
                  }
                }}
              >
                <span>{stepNum}</span>
              </div>
              {idx < 7 && <div className={lineClass} />}
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

        {isStageScene && (
          <button className="hud-btn hud-btn-restart" onClick={handleRestartClick} title="Restart Current Stage">
            <span className="icon"><RestartIcon size={17} strokeWidth={2.5} /></span>
            <span className="label">Restart</span>
          </button>
        )}

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
