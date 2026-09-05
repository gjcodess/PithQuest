import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission5Steaming = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Steamer states:
  // 0: Open aluminum steamer base on stove -> accept potable water pitcher
  // 1: Base with water, empty perforated middle tier -> accept molded ubod tray
  // 2: Mold loaded into perforated tier -> action: place domed lid & start 10-min steam
  // 3: Steamer assembled on lit stove (100°C steam time-lapse with progress bar)
  // 4: Steaming complete, lid opened showing cooked translucent pieces -> accept heat mitts / click transfer
  // 5: Mold cooling on wire rack -> Stage 5 complete!
  const [steamerStep, setSteamerStep] = useState(0);
  const [steamProgress, setSteamProgress] = useState(0);
  const [isSteaming, setIsSteaming] = useState(false);

  useEffect(() => {
    speak(
      'Stage 5: Starch Gelatinization & Steaming! Steaming locks the rectangular shape of the crackers by hydrating and gelatinizing the rice starches at 100°C.',
      'neutral',
      {
        badge: 'Stage 5: Steaming',
        hint: 'First, select the Potable Water Pitcher from your bottom inventory and pour it into the steamer base.',
        hideButton: true,
      }
    );
  }, []);

  const steamerSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['steamer_water', 'water_pitcher', 'water', 'portion_water_1cup'],
      prompt: 'Pour 1 cup clean potable water into the bottom steamer base',
      img: '/assets/steamer_base_stove.png',
      fallbackIcon: '🫕',
      label: 'Steamer Base Pot on Stove',
    },
    {
      stepIndex: 1,
      acceptedItems: ['molded_tray', 'molded_ubod', 'molder_completely_filled'],
      prompt: 'Arrange the molded rectangular ubod pieces onto the perforated middle tier',
      img: '/assets/steamer_tier_with_mold.png',
      fallbackIcon: '🧈',
      label: 'Perforated Tier with Mold',
    },
    {
      stepIndex: 2,
      acceptedItems: [],
      prompt: 'Domed lid sealed! Ignite gas burner to begin 10-minute rolling steam',
      img: '/assets/steamer_assembled_unlit.png',
      fallbackIcon: '♨️',
      label: 'Assembled Steamer (Cold Standby)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Rolling steam at 100°C: Gelatinizing rice starches into elastic matrix...',
      img: '/assets/steamer_assembled_steaming.png',
      fallbackIcon: '☁️',
      label: '100°C Rolling Steam (10-Min Cycle)',
    },
    {
      stepIndex: 4,
      acceptedItems: ['heat_mitts', 'ppe_heat_gloves'],
      prompt: '10 minutes complete! Don Silicone Heat Mitts to safely transfer hot mold to cooling rack',
      img: '/assets/steamer_opened_cooked.png',
      fallbackIcon: '✨',
      label: 'Cooked Gelatinized Pieces (100°C Hot)',
    },
    {
      stepIndex: 5,
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
      addScore(20);
      setHoldingItem(null);
      showToast('Water Added!', '1 cup potable water loaded in base tier. Now place the molded tray (+20 pts)', 'success');
      speak(
        'Water is loaded in the base! Now select the Molded Ubod Tray from your bottom shelf and place it into the perforated middle tier.',
        'neutral',
        {
          badge: 'Middle Tier Loading',
          hint: 'Select the Molded Ubod Tray on the bottom shelf, then tap the steamer.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'molded_tray' || item.id === 'molded_ubod' || item.id === 'molder_completely_filled')) {
      soundManager.playClick();
      setSteamerStep(2);
      addScore(25);
      setHoldingItem(null);
      showToast('Tray Loaded!', 'Molded crackers in place. Domed lid sealed! Ready to steam (+25 pts)', 'success');
      speak(
        'The pieces are in place and the domed lid is sealed! Click "♨️ Ignite Burner & Start 10-Min Steam" to begin gelatinizing the starch matrix.',
        'thinking',
        {
          badge: 'Starch Gelatinization',
          hint: 'Click the "♨️ Ignite Burner & Start 10-Min Steam" button.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 4 && (item.id === 'heat_mitts' || item.id === 'ppe_heat_gloves')) {
      handleTransferToCooling();
    }
  };

  const handleStartSteaming = () => {
    soundManager.playBoil();
    setIsSteaming(true);
    setSteamerStep(3);
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
        setSteamerStep(4);
        soundManager.playSuccess();
        addScore(35);
        showToast('Steaming Complete!', 'Rice starches are fully gelatinized and set (+35 pts)', 'success');
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
    setSteamerStep(5);
    setHoldingItem(null);
    addScore(30);
    unlockBadge('steam_artisan', 'Gelatinization Specialist', '♨️');
    completeMission('mission5');
    showToast('Safely Transferred!', 'Transferred to wire cooling rack with thermal heat mitts (+30 pts)', 'success');
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
      measure: '1 Cup (Base Tier)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: steamerStep >= 1,
      isNext: steamerStep === 0,
      tooltip: 'Clean potable water to produce 100°C rolling steam in the base tier',
    },
    {
      id: 'molded_tray',
      name: 'Molded Ubod Tray',
      measure: '24 Rectangular Cavities',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '🧈',
      isUsed: steamerStep >= 2,
      isNext: steamerStep === 1,
      tooltip: 'Silicone mold filled with uniform 3 tsp portions of ubod dough',
    },
    {
      id: 'heat_mitts',
      name: 'Silicone Heat Mitts',
      measure: 'Thermal PPE (100°C)',
      img: '/assets/ppe_heat_gloves.png',
      fallbackIcon: '🧤',
      isUsed: steamerStep >= 5,
      isNext: steamerStep === 4,
      tooltip: 'Heavy heat-resistant mitts required for safely handling 100°C hot steamer tiers',
    },
  ];

  return (
    <div className="workstation-scene steaming-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '880px' }}>
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
              containerWidth="440px"
              containerHeight="220px"
              statusDotClass={steamerStep >= 5 ? 'dot-success' : isSteaming ? 'dot-amber' : ''}
              statusText={
                steamerStep === 3
                  ? `Active 100°C steam cycle in progress (${steamProgress}%)...`
                  : steamerSteps[steamerStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    steamerStep >= 5 ? 'spec-success' : steamerStep >= 3 ? 'spec-amber' : ''
                  }`}
                >
                  {steamerStep >= 5
                    ? 'SET: COOLED'
                    : steamerStep === 4
                    ? 'HEAT: 100°C HOT'
                    : steamerStep === 3
                    ? 'CYCLE: 10 MIN'
                    : steamerStep === 2
                    ? 'STANDBY'
                    : steamerStep === 1
                    ? 'TRAY LOADED'
                    : 'BASE: WATER'}
                </span>
              }
              interactiveAction={
                steamerStep === 2
                  ? {
                      label: '♨️ Ignite Burner & Start 10-Min Steam',
                      onClick: handleStartSteaming,
                      icon: '♨️',
                    }
                  : steamerStep === 3
                  ? {
                      label: `Steaming... ${steamProgress}%`,
                      disabled: true,
                    }
                  : steamerStep === 4
                  ? {
                      label: '🧤 Don Heat Mitts & Transfer to Cooling Rack',
                      onClick: handleTransferToCooling,
                      icon: '🧤',
                    }
                  : null
              }
            />
          </div>

          {/* Right Side: Steaming QC & Gelatinization Monitor */}
          <div
            className={`multi-state-workstation qc-workstation ${
              steamerStep === 4 && (holdingItem?.id === 'heat_mitts' || holdingItem?.id === 'ppe_heat_gloves')
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '360px',
              cursor: steamerStep === 4 ? 'pointer' : 'default',
            }}
            onClick={() => {
              if (steamerStep === 4) {
                handleTransferToCooling();
              }
            }}
            onDragOver={(e) => {
              if (steamerStep === 4) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (steamerStep === 4) {
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
                  steamerStep >= 5
                    ? 'badge-success-glow'
                    : steamerStep >= 3
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {steamerStep >= 5
                  ? '✅ Cooled & Set'
                  : steamerStep === 4
                  ? '🧤 Safe Transfer'
                  : steamerStep === 3
                  ? '♨️ 100°C Steaming'
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div className="workstation-viewport steaming-qc-viewport" style={{ height: '220px', minHeight: '220px', flex: '1 1 auto' }}>
              {/* Steamer Parameters Card */}
              <div className="steaming-spec-card">
                <div className="steaming-spec-header">
                  <span>♨️ Thermal Parameters</span>
                  <span style={{ color: steamerStep >= 3 ? '#0284c7' : '#64748b' }}>
                    {steamerStep >= 3 ? 'Medium-High Burner' : 'Cold Standby'}
                  </span>
                </div>

                <div className="steaming-spec-grid">
                  <div className="steaming-spec-item">
                    <span className="spec-title">Steam Temperature</span>
                    <span
                      className="spec-val"
                      style={{ color: steamerStep >= 3 ? '#0284c7' : '#334155' }}
                    >
                      {steamerStep >= 3 ? '100°C (Rolling)' : '28°C (Ambient)'}
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
                    <strong>{steamerStep >= 4 ? '100% (Completed)' : `${steamProgress}%`}</strong>
                  </div>
                  <div className="steaming-progress-bar-bg">
                    <div
                      className="steaming-progress-bar-fill"
                      style={{ width: steamerStep >= 4 ? '100%' : `${steamProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Before & After Texture Comparison */}
              <div className="steaming-texture-compare">
                <div className={`texture-compare-box ${steamerStep < 3 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Raw Dough</span>
                  <span className="texture-box-desc">Opaque White • Crumbly</span>
                </div>
                <div className={`texture-compare-box ${steamerStep >= 4 ? 'active-state' : ''}`}>
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
                    steamerStep >= 5
                      ? 'dot-success'
                      : steamerStep >= 3
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {steamerStep >= 5
                    ? 'Crackers cooled on rack; ready for dehydrator trays.'
                    : steamerStep === 4
                    ? 'Hot mold ready! Don thermal heat mitts to transfer.'
                    : steamerStep === 3
                    ? '10-minute steam cycle actively gelatinizing starches.'
                    : '100°C steam parameters calibrated and awaiting ignition.'}
                </span>
              </div>
              <span className="spec-badge">
                {steamerStep >= 5
                  ? 'QC: SET MATRIX'
                  : steamerStep >= 3
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

