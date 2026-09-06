import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';

export const Mission5Steaming = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Steamer states:
  // 0: Empty aluminum steamer base on stove -> accept potable water pitcher
  // 1: Base filled with water -> accept perforated middle tier
  // 2: Perforated middle tier mounted on water base -> accept molded ubod tray
  // 3: Ubod tray loaded into perforated tier with sealed domed lid -> ready to turn stove knob to HIGH
  // 4: Active rolling steam at 100°C (10-minute cycle with progress meter)
  // 5: Steaming complete, cooked translucent pieces -> accept heat mitts / Don Mitts action
  // 6: Mold cooling on wire rack -> Stage 5 complete!
  const [steamerStep, setSteamerStep] = useState(0);
  const [steamProgress, setSteamProgress] = useState(0);
  const [isSteaming, setIsSteaming] = useState(false);

  useEffect(() => {
    speak(
      'Stage 5: Starch Gelatinization & Steaming! Steaming locks the rectangular shape of the crackers by hydrating and gelatinizing the rice starches at 100°C.',
      'neutral',
      {
        badge: 'Stage 5: Steaming',
        hint: 'First, select the Potable Water Pitcher from your bottom inventory and pour it into the empty steamer base.',
        hideButton: true,
      }
    );
  }, []);

  const steamerSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['steamer_water', 'water_pitcher', 'water', 'portion_water_1cup'],
      prompt: 'Pour 1 cup clean potable water into the empty steamer base',
      img: '/assets/steamer_base_empty.png',
      fallbackIcon: '🫕',
      label: 'Empty Steamer Base on Stove',
    },
    {
      stepIndex: 1,
      acceptedItems: ['perforated_tier', 'steam_tier', 'tier_perforated'],
      prompt: 'Place the perforated middle tier (steamer rack with holes) onto the base pot',
      img: '/assets/steamer_base_water.png',
      fallbackIcon: '💧',
      label: 'Steamer Base Filled with Water',
    },
    {
      stepIndex: 2,
      acceptedItems: ['molded_tray', 'molded_ubod', 'molder_completely_filled'],
      prompt: 'Arrange the molded rectangular ubod pieces onto the perforated middle tier',
      img: '/assets/steamer_tier_empty.png',
      fallbackIcon: '♨️',
      label: 'Perforated Tier on Base Pot',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Molded tray loaded! Turn stove knob to HIGH to begin 10-minute rolling steam',
      img: '/assets/steamer_tier_with_tray.png',
      fallbackIcon: '🧈',
      label: 'Assembled Steamer with Ubod Tray',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'Rolling steam at 100°C: Gelatinizing rice starches into elastic matrix...',
      img: '/assets/steamer_assembled_steaming.png',
      fallbackIcon: '☁️',
      label: '100°C Rolling Steam (10-Min Cycle)',
    },
    {
      stepIndex: 5,
      acceptedItems: ['heat_mitts', 'ppe_heat_gloves'],
      prompt: '10 minutes complete! Don Silicone Heat Mitts to safely transfer hot mold to cooling rack',
      img: '/assets/steamer_opened_cooked.png',
      fallbackIcon: '✨',
      label: 'Cooked Gelatinized Pieces (100°C Hot)',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Hot mold cooling on wire rack! Starch matrix setting before dehydrator tray arrangement',
      img: '/assets/steamed_mold_on_cooling_rack.png',
      fallbackIcon: '❄️',
      label: 'Cooled Gelatinized Pieces on Rack',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'steamer_water' || item.id === 'water_pitcher' || item.id === 'water' || item.id === 'portion_water_1cup')) {
      soundManager.playPour();
      setSteamerStep(1);
      addScore(15);
      setHoldingItem(null);
      showToast('Water Added!', '1 cup potable water loaded in base pot. Next, place the perforated steam tier (+15 pts)', 'success');
      speak(
        'Water is loaded in the base! Now select the Perforated Steam Tier from your bottom inventory and place it onto the pot.',
        'neutral',
        {
          badge: 'Steam Tier Placement',
          hint: 'Select the Perforated Steam Tier on the bottom shelf, then place it on the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'perforated_tier' || item.id === 'steam_tier' || item.id === 'tier_perforated')) {
      soundManager.playClick();
      setSteamerStep(2);
      addScore(15);
      setHoldingItem(null);
      showToast('Steam Tier Placed!', 'Perforated middle tier mounted on water base. Now load the molded ubod tray (+15 pts)', 'success');
      speak(
        'The steam vent tier is in place! Now select the Molded Ubod Tray from your inventory and place it inside the perforated tier.',
        'neutral',
        {
          badge: 'Middle Tier Loading',
          hint: 'Select the Molded Ubod Tray on the bottom shelf, then place it inside the tier.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'molded_tray' || item.id === 'molded_ubod' || item.id === 'molder_completely_filled')) {
      soundManager.playClick();
      setSteamerStep(3);
      addScore(20);
      setHoldingItem(null);
      showToast('Tray Loaded!', 'Molded crackers in place. Domed lid sealed! Ready to steam (+20 pts)', 'success');
      speak(
        'The molded crackers are in place and the domed lid is ready! Turn the rotary stove knob to HIGH to begin gelatinizing the starch matrix at 100°C.',
        'thinking',
        {
          badge: 'Starch Gelatinization',
          hint: 'Turn the rotary stove knob to HIGH to ignite the burner.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 5 && (item.id === 'heat_mitts' || item.id === 'ppe_heat_gloves')) {
      handleTransferToCooling();
    }
  };

  const handleStartSteaming = () => {
    soundManager.playBoil();
    setIsSteaming(true);
    setSteamerStep(4);
    showToast('Steaming Active...', 'Gas burner ignited! 100°C steam gelatinizing starches...', 'info');
    speak(
      'Rolling steam active at 100°C! Watch the live gelatinization monitor as steam transfers heat to the cracker starches.',
      'happy',
      {
        badge: 'Steaming in Progress',
        hint: 'Wait for the 10-minute steam cycle to complete.',
        hideButton: true,
      }
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSteamProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSteaming(false);
        setSteamerStep(5);
        soundManager.playSuccess();
        addScore(30);
        showToast('Steaming Complete!', 'Rice starches are fully gelatinized and set (+30 pts)', 'success');
        speak(
          '10 minutes elapsed! Notice how the pieces have turned glossy, firm, and semi-translucent. Don your red silicone heat mitts and safely transfer the hot mold to the wire cooling rack!',
          'happy',
          {
            badge: 'Gelatinization Achieved',
            hint: 'Select the Silicone Heat Mitts below and tap the hot mold to transfer.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleTransferToCooling = () => {
    soundManager.playClick();
    setSteamerStep(6);
    setHoldingItem(null);
    addScore(20);
    unlockBadge('steam_artisan', 'Gelatinization Specialist', '♨️');
    completeMission('mission5');
    showToast('Safely Transferred!', 'Transferred to wire cooling rack with thermal heat mitts (+20 pts)', 'success');
    speak(
      'Outstanding steaming! The crackers are cooling on the wire rack. Starch retrogradation is firming up the pieces so they can be neatly arranged on dehydrator trays in Stage 6!',
      'happy',
      {
        badge: 'Stage 5 Complete',
        btnText: 'Proceed to Stage 6: Cabinet Dehydration ➔',
        onNext: () => setScene('mission6'),
      }
    );
  };

  const stage5Inventory = [
    {
      id: 'steamer_water',
      name: 'Potable Water Pitcher',
      measure: '1 Cup (Base Pot)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: steamerStep >= 1,
      isNext: steamerStep === 0,
      tooltip: 'Potable water poured into base tier to generate 100°C saturated steam.',
    },
    {
      id: 'perforated_tier',
      name: 'Perforated Steam Tier',
      measure: 'Vented Middle Rack',
      img: '/assets/tier_perforated_icon.png',
      fallbackIcon: '♨️',
      isUsed: steamerStep >= 2,
      isNext: steamerStep === 1,
      tooltip: 'Perforated aluminum tier allowing 360° convection steam penetration.',
    },
    {
      id: 'molded_tray',
      name: 'Molded Ubod Tray',
      measure: '24 Rectangular Cavities',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '🧈',
      isUsed: steamerStep >= 3,
      isNext: steamerStep === 2,
      tooltip: '24 leveled dough portions loaded for 10-minute starch gelatinization.',
    },
    {
      id: 'heat_mitts',
      name: 'Silicone Heat Mitts',
      measure: 'Thermal PPE (100°C)',
      img: '/assets/ppe_heat_gloves.png',
      fallbackIcon: '🧤',
      isUsed: steamerStep >= 6,
      isNext: steamerStep === 5,
      tooltip: 'Certified thermal PPE gloves to safely transfer hot 100°C silicone molds to cooling racks.',
    },
  ];

  return (
    <div className="workstation-scene steaming-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Left: 3-Tier Aluminum Steamer MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="steamer"
              title="3-Tier Aluminum Steamer"
              subtitle="100°C Starch Gelatinization (Step 14)"
              currentStepIndex={steamerStep}
              steps={steamerSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isSteaming ? 'steaming' : null}
              containerWidth="520px"
              containerHeight="330px"
              customFooter={
                <StoveBurnerConsole
                  isReady={steamerStep === 3 && !isSteaming}
                  isIgnited={isSteaming}
                  isComplete={steamerStep >= 5}
                  progress={steamProgress}
                  onIgnite={handleStartSteaming}
                  onLockedClick={() => {
                    if (steamerStep === 0) {
                      showToast(
                        'Steamer Not Ready',
                        'Pour potable water into the steamer base before turning on the burner!',
                        'warning'
                      );
                      speak(
                        'Safety first! Pour potable water into the steamer base before igniting the gas burner.',
                        'thinking',
                        {
                          badge: 'Steamer Safety',
                          hint: 'Pour potable water into the bottom base tier first.',
                        }
                      );
                    } else if (steamerStep === 1) {
                      showToast(
                        'Steamer Not Ready',
                        'Place the perforated middle tier onto the base pot before turning on the burner!',
                        'warning'
                      );
                      speak(
                        'Safety first! Place the perforated middle tier onto the base pot before igniting the gas burner.',
                        'thinking',
                        {
                          badge: 'Steamer Safety',
                          hint: 'Place the perforated middle tier onto the base pot.',
                        }
                      );
                    } else if (steamerStep === 2) {
                      showToast(
                        'Steamer Not Ready',
                        'Place the molded ubod tray into the perforated tier before turning on the burner!',
                        'warning'
                      );
                      speak(
                        'Safety first! Place the molded dough tray into the middle tier before turning on the burner.',
                        'thinking',
                        {
                          badge: 'Steamer Safety',
                          hint: 'Place the molded ubod tray onto the middle tier.',
                        }
                      );
                    }
                  }}
                  standbyHint={
                    steamerStep === 0
                      ? 'Add water to base pot first'
                      : steamerStep === 1
                      ? 'Place perforated steam tier'
                      : steamerStep === 2
                      ? 'Place molded tray inside tier'
                      : 'Turn dial to HIGH to ignite'
                  }
                  readyHint="👉 Click dial to turn to HIGH"
                  activeHint={(p) => `♨️ Rolling steam... ${p}%`}
                  completeHint="✓ 10-Min gelatinization complete"
                  disabled={isSteaming || steamerStep >= 6}
                />
              }
            />
          </div>

          {/* Right Side: Steaming QC & Gelatinization Monitor */}
          <div
            className={`multi-state-workstation qc-workstation ${
              steamerStep === 5 && (holdingItem?.id === 'heat_mitts' || holdingItem?.id === 'ppe_heat_gloves')
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '440px',
              cursor: steamerStep === 5 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (steamerStep === 5) {
                handleTransferToCooling();
              }
            }}
            onDragOver={(e) => {
              if (steamerStep === 5) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (steamerStep === 5) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (item.id === 'heat_mitts' || item.id === 'ppe_heat_gloves') {
                    handleTransferToCooling();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Steaming QC & Gelatinization Monitor"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Steaming QC & Heat Monitor</h4>
                <span className="workstation-sub">Step 14: 10-Min Starch Crosslinking</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  steamerStep >= 6
                    ? 'badge-success-glow'
                    : steamerStep >= 4
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {steamerStep >= 6
                  ? '✅ Cooled & Set'
                  : steamerStep === 5
                  ? '🧤 Safe Transfer'
                  : steamerStep === 4
                  ? '♨️ 100°C Steaming'
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div className="workstation-viewport steaming-qc-viewport" style={{ height: '340px', minHeight: '340px', maxHeight: '340px', flex: '0 0 auto' }}>
              {/* Steamer Parameters Card */}
              <div className="steaming-spec-card">
                <div className="steaming-spec-header">
                  <span>♨️ Thermal Parameters</span>
                  <span style={{ color: steamerStep >= 4 ? '#0284c7' : '#64748b' }}>
                    {steamerStep >= 4 ? 'Medium-High Burner' : 'Cold Standby'}
                  </span>
                </div>

                <div className="steaming-spec-grid">
                  <div className="steaming-spec-item">
                    <span className="spec-title">Steam Temperature</span>
                    <span
                      className="spec-val"
                      style={{ color: steamerStep >= 4 ? '#0284c7' : '#334155' }}
                    >
                      {steamerStep >= 4 ? '100°C (Rolling)' : '28°C (Ambient)'}
                    </span>
                  </div>

                  <div className="steaming-spec-item">
                    <span className="spec-title">Target Duration</span>
                    <span className="spec-val">10 Minutes</span>
                  </div>
                </div>

                {/* Live Steaming Countdown Meter */}
                <div className="steaming-progress-row">
                  <div className="steaming-progress-header">
                    <span>Cycle Progress:</span>
                    <strong>{steamerStep >= 5 ? '100% (Completed)' : `${steamProgress}%`}</strong>
                  </div>
                  <div className="steaming-progress-bar-bg">
                    <div
                      className="steaming-progress-bar-fill"
                      style={{ width: steamerStep >= 5 ? '100%' : `${steamProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Before & After Texture Comparison */}
              <div className="steaming-texture-compare">
                <div className={`texture-compare-box ${steamerStep < 4 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Raw Dough</span>
                  <span className="texture-box-desc">Opaque White • Crumbly</span>
                </div>
                <div className={`texture-compare-box ${steamerStep >= 5 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Gelatinized</span>
                  <span className="texture-box-desc">Translucent • Elastic & Firm</span>
                </div>
              </div>

              {/* Food Science Note */}
              <div className="steaming-science-note">
                <strong>🔬 Science Principle: </strong>
                Steaming at 100°C permanently gelatinizes rice starches into an elastic polymer matrix, locking the rectangular wafer structure so it does not collapse into powder in the dehydrator!
              </div>
            </div>

            {/* Workstation Footer */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <div
                  className={`status-dot ${
                    steamerStep >= 6
                      ? 'dot-success'
                      : steamerStep >= 4
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {steamerStep >= 6
                    ? 'Crackers cooled on rack; ready for dehydrator trays.'
                    : steamerStep === 5
                    ? 'Hot mold ready! Don thermal heat mitts to transfer.'
                    : steamerStep === 4
                    ? '10-minute steam cycle actively gelatinizing starches.'
                    : '100°C steam parameters calibrated and awaiting ignition.'}
                </span>
              </div>
              <span className="spec-badge">
                {steamerStep >= 6
                  ? 'QC: SET MATRIX'
                  : steamerStep >= 4
                  ? 'TEMP: 100°C'
                  : 'TARGET: 10 MIN'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 5 Steaming Tools & Ingredients"
        items={stage5Inventory}
      />
    </div>
  );
};


