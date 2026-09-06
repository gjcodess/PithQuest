import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission4Molding = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Mold Step States:
  // 0: Empty Mold -> accept measuring spoon / paste portion
  // 1: 1 Cavity Calibrated -> accept measuring spoon OR quick fill button
  // 2: 24 Cavities Filled (Unleveled) -> accept leveling spatula
  // 3: 24 Cavities Completely Leveled -> Complete!
  const [moldStep, setMoldStep] = useState(0);
  const [isLeveling, setIsLeveling] = useState(false);

  useEffect(() => {
    speak(
      'Stage 4: Portioning & Rectangular Molding! Step 13: After mixing the paste, portion it into the molder. Use approximately 3 teaspoons per piece to achieve a uniform size and thickness.',
      'neutral',
      {
        badge: 'Step 13: Portioning & Molding',
        note: "Using the same amount of paste for each piece helps produce crackers with uniform size and thickness, promoting more even cooking and drying. Don't forget to wear gloves!",
        hint: 'Select the Ubod Cracker Paste on your shelf, then tap the mold to place a portion.',
        hideButton: true,
      }
    );
  }, []);

  const moldSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['dough_bowl', 'dough_portion', 'measuring_spoon'],
      prompt: 'Portion 3 teaspoons of paste into the silicone mold',
      img: '/assets/molder_empty.png',
      fallbackIcon: '🌸',
      label: 'Clean 24-Cavity Silicone Mold',
    },
    {
      stepIndex: 1,
      acceptedItems: ['dough_bowl', 'dough_portion', 'measuring_spoon'],
      prompt: 'Standard 3 tsp portion calibrated! Fill remaining cavities or click Quick-Fill',
      img: '/assets/molder_single_piece.png',
      fallbackIcon: '🧈',
      label: '1 Cavity Calibrated (3 tsp)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['leveling_spatula', 'spatula'],
      prompt: 'Cavities filled! Select the Leveling Spatula to scrape and level flat',
      img: '/assets/molder_partially_filled.png',
      fallbackIcon: '🥄',
      label: 'Cavities Portioned (Unleveled)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'All 24 rectangular crackers uniformly leveled and ready for steaming!',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '✨',
      label: 'All 24 Wafers Uniform & Leveled',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'dough_bowl' || item.id === 'dough_portion' || item.id === 'measuring_spoon')) {
      soundManager.playSuccess();
      setMoldStep(1);
      addScore(25);
      setHoldingItem(null);
      showToast('Cavity Calibrated!', 'First cavity filled with 3 tsp portion', 'success');
      speak(
        'Excellent portion control! Exactly 3 teaspoons produces our standard uniform thickness. Continue filling or click "Fill Remaining Tray"!',
        'happy',
        {
          badge: 'Portioning Calibration',
          note: 'Uniform thickness prevents thin edges from overcooking or burning while thicker centers remain undercooked.',
          hint: 'Place more portions or click "Fill Remaining Tray".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'dough_bowl' || item.id === 'dough_portion' || item.id === 'measuring_spoon')) {
      handleFillBatch();
    } else if (stepIndex === 2 && (item.id === 'leveling_spatula' || item.id === 'spatula')) {
      handleLevelDough();
    }
  };

  const handleFillBatch = () => {
    soundManager.playFanfare();
    setMoldStep(2);
    addScore(25);
    setHoldingItem(null);
    showToast('Batch Portioned!', 'All 24 cavities filled! Now level flat with spatula', 'success');
    speak(
      'All 24 cavities filled! Now take the Red Leveling Spatula from your shelf and scrape across the surface to level them completely flush.',
      'thinking',
      {
        badge: 'Leveling Step',
        note: 'Scraping off excess paste ensures each cracker piece has a flat, consistent surface.',
        hint: 'Select the Leveling Spatula on the bottom shelf, then tap the mold.',
        hideButton: true,
      }
    );
  };

  const handleLevelDough = () => {
    setIsLeveling(true);
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
    showToast('Leveling Surface...', 'Scraping excess paste flush with mold rim...', 'info');

    setTimeout(() => {
      setIsLeveling(false);
      setMoldStep(3);
      soundManager.playSuccess();
      addScore(50);
      unlockBadge('molding_master', 'Geometric Portioning Master', '🧈');
      completeMission('mission4');
      showToast('Mold Leveled!', 'All 24 rectangular cavities uniformly flat', 'success');
      speak(
        'Superb work! All 24 rectangular crackers are molded to exact uniform thickness. Now let\'s transfer the tray to our steamer in Stage 5!',
        'happy',
        {
          badge: 'Stage 4 Complete',
          note: 'Evenly molded pieces are now ready for steaming to set the starch matrix before dehydration.',
          btnText: 'Proceed to Stage 5: Starch Steaming ➔',
          onNext: () => setScene('mission5'),
        }
      );
    }, 700);
  };

  const stage4Inventory = [
    {
      id: 'dough_bowl',
      name: 'Ubod Cracker Paste',
      measure: '3 tsp Standard Portion',
      img: '/assets/mixing_bowl_dough_uniform.png',
      fallbackIcon: '🥣',
      isUsed: moldStep >= 2,
      isNext: moldStep < 2,
      tooltip: 'Formulated paste batch. Calibrated 3 tsp portion per 50mm × 25mm cavity.',
    },
    {
      id: 'leveling_spatula',
      name: 'Leveling Spatula',
      measure: 'Flat Surface Scraper',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '📐',
      isUsed: moldStep >= 3,
      isNext: moldStep === 2,
      tooltip: 'Flat straight-edge scraper to level paste flush with silicone rims for identical thickness.',
    },
  ];

  const handleInventoryClick = (item) => {
    if (item.isUsed) return;
    soundManager.playClick();

    // Toggle holding state
    if (holdingItem?.id === item.id) {
      setHoldingItem(null);
    } else {
      setHoldingItem({
        id: item.id,
        name: item.name,
        img: item.img,
        icon: item.fallbackIcon || '🥣',
      });
      if (item.id === 'dough_bowl') {
        showToast('Ubod Paste Selected', '3 tsp portion ready. Tap the silicone mold to place!', 'info');
      } else if (item.id === 'leveling_spatula') {
        showToast('Leveling Spatula Selected', 'Tap the silicone mold to scrape and level flat!', 'info');
      }
    }
  };

  return (
    <div className="workstation-scene molding-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Center: 24-Slot Rectangular Silicone Mold MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="silicone_mold"
              title="Rectangular Silicone Mold"
              subtitle="24-Cavity Grid • 50mm × 25mm Cavities"
              currentStepIndex={moldStep}
              steps={moldSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="520px"
              containerHeight="330px"
              statusDotClass={moldStep >= 3 ? 'dot-success' : moldStep >= 1 ? 'dot-amber' : ''}
              statusText={
                isLeveling
                  ? 'Scraping and leveling paste flush with cavity rims...'
                  : moldSteps[moldStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    moldStep >= 3 ? 'spec-success' : moldStep >= 1 ? 'spec-amber' : ''
                  }`}
                >
                  {moldStep >= 3
                    ? 'BATCH: LEVELED'
                    : moldStep === 2
                    ? 'TOOL: SPATULA'
                    : moldStep === 1
                    ? 'CAL: 1/24'
                    : 'SPEC: 3 TSP'}
                </span>
              }
            >
              {/* Spatula Leveling Motion Overlay */}
              {isLeveling && (
                <div className="mold-scraping-overlay">
                  <img
                    src="/assets/tool_spatula_red.png"
                    alt="Leveling Spatula"
                    className="mold-leveling-anim"
                  />
                </div>
              )}

              {/* Step 1 Quick-Fill Action Prompt inside mold */}
              {moldStep === 1 && (
                <div
                  className="spatula-scrape-guide"
                  onClick={handleFillBatch}
                  title="Click to fill all remaining 23 cavities"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    borderColor: '#0284c7',
                  }}
                >
                  <span>⚡ Click to Fill Remaining Tray</span>
                </div>
              )}

              {/* Step 2 Leveling Guidance Guide */}
              {moldStep === 2 && !isLeveling && (
                <div
                  className="spatula-scrape-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula') {
                      handleLevelDough();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Leveling Spatula on the bottom shelf, then tap the mold!', 'info');
                      speak(
                        'Pick up the Leveling Spatula from your bottom shelf first, then tap the mold to scrape across the cavities!',
                        'thinking',
                        {
                          badge: 'Select Spatula',
                          hint: 'Tap "Leveling Spatula" on the bottom tray, then tap the mold.',
                        }
                      );
                    }
                  }}
                  title="Tap with Leveling Spatula to scrape"
                >
                  <span>
                    📐 {holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula' ? 'Tap Mold to Scrape & Level' : 'Pick Up Leveling Spatula Below'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>

          {/* Right Side: Molding QC & Wafer Geometry Console */}
          <div
            className={`multi-state-workstation qc-workstation ${
              moldStep === 2 && (holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula') ? 'compatible-target' : ''
            }`}
            style={{
              width: '440px',
              cursor: moldStep === 2 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (moldStep === 2) {
                if (holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula') {
                  handleLevelDough();
                } else {
                  soundManager.playClick();
                  showToast('Select Spatula First', 'Click the Leveling Spatula on the bottom shelf, then tap to level!', 'info');
                }
              }
            }}
            onDragOver={(e) => {
              if (moldStep === 2) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (moldStep === 2) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (item.id === 'leveling_spatula' || item.id === 'spatula') {
                    handleLevelDough();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Molding QC & Wafer Geometry Console"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Molding QC & Geometry</h4>
                <span className="workstation-sub">Step 13: Uniform Thickness Control</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  moldStep >= 3
                    ? 'badge-success-glow'
                    : moldStep >= 1
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {moldStep >= 3
                  ? '✓ 24/24 Leveled'
                  : moldStep === 2
                  ? '📐 Ready to Level'
                  : moldStep === 1
                  ? '1/24 Calibrated'
                  : '0/24 Portioned'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div className="workstation-viewport molding-qc-viewport" style={{ height: '330px', minHeight: '330px', maxHeight: '330px', flex: '0 0 auto' }}>
              {/* Specification Card */}
              <div className="molding-spec-card">
                <div className="molding-spec-header">
                  <span>Standard Wafer Calibration</span>
                  <span className="qc-step-counter">3 Teaspoons</span>
                </div>

                {/* Integrated Geometry & Target Profile Row */}
                <div className="wafer-profile-row">
                  <div className="wafer-profile-visual">
                    <img src="/assets/cracker_piece_unmolded.png" alt="Target Wafer" />
                    <span className="wafer-tag-badge">50 × 25 × 4 mm</span>
                  </div>
                  <div className="wafer-profile-details">
                    <div className="profile-detail-item">
                      <span className="detail-label">Portion Target:</span>
                      <strong className="detail-val">3 tsp (Level)</strong>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Wafer Thickness:</span>
                      <strong className="detail-val">Uniform 4 mm</strong>
                    </div>
                  </div>
                </div>

                <div className="molding-science-note">
                  <strong>Food Science:</strong> Uniform 4mm thickness ensures equal drying in Stage 6, preventing curled or burnt edges during frying.
                </div>
              </div>

              {/* Batch Cavity Fill & Leveling Progress Meter */}
              <div className="qc-rheology-card">
                <div className="qc-rheology-header">
                  <span className="qc-rheology-label">Cavity Fill & Leveling:</span>
                  <span className="qc-rheology-pct">
                    {moldStep === 0 ? '0%' : moldStep === 1 ? '25%' : moldStep === 2 ? '75%' : '100%'}
                  </span>
                </div>
                <div className="qc-progress-track">
                  <div
                    className="qc-progress-fill"
                    style={{
                      width: moldStep === 0 ? '0%' : moldStep === 1 ? '25%' : moldStep === 2 ? '75%' : '100%',
                      background: 'linear-gradient(90deg, #0284c7 0%, #10b981 100%)',
                    }}
                  />
                </div>
                <div
                  className={`qc-texture-badge ${
                    moldStep >= 3
                      ? 'texture-perfect'
                      : moldStep === 2
                      ? 'texture-ready'
                      : ''
                  }`}
                >
                  {moldStep === 0
                    ? 'Awaiting 3 tsp Calibration'
                    : moldStep === 1
                    ? '1 Cavity Calibrated (3 tsp)'
                    : moldStep === 2
                    ? '👉 Level Flat with Spatula'
                    : '✨ All 24 Leveled & Ready for Steamer'}
                </div>
              </div>
            </div>

            {/* Workstation Footer (86px) */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <span
                  className={`status-dot ${
                    moldStep >= 3 ? 'dot-success' : moldStep >= 1 ? 'dot-amber' : ''
                  }`}
                />
                <span className="status-text">
                  {moldStep === 0
                    ? 'Portion 3 tsp paste from bowl into mold cavities'
                    : moldStep === 1
                    ? 'First cavity calibrated. Fill remaining cavities or click Quick-Fill'
                    : moldStep === 2
                    ? 'Select Leveling Spatula below, then tap mold to level flat'
                    : 'All 24 rectangular crackers leveled for Stage 5 steaming'}
                </span>
              </div>
              <span
                className={`spec-badge ${
                  moldStep >= 3 ? 'spec-success' : moldStep >= 1 ? 'spec-amber' : ''
                }`}
              >
                {moldStep >= 3
                  ? 'TRAY: READY'
                  : moldStep === 2
                  ? 'ACTION: LEVEL'
                  : moldStep === 1
                  ? 'FILLED: 1/24'
                  : 'THICKNESS: 4MM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 4 Portioning & Leveling Tools"
        items={stage4Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};


