import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../audio/soundManager';

const ASSETS_TO_PRELOAD = [
  '/images/he_lab_workstation.jpg',
  '/images/bg_stage1_prep.jpg',
  '/images/bg_stage2_boiling.jpg',
  '/images/bg_stage3_formulation.jpg',
  '/images/bg_stage4_dehydration.jpg',
  '/images/bg_stage5_frying.jpg',
  '/images/bg_evaluation_hall.jpg',
  '/images/teacher_mia_neutral.png',
  '/images/teacher_mia_happy.png',
  '/images/teacher_mia_thinking.png',
  '/images/icon_coconut_pith.png',
  '/images/icon_puffed_crackers.png',
  '/assets/platter_crackers_cooled.png',
  '/assets/icon_gold_medal_front.png',
  '/assets/card_step_boiling.png',
  '/assets/card_step_grinding.png',
  '/assets/card_step_mixing.png',
  '/assets/card_step_molding.png',
  '/assets/card_step_steaming.png',
  '/assets/card_step_dehydration.png',
  '/assets/card_step_frying.png',
  '/assets/card_step_packaging.png',
  '/assets/bg_prep.jpg',
  '/assets/bg_boiling.jpg',
  '/assets/bg_formulation.jpg',
  '/assets/bg_dehydration.jpg',
  '/assets/bg_frying.jpg',
  '/assets/bg_evaluation_hall.jpg',
  '/assets/processor_lid.png',
];

export const LoadingScreen = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    let currentProgress = 0;
    let loadedCount = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length;

    // Parallel Asset Preloading
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
      };
    });

    // Simulated organic progress timer for smooth calibration animation
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 3;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (isFadingOut) return;
    if (!audioUnlockedRef.current) {
      try {
        soundManager.init();
        soundManager.playSuccess();
        audioUnlockedRef.current = true;
      } catch (err) {
        console.warn('Audio unlock notice', err);
      }
    }
    setIsFadingOut(true);
    setTimeout(() => {
      if (onLoaded) onLoaded();
    }, 220);
  };

  return (
    <div className={`loading-screen-backdrop ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Background Animated Floating Blurred Stage Cards */}
      <div className="loading-ambient-particles">
        <img src="/assets/card_step_boiling.png" alt="Boiling Step" className="particle-card p1" />
        <img src="/assets/card_step_grinding.png" alt="Grinding Step" className="particle-card p2" />
        <img src="/assets/card_step_mixing.png" alt="Mixing Step" className="particle-card p3" />
        <img src="/assets/card_step_molding.png" alt="Molding Step" className="particle-card p4" />
        <img src="/assets/card_step_steaming.png" alt="Steaming Step" className="particle-card p5" />
        <img src="/assets/card_step_dehydration.png" alt="Dehydration Step" className="particle-card p6" />
        <img src="/assets/card_step_frying.png" alt="Frying Step" className="particle-card p7" />
        <img src="/assets/card_step_packaging.png" alt="Packaging Step" className="particle-card p8" />
      </div>

      {/* Main Minimalist Clean Loading Container */}
      <div className="title-container loading-title-container">
        <div className="title-card loading-card-minimal">
          {/* PITHQUEST Title */}
          <div className="loading-title-group">
            <h1 className="game-logo loading-game-logo">
              PITH<span>QUEST</span>
            </h1>
            <p className="game-subtitle loading-game-subtitle">
              The Coconut Pith Crackers Virtual Laboratory Challenge
            </p>
            <div className="title-divider" />
          </div>

          {/* Loading Progress Bar */}
          <div className="loading-progress-wrapper">
            <div className="loading-progress-header">
              <span className="progress-label">Loading Simulation</span>
              <span className="progress-percent">{progress}%</span>
            </div>

            <div className="loading-progress-track">
              <div
                className="loading-progress-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="progress-light-sweep" />
              </div>
            </div>
          </div>

          {/* Enter Button / Status */}
          <div className="loading-footer">
            {isReady ? (
              <button
                type="button"
                className="btn-primary btn-start btn-enter-lab-pulsing"
                onClick={handleEnter}
                disabled={isFadingOut}
                autoFocus
              >
                <span className="btn-icon">▶</span>
                <span>{isFadingOut ? 'Entering Laboratory...' : 'Enter Laboratory Activity'}</span>
              </button>
            ) : (
              <div className="loading-hint-text">
                <span className="hint-pulse-dot" />
                <span>Loading virtual laboratory assets & interactive stations...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
