import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission3Mixing = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Mixing bowl states:
  // 0: Empty stainless bowl -> accept rice_flour
  // 1: Bowl with rice flour -> accept salt
  // 2: Bowl with flour + salt -> accept ubod_paste
  // 3: Bowl with flour + salt + paste -> accept water
  // 4: All ingredients in bowl -> action: fold & knead dough
  // 5: Kneading in progress
  // 6: Smooth pliable dough ball ready
  const [bowlStep, setBowlStep] = useState(0);
  const [kneadProgress, setKneadProgress] = useState(0);
  const [isKneading, setIsKneading] = useState(false);

  useEffect(() => {
    speak(
      'Stage 3: Dough Formulation & Mixing! In our large stainless steel bowl, we will formulate our 1:1 recipe using Erawan Rice Flour, Salt, Ubod Paste, and Gradual Water.',
      'neutral',
      {
        badge: 'Stage 3: Formulation',
        hint: 'First, add the Erawan Rice Flour into the stainless mixing bowl.',
        hideButton: true,
      }
    );
  }, []);

  const bowlSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['rice_flour'],
      prompt: 'Pour Erawan Rice Flour (1:1 ratio base) into the bowl',
      img: '/assets/mixing_bowl_empty.png',
      fallbackIcon: '🥣',
      label: 'Empty Stainless Mixing Bowl',
    },
    {
      stepIndex: 1,
      acceptedItems: ['salt'],
      prompt: 'Add measured Pure Sea Salt into the flour',
      img: '/assets/mixing_bowl_dry_ingredients.png',
      fallbackIcon: '🌾',
      label: 'Bowl with Rice Flour',
    },
    {
      stepIndex: 2,
      acceptedItems: ['ubod_paste'],
      prompt: 'Add pureed Boiled Ubod Paste into the dry mixture',
      img: '/assets/mixing_bowl_paste_added.png',
      fallbackIcon: '🧂',
      label: 'Flour + Salt Dry Mix',
    },
    {
      stepIndex: 3,
      acceptedItems: ['water_hydration', 'water'],
      prompt: 'Add measured potable water gradually to hydrate the starches',
      img: '/assets/mixing_bowl_water_pouring.png',
      fallbackIcon: '🥥',
      label: 'Flour + Paste Mixture',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'All ingredients added! Fold with spatula and knead into dough',
      img: '/assets/mixing_bowl_mixing_in_progress.png',
      fallbackIcon: '🥣',
      label: 'Hydrated Formulation Mix',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Folding and kneading into a cohesive, non-sticky dough ball...',
      img: '/assets/mixing_bowl_mixing_in_progress.png',
      fallbackIcon: '🥯',
      label: 'Kneading in Progress',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Pliable, elastic coconut pith dough ball ready for molding!',
      img: '/assets/mixing_bowl_dough_uniform.png',
      fallbackIcon: '✨',
      label: 'Smooth Cracker Dough Ball',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'rice_flour') {
      soundManager.playPour();
      setBowlStep(1);
      addScore(20);
      showToast('Rice Flour Added!', 'Next: Add Sea Salt to distribute evenly in dry mix.', 'success');
      speak(
        'Rice flour added! Now add the Pure Sea Salt so it blends thoroughly into the dry flour particles.',
        'neutral',
        {
          badge: 'Dry Mixing',
          hint: 'Select Sea Salt and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'salt' || item.id === 'sea_salt')) {
      soundManager.playClick();
      setBowlStep(2);
      addScore(20);
      showToast('Salt Added!', 'Next: Add the pureed Boiled Ubod Paste.', 'success');
      speak(
        'Dry seasoning combined! Now drop in the pureed Coconut Pith Paste from Stage 2.',
        'neutral',
        {
          badge: 'Pulp Addition',
          hint: 'Select Ubod Paste and drop it into the mixing bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && item.id === 'ubod_paste') {
      soundManager.playPour();
      setBowlStep(3);
      addScore(20);
      showToast('Ubod Paste Added!', 'Now add gradual water to hydrate the starches.', 'success');
      speak(
        'Great 1:1 proportion! Finally, add the calibrated Water to hydrate the rice starch granules.',
        'neutral',
        {
          badge: 'Starch Hydration',
          hint: 'Select Water and drop it into the mixing bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 3 && (item.id === 'water_hydration' || item.id === 'water')) {
      soundManager.playPour();
      setBowlStep(4);
      addScore(25);
      showToast('Formulation Complete!', 'Click "Fold & Knead Dough" to form the dough ball.', 'success');
      speak(
        'All formulation ingredients are in the bowl! Use the red silicone spatula to fold and knead the mixture until smooth and non-sticky.',
        'happy',
        {
          badge: 'Kneading Stage',
          hint: 'Click the "Fold & Knead Dough" button on the workstation.',
          hideButton: true,
        }
      );
    }
  };

  const handleKneadDough = () => {
    soundManager.playClick();
    setIsKneading(true);
    setBowlStep(5);
    showToast('Kneading Dough...', 'Folding starch and ubod fibers together...', 'info');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setKneadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsKneading(false);
        setBowlStep(6);
        soundManager.playSuccess();
        addScore(35);
        unlockBadge('dough_artisan', 'Dough Matrix Artisan', '🥯');
        completeMission('mission3');
        showToast('Dough Formed!', 'Smooth, pliable dough ball ready for molding (+35 pts)', 'success');
        speak(
          'Outstanding kneading! The dough is perfectly cohesive, non-sticky, and pliable. The rice flour starch matrix is fully hydrated and ready for rectangular portioning in Stage 4!',
          'happy',
          {
            badge: 'Stage 3 Complete',
            btnText: 'Proceed to Stage 4: Rectangular Molding ➔',
            onNext: () => setScene('mission4'),
          }
        );
      }
    }, 600);
  };

  return (
    <div className="workstation-scene mixing-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Recipe Formulations */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>📋 Formulation Tray</span>
          </div>
          <div className="inventory-vertical-list">
            {/* Rice Flour */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'rice_flour' ? 'active-held' : ''} ${bowlStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'rice_flour' ? null : { id: 'rice_flour', name: 'Erawan Rice Flour', img: '/assets/portion_rice_flour_1cup.png', icon: '🌾' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'rice_flour', name: 'Erawan Rice Flour' }));
              }}
            >
              <img src="/assets/portion_rice_flour_1cup.png" alt="Rice Flour" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Erawan Rice Flour</strong>
                <span>2 Cups (1:1 Ratio)</span>
              </div>
            </div>

            {/* Salt */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'salt' ? 'active-held' : ''} ${bowlStep === 1 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'salt' ? null : { id: 'salt', name: 'Pure Sea Salt', img: '/assets/portion_salt_1tsp.png', icon: '🧂' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'salt', name: 'Pure Sea Salt' }));
              }}
            >
              <img src="/assets/portion_salt_1tsp.png" alt="Sea Salt" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Pure Sea Salt</strong>
                <span>Dry Seasoning</span>
              </div>
            </div>

            {/* Ubod Paste */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'ubod_paste' ? 'active-held' : ''} ${bowlStep === 2 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'ubod_paste' ? null : { id: 'ubod_paste', name: 'Ubod Paste', img: '/assets/portion_ubod_paste_1cup.png', icon: '🥥' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'ubod_paste', name: 'Ubod Paste' }));
              }}
            >
              <img src="/assets/portion_ubod_paste_1cup.png" alt="Ubod Paste" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Silky Ubod Paste</strong>
                <span>From Food Processor</span>
              </div>
            </div>

            {/* Hydration Water */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'water_hydration' ? 'active-held' : ''} ${bowlStep === 3 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'water_hydration' ? null : { id: 'water_hydration', name: 'Hydration Water', img: '/assets/portion_water_1cup.png', icon: '💧' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'water_hydration', name: 'Hydration Water' }));
              }}
            >
              <img src="/assets/portion_water_1cup.png" alt="Water" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Hydration Water</strong>
                <span>Gradual Addition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Stainless Mixing Bowl MultiStateContainer */}
        <div className="station-center-card">
          <MultiStateContainer
            containerId="mixing_bowl"
            title="Stainless Steel Mixing Bowl"
            subtitle="1:1 Ratio Formulation with Red Spatula"
            currentStepIndex={bowlStep}
            steps={bowlSteps}
            onItemAccepted={handleItemAccepted}
            containerWidth="380px"
            containerHeight="260px"
            interactiveAction={
              bowlStep === 4
                ? {
                    label: '🥣 Fold & Knead Dough with Spatula',
                    onClick: handleKneadDough,
                    icon: '🥣',
                  }
                : bowlStep === 5
                ? {
                    label: `Kneading... ${kneadProgress}%`,
                    disabled: true,
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Tool & Dough Preview */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🥄 Tools & Dough Status</span>
          </div>
          <div className="tool-preview-box">
            <div className="spatula-badge" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/assets/tool_spatula_red.png" alt="Red Spatula" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div className="spat-text">
                <strong>Red Silicone Spatula</strong>
                <span>For clean bowl scraping & folding</span>
              </div>
            </div>

            <div className="dough-texture-indicator">
              <div className="texture-label">Dough Cohesiveness:</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(bowlStep / 6) * 100}%` }}
                />
              </div>
              <span className="texture-desc">
                {bowlStep < 4 ? 'Awaiting Ingredients' : bowlStep < 6 ? 'Hydrated & Mixing' : '✨ Pliable & Non-Sticky'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
