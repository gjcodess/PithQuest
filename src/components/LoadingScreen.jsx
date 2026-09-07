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
];

const LAB_SETUP_STEPS = [
  { icon: '', text: 'Inspecting raw Ubod ng Niyog (Coconut Pith) harvest...', phase: 'Harvest Quality Check' },
  { icon: '', text: 'Sterilizing virtual laboratory workstations & PPE attire...', phase: 'Lab Sanitation Protocol' },
  { icon: '', text: 'Calibrating potable water boiling & colander stations...', phase: 'Thermal Prep Setup' },
  { icon: '', text: 'Initializing high-speed food processor & S-blade...', phase: 'Puree Matrix Calibration' },
  { icon: '', text: 'Measuring 1:1 formulation ratio with rice flour...', phase: 'Starch Ratio Verification' },
  { icon: '', text: 'Warming starch gelatinization steamer (100°C)...', phase: 'Thermal Softening System' },
  { icon: '', text: 'Powering 90°C convection air dehydrator...', phase: 'Moisture Control Setup' },
  { icon: '', text: 'Stabilizing flash deep-frying wok (180°C hot oil)...', phase: 'Flash Expansion Station' },
  { icon: '', text: 'Food Processing Laboratory setup complete! Ready to start!', phase: 'Virtual Laboratory Ready' },
];

export const LoadingScreen = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
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

    // Simulated organic progress timer for high-fidelity animations
    const interval = setInterval(() => {
      // Calculate organic target progress
      const assetRatio = totalAssets > 0 ? (loadedCount / totalAssets) * 40 : 20;
      const increment = Math.floor(Math.random() * 5) + 2;

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      // Determine step based on progress
      const targetStep = Math.min(
        Math.floor((currentProgress / 100) * LAB_SETUP_STEPS.length),
        LAB_SETUP_STEPS.length - 1
      );
      setStepIndex(targetStep);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 45);

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
    }, 180);
  };

  const currentStep = LAB_SETUP_STEPS[stepIndex] || LAB_SETUP_STEPS[0];

  return (
    <div className={`loading-screen-backdrop ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Background Animated Floating Stage Cards */}
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

      {/* Center 3D Tactile Loading Card */}
      <div className="loading-card-3d">
        {/* Central Animated Laboratory Emblem */}
        <div className="loading-emblem-container">
          <div className="emblem-orbit-ring ring-1" />
          <div className="emblem-orbit-ring ring-2" />
          <div className="emblem-orbit-ring ring-3" />

          <div className="loading-emblem-core">
            <img
              src="/assets/platter_crackers_cooled.png"
              alt="Golden Coconut Pith Crackers"
              className="emblem-img-main"
            />
            {/* Animated Steam / Shimmer Effects */}
            <div className="emblem-steam-waves">
              <span className="steam s1">♨️</span>
              <span className="steam s2">♨️</span>
              <span className="steam s3">♨️</span>
            </div>
          </div>
        </div>

        {/* Game Title & Subtitle */}
        <div className="loading-title-group">
          <h1 className="loading-game-logo">
            PITH<span className="logo-accent">QUEST</span>
          </h1>
          <p className="loading-game-subtitle">
            Coconut Pith Crackers (Ubod CRUNCH) Virtual Laboratory
          </p>
        </div>

        {/* Live Step Status Ticker Box */}
        <div className="loading-step-box">
          <div className="step-phase-pill">
            {currentStep.icon && <span className="step-phase-icon">{currentStep.icon}</span>}
            <span className="step-phase-text">{currentStep.phase}</span>
          </div>
          <p className="step-detail-text">{currentStep.text}</p>
        </div>

        {/* 3D Segmented Progress Bar */}
        <div className="loading-progress-wrapper">
          <div className="loading-progress-header">
            <span className="progress-label">Laboratory Setup & Calibration</span>
            <span className="progress-percent">{progress}%</span>
          </div>

          <div className="loading-progress-track">
            <div
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            >
              {/* Specular Light Sweep Beam */}
              <div className="progress-light-sweep" />
              <div className="progress-pulse-head" />
            </div>
          </div>
        </div>

        {/* Bottom Status / Manual Enter Trigger */}
        <div className="loading-footer">
          {isReady ? (
            <button
              className="btn-enter-lab-pulsing"
              onClick={handleEnter}
              disabled={isFadingOut}
              aria-label="Enter Food Processing Laboratory"
            >
              <span className="btn-pulse-icon">▶</span>
              <span>{isFadingOut ? 'Entering Laboratory...' : 'ENTER LABORATORY'}</span>
            </button>
          ) : (
            <div className="loading-hint-text">
              <span>Optimizing assets, audio engine & interactive workstations</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
