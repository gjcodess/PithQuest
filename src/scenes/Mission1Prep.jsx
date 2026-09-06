import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { FaucetKnobConsole } from '../components/FaucetKnobConsole';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge } = useGame();

  // Wash step states:
  // 1. isUbodInColander (false -> place ing_ubod_fresh into sink_colander_empty -> becomes sink_colander_ubod)
  // 2. isWashingActive (running water animation with sink_colander_washing)
  // 3. isWashed (true -> ubod sanitized, ready to load in pot)
  const [isUbodInColander, setIsUbodInColander] = useState(false);
  const [isWashed, setIsWashed] = useState(false);
  const [isWashingActive, setIsWashingActive] = useState(false);

  // Pot state: 0: empty, 1: +ubod, 2: +water, 3: +salt, 4: boiling, 5: drained
  const [potStep, setPotStep] = useState(0);
  const [isBoilingTimerActive, setIsBoilingTimerActive] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 1: Washing & Pre-Cooking! Step 1: Wash the ubod thoroughly. Pick up the fresh cut raw coconut pith from your bottom inventory shelf and place it into the sink colander.',
      'neutral',
      {
        badge: 'Step 1: Raw Preparation',
        note: 'Always wash the raw ubod thoroughly under clean running water to remove surface dirt, debris, and impurities.',
        hint: 'Tap "Raw Ubod Strips" on the bottom shelf, then click or drop onto the empty sink colander.',
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

  const handlePlaceRawUbodInColander = () => {
    if (isUbodInColander) return;
    soundManager.playClick();
    soundManager.playPour();
    setIsUbodInColander(true);
    setHoldingItem(null);
    addScore(15);
    showToast('Loaded into Colander!', 'Raw ubod placed in colander. Now turn on faucet to rinse!', 'success');
    speak(
      'Great! Raw coconut pith is loaded into the colander. Now click or turn the cross handle on the faucet knob below to rinse under running water!',
      'happy',
      {
        badge: 'Step 1: Rinse Ubod',
        note: 'Wash the ubod thoroughly to remove unwanted residue and cool it down.',
        hint: 'Click or turn the 4-arm chrome cross handle to 90° -FLOW to start washing.',
        hideButton: true,
      }
    );
  };

  const handleWashUbod = () => {
    if (isWashingActive || isWashed || !isUbodInColander) return;
    setIsWashingActive(true);
    soundManager.playPour();

    setTimeout(() => {
      setIsWashingActive(false);
      setIsWashed(true);
      soundManager.playSuccess();
      addScore(20);
      showToast('Ubod Sanitized!', 'Raw coconut pith rinsed clean under running faucet', 'success');
      speak(
        'Step 2: After washing, transfer the ubod to a pan/stockpot. Pick up the Washed Ubod from your bottom shelf and transfer it into the pot!',
        'happy',
        {
          badge: 'Step 2: Transfer to Pan',
          note: 'Drain the ubod properly in the colander before transferring it to the cooking pan.',
          hint: 'Select Washed Ubod on the bottom shelf, then drop into the stockpot.',
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
        'Step 3: Add water to the pan with the ubod. Pick up the Potable Water from your bottom shelf and pour until submerged.',
        'neutral',
        {
          badge: 'Step 3: Add Water',
          note: 'Water provides moisture and facilitates uniform heat distribution during thermal softening.',
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
        'Step 3 (cont): Add a pinch of salt to the pan with the ubod.',
        'neutral',
        {
          badge: 'Step 3: Add Salt',
          note: 'Salt enhances flavor and helps tenderize coconut pith during the boiling process.',
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
        'Step 4: Boil the ubod over medium heat for approximately 10–15 minutes, or until it becomes tender. Press the "Ignite Burner" button to begin!',
        'thinking',
        {
          badge: 'Step 4: Boiling',
          note: 'Safety Note: Check the Stove, Gas Smell, Gas Hose and Regulator, and Nearby Materials before igniting.',
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
        showToast('Boiling Complete!', 'Ubod fibers are fork-tender and translucent', 'success');
        speak(
          'Step 5: Use a colander to drain the water from the boiled ubod. Pick up the stainless colander and tap the sink to drain!',
          'happy',
          {
            badge: 'Step 5: Drain Boiled Ubod',
            note: 'Safety Note: Wear heat-resistant gloves or use oven mitts when handling the hot pan after boiling.',
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
    showToast('Drained in Sink!', 'Hot water drained; tender ubod cooling in colander', 'success');
    speak(
      'Steps 6 & 7: While the ubod is in the colander, wash it again to remove unwanted residue and cool it down. Drain the ubod properly before proceeding!',
      'happy',
      {
        badge: 'Stage 1 Complete',
        note: 'Drain the ubod properly so excess moisture does not affect the grinding consistency in Stage 2.',
        btnText: 'Proceed to Stage 2: Food Processing ➔',
        onNext: () => setScene('mission2'),
      }
    );
  };

  const handleSinkClick = () => {
    if (!isUbodInColander) {
      if (holdingItem?.id === 'raw_ubod' || holdingItem?.id === 'washed_ubod') {
        handlePlaceRawUbodInColander();
      } else {
        soundManager.playClick();
        showToast('Select Raw Ubod First', 'Tap the Raw Ubod Strips on the bottom shelf, then tap the sink colander!', 'info');
        speak(
          'Pick up the fresh cut raw ubod from your bottom inventory shelf first, then tap the sink colander to place it inside!',
          'thinking',
          {
            badge: 'Load Colander',
            hint: 'Tap "Raw Ubod Strips" on the bottom tray, then tap the sink.',
            hideButton: true,
          }
        );
      }
      return;
    }

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
            hideButton: true,
          }
        );
      }
    }
  };

  const handleSinkDragOver = (e) => {
    if (!isUbodInColander || potStep === 4) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleSinkDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      const item = JSON.parse(data);
      if (!isUbodInColander && (item.id === 'raw_ubod' || item.id === 'washed_ubod')) {
        handlePlaceRawUbodInColander();
      } else if (potStep === 4 && item.id === 'colander') {
        handleDrainUbod();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stage1Inventory = [
    {
      id: isWashed ? 'washed_ubod' : 'raw_ubod',
      name: isWashed ? 'Washed Ubod' : 'Raw Ubod Strips',
      measure: isWashed
        ? '1 Cup (Sanitized)'
        : !isUbodInColander
        ? '1 Cup (Fresh Cut)'
        : 'In Sink (Washing)',
      img: isWashed ? '/assets/portion_ubod_raw_1cup.png' : '/assets/ing_ubod_fresh.png',
      fallbackIcon: '🥥',
      isUsed: isUbodInColander && !isWashed ? true : potStep >= 1,
      isNext: !isUbodInColander ? true : isWashed && potStep === 0,
      disabled: isUbodInColander && !isWashed,
      onClick:
        isUbodInColander && !isWashed
          ? () => {
              soundManager.playClick();
              showToast('Turn Faucet On', 'Click the cross valve handle below the sink to wash the ubod.', 'info');
              speak('The raw ubod is loaded in the colander! Turn the cross valve handle to wash it with running water.', 'thinking', {
                badge: 'Turn On Faucet',
                hint: 'Click the chrome cross valve handle on the washing console.',
                hideButton: true,
              });
            }
          : undefined,
      tooltip: isWashed
        ? 'Sanitized coconut pith strips, rinsed clean of surface soil & starch residues.'
        : !isUbodInColander
        ? 'Fresh cut raw coconut pith strips. Place in sink colander to wash.'
        : 'Ubod is in the sink colander. Turn on faucet to rinse.',
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

  const sinkImgSrc = isWashingActive
    ? '/assets/sink_colander_washing.png'
    : potStep >= 5
    ? '/assets/colander_boiled_ubod_draining.png'
    : potStep >= 1
    ? '/assets/sink_colander_empty.png'
    : isUbodInColander
    ? '/assets/sink_colander_ubod.png'
    : '/assets/sink_colander_empty.png';

  const sinkStatusText = isWashingActive
    ? '🌊 Rinsing under Running Water...'
    : potStep >= 5
    ? '♨️ Boiled Ubod Draining & Steam-Cooling'
    : potStep >= 1
    ? '🥣 Empty Colander (Ready to Drain)'
    : isWashed
    ? '✨ Washed & Sanitized'
    : isUbodInColander
    ? '🌿 Fresh Cut Raw Ubod (Ready to Wash)'
    : '🥣 Empty Colander • Place Raw Ubod Here';

  const sinkStatusClass = isWashingActive
    ? 'washing'
    : potStep >= 5
    ? 'washed'
    : potStep >= 1
    ? 'empty'
    : isWashed
    ? 'washed'
    : isUbodInColander
    ? 'unwashed'
    : 'empty';

  return (
    <div className="workstation-scene prep-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1080px' }}>
          {/* Left: Washing Sink Station (Unified Multi-State Workstation) */}
          <div
            className={`multi-state-workstation washing-workstation ${
              (!isUbodInColander && (holdingItem?.id === 'raw_ubod' || holdingItem?.id === 'washed_ubod')) ||
              (potStep === 4 && holdingItem?.id === 'colander')
                ? 'compatible-target'
                : ''
            }`}
            style={{ width: '480px' }}
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
                    : isUbodInColander
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {potStep >= 5 ? (
                  <>
                    <span className="badge-icon">♨️</span>
                    <span>Ubod Draining</span>
                  </>
                ) : isWashed ? (
                  <>
                    <span className="badge-icon-check">✓</span>
                    <span>Sanitized</span>
                  </>
                ) : isWashingActive ? (
                  <>
                    <span className="badge-icon">💧</span>
                    <span>Rinsing...</span>
                  </>
                ) : isUbodInColander ? (
                  <>
                    <span className="badge-icon">🌿</span>
                    <span>Ready to Wash</span>
                  </>
                ) : (
                  <span>1. Load Ubod</span>
                )}
              </div>
            </div>

            {/* Workstation Viewport (330px height, matching Boiling Pot workstation) */}
            <div
              className={`workstation-viewport washing-viewport ${
                !isUbodInColander || (!isWashed && !isWashingActive) || potStep === 4
                  ? 'interactive-sink'
                  : ''
              }`}
              style={{ minHeight: '330px', flex: '1 1 auto' }}
              onClick={handleSinkClick}
              onDragOver={handleSinkDragOver}
              onDrop={handleSinkDrop}
              title={
                !isUbodInColander
                  ? 'Drop Fresh Cut Raw Ubod into empty colander'
                  : !isWashed
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
                  src={sinkImgSrc}
                  alt="Sink Colander"
                  className="container-state-img sink-preview-img"
                />
              </div>

              <div className={`sink-status-pill ${sinkStatusClass}`}>
                <span>{sinkStatusText}</span>
              </div>
            </div>

            {/* Workstation Footer holding the Faucet Knob Console */}
            <div className="workstation-footer has-custom-footer">
              <FaucetKnobConsole
                isReady={isUbodInColander && !isWashed}
                isUbodLoaded={isUbodInColander}
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
              containerWidth="520px"
              containerHeight="330px"
              customFooter={
                <StoveBurnerConsole
                  isReady={potStep === 3}
                  isIgnited={isBoilingTimerActive}
                  isComplete={potStep >= 4}
                  progress={boilProgress}
                  onIgnite={handleIgniteBurner}
                  disabled={potStep !== 3 || isBoilingTimerActive}
                  standbyHint="Add ubod, water & salt first"
                  readyHint="👉 Turn burner dial 90° to HIGH"
                />
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    potStep >= 5
                      ? 'spec-success'
                      : potStep >= 4
                      ? 'spec-amber'
                      : potStep >= 1
                      ? 'spec-blue'
                      : ''
                  }`}
                >
                  {potStep >= 5
                    ? 'DRAINED & COOL'
                    : potStep >= 4
                    ? 'BOILED TENDER'
                    : potStep === 3
                    ? 'READY TO BOIL'
                    : potStep === 2
                    ? 'WATER: 4 CUPS'
                    : potStep === 1
                    ? 'UBOD LOADED'
                    : 'EMPTY POT'}
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Right Side / Bottom Inventory Rack */}
      <InventoryTray
        items={stage1Inventory}
        onItemSelect={(item) => {
          if (item.disabled) {
            if (item.onClick) item.onClick();
            return;
          }
          if (holdingItem?.id === item.id) {
            setHoldingItem(null);
          } else {
            setHoldingItem(item);
          }
        }}
        activeItemId={holdingItem?.id}
      />
    </div>
  );
};
