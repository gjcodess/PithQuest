import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission5Steaming = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Steamer states:
  // 0: Empty aluminum steamer base on stove -> accept steamer_water
  // 1: Base with water -> accept molded_ubod_tray
  // 2: Molded ubod in middle tier -> action: place lid & ignite rolling steam
  // 3: Active steaming (10 minutes time-lapse with rising steam clouds)
  // 4: Steaming complete, lid removed -> action: transfer to cooling rack with heat mitts
  // 5: Mold on cooling rack -> ready to proceed to dehydration
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
      acceptedItems: ['steamer_water', 'water_pitcher', 'water'],
      prompt: 'Pour clean potable water into the bottom steamer tier',
      img: '/assets/equip_steamer_safe.png',
      fallbackIcon: '🫕',
      label: 'Aluminum Steamer Base',
    },
    {
      stepIndex: 1,
      acceptedItems: ['molded_tray', 'molded_ubod'],
      prompt: 'Arrange the molded rectangular ubod pieces onto the perforated middle tier',
      img: '/assets/steamer_tier_with_mold.png',
      fallbackIcon: '🧈',
      label: 'Water Heated in Base',
    },
    {
      stepIndex: 2,
      acceptedItems: [],
      prompt: 'Place domed lid on steamer and ignite rolling steam',
      img: '/assets/steamer_assembled_steaming.png',
      fallbackIcon: '♨️',
      label: 'Lid Sealed & Ready to Steam',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Steaming for 10 minutes at 100°C to gelatinize rice starches...',
      img: '/assets/steamer_assembled_steaming.png',
      fallbackIcon: '☁️',
      label: 'Rolling Steam (10 Minutes)',
    },
    {
      stepIndex: 4,
      acceptedItems: ['heat_mitts', 'cooling_rack', 'spatula'],
      prompt: 'Lid uncovered! Don heat mitts and transfer gelatinized mold to cooling rack',
      img: '/assets/steamer_opened_cooked.png',
      fallbackIcon: '✨',
      label: 'Gelatinized Ubod in Steamer',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Mold cooling on wire rack! Starch matrix setting before tray arrangement',
      img: '/assets/steamed_mold_on_cooling_rack.png',
      fallbackIcon: '❄️',
      label: 'Cooled Gelatinized Pieces on Rack',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'steamer_water' || item.id === 'water_pitcher' || item.id === 'water')) {
      soundManager.playPour();
      setSteamerStep(1);
      addScore(20);
      showToast('Water Added!', 'Now load the molded rectangular ubod pieces into the middle tier.', 'success');
      speak(
        'Water is loaded in the base! Now select the Molded Ubod Tray from the inventory shelf and place it into the middle tier.',
        'neutral',
        {
          badge: 'Tray Loading',
          hint: 'Select the Molded Ubod Tray and drop it into the steamer.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'molded_tray' || item.id === 'molded_ubod')) {
      soundManager.playClick();
      setSteamerStep(2);
      addScore(25);
      showToast('Tray Loaded!', 'Cover with domed lid and start the 10-minute steam cycle.', 'success');
      speak(
        'The pieces are in place! Click "Start 10-Minute Rolling Steam" to seal the lid and begin gelatinizing the starch matrix.',
        'thinking',
        {
          badge: 'Starch Gelatinization',
          hint: 'Click the "Start 10-Minute Rolling Steam" button.',
          hideButton: true,
        }
      );
    }
  };

  const handleStartSteaming = () => {
    soundManager.playBoil();
    setIsSteaming(true);
    setSteamerStep(3);
    showToast('Steaming Active...', '100°C steam gelatinizing starches...', 'info');

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
          '10 minutes elapsed! Notice how the pieces have turned glossy and firm to the touch. Don your red silicone heat mitts and transfer the hot mold to the cooling rack!',
          'happy',
          {
            badge: 'Gelatinization Achieved',
            hint: 'Tap "Transfer to Cooling Rack" to place the hot mold on the wire rack.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleTransferToCooling = () => {
    soundManager.playClick();
    setSteamerStep(5);
    addScore(30);
    unlockBadge('steam_artisan', 'Gelatinization Specialist', '♨️');
    completeMission('mission5');
    showToast('Cooled & Set!', 'Transferred safely with thermal heat mitts (+30 pts)', 'success');
    speak(
      'Outstanding steaming! The crackers are cooling on the wire rack. Let\'s unmold the firm pieces and arrange them on wire mesh trays for the 12-hour cabinet dehydration in Stage 6!',
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
      tooltip: 'Clean potable water to produce 100°C steam in the base tier',
    },
    {
      id: 'molded_tray',
      name: 'Molded Ubod Tray',
      measure: '24 Rectangular Cavities',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '🧈',
      isUsed: steamerStep >= 2,
      isNext: steamerStep === 1,
      tooltip: 'Silicone mold filled with 3 tsp portions of ubod dough',
    },
    {
      id: 'heat_mitts',
      name: 'Silicone Heat Mitts',
      measure: 'Thermal PPE',
      img: '/assets/ppe_heat_gloves.png',
      fallbackIcon: '🧤',
      isUsed: steamerStep >= 5,
      isNext: steamerStep === 4,
      tooltip: 'Heavy heat-resistant mitts for handling 100°C steamer tiers',
    },
    {
      id: 'cooling_rack',
      name: 'Wire Cooling Rack',
      measure: 'Air Circulation Base',
      img: '/assets/steamed_mold_on_cooling_rack.png',
      fallbackIcon: '❄️',
      isUsed: steamerStep >= 5,
      isNext: steamerStep === 4,
      tooltip: 'Elevated cooling wire rack allowing rapid starch retrogradation',
    },
  ];

  return (
    <div className="workstation-scene steaming-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '980px' }}>
          {/* Left Side: Steamer Parameters & Heat Monitor */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>♨️ Steamer Monitor</span>
              <span className={`station-badge-mini ${steamerStep >= 3 ? 'badge-success' : 'badge-pending'}`}>
                {steamerStep === 3 ? 'Steaming' : steamerStep >= 4 ? '100°C Achieved' : 'Standby'}
              </span>
            </div>

            <div className="specs-card-content" style={{ marginTop: '8px' }}>
              <div className="spec-point">
                <strong>Steam Temperature:</strong>
                <p style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.95rem', margin: '2px 0' }}>
                  {steamerStep >= 3 ? '100°C (Rolling Steam)' : '28°C (Ambient)'}
                </p>
              </div>

              <div className="spec-point" style={{ marginTop: '10px' }}>
                <strong>Cycle Duration:</strong>
                <p>10 minutes continuous steam</p>
                {steamerStep === 3 && (
                  <div className="progress-bar-bg" style={{ marginTop: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${steamProgress}%` }} />
                  </div>
                )}
              </div>

              <div className="spec-point" style={{ marginTop: '10px' }}>
                <strong>Safety Verification:</strong>
                <p>Always don thermal heat mitts before opening domed lid to prevent steam scalds.</p>
              </div>
            </div>
          </div>

          {/* Center: 3-Tier Aluminum Steamer MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="steamer"
              title="3-Tier Aluminum Steamer"
              subtitle="10-Minute Starch Gelatinization at 100°C"
              currentStepIndex={steamerStep}
              steps={steamerSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isSteaming ? 'steaming' : null}
              containerWidth="380px"
              containerHeight="260px"
              interactiveAction={
                steamerStep === 2
                  ? {
                      label: '♨️ Start 10-Minute Rolling Steam',
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
                      label: '🧤 Transfer to Cooling Rack (Use Heat Mitts)',
                      onClick: handleTransferToCooling,
                      icon: '🧤',
                    }
                  : null
              }
            />
          </div>

          {/* Right Side: Science Concept Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🔬 Science Principle</span>
            </div>
            <div className="specs-card-content">
              <div className="spec-point">
                <strong>Why Steaming is Essential:</strong>
                <p>Raw rice flour contains crystalline starch granules. Steaming at 100°C permanently gelatinizes the molecules into an elastic matrix, preventing the crackers from disintegrating into powder in the dehydrator!</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px' }}>
                <strong>Visual Indicator:</strong>
                <p>Opaque white dough turns semi-translucent, glossy, and firm to the touch once fully gelatinized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 5 Steaming Cookware & Trays"
        items={stage5Inventory}
      />
    </div>
  );
};
