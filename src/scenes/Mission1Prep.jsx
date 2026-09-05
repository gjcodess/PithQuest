import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge } = useGame();

  // Wash step: 0: raw ubod in colander, 1: washed ubod
  const [isWashed, setIsWashed] = useState(false);
  // Pot state: 0: empty, 1: +ubod, 2: +water, 3: +salt, 4: boiling, 5: drained
  const [potStep, setPotStep] = useState(0);
  const [isBoilingTimerActive, setIsBoilingTimerActive] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 1: Washing & Pre-Cooking! First, wash the cut raw coconut pith under running potable water to remove surface dirt and starch residues.',
      'neutral',
      {
        badge: 'Stage 1: Washing',
        hint: 'Tap "Wash Ubod Under Faucet", then pick up the clean washed ubod from the bottom shelf.',
        hideButton: true,
      }
    );
  }, []);

  // MultiStateContainer step configurations
  const potSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['washed_ubod'],
      prompt: 'Add washed ubod strips into the empty stockpot',
      img: '/assets/pot_empty.png',
      fallbackIcon: '🫕',
      label: 'Empty Stockpot',
    },
    {
      stepIndex: 1,
      acceptedItems: ['water_pitcher', 'water'],
      prompt: 'Pour clean potable water to submerge the ubod',
      img: '/assets/pot_with_ubod.png',
      fallbackIcon: '🥣',
      label: 'Stockpot with Ubod',
    },
    {
      stepIndex: 2,
      acceptedItems: ['sea_salt', 'salt'],
      prompt: 'Add sea salt into the pot for moisture regulation & seasoning',
      img: '/assets/pot_with_ubod_water.png',
      fallbackIcon: '💧',
      label: 'Submerged Ubod in Water',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Ignite stove burner to bring water to a rolling boil',
      img: isBoilingTimerActive ? '/assets/pot_boiling_on_stove.png' : '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '♨️',
      label: isBoilingTimerActive ? 'Rolling Boil (100°C)' : 'Seasoned Ubod Ready to Boil',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander'],
      prompt: 'Drain boiled ubod into colander to remove water and steam-cool',
      img: '/assets/colander_boiled_ubod_draining.png',
      fallbackIcon: '🍲',
      label: 'Fork-Tender Boiled Ubod',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Boiled ubod drained & cooled under clean rinse to stop carryover heat',
      img: '/assets/colander_boiled_ubod_cooling_rinse.png',
      fallbackIcon: '✨',
      label: 'Drained & Cooled Boiled Ubod',
    },
  ];

  const handleWashUbod = () => {
    soundManager.playPour();
    setIsWashed(true);
    addScore(20);
    showToast('Ubod Washed!', 'Raw coconut pith is now sanitized and ready for boiling (+20 pts)', 'success');
    speak(
      'Great job! The ubod is washed and clean. Now tap or drag the Washed Ubod from your bottom inventory shelf into the stockpot!',
      'happy',
      {
        badge: 'Submerge in Pot',
        hint: 'Click "Washed Ubod" on the bottom tray, then drop into the stockpot.',
        hideButton: true,
      }
    );
  };

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'washed_ubod') {
      soundManager.playPour();
      setPotStep(1);
      addScore(20);
      showToast('Ubod Added!', 'Now pour clean potable water to submerge the ubod.', 'success');
      speak(
        'Excellent! Coconut pith is loaded. Now pick up the Potable Water from your bottom shelf and pour until submerged.',
        'neutral',
        {
          badge: 'Water Hydration',
          hint: 'Select Potable Water from the bottom shelf and drop into the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'water_pitcher' || item.id === 'water')) {
      soundManager.playPour();
      setPotStep(2);
      addScore(20);
      showToast('Water Added!', 'Now add Sea Salt to season and regulate osmotic moisture.', 'success');
      speak(
        'Perfect liquid level! Now add measured Pure Sea Salt from the bottom tray into the pot.',
        'neutral',
        {
          badge: 'Salting Step',
          hint: 'Select Pure Sea Salt on the shelf and drop it into the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'sea_salt' || item.id === 'salt')) {
      soundManager.playClick();
      setPotStep(3);
      addScore(20);
      showToast('Salt Added!', 'Pot is ready! Ignite the high heat burner.', 'success');
      speak(
        'All ingredients are in the pot! Press the "Ignite Burner" button to bring the water to a rolling boil until the ubod is fork-tender.',
        'thinking',
        {
          badge: 'Thermal Softening',
          hint: 'Click the "Ignite High Heat Burner" button on the workstation.',
          hideButton: true,
        }
      );
    }
  };

  const handleIgniteBurner = () => {
    soundManager.playBoil();
    setIsBoilingTimerActive(true);
    showToast('Burner Ignited!', 'Water reaching 100°C rolling boil...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBoilProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsBoilingTimerActive(false);
        setPotStep(4);
        soundManager.playSuccess();
        addScore(30);
        showToast('Boiling Complete!', 'Ubod fibers are fork-tender and translucent (+30 pts)', 'success');
        speak(
          'Boiling complete! The tough cellulose fibers have softened into translucent, tender pieces. Now use the stainless colander on your bottom shelf to drain boiling liquid.',
          'happy',
          {
            badge: 'Drain & Cool',
            hint: 'Select Stainless Colander on the bottom shelf (or click Drain below).',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleDrainUbod = () => {
    soundManager.playPour();
    setPotStep(5);
    addScore(30);
    unlockBadge('boil_master', 'Thermal Softening Specialist', '🫕');
    completeMission('mission1');
    showToast('Drained & Cooled!', 'Boiled ubod drained in colander (+30 pts)', 'success');
    speak(
      'Outstanding! The boiled ubod is drained and cooling. The softened fibers are now ready for food processing into a fine paste!',
      'happy',
      {
        badge: 'Stage 1 Complete',
        btnText: 'Proceed to Stage 2: Food Processing ➔',
        onNext: () => setScene('mission2'),
      }
    );
  };

  const stage1Inventory = [
    {
      id: 'washed_ubod',
      name: isWashed ? 'Washed Ubod' : 'Raw Ubod Strips',
      measure: isWashed ? '1 Cup (Sanitized)' : 'Wash at Sink First',
      img: isWashed ? '/assets/portion_ubod_raw_1cup.png' : '/assets/ing_ubod_fresh.png',
      fallbackIcon: '🥥',
      isUsed: potStep >= 1,
      isNext: potStep === 0 && isWashed,
      disabled: !isWashed,
      onClick: !isWashed ? () => {
        soundManager.playClick();
        showToast('Wash Ubod First', 'Click "Wash Ubod Under Faucet" at the washing station on the left.', 'info');
        speak('Please wash the raw cut ubod strips under running water at the sink station first!', 'thinking', {
          badge: 'Washing Station',
          hint: 'Tap "Wash Ubod Under Faucet" in the washing station card on the left.',
        });
      } : undefined,
      tooltip: isWashed ? '1 Cup clean washed ubod' : 'Wash raw ubod under faucet first',
    },
    {
      id: 'water_pitcher',
      name: 'Potable Water',
      measure: '4 Cups (To Submerge)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: potStep >= 2,
      isNext: potStep === 1,
      tooltip: 'Clean potable water for boiling',
    },
    {
      id: 'sea_salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Sea Salt)',
      img: '/assets/ing_salt_fresh.png',
      fallbackIcon: '🧂',
      isUsed: potStep >= 3,
      isNext: potStep === 2,
      tooltip: '1 tsp pure white sea salt for seasoning & osmosis',
    },
    {
      id: 'colander',
      name: 'Stainless Colander',
      measure: 'Drain & Rinse',
      img: '/assets/tool_colander_safe.png',
      fallbackIcon: '🥣',
      isUsed: potStep >= 5,
      isNext: potStep === 4,
      tooltip: 'Perforated colander for draining boiling water and cooling rinse',
    },
  ];

  return (
    <div className="workstation-scene prep-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '980px' }}>
          {/* Left: Washing Sink Station */}
          <div className="station-side-card washing-station-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🚰 Washing Station</span>
              <span className={`station-badge-mini ${isWashed ? 'badge-success' : 'badge-pending'}`}>
                {isWashed ? '✅ Sanitized' : 'Required'}
              </span>
            </div>

            <div className="sink-box">
              <div className="sink-colander-preview">
                <img
                  src={potStep >= 1 ? '/assets/sink_colander_empty.png' : isWashed ? '/assets/sink_colander_washing.png' : '/assets/sink_colander_ubod.png'}
                  alt="Sink Colander"
                  className="sink-preview-img"
                />
                <div className={`sink-status-pill ${potStep >= 1 ? 'washed' : isWashed ? 'washed' : 'unwashed'}`}>
                  <span>{potStep >= 1 ? '🥣 Empty Colander' : isWashed ? '✨ Washed & Cleaned' : '🌿 Fresh Raw Ubod'}</span>
                </div>
              </div>

              {!isWashed ? (
                <button className="btn-wash-action" onClick={handleWashUbod}>
                  <span className="wash-action-icon">🚰</span>
                  <span>Wash Ubod Under Faucet</span>
                </button>
              ) : (
                <div className="wash-complete-hint" style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, textAlign: 'center', marginTop: '6px' }}>
                  ✓ Clean & ready on bottom shelf!
                </div>
              )}
            </div>
          </div>

          {/* Center: Multi-State Stockpot Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="stockpot"
              title="Stainless Steel Boiling Pot"
              subtitle="Thermal softening on gas burner"
              currentStepIndex={potStep}
              steps={potSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isBoilingTimerActive ? 'boiling' : potStep === 4 ? 'steaming' : null}
              containerWidth="460px"
              containerHeight="270px"
              interactiveAction={
                potStep === 4
                  ? {
                      label: '🥣 Drain Boiled Ubod into Colander',
                      onClick: handleDrainUbod,
                      icon: '🥣',
                    }
                  : null
              }
              customFooter={
                potStep <= 3 || isBoilingTimerActive ? (
                  <StoveBurnerConsole
                    isReady={potStep === 3 && !isBoilingTimerActive}
                    isIgnited={isBoilingTimerActive}
                    isComplete={potStep >= 4}
                    progress={boilProgress}
                    onIgnite={handleIgniteBurner}
                    onLockedClick={() => {
                      showToast(
                        'Pot Not Ready',
                        'Add Ubod, Water, and Sea Salt into the pot before turning on the burner!',
                        'warning'
                      );
                      speak(
                        'Safety first! Always ensure the cut ubod strips, potable water, and sea salt are inside the pot before igniting the burner flame.',
                        'thinking',
                        {
                          badge: 'Stove Safety',
                          hint: 'Place all ingredients into the pot first.',
                        }
                      );
                    }}
                    disabled={isBoilingTimerActive}
                  />
                ) : null
              }
            />
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 1 Inventory & Cookware"
        items={stage1Inventory}
      />
    </div>
  );
};

