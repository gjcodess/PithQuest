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
      'Stage 3: Dough Formulation & Mixing! Step 12: In a large bowl, combine 1 cup of rice flour and 1 teaspoon of salt. Add 1 cup of ubod paste and gradually pour in 1 cup of water while gently mixing until all ingredients are well combined.',
      'neutral',
      {
        badge: 'Step 12: Formulation',
        note: 'Mix the ingredients gradually and gently. Add the water little by little while mixing until a uniform dough is formed.',
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
      img: '/assets/mixing_bowl_flour_added.png',
      fallbackIcon: '🌾',
      label: 'Bowl with Rice Flour',
    },
    {
      stepIndex: 2,
      acceptedItems: ['ubod_paste'],
      prompt: 'Add pureed Boiled Ubod Paste into the dry mixture',
      img: '/assets/mixing_bowl_dry_ingredients.png',
      fallbackIcon: '🧂',
      label: 'Flour + Salt Dry Mix',
    },
    {
      stepIndex: 3,
      acceptedItems: ['water_hydration', 'water'],
      prompt: 'Add measured potable water gradually to hydrate the starches',
      img: '/assets/mixing_bowl_paste_added.png',
      fallbackIcon: '🥥',
      label: 'Flour + Paste Mixture',
    },
    {
      stepIndex: 4,
      acceptedItems: ['spatula', 'red_spatula'],
      prompt: 'All ingredients added! Select Red Spatula on shelf to knead dough',
      img: '/assets/mixing_bowl_water_pouring.png',
      fallbackIcon: '💧',
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
          note: 'Blending the dry ingredients (flour + salt) first ensures even salt dispersal without concentrated salty spots.',
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
          note: 'Rice flour acts as a binder holding the ubod fibers together and providing crispy expansion upon frying.',
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
          note: 'Pour the water gradually while mixing to achieve the right dough plasticity without making it overly sticky or watery.',
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
        'All formulation ingredients are in the bowl! Pick up the Red Silicone Spatula on your bottom shelf and tap the bowl to knead into dough.',
        'thinking',
        {
          badge: 'Dough Kneading',
          note: 'Mix the ingredients gradually and gently until all components are well combined and a uniform dough is formed.',
          hint: 'Select Red Spatula on the bottom shelf, then tap the mixing bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 4 && (item.id === 'spatula' || item.id === 'red_spatula')) {
      handleKneadDough();
    }
  };

  const handleKneadDough = () => {
    try {
      if (typeof soundManager.playScrape === 'function') {
        soundManager.playScrape();
      } else {
        soundManager.playClick();
      }
    } catch (err) {
      console.warn(err);
    }
    setHoldingItem(null);
    setIsKneading(true);
    setBowlStep(5);
    showToast('Kneading Dough...', 'Forming starch-protein matrix with spatula...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setKneadProgress(current);
      try {
        if (typeof soundManager.playScrape === 'function') {
          soundManager.playScrape();
        }
      } catch (err) {
        console.warn(err);
      }
      if (current >= 100) {
        clearInterval(interval);
        setIsKneading(false);
        setBowlStep(6);
        soundManager.playSuccess();
        addScore(35);
        unlockBadge('dough_master', 'Starch Formulation Chemist', '🥯');
        completeMission('mission3');
        showToast('Dough Ball Formed!', 'Pliable, elastic, non-sticky dough ready', 'success');
        speak(
          'Masterpiece! The dough has achieved the exact desired texture: smooth, elastic, and uniform. Ready for molding in Stage 4!',
          'happy',
          {
            badge: 'Stage 3 Complete',
            note: 'Proper dough consistency is critical: uniform dough prevents cracks during dehydration and ensures even puffing during frying.',
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
      tooltip: 'Fine white rice flour providing amylose and amylopectin starches for structural expansion.',
    },
    {
      id: 'salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Sea Salt)',
      img: '/assets/ing_salt_fresh.png',
      fallbackIcon: '🧂',
      isUsed: bowlStep >= 2,
      isNext: bowlStep === 1,
      tooltip: '1 tsp pure sea salt to enhance savoriness and reinforce dough gluten-free binding.',
    },
    {
      id: 'ubod_paste',
      name: 'Silky Ubod Paste',
      measure: '2 Cups Puree',
      img: '/assets/portion_ubod_paste_1cup.png',
      fallbackIcon: '🥥',
      isUsed: bowlStep >= 3,
      isNext: bowlStep === 2,
      tooltip: 'Smooth boiled ubod puree adding dietary fiber, moisture, and delicate flavor notes.',
    },
    {
      id: 'water_hydration',
      name: 'Hydration Water',
      measure: 'Gradual Addition',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: bowlStep >= 4,
      isNext: bowlStep === 3,
      tooltip: 'Potable water added incrementally to hydrate starch granules into pliable dough.',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Fold & Knead',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: bowlStep >= 6,
      isNext: bowlStep === 4,
      tooltip: 'Silicone dough spatula for thorough folding, kneading, and homogeneous blending.',
    },
  ];

  return (
    <div className="workstation-scene mixing-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Center: Stainless Mixing Bowl MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="mixing_bowl"
              title="Stainless Steel Mixing Bowl"
              subtitle="1:1 Ratio Formulation with Red Spatula"
              currentStepIndex={bowlStep}
              steps={bowlSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="520px"
              containerHeight="330px"
              activeAnimation={isKneading ? 'mixing' : null}
              statusDotClass={bowlStep >= 6 ? 'dot-success' : bowlStep === 5 ? 'dot-amber' : ''}
              statusText={
                bowlStep === 5
                  ? `Folding and kneading dough matrix... (${kneadProgress}%)`
                  : undefined
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    bowlStep >= 6 ? 'spec-success' : bowlStep === 4 ? 'spec-amber' : ''
                  }`}
                >
                  {bowlStep >= 6
                    ? 'DOUGH: READY'
                    : bowlStep === 5
                    ? `KNEAD: ${kneadProgress}%`
                    : bowlStep === 4
                    ? 'TOOL: SPATULA'
                    : 'CAP: 4 QT'}
                </span>
              }
            >
              {/* Step 4 Spatula Guidance Guide */}
              {bowlStep === 4 && !isKneading && (
                <div
                  className="spatula-scrape-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') {
                      handleKneadDough();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Red Spatula on the bottom shelf, then tap the bowl!', 'info');
                      speak(
                        'Pick up the red silicone spatula from your bottom shelf first, then tap the bowl to knead the dough!',
                        'thinking',
                        {
                          badge: 'Select Spatula',
                          hint: 'Tap "Red Spatula" on the bottom tray, then tap the bowl.',
                        }
                      );
                    }
                  }}
                  title="Tap with Red Spatula to knead"
                >
                  <span>
                    🥄 {holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula' ? 'Tap Bowl to Knead Dough' : 'Pick Up Red Spatula Below'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>

          {/* Right Side: Recipe Formulation & QC Workstation */}
          <div
            className={`multi-state-workstation qc-workstation ${
              bowlStep === 4 && (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') ? 'compatible-target' : ''
            }`}
            style={{
              width: '440px',
              cursor: bowlStep === 4 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (bowlStep === 4) {
                if (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') {
                  handleKneadDough();
                } else {
                  soundManager.playClick();
                  showToast('Select Spatula First', 'Click the Red Spatula on the bottom shelf, then tap to knead!', 'info');
                  speak(
                    'Pick up the red silicone spatula from your bottom shelf first, then tap to fold and knead the formulation!',
                    'thinking',
                    {
                      badge: 'Select Spatula',
                      hint: 'Tap "Red Spatula" on the bottom tray first.',
                    }
                  );
                }
              }
            }}
            onDragOver={(e) => {
              if (bowlStep === 4) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (bowlStep === 4) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (item.id === 'spatula' || item.id === 'red_spatula') {
                    handleKneadDough();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title={bowlStep === 4 ? 'Click to knead formulation into dough ball' : 'Recipe Formulation & QC Monitor'}
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Recipe Formulation & QC</h4>
                <span className="workstation-sub">1:1 Ubod-to-Starch Calibration</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  bowlStep >= 6
                    ? 'badge-success-glow'
                    : bowlStep === 5
                    ? 'badge-flow-glow'
                    : bowlStep === 4
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {bowlStep >= 6
                  ? '✅ Cohesive Matrix'
                  : bowlStep === 5
                  ? `⚡ Kneading (${kneadProgress}%)`
                  : bowlStep === 4
                  ? '🥄 Ready to Knead'
                  : `${bowlStep}/4 Added`}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div className="workstation-viewport qc-viewport" style={{ height: '330px', minHeight: '330px', maxHeight: '330px', flex: '0 0 auto' }}>
              {/* Recipe Calibration Checklist */}
              <div className="qc-recipe-list">
                <div className="qc-list-title">
                  <span>Standard 1:1 Formulation</span>
                  <span className="qc-step-counter">{Math.min(4, bowlStep)} of 4</span>
                </div>

                {/* Ingredient 1: Rice Flour */}
                <div className={`qc-item-row ${bowlStep >= 1 ? 'completed' : bowlStep === 0 ? 'current-target' : ''}`}>
                  <div className="qc-item-icon-box">
                    <img src="/assets/portion_rice_flour_1cup.png" alt="Rice Flour" />
                  </div>
                  <div className="qc-item-meta">
                    <strong>Erawan Rice Flour</strong>
                    <span>2 Cups • 1:1 Starch Base</span>
                  </div>
                  <div className={`qc-status-chip ${bowlStep >= 1 ? 'chip-done' : bowlStep === 0 ? 'chip-next' : ''}`}>
                    {bowlStep >= 1 ? '✓ Added' : bowlStep === 0 ? '👉 Next' : 'Pending'}
                  </div>
                </div>

                {/* Ingredient 2: Sea Salt */}
                <div className={`qc-item-row ${bowlStep >= 2 ? 'completed' : bowlStep === 1 ? 'current-target' : ''}`}>
                  <div className="qc-item-icon-box">
                    <img src="/assets/ing_salt_fresh.png" alt="Sea Salt" />
                  </div>
                  <div className="qc-item-meta">
                    <strong>Pure Sea Salt</strong>
                    <span>1 tsp • Ionic Stabilizer</span>
                  </div>
                  <div className={`qc-status-chip ${bowlStep >= 2 ? 'chip-done' : bowlStep === 1 ? 'chip-next' : ''}`}>
                    {bowlStep >= 2 ? '✓ Added' : bowlStep === 1 ? '👉 Next' : 'Pending'}
                  </div>
                </div>

                {/* Ingredient 3: Ubod Paste */}
                <div className={`qc-item-row ${bowlStep >= 3 ? 'completed' : bowlStep === 2 ? 'current-target' : ''}`}>
                  <div className="qc-item-icon-box">
                    <img src="/assets/portion_ubod_paste_1cup.png" alt="Ubod Paste" />
                  </div>
                  <div className="qc-item-meta">
                    <strong>Silky Ubod Paste</strong>
                    <span>2 Cups • 1:1 Puree Base</span>
                  </div>
                  <div className={`qc-status-chip ${bowlStep >= 3 ? 'chip-done' : bowlStep === 2 ? 'chip-next' : ''}`}>
                    {bowlStep >= 3 ? '✓ Added' : bowlStep === 2 ? '👉 Next' : 'Pending'}
                  </div>
                </div>

                {/* Ingredient 4: Potable Water */}
                <div className={`qc-item-row ${bowlStep >= 4 ? 'completed' : bowlStep === 3 ? 'current-target' : ''}`}>
                  <div className="qc-item-icon-box">
                    <img src="/assets/portion_water_1cup.png" alt="Water" />
                  </div>
                  <div className="qc-item-meta">
                    <strong>Potable Water</strong>
                    <span>Gradual • Starch Hydration</span>
                  </div>
                  <div className={`qc-status-chip ${bowlStep >= 4 ? 'chip-done' : bowlStep === 3 ? 'chip-next' : ''}`}>
                    {bowlStep >= 4 ? '✓ Added' : bowlStep === 3 ? '👉 Next' : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Dough Rheology & Cohesiveness Meter */}
              <div className="qc-rheology-card">
                <div className="qc-rheology-header">
                  <span className="qc-rheology-label">Dough Cohesiveness:</span>
                  <span className="qc-rheology-pct">{Math.round((bowlStep / 6) * 100)}%</span>
                </div>
                <div className="qc-progress-track">
                  <div
                    className="qc-progress-fill"
                    style={{
                      width: `${Math.round((bowlStep / 6) * 100)}%`,
                    }}
                  />
                </div>
                <div className={`qc-texture-badge ${bowlStep >= 6 ? 'texture-perfect' : bowlStep === 4 ? 'texture-ready' : ''}`}>
                  {bowlStep < 4
                    ? 'Awaiting Ingredients'
                    : bowlStep === 4
                    ? '🥣 Ready to Fold & Knead'
                    : bowlStep === 5
                    ? '🔄 Kneading Starch Matrix...'
                    : '✨ Pliable & Non-Sticky'}
                </div>
              </div>
            </div>

            {/* Workstation Footer (86px) */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <span
                  className={`status-dot ${
                    bowlStep >= 6 ? 'dot-success' : bowlStep >= 4 ? 'dot-amber' : ''
                  }`}
                />
                <span className="status-text">
                  {bowlStep === 0
                    ? 'Add 2 cups Erawan Rice Flour into bowl'
                    : bowlStep === 1
                    ? 'Add 1 tsp Pure Sea Salt to dry flour'
                    : bowlStep === 2
                    ? 'Add 2 cups Boiled Ubod Paste for 1:1 ratio'
                    : bowlStep === 3
                    ? 'Add potable water gradually for hydration'
                    : bowlStep === 4
                    ? 'Tap Red Spatula on shelf, then tap bowl to knead'
                    : bowlStep === 5
                    ? 'Forming cohesive starch-protein matrix...'
                    : '1:1 dough ball calibrated for rectangular molding'}
                </span>
              </div>
              <span
                className={`spec-badge ${
                  bowlStep >= 6 ? 'spec-success' : bowlStep === 4 ? 'spec-amber' : ''
                }`}
              >
                {bowlStep >= 6 ? 'TEXTURE: NON-STICKY' : bowlStep === 5 ? `DEV: ${kneadProgress}%` : bowlStep === 4 ? 'ACTION: KNEAD' : 'RATIO: 1:1'}
              </span>
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

