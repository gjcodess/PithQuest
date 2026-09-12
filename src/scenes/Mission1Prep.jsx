import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { FaucetKnobConsole } from '../components/FaucetKnobConsole';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

export const Mission1Prep = () => {
  const { setScene, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge, missionsCompleted, maxUnlockedStage, stageAnswers, recordStageAnswer } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission1);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission1);

  const handleCheckpointComplete = (selectedChoice) => {
    recordStageAnswer('mission1', {
      stageNum: 1,
      stageTitle: STAGE_QUESTIONS.mission1.stageTitle,
      question: STAGE_QUESTIONS.mission1.question,
      selectedOptionId: selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission1.explanation,
      choices: STAGE_QUESTIONS.mission1.choices,
    });
    setIsCheckpointOpen(false);
  };

  // Wash step states:
  // 1. isUbodInColander (false -> place raw_ubod into sink colander -> becomes sink_colander_ubod)
  // 2. isWashingActive (running water animation with sink_colander_washing)
  // 3. isWashed (true -> ubod sanitized, ready to load in pot)
  const [isUbodInColander, setIsUbodInColander] = useState(() => isAlreadyCompleted);
  const [isWashed, setIsWashed] = useState(() => isAlreadyCompleted);
  const [isWashingActive, setIsWashingActive] = useState(false);

  // Pot state: 0: empty, 1: +ubod, 2: +water, 3: +salt, 4: boiling complete, 5: drained in sink
  const [potStep, setPotStep] = useState(() => (isAlreadyCompleted ? 5 : 0));
  const [isBoilingTimerActive, setIsBoilingTimerActive] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  // Post-Boil Step 6: Cooling Rinse & Residue Wash in Sink
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
        'Stage 1: Washing & Pre-Cooking! Step 1: Wash the ubod thoroughly. Pick up the fresh cut raw coconut pith from your inventory and place it into the sink colander.',
        'neutral',
        {
          badge: 'Step 1: Raw Preparation',
          note: 'Always wash the raw ubod thoroughly under clean running water to remove surface dirt, debris, and impurities.',
          hint: 'Tap "Raw Ubod Strips" in your inventory, then click or drop onto the sink colander on the left.',
          hideButton: true,
        }
      );
    }
  }, []);

  // MultiStateContainer step configurations for the Boiling Pot
  const potSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['washed_ubod'],
      prompt: 'Add washed ubod strips into the empty cooking pot',
      img: '/assets/pot_empty.png',
      fallbackIcon: '🥣',
      label: 'Empty Cooking Pot',
    },
    {
      stepIndex: 1,
      acceptedItems: ['water_pitcher', 'water', 'portion_water'],
      prompt: 'Pour clean potable water to submerge the ubod',
      img: '/assets/pot_with_ubod.png',
      fallbackIcon: '💧',
      label: 'Cooking Pot with Ubod',
    },
    {
      stepIndex: 2,
      acceptedItems: ['sea_salt', 'salt', 'ing_salt_fresh'],
      prompt: 'Add pinch of sea salt into the pot for seasoning',
      img: '/assets/pot_with_ubod_water.png',
      fallbackIcon: '🧂',
      label: 'Submerged Ubod in Water',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Ignite stove burner for 10–15 minute medium boil',
      img: isBoilingTimerActive ? '/assets/pot_boiling_on_stove.png' : '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '♨️',
      label: isBoilingTimerActive ? 'Rolling Boil (100°C)' : 'Seasoned Ubod Ready to Boil',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander', 'stainless_colander', 'tool_colander_safe'],
      prompt: 'Boiled tender! Select Stainless Colander from inventory to drain in sink',
      img: '/assets/pot_boiling_done.png',
      fallbackIcon: '🥘',
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
      label: 'Emptied Cooking Pot (Contents Drained)',
    },
  ];

  const handlePlaceRawUbodInColander = () => {
    if (isUbodInColander) return;
    soundManager.playClick();
    soundManager.playPour();
    setIsUbodInColander(true);
    setHoldingItem(null);
    showToast('Loaded into Colander!', 'Raw ubod placed in colander. Now turn on faucet to rinse!', 'success');
    speak(
      'Great! Raw coconut pith is loaded into the colander. Now click or turn the cross handle on the faucet knob on the washing console to rinse under running water!',
      'happy',
      {
        badge: 'Step 1: Rinse Ubod',
        note: 'Wash the ubod thoroughly to remove unwanted residue and cool it down.',
        hint: 'Click or turn the 4-arm chrome cross handle to start washing.',
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
      showToast('Ubod Sanitized!', 'Raw coconut pith rinsed clean under running faucet', 'success');
      speak(
        'Step 2: After washing, transfer the ubod to the cooking pot. Pick up the Washed Ubod from the colander or inventory and place it in the pot on the right!',
        'happy',
        {
          badge: 'Step 2: Transfer to Pot',
          note: 'Drain the ubod properly in the colander before transferring it to the cooking pot.',
          hint: 'Select Washed Ubod and drop it into the Stainless Steel Boiling Pot on the right.',
          hideButton: true,
        }
      );
    }, 1200);
  };

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'washed_ubod') {
      soundManager.playPour();
      setPotStep(1);
      showToast('Ubod Added!', 'Now pour clean potable water to submerge the ubod.', 'success');
      speak(
        'Step 3: Add water to the pot with the ubod. Pick up the Potable Water from your inventory and pour 1 cup to submerge.',
        'neutral',
        {
          badge: 'Step 3: Add Water',
          note: 'Water provides moisture and facilitates uniform heat distribution during thermal softening.',
          hint: 'Select Potable Water from your inventory and drop into the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'water_pitcher' || item.id === 'water' || item.id === 'portion_water')) {
      soundManager.playPour();
      setPotStep(2);
      showToast('Water Added!', 'Now add a pinch of Sea Salt to season and tenderize.', 'success');
      speak(
        'Step 3 (cont): Add a pinch of salt to the pan with the ubod.',
        'neutral',
        {
          badge: 'Step 3: Add Salt',
          note: 'Salt enhances flavor and helps tenderize coconut pith during the boiling process.',
          hint: 'Select Pure Sea Salt from the shelf and drop it into the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'sea_salt' || item.id === 'salt' || item.id === 'ing_salt_fresh')) {
      soundManager.playClick();
      setPotStep(3);
      showToast('Salt Added!', 'Pot is ready! Turn the burner dial to ignite.', 'success');
      speak(
        'Step 4: Boil the ubod over medium heat for approximately 10–15 minutes, or until it becomes tender. Click the burner dial to begin!',
        'thinking',
        {
          badge: 'Step 4: Boiling',
          note: 'Safety Note: Check the Stove, Gas Smell, Gas Hose and Regulator, and Nearby Materials before igniting.',
          hint: 'Click the burner dial on the stove console below the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 4 && (item.id === 'colander' || item.id === 'stainless_colander' || item.id === 'tool_colander_safe')) {
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
        showToast('Boiling Complete!', 'Ubod fibers are fork-tender (10–15 min boil done)', 'success');
        speak(
          'Step 5: Use a colander to drain the water from the boiled ubod. Pick up the stainless colander and tap the sink on the left to drain!',
          'happy',
          {
            badge: 'Step 5: Drain Boiled Ubod',
            note: 'Safety Note: Wear heat-resistant gloves or use oven mitts when handling the hot pan after boiling.',
            hint: 'Select Stainless Colander in your inventory, then tap the sink on the left.',
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
    showToast('Drained in Sink!', 'Boiled ubod drained into colander. Now turn on faucet to rinse & cool!', 'info');
    speak(
      'Step 6: While the ubod is in the colander, wash it again to remove any unwanted residue and to cool it down.',
      'neutral',
      {
        badge: 'Step 6: Residue & Cooling Rinse',
        note: 'Washing the boiled ubod removes excess surface starch residue and rapidly cools it down to stop carryover cooking.',
        hint: 'Click the chrome cross valve handle on the washing console on the left to turn on the faucet.',
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
      unlockBadge('boil_master', 'Thermal Softening Specialist', '🥣');
      completeMission('mission1');
      showToast('Cooled & Drained!', 'Ubod residue washed away and properly cooled!', 'success');
      speak(
        'Step 7: Perfect! The boiled ubod is washed clean, drained, and cooled down. Ready for Stage 2 food processing!',
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
            hint: 'Tap "Raw Ubod Strips" in your inventory, then tap the sink on the left.',
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
          fallbackIcon: '🥣',
          tooltip: 'Sanitized coconut pith strips, rinsed clean of surface soil & starch residues.',
        };
        setHoldingItem(washedItem);
        showToast('Holding Washed Ubod!', 'Drop or tap into the boiling pot on the right.', 'info');
        speak(
          'Step 2: Transfer the washed ubod to the cooking pot. Drop or tap the Washed Ubod into the empty boiling pot on the right!',
          'happy',
          {
            badge: 'Step 2: Transfer to Pot',
            note: 'Drain the ubod properly in the colander before transferring it to the cooking pot.',
            hint: 'Drop or tap the Washed Ubod into the Stainless Steel Boiling Pot on the right.',
            hideButton: true,
          }
        );
      }
      return;
    }

    // 3. Draining boiled ubod into colander
    if (potStep === 4) {
      if (holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander' || holdingItem?.id === 'tool_colander_safe') {
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
      } else if (potStep === 4 && (item.id === 'colander' || item.id === 'stainless_colander' || item.id === 'tool_colander_safe')) {
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
                hint: 'Click the chrome cross valve handle on the washing console on the left.',
                hideButton: true,
              });
            }
          : undefined,
      tooltip: isWashed
        ? 'Sanitized coconut pith strips, rinsed clean of surface soil & starch residues.'
        : !isUbodInColander
        ? 'Fresh cut raw coconut pith strips. Place in sink colander on the left to wash.'
        : 'Ubod is in the sink colander. Turn on faucet to rinse.',
    },
    {
      id: 'water_pitcher',
      name: 'Potable Water',
      measure: '1 Cup (To Submerge)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: potStep >= 2,
      isNext: potStep === 1,
      tooltip: 'Clean potable water to fully submerge ubod for uniform thermal softening.',
    },
    {
      id: 'sea_salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Pinch)',
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

  const recipeItems = [
    { name: 'Raw Ubod', measure: '1 Cup', icon: '🥥' },
    { name: 'Potable Water', measure: '1 Cup', icon: '💧' },
    { name: 'Pure Sea Salt', measure: '1 tsp (Pinch)', icon: '🧂' },
  ];

  const safetyChecklist = [
    {
      title: 'Stove & Gas Inspection (Step 4)',
      desc: 'Check stove, gas smell, gas hose & regulator, and nearby flammable materials before igniting.',
      icon: '🔥',
    },
    {
      title: 'Heat Protection Protocol (Step 5)',
      desc: 'Wear heat-resistant gloves or oven mitts when handling hot pan (never thin disposable gloves).',
      icon: '🧤',
    },
    {
      title: 'Double Colander Wash (Steps 1 & 6)',
      desc: 'Wash in colander before boiling to remove dirt, and after boiling to remove residue and cool down.',
      icon: '🧼',
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
    ? '♨️ Boiled Ubod in Colander • Turn Faucet to Wash & Cool'
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

      {/* Stage 1 Pre-Check Question Modal */}
      <CheckpointQuestionModal
        isOpen={isCheckpointOpen}
        stageTitle={STAGE_QUESTIONS.mission1.stageTitle}
        question={STAGE_QUESTIONS.mission1.question}
        choices={STAGE_QUESTIONS.mission1.choices}
        onComplete={handleCheckpointComplete}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 1: Washing & Boiling"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Boiling the coconut pith for 10–15 minutes softens the tough plant fibers so they can be smoothly pureed into a fine paste in Stage 2 without coarse lumps."
        />

        <div className="stage-content-row">
          {/* Left: Washing Sink Station (Unified Multi-State Workstation) */}
          <div
            className={`multi-state-workstation washing-workstation ${
              (!isUbodInColander && (holdingItem?.id === 'raw_ubod' || holdingItem?.id === 'washed_ubod')) ||
              (potStep === 4 && (holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander' || holdingItem?.id === 'tool_colander_safe')) ||
              (potStep >= 5 && !isCoolingRinseComplete)
                ? 'compatible-target'
                : ''
            }`}
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Washing & Draining Sink</h4>
                <span className="workstation-sub">Stage 1: Potable Rinse & Residue Cooling Drain</span>
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

            {/* Workstation Viewport */}
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
              style={{ flex: '1 1 auto' }}
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
                  ? holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander' || holdingItem?.id === 'tool_colander_safe'
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
                    🥣 {holdingItem?.id === 'colander' || holdingItem?.id === 'stainless_colander' || holdingItem?.id === 'tool_colander_safe' ? 'Tap Sink to Drain' : 'Select Colander from Inventory'}
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
                  alt="Washing Sink & Colander"
                  className="sink-preview-img container-asset-img container-state-img"
                  style={{
                    filter: isWashingActive || isCoolingRinseActive ? 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.45))' : undefined,
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/sink_colander_empty.png';
                  }}
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

          {/* Right: Multi-State Stockpot Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="stockpot"
              title="Stainless Steel Boiling Pot"
              subtitle="Stage 1: Thermal Boiling & Softening on Gas Stove"
              currentStepIndex={potStep}
              steps={potSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isBoilingTimerActive ? 'boiling' : potStep === 4 ? 'steaming' : null}
              containerWidth="100%"
              customFooter={
                <StoveBurnerConsole
                  isReady={potStep === 3}
                  isIgnited={isBoilingTimerActive}
                  isComplete={potStep >= 4}
                  progress={boilProgress}
                  onIgnite={handleIgniteBurner}
                  disabled={potStep !== 3 || isBoilingTimerActive}
                  standbyHint="Add ubod, water & salt first"
                  readyHint="👉 Turn burner dial to ignite"
                  modeTitleReady="IGNITE BURNER"
                  modeTitleActive="BOILING: MEDIUM HEAT"
                  modeTitleStandby="BURNER: OFF"
                  modeTitleComplete="BOILED (10–15 MIN)"
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
                    ? 'DRAINED & RINSED'
                    : potStep >= 4
                    ? 'BOILED TENDER'
                    : potStep === 3
                    ? 'HEAT: MEDIUM'
                    : potStep === 2
                    ? 'SALT: 1 PINCH'
                    : potStep === 1
                    ? 'WATER: 1 CUP'
                    : 'EMPTY POT'}
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Inventory Shelf */}
      <InventoryTray
        title="Station 1 Boiling Ingredients & Tools"
        items={stage1Inventory}
        onItemClick={(item) => {
          if (item.disabled) {
            if (item.onClick) item.onClick();
            return;
          }
          soundManager.playClick();
          if (holdingItem?.id === item.id) {
            setHoldingItem(null);
          } else {
            setHoldingItem(item);
            if (item.id === 'raw_ubod') {
              showToast('Raw Ubod Selected', 'Drop or tap into the sink colander on the left.', 'info');
            } else if (item.id === 'washed_ubod') {
              showToast('Washed Ubod Selected', 'Drop or tap into the cooking pot on the right.', 'info');
            } else if (item.id === 'water_pitcher') {
              showToast('Water Selected', 'Drop into the cooking pot to submerge ubod.', 'info');
            } else if (item.id === 'sea_salt') {
              showToast('Salt Selected', 'Drop into the cooking pot for seasoning.', 'info');
            } else if (item.id === 'colander') {
              showToast('Colander Selected', 'Tap the sink on the left to drain boiled ubod.', 'info');
            }
          }
        }}
      />
    </div>
  );
};
