import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission5Steaming = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Steamer states:
  // 0: Empty aluminum steamer base on stove -> accept steamer_water
  // 1: Base with water -> accept molded_ubod_tray
  // 2: Molded ubod in middle tier -> action: place lid & ignite rolling steam
  // 3: Active steaming (10 minutes time-lapse with rising steam clouds)
  // 4: Steaming complete, lid removed -> action: transfer to cooling rack
  // 5: Finished
  const [steamerStep, setSteamerStep] = useState(0);
  const [steamProgress, setSteamProgress] = useState(0);
  const [isSteaming, setIsSteaming] = useState(false);

  useEffect(() => {
    speak(
      'Stage 5: Starch Gelatinization & Steaming! Steaming locks the rectangular shape of the crackers by hydrating and gelatinizing the rice starches at 100°C.',
      'neutral',
      {
        badge: 'Stage 5: Steaming',
        hint: 'First, pour clean water into the base of our 3-tier aluminum steamer.',
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
      acceptedItems: ['cooling_rack', 'spatula'],
      prompt: 'Uncover lid! Transfer gelatinized glossy pieces to cooling rack',
      img: '/assets/steamer_opened_cooked.png',
      fallbackIcon: '✨',
      label: 'Gelatinized Ubod Pieces',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'steamer_water' || item.id === 'water_pitcher' || item.id === 'water')) {
      soundManager.playPour();
      setSteamerStep(1);
      addScore(20);
      showToast('Water Added!', 'Now load the molded rectangular ubod pieces into the middle tier.', 'success');
      speak(
        'Water is loaded in the base! Now place the molded rectangular ubod pieces onto the perforated middle tier.',
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
          '10 minutes elapsed! Notice how the pieces have turned glossy and firm to the touch. They will now hold their rectangular shape perfectly during dehydration. Click below to transfer to the cooling rack!',
          'happy',
          {
            badge: 'Gelatinization Achieved',
            hint: 'Tap "Transfer to Cooling Rack" to proceed.',
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
    showToast('Cooled & Set!', 'Ready for cabinet dehydration (+30 pts)', 'success');
    speak(
      'Outstanding steaming! The crackers are cooling on the rack. Let\'s arrange them on wire mesh trays and begin the 12-hour cabinet dehydration in Stage 6!',
      'happy',
      {
        badge: 'Stage 5 Complete',
        btnText: 'Proceed to Stage 6: Cabinet Dehydration ➔',
        onNext: () => setScene('mission6'),
      }
    );
  };

  return (
    <div className="workstation-scene steaming-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Steamer Materials */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>♨️ Steamer Loading</span>
          </div>
          <div className="inventory-vertical-list">
            <div
              className={`dispenser-card ${holdingItem?.id === 'steamer_water' ? 'active-held' : ''} ${steamerStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'steamer_water' ? null : { id: 'steamer_water', name: 'Steamer Base Water', img: '/assets/portion_water_1cup.png', icon: '💧' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'steamer_water', name: 'Steamer Base Water' }));
              }}
            >
              <img src="/assets/portion_water_1cup.png" alt="Steamer Water" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Steamer Base Water</strong>
                <span>Fill Bottom Tier</span>
              </div>
            </div>

            <div
              className={`dispenser-card ${holdingItem?.id === 'molded_tray' ? 'active-held' : ''} ${steamerStep === 1 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'molded_tray' ? null : { id: 'molded_tray', name: 'Molded Ubod Tray', img: '/assets/molder_completely_filled.png', icon: '🧈' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'molded_tray', name: 'Molded Ubod Tray' }));
              }}
            >
              <img src="/assets/molder_completely_filled.png" alt="Molded Tray" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Molded Ubod Tray</strong>
                <span>24 Rectangles</span>
              </div>
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
                    label: '🌬️ Transfer to Cooling Rack',
                    onClick: handleTransferToCooling,
                    icon: '🌬️',
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Science Concept Card */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🔬 Science Principle</span>
          </div>
          <div className="specs-card-content">
            <div className="spec-point">
              <strong>Why Steaming is Essential:</strong>
              <p>Raw rice flour contains crystalline starch granules. Steaming at 100°C permanently gelatinizes the molecules into an elastic matrix, preventing the crackers from disintegrating into powder in the dehydrator!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
