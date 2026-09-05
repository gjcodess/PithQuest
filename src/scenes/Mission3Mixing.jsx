import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

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
        hint: 'Select the Erawan Rice Flour from your bottom inventory shelf and add it into the bowl.',
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
        'Rice flour added! Now add the Pure Sea Salt from the bottom shelf so it blends thoroughly into the dry flour particles.',
        'neutral',
        {
          badge: 'Dry Blending',
          hint: 'Select Pure Sea Salt from the bottom shelf and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && item.id === 'salt') {
      soundManager.playClick();
      setBowlStep(2);
      addScore(20);
      showToast('Salt Added!', 'Next: Add Silky Ubod Paste (1:1 Ratio).', 'success');
      speak(
        'Salt blended! Now add the pureed Boiled Ubod Paste into the bowl to achieve our 1:1 starch-to-pith ratio.',
        'happy',
        {
          badge: '1:1 Ratio Formulation',
          hint: 'Select Ubod Paste on the bottom shelf and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && item.id === 'ubod_paste') {
      soundManager.playPour();
      setBowlStep(3);
      addScore(25);
      showToast('Ubod Paste Added!', 'Next: Add Hydration Water gradually.', 'success');
      speak(
        'Paste incorporated! Now add the Hydration Water gradually to hydrate the starch granules for gelatinization.',
        'neutral',
        {
          badge: 'Hydration Control',
          hint: 'Select Hydration Water and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 3 && (item.id === 'water_hydration' || item.id === 'water')) {
      soundManager.playPour();
      setBowlStep(4);
      addScore(25);
      showToast('Hydration Complete!', 'All ingredients added! Fold and knead with spatula.', 'success');
      speak(
        'All formulation ingredients are in the bowl! Now click the "Fold & Knead Dough" button to develop a non-sticky, pliable dough ball.',
        'thinking',
        {
          badge: 'Dough Kneading',
          hint: 'Click "Fold & Knead Dough with Spatula".',
          hideButton: true,
        }
      );
    }
  };

  const handleKneadDough = () => {
    soundManager.playClick();
    setIsKneading(true);
    setBowlStep(5);
    showToast('Kneading Dough...', 'Forming starch-protein matrix with spatula...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setKneadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsKneading(false);
        setBowlStep(6);
        soundManager.playSuccess();
        addScore(35);
        unlockBadge('dough_master', 'Starch Formulation Chemist', '🥯');
        completeMission('mission3');
        showToast('Dough Ball Formed!', 'Pliable, elastic, non-sticky dough ready (+35 pts)', 'success');
        speak(
          'Masterpiece! The dough has achieved the exact desired texture: smooth, elastic, and completely non-sticky. Ready for rectangular molding in Stage 4!',
          'happy',
          {
            badge: 'Stage 3 Complete',
            btnText: 'Proceed to Stage 4: Portioning & Molding ➔',
            onNext: () => setScene('mission4'),
          }
        );
      }
    }, 600);
  };

  const stage3Inventory = [
    {
      id: 'rice_flour',
      name: 'Erawan Rice Flour',
      measure: '2 Cups (1:1 Base)',
      img: '/assets/portion_rice_flour_1cup.png',
      fallbackIcon: '🌾',
      isUsed: bowlStep >= 1,
      isNext: bowlStep === 0,
      tooltip: 'Erawan brand fine white rice flour',
    },
    {
      id: 'salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Sea Salt)',
      img: '/assets/ing_salt_fresh.png',
      fallbackIcon: '🧂',
      isUsed: bowlStep >= 2,
      isNext: bowlStep === 1,
      tooltip: '1 tsp pure white sea salt',
    },
    {
      id: 'ubod_paste',
      name: 'Silky Ubod Paste',
      measure: '2 Cups Puree',
      img: '/assets/portion_ubod_paste_1cup.png',
      fallbackIcon: '🥥',
      isUsed: bowlStep >= 3,
      isNext: bowlStep === 2,
      tooltip: 'Smooth boiled coconut pith puree',
    },
    {
      id: 'water_hydration',
      name: 'Hydration Water',
      measure: 'Gradual Addition',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: bowlStep >= 4,
      isNext: bowlStep === 3,
      tooltip: 'Clean potable water for starch hydration',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Fold & Knead',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: bowlStep >= 6,
      isNext: bowlStep === 4,
      onClick: bowlStep === 4 ? handleKneadDough : undefined,
      tooltip: 'Red silicone spatula for dough folding',
    },
    {
      id: 'measuring_cups',
      name: 'Measuring Cups',
      measure: '1:1 Volume Ratio',
      img: '/assets/tool_measuring_cups.png',
      fallbackIcon: '📏',
      isUsed: bowlStep >= 2,
      isNext: false,
      tooltip: 'Stainless steel measuring cups for exact 1:1 flour-to-puree ratio',
    },
    {
      id: 'mixing_bowl',
      name: 'Large Mixing Bowl',
      measure: 'Stainless Steel',
      img: '/assets/tool_mixing_bowl_large.png',
      fallbackIcon: '🥣',
      isUsed: false,
      isNext: false,
      tooltip: 'Safe stainless steel commercial mixing bowl',
    },
  ];

  return (
    <div className="workstation-scene mixing-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '880px' }}>
          {/* Center: Stainless Mixing Bowl MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="mixing_bowl"
              title="Stainless Steel Mixing Bowl"
              subtitle="1:1 Ratio Formulation with Red Spatula"
              currentStepIndex={bowlStep}
              steps={bowlSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="440px"
              containerHeight="290px"
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

          {/* Right Side: Tool & Dough Preview Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🥄 Tools & Dough Status</span>
            </div>
            <div className="tool-preview-box">
              <div className="spatula-badge" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/assets/tool_spatula_red.png" alt="Red Spatula" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                <div className="spat-text">
                  <strong>Red Silicone Spatula</strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>For folding & kneading</span>
                </div>
              </div>

              <div className="spatula-badge" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <img src="/assets/tool_measuring_cups.png" alt="Measuring Cups" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                <div className="spat-text">
                  <strong>Measuring Cups</strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>1:1 Standard ratio</span>
                </div>
              </div>

              <div className="dough-texture-indicator" style={{ marginTop: '16px' }}>
                <div className="texture-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Dough Cohesiveness:
                </div>
                <div className="progress-bar-bg" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(bowlStep / 6) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div className="texture-desc" style={{ marginTop: '8px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', color: bowlStep >= 6 ? '#16a34a' : '#0284c7' }}>
                  {bowlStep < 4 ? 'Awaiting Ingredients' : bowlStep < 6 ? 'Hydrated & Mixing' : '✨ Pliable & Non-Sticky'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 3 Formulation Ingredients & Tools"
        items={stage3Inventory}
      />
    </div>
  );
};
