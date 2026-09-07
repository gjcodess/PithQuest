import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { FaucetKnobConsole } from '../components/FaucetKnobConsole';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge, missionsCompleted, maxUnlockedStage } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission1);

  // Wash step states:
  // 1. isUbodInColander (false -> place ing_ubod_fresh into sink_colander_empty -> becomes sink_colander_ubod)
  // 2. isWashingActive (running water animation with sink_colander_washing)
  // 3. isWashed (true -> ubod sanitized, ready to load in pot)
  const [isUbodInColander, setIsUbodInColander] = useState(() => isAlreadyCompleted);
  const [isWashed, setIsWashed] = useState(() => isAlreadyCompleted);
  const [isWashingActive, setIsWashingActive] = useState(false);

  // Pot state: 0: empty, 1: +ubod, 2: +water, 3: +salt, 4: boiling, 5: drained
  const [potStep, setPotStep] = useState(() => (isAlreadyCompleted ? 5 : 0));
  const [isBoilingTimerActive, setIsBoilingTimerActive] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  // Post-Boil Step 6: Cooling Rinse & Residue Wash
  const [isCoolingRinseActive, setIsCoolingRinseActive] = useState(false);
  const [isCoolingRinseComplete, setIsCoolingRinseComplete] = useState(() => isAlreadyCompleted);

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 1 Completed! You have prepared, boiled, and washed the tender coconut pith clean. You can review your work or proceed to Stage 2.',
        'happy',
        {
          badge: 'Stage 1 Complete',
          note: 'Drain the ubod properly so excess moisture does not affect the grinding consistency in Stage 2.',
          btnText: 'Proceed to Stage 2: Food Processing ➔',
          onNext: () => setScene('mission2'),
        }
      );
    } else {
      speak(
        'Stage 1: Washing & Pre-Cooking! Step 1: Wash the ubod thoroughly. Pick up the fresh cut raw coconut pith from your inventory rack and place it into the sink colander.',
        'neutral',
        {
          badge: 'Step 1: Raw Preparation',
          note: 'Always wash the raw ubod thoroughly under clean running water to remove surface dirt, debris, and impurities.',
          hint: 'Tap "Raw Ubod Strips" in your inventory, then click or drop onto the empty sink colander.',
          hideButton: true,
        }
      );
    }
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
      acceptedItems: ['colander', 'stainless_colander'],
      prompt: 'Boiled tender! Select Stainless Colander from inventory to drain in sink',
      img: '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '🍲',
      label: 'Fork-Tender Boiled Ubod',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: isCoolingRinseComplete
        ? 'Boiled ubod rinsed clean & properly drained for Stage 2'
        : 'Boiled ubod transferred to sink colander for cooling rinse & residue wash',
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
      'Great! Raw coconut pith is loaded into the colander. Now click or turn the cross handle on the faucet knob on the washing console to rinse under running water!',
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
        'Step 2: After washing, transfer the ubod to a pan/stockpot. Pick up the Washed Ubod from your inventory and transfer it into the pot!',
        'happy',
        {
          badge: 'Step 2: Transfer to Pan',
          note: 'Drain the ubod properly in the colander before transferring it to the cooking pan.',
          hint: 'Select Washed Ubod in your inventory, then drop into the stockpot.',
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
        'Step 3: Add water to the pan with the ubod. Pick up the Potable Water from your inventory and pour until submerged.',
        'neutral',
        {
          badge: 'Step 3: Add Water',
          note: 'Water provides moisture and facilitates uniform heat distribution during thermal softening.',
          hint: 'Select Potable Water from your inventory and drop into the pot.',
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
            hint: 'Select Stainless Colander in your inventory, then tap the washing sink to drain.',
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
    addScore(25);
    showToast('Drained in Sink!', 'Boiled ubod drained into colander. Now turn on faucet to rinse & cool!', 'info');
    speak(
      'Step 6: While the ubod is in the colander, wash it again to remove any unwanted residue and to cool it down.',
      'neutral',
      {
        badge: 'Step 6: Residue & Cooling Rinse',
        note: 'Washing the boiled ubod removes excess surface starch residue and rapidly cools it down to stop carryover cooking.',
        hint: 'Click the chrome cross valve handle on the washing console to turn on the faucet.',
        hideButton: true,
      }
    );
  };

  const handleCoolingRinse = () => {
    if (isCoolingRinseActive || isCoolingRinseComplete || potStep < 5) return;
    setIsCoolingRinseActive(true);
    soundManager.playPour();

    setTimeout(() => {
      setIsCoolingRinseActive(false);
      setIsCoolingRinseComplete(true);
      soundManager.playSuccess();
      addScore(30);
      unlockBadge('boil_master', 'Thermal Softening Specialist', '🫕');
      completeMission('mission1');
      showToast('Cooled & Drained!', 'Ubod residue washed away and properly cooled!', 'success');
      speak(
        'Step 7: Perfect! The boiled ubod is washed clean and cooled down. Drain the ubod properly so excess moisture does not affect grinding consistency in Stage 2!',
        'happy',
        {
          badge: 'Stage 1 Complete',
          note: 'Drain the ubod properly so excess moisture does not affect the grinding consistency in Stage 2.',
          btnText: 'Proceed to Stage 2: Food Processing ➔',
          onNext: () => setScene('mission2'),
        }
      );
    }, 1400);
  };

  const handleSinkClick = () => {
    // 1. Loading raw ubod
    if (!isUbodInColander) {
      if (holdingItem?.id === 'raw_ubod' || holdingItem?.id === 'washed_ubod') {
        handlePlaceRawUbodInColander();
      } else {
        soundManager.playClick();
        showToast('Select Raw Ubod First', 'Tap the Raw Ubod Strips in your inventory, then tap the sink colander!', 'info');
        speak(
          'Pick up the fresh cut raw ubod from your inventory first, then tap the sink colander to place it inside!',
          'thinking',
          {
            badge: 'Load Colander',
            hint: 'Tap "Raw Ubod Strips" in your inventory, then tap the sink.',
            hideButton: true,
          }
        );
      }
      return;
    }

    // 2. Initial raw wash
    if (!isWashed && !isWashingActive) {
      handleWashUbod();
      return;
    }

    // 2b. Pick up Washed Ubod directly from the sink colander
    if (isWashed && potStep === 0) {
      soundManager.playClick();
      if (holdingItem?.id === 'washed_ubod') {
        setHoldingItem(null);
      } else {
        const washedItem = stage1Inventory.find((i) => i.id === 'washed_ubod') || {
          id: 'washed_ubod',
          name: 'Washed Ubod',
          measure: '1 Cup (Sanitized)',
          img: '/assets/colander_ubod_raw.png',
          fallbackIcon: '🥥',
          tooltip: 'Sanitized coconut pith strips, rinsed clean of surface soil & starch residues.',
        };
        setHoldingItem(washedItem);
        showToast('Holding Washed Ubod!', 'Drop or tap into the boiling pot on the right.', 'info');
        speak(
          'Step 2: Transfer the washed ubod to the stockpot. Drop or tap the Washed Ubod into the empty boiling pot on the right!',
          'happy',
          {
            badge: 'Step 2: Transfer to Pan',
            note: 'Drain the ubod properly in the colander before transferring it to the cooking pan.',
            hint: 'Drop or tap the Washed Ubod into the Stainless Steel Boiling Pot.',
            hideButton: true,
          }
        );
      }
      return;
    }

    // 3. Draining boiled ubod into colander
    if (potStep === 4) {
      if (holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander') {
        handleDrainUbod();
      } else {
        soundManager.playClick();
        showToast('Select Colander First', 'Click the Stainless Colander in your inventory, then tap the sink!', 'info');
        speak(
          'Pick up the stainless colander from your inventory first, then tap the sink to drain the boiling pot!',
          'thinking',
          {
            badge: 'Select Colander',
            hint: 'Tap "Stainless Colander" in your inventory, then tap the sink.',
            hideButton: true,
          }
        );
      }
      return;
    }

    // 4. Post-boil cooling rinse
    if (potStep >= 5 && !isCoolingRinseComplete && !isCoolingRinseActive) {
      handleCoolingRinse();
      return;
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
      } else if (potStep === 4 && (item.id === 'colander' || item.id === 'stainless_colander')) {
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
      img: isWashed ? '/assets/colander_ubod_raw.png' : '/assets/ing_ubod_fresh.png',
      fallbackIcon: '🥥',
      isUsed: isUbodInColander && !isWashed ? true : potStep >= 1,
      isNext: !isUbodInColander ? true : isWashed && potStep === 0,
      disabled: isUbodInColander && !isWashed,
      onClick:
        isUbodInColander && !isWashed
          ? () => {
              soundManager.playClick();
              showToast('Turn Faucet On', 'Click the cross valve handle on the washing console to wash the ubod.', 'info');
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
      tooltip: 'Perforated stainless colander to drain boiling water and allow cooling rinse in sink.',
    },
  ];

  const sinkImgSrc = isWashingActive
    ? '/assets/sink_colander_washing.png'
    : isCoolingRinseActive
    ? '/assets/colander_boiled_ubod_cooling_rinse.png'
    : isCoolingRinseComplete
    ? '/assets/colander_boiled_ubod_ready.png'
    : potStep >= 5
    ? '/assets/colander_boiled_ubod_draining.png'
    : potStep >= 1
    ? '/assets/sink_colander_empty.png'
    : isUbodInColander
    ? '/assets/sink_colander_ubod.png'
    : '/assets/sink_colander_empty.png';

  const sinkStatusText = isWashingActive
    ? '🌊 Rinsing Raw Ubod under Running Water...'
    : isCoolingRinseActive
    ? '🌊 Cooling Rinse: Washing residue & cooling ubod...'
    : isCoolingRinseComplete
    ? '✨ Cooled & Drained (Ready for Stage 2)'
    : potStep >= 5
    ? '♨️ Boiled Ubod in Colander • Turn On Faucet to Wash & Cool'
    : potStep >= 1
    ? '🥣 Empty Colander (Ready to Drain)'
    : isWashed && potStep === 0
    ? '✨ Washed & Sanitized • Click to Pick Up'
    : isWashed
    ? '✨ Washed & Sanitized'
    : isUbodInColander
    ? '🌿 Fresh Cut Raw Ubod (Ready to Wash)'
    : '🥣 Empty Colander • Place Raw Ubod Here';

  const sinkStatusClass = isWashingActive || isCoolingRinseActive
    ? 'washing'
    : isCoolingRinseComplete
    ? 'washed'
    : potStep >= 5
    ? 'unwashed'
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
              (potStep === 4 && (holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander')) ||
              (potStep >= 5 && !isCoolingRinseComplete)
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
                  isCoolingRinseComplete
                    ? 'badge-success-glow'
                    : isCoolingRinseActive
                    ? 'badge-flow-glow'
                    : potStep >= 5
                    ? 'badge-amber-glow'
                    : isWashed
                    ? 'badge-success-glow'
                    : isWashingActive
                    ? 'badge-flow-glow'
                    : isUbodInColander
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {isCoolingRinseActive ? (
                  <>
                    <span className="badge-icon">💧</span>
                    <span>Cooling Rinse...</span>
                  </>
                ) : isCoolingRinseComplete ? (
                  <>
                    <span className="badge-icon-check">✓</span>
                    <span>Cooled & Ready</span>
                  </>
                ) : potStep >= 5 ? (
                  <>
                    <span className="badge-icon">♨️</span>
                    <span>Turn Faucet to Cool</span>
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
                !isUbodInColander ||
                (!isWashed && !isWashingActive) ||
                (isWashed && potStep === 0) ||
                potStep === 4 ||
                (potStep >= 5 && !isCoolingRinseComplete && !isCoolingRinseActive)
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
                  : isWashed && potStep === 0
                  ? 'Click to pick up Washed Ubod'
                  : potStep === 4
                  ? holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander'
                    ? 'Tap sink to drain boiled ubod into colander'
                    : 'Select Stainless Colander first, then tap sink'
                  : potStep >= 5 && !isCoolingRinseComplete
                  ? 'Click to turn on faucet and cool down boiled ubod'
                  : isCoolingRinseComplete
                  ? 'Clean, cooled & drained boiled ubod'
                  : 'Sanitized colander'
              }
            >
              {/* Active Water Spray Splash Animation Overlay */}
              {(isWashingActive || isCoolingRinseActive) && (
                <div className="water-spray-overlay">
                  <span className="water-drop d1">💧</span>
                  <span className="water-drop d2">💧</span>
                  <span className="water-drop d3">💧</span>
                </div>
              )}

              {/* Step 2 Pick Up Guidance Pill */}
              {isWashed && potStep === 0 && (
                <div
                  className="sink-drain-guidance-pill"
                  onClick={handleSinkClick}
                  title="Click to pick up Washed Ubod"
                >
                  <span>👉 {holdingItem?.id === 'washed_ubod' ? 'Holding Washed Ubod • Drop in Pot' : 'Click to Pick Up Washed Ubod'}</span>
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
                    🥣 {holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander' ? 'Tap Sink to Drain' : 'Select Colander from Inventory'}
                  </span>
                </div>
              )}

              {/* Step 6 Cooling Rinse Guidance Pill */}
              {potStep >= 5 && !isCoolingRinseComplete && !isCoolingRinseActive && (
                <div
                  className="sink-drain-guidance-pill sink-cooling-guidance-pill"
                  onClick={handleSinkClick}
                  title="Click to wash residue & cool boiled ubod"
                >
                  <span>💧 Click Sink or Turn Cross Handle to Rinse</span>
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
                isCoolingRinsePhase={potStep >= 5}
                isCoolingRinseReady={potStep >= 5 && !isCoolingRinseComplete}
                isCoolingRinseFlowing={isCoolingRinseActive}
                isCoolingRinseComplete={isCoolingRinseComplete}
                onTurnOnCoolingRinse={handleCoolingRinse}
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
                    isCoolingRinseComplete
                      ? 'spec-success'
                      : potStep >= 5
                      ? 'spec-amber'
                      : potStep >= 4
                      ? 'spec-amber'
                      : potStep >= 1
                      ? 'spec-blue'
                      : ''
                  }`}
                >
                  {isCoolingRinseComplete
                    ? 'COOLED & READY'
                    : potStep >= 5
                    ? 'COOLING RINSE'
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
