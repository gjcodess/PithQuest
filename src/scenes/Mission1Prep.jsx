import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { FaucetKnobConsole } from '../components/FaucetKnobConsole';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge } = useGame();

  // Wash step: 0: raw ubod in colander, 1: washed ubod
  const [isWashed, setIsWashed] = useState(false);
  const [isWashingActive, setIsWashingActive] = useState(false);
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
      prompt: 'Boiled tender! Select Stainless Colander from bottom shelf to drain in sink',
      img: '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '🍲',
      label: 'Fork-Tender Boiled Ubod',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Boiled ubod drained into colander & steam-cooling in sink',
      img: '/assets/pot_empty.png',
      fallbackIcon: '✨',
      label: 'Emptied Stockpot (Contents Drained)',
    },
  ];

  const handleWashUbod = () => {
    if (isWashingActive || isWashed) return;
    setIsWashingActive(true);
    soundManager.playPour();

    setTimeout(() => {
      setIsWashingActive(false);
      setIsWashed(true);
      soundManager.playSuccess();
      addScore(20);
      showToast('Ubod Sanitized!', 'Raw coconut pith rinsed clean under running faucet (+20 pts)', 'success');
      speak(
        'Great job! The ubod is washed and clean. Now tap or drag the Washed Ubod from your bottom inventory shelf into the stockpot!',
        'happy',
        {
          badge: 'Submerge in Pot',
          hint: 'Click "Washed Ubod" on the bottom tray, then drop into the stockpot.',
          hideButton: true,
        }
      );
    }, 1200);
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
    } else if (stepIndex === 4 && (item.id === 'colander' || item.id === 'stainless_colander')) {
      handleDrainUbod();
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
          'Boiling complete! The tough cellulose fibers have softened into translucent, tender pieces. Now pick up the stainless colander from your bottom shelf and tap the sink to drain the hot water!',
          'happy',
          {
            badge: 'Drain & Cool',
            hint: 'Select Stainless Colander on the bottom shelf, then tap the washing sink to drain.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleDrainUbod = () => {
    soundManager.playPour();
    setPotStep(5);
    setHoldingItem(null);
    addScore(30);
    unlockBadge('boil_master', 'Thermal Softening Specialist', '🫕');
    completeMission('mission1');
    showToast('Drained in Sink!', 'Hot water drained; tender ubod cooling in colander (+30 pts)', 'success');
    speak(
      'Outstanding! The boiled ubod is drained and steam-cooling in the colander. The softened fibers are now ready for food processing into a fine paste!',
      'happy',
      {
        badge: 'Stage 1 Complete',
        btnText: 'Proceed to Stage 2: Food Processing ➔',
        onNext: () => setScene('mission2'),
      }
    );
  };

  const handleSinkClick = () => {
    if (!isWashed && !isWashingActive) {
      handleWashUbod();
      return;
    }

    if (potStep === 4) {
      if (holdingItem?.id === 'colander') {
        handleDrainUbod();
      } else {
        soundManager.playClick();
        showToast('Select Colander First', 'Click the Stainless Colander on the bottom shelf, then tap the sink!', 'info');
        speak(
          'Pick up the stainless colander from your bottom shelf first, then tap the sink to drain the boiling pot!',
          'thinking',
          {
            badge: 'Select Colander',
            hint: 'Tap "Stainless Colander" on the bottom tray, then tap the sink.',
          }
        );
      }
    }
  };

  const handleSinkDragOver = (e) => {
    if (potStep === 4) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleSinkDrop = (e) => {
    if (potStep === 4) {
      e.preventDefault();
      try {
        const data = e.dataTransfer.getData('text/plain');
        if (!data) return;
        const item = JSON.parse(data);
        if (item.id === 'colander') {
          handleDrainUbod();
        }
      } catch (err) {
        console.error(err);
      }
    }
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
      tooltip: isWashed ? 'Sanitized coconut pith strips, rinsed clean of surface soil & starch residues.' : 'Raw cut coconut pith strips. Wash under running water before cooking.',
    },
    {
      id: 'water_pitcher',
      name: 'Potable Water',
      measure: '4 Cups (To Submerge)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: potStep >= 2,
      isNext: potStep === 1,
      tooltip: 'Clean potable water to fully submerge ubod for uniform thermal softening.',
    },
    {
      id: 'sea_salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Sea Salt)',
      img: '/assets/ing_salt_fresh.png',
      fallbackIcon: '🧂',
      isUsed: potStep >= 3,
      isNext: potStep === 2,
      tooltip: 'Pure mineral sea salt for osmotic balance, seasoning, and fiber tenderization.',
    },
    {
      id: 'colander',
      name: 'Stainless Colander',
      measure: 'Drain & Rinse',
      img: '/assets/tool_colander_safe.png',
      fallbackIcon: '🥣',
      isUsed: potStep >= 5,
      isNext: potStep === 4,
      tooltip: 'Perforated stainless colander to drain boiling water and allow steam-cooling in sink.',
    },
  ];

  return (
    <div className="workstation-scene prep-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Left: Washing Sink Station (Unified Multi-State Workstation) */}
          <div
            className={`multi-state-workstation washing-workstation ${
              potStep === 4 && holdingItem?.id === 'colander' ? 'compatible-target' : ''
            }`}
            style={{ width: '440px' }}
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Washing Station</h4>
                <span className="workstation-sub">Potable rinse & colander station</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  potStep >= 5
                    ? 'badge-success-glow'
                    : isWashed
                    ? 'badge-success-glow'
                    : isWashingActive
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {potStep >= 5
                  ? '♨️ Ubod Draining'
                  : isWashed
                  ? '✅ Sanitized'
                  : isWashingActive
                  ? '💧 Rinsing...'
                  : 'Required'}
              </div>
            </div>

            {/* Workstation Viewport (270px height, matching Boiling Pot workstation) */}
            <div
              className={`workstation-viewport washing-viewport ${
                (!isWashed && !isWashingActive) || potStep === 4 ? 'interactive-sink' : ''
              }`}
              style={{ minHeight: '270px', flex: '1 1 auto' }}
              onClick={handleSinkClick}
              onDragOver={handleSinkDragOver}
              onDrop={handleSinkDrop}
              title={
                !isWashed
                  ? 'Click to wash under running faucet'
                  : potStep === 4
                  ? holdingItem?.id === 'colander'
                    ? 'Tap sink to drain boiled ubod into colander'
                    : 'Select Stainless Colander first, then tap sink'
                  : potStep >= 5
                  ? 'Drained & cooling boiled ubod'
                  : 'Sanitized colander'
              }
            >
              {/* Active Water Spray Splash Animation Overlay */}
              {isWashingActive && (
                <div className="water-spray-overlay">
                  <span className="water-drop d1">💧</span>
                  <span className="water-drop d2">💧</span>
                  <span className="water-drop d3">💧</span>
                </div>
              )}

              {/* Step 4 Drain Guidance Pill */}
              {potStep === 4 && (
                <div
                  className="sink-drain-guidance-pill"
                  onClick={handleSinkClick}
                  title="Click to drain boiled ubod"
                >
                  <span>
                    🥣 {holdingItem?.id === 'colander' ? 'Tap Sink to Drain' : 'Pick Up Colander Below'}
                  </span>
                </div>
              )}

              <div className="container-visual-wrapper">
                <img
                  src={
                    isWashingActive
                      ? '/assets/sink_colander_washing.png'
                      : potStep >= 5
                      ? '/assets/colander_boiled_ubod_draining.png'
                      : potStep >= 1
                      ? '/assets/sink_colander_empty.png'
                      : '/assets/sink_colander_ubod.png'
                  }
                  alt="Sink Colander"
                  className="container-state-img sink-preview-img"
                />
              </div>

              <div
                className={`sink-status-pill ${
                  isWashingActive
                    ? 'washing'
                    : potStep >= 5
                    ? 'washed'
                    : potStep >= 1
                    ? 'empty'
                    : isWashed
                    ? 'washed'
                    : 'unwashed'
                }`}
              >
                <span>
                  {isWashingActive
                    ? '🌊 Rinsing under Running Water...'
                    : potStep >= 5
                    ? '♨️ Boiled Ubod Draining & Steam-Cooling'
                    : potStep >= 1
                    ? '🥣 Empty Colander (Ready to Drain)'
                    : isWashed
                    ? '✨ Washed & Sanitized'
                    : '🌿 Fresh Cut Raw Ubod'}
                </span>
              </div>
            </div>

            {/* Workstation Footer holding the Faucet Knob Console */}
            <div className="workstation-footer has-custom-footer">
              <FaucetKnobConsole
                isReady={!isWashed}
                isFlowing={isWashingActive}
                isComplete={isWashed}
                potStep={potStep}
                onTurnOn={handleWashUbod}
              />
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
              customFooter={
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
                  disabled={isBoilingTimerActive || potStep >= 4}
                />
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

