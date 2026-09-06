import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { RestartIcon, ZoomInIcon, ZoomOutIcon } from './Icons';

const STAGE_CONFIG = {
  orientation: { num: 'Prep', title: 'Orientation & Safety', step: 0 },
  mission1: { num: 'Stage 1', title: 'Washing & Boiling', step: 1 },
  mission2: { num: 'Stage 2', title: 'Pureeing & Grinding', step: 2 },
  mission3: { num: 'Stage 3', title: 'Paste Formulation', step: 3 },
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
    studentName,
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
    zoomLevel,
    setZoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useGame();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

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
      setIsMenuOpen(false);
      const targetScene = `mission${stepNum}`;
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
    setIsMenuOpen(false);
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
    setIsMenuOpen(false);
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

  const zoomPercent = Math.round(zoomLevel * 100);

  return (
    <header className="game-hud">
      {/* Left: Stage Title Pill */}
      <div className="hud-left">
        <div className="mission-pill">
          <span className="pill-badge">{currentStage.num}</span>
          <span className="pill-title">{currentStage.title}</span>
        </div>
      </div>

      {/* Center: Stepper (1 to 8) - Interactive Stage Jumper */}
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

      {/* Right: Menu Button & Dropdown Container */}
      <div className="hud-right" ref={menuRef}>
        <button
          className={`hud-btn hud-btn-menu ${isMenuOpen ? 'menu-active' : ''}`}
          onClick={() => {
            soundManager.playClick();
            setIsMenuOpen(!isMenuOpen);
          }}
          title={isMenuOpen ? 'Close Menu' : 'Open Laboratory Menu & Settings'}
          aria-expanded={isMenuOpen}
        >
          <span className="icon">{isMenuOpen ? '✕' : '☰'}</span>
          <span className="label">Menu</span>
        </button>

        {/* Flyout Menu Dropdown Panel */}
        {isMenuOpen && (
          <>
            <div
              className="hud-menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="hud-menu-panel" role="dialog" aria-label="Laboratory Menu">
              {/* Menu Top Hero Header */}
              <div className="hud-menu-header">
                <div className="hud-menu-header-content">
                  <div className="hud-menu-top-badge">🥥 Virtual Laboratory Controls</div>
                  <div className="hud-menu-brand-row">
                    <h3 className="hud-menu-logo">PITH<span>QUEST</span></h3>
                    <button
                      className="hud-menu-close-btn"
                      onClick={() => setIsMenuOpen(false)}
                      title="Close Menu"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="hud-menu-stage-strip">
                    <span className="stage-strip-badge">{currentStage.num}</span>
                    <span className="stage-strip-title">{currentStage.title}</span>
                  </div>
                </div>
                <div className="hud-menu-divider" />
              </div>

              <div className="hud-menu-body">
                {/* Full-width Mini Hero Card: Teacher Mia greeting */}
                <div className="hud-menu-hero-card">
                  <img
                    src="/images/teacher_mia_neutral.png"
                    alt="Teacher Mia"
                    className="hud-menu-avatar"
                  />
                  <div className="hud-menu-greeting">
                    <strong>{studentName || 'Food Technologist'}</strong>
                    <p>Keep following standard procedures & safe thermal handling!</p>
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="hud-menu-grid-columns">
                  {/* Column 1: Activity & Navigation */}
                  <div className="hud-menu-col">
                    <span className="hud-menu-section-title">📋 Activity & Navigation</span>

                    {/* Primary Action: Recipe & Standards */}
                    <button
                      className="hud-menu-item-btn recipe-card-btn"
                      onClick={() => {
                        setIsMenuOpen(false);
                        soundManager.playClick();
                        openModal('recipe');
                      }}
                    >
                      <div className="menu-btn-icon-box recipe-icon-box">📖</div>
                      <div className="menu-item-text">
                        <strong>View Recipe & Formulation</strong>
                        <small>1:1 Ubod-to-Rice Flour ratios & science standards</small>
                      </div>
                      <span className="menu-item-arrow">➔</span>
                    </button>

                    {/* Primary Action: Restart Stage */}
                    {isStageScene && (
                      <button
                        className="hud-menu-item-btn restart-card-btn"
                        onClick={handleRestartClick}
                      >
                        <div className="menu-btn-icon-box restart-icon-box">
                          <RestartIcon size={20} strokeWidth={2.5} />
                        </div>
                        <div className="menu-item-text">
                          <strong>Restart Current Stage</strong>
                          <small>Reset workstation progress for {currentStage.title}</small>
                        </div>
                        <span className="menu-item-arrow">➔</span>
                      </button>
                    )}

                    {/* Navigation: Return to Menu */}
                    <button
                      className="hud-menu-item-btn exit-card-btn"
                      onClick={handleHomeClick}
                    >
                      <div className="menu-btn-icon-box exit-icon-box">🏠</div>
                      <div className="menu-item-text">
                        <strong>Exit to Title Screen</strong>
                        <small>Save progress & return to main menu</small>
                      </div>
                      <span className="menu-item-arrow">➔</span>
                    </button>
                  </div>

                  {/* Column 2: Audio & Display Settings */}
                  <div className="hud-menu-col">
                    <span className="hud-menu-section-title">⚙️ Audio & Display</span>

                    {/* Sound Settings Toggle */}
                    <div className="hud-menu-row sound-setting-card">
                      <div className="hud-menu-row-info">
                        <div className="menu-btn-icon-box sound-icon-box">
                          {isMuted ? '🔇' : '🔊'}
                        </div>
                        <div className="menu-item-text">
                          <strong>Sound Effects & Voice</strong>
                          <small>{isMuted ? 'Muted / Silent mode' : 'Active (SFX & Voice)'}</small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`menu-switch-btn ${!isMuted ? 'is-on' : 'is-off'}`}
                        onClick={() => {
                          toggleSound();
                        }}
                        title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                      >
                        <span className="switch-thumb" />
                        <span className="switch-text">{isMuted ? 'OFF' : 'ON'}</span>
                      </button>
                    </div>

                    {/* Screen & HUD Zoom Scaling Section */}
                    <div className="hud-menu-zoom-card">
                      <div className="hud-menu-zoom-head">
                        <div className="zoom-title-stack">
                          <div className="menu-btn-icon-box zoom-icon-box">🔍</div>
                          <div>
                            <strong>Screen & UI Scale</strong>
                            <small>Scale workspace to fit your monitor</small>
                          </div>
                        </div>
                        <span className={`zoom-live-badge ${zoomPercent !== 100 ? 'is-custom' : ''}`}>
                          {zoomPercent}%
                        </span>
                      </div>

                      <div className="hud-menu-zoom-controls">
                        <button
                          type="button"
                          className="zoom-tactile-btn"
                          onClick={zoomOut}
                          disabled={zoomLevel <= 0.5}
                          title="Zoom Out (-5%)"
                          aria-label="Zoom Out"
                        >
                          <ZoomOutIcon size={16} strokeWidth={2.6} />
                        </button>

                        <div className="zoom-slider-wrap">
                          <input
                            type="range"
                            min="50"
                            max="150"
                            step="5"
                            value={zoomPercent}
                            onChange={(e) => setZoomLevel(Number(e.target.value) / 100)}
                            className="zoom-slider-input"
                            aria-label="Screen zoom level"
                            title={`Zoom: ${zoomPercent}%`}
                          />
                        </div>

                        <button
                          type="button"
                          className="zoom-tactile-btn"
                          onClick={zoomIn}
                          disabled={zoomLevel >= 1.5}
                          title="Zoom In (+5%)"
                          aria-label="Zoom In"
                        >
                          <ZoomInIcon size={16} strokeWidth={2.6} />
                        </button>

                        <button
                          type="button"
                          className={`zoom-reset-pill ${zoomPercent === 100 ? 'is-default' : ''}`}
                          onClick={resetZoom}
                          title="Reset Zoom to 100%"
                        >
                          100% Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
