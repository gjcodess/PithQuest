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
  const { setScene, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge, missionsCompleted, maxUnlockedStage, stageAnswers, recordStageAnswer, recordMistake } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission1);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission1);

  const handleCheckpointComplete = (selectedChoice, questionChoices) => {
    const choicesList = questionChoices || STAGE_QUESTIONS.mission1.choices;
    const correctChoice = choicesList.find((c) => c.isCorrect);
    recordStageAnswer('mission1', {
      stageNum: 1,
      stageTitle: STAGE_QUESTIONS.mission1.stageTitle,
      question: STAGE_QUESTIONS.mission1.question,
      selectedOptionId: selectedChoice.displayLetter || selectedChoice.selectedOptionId || selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission1.explanation,
      choices: choicesList,
      correctOptionId: correctChoice?.displayLetter || correctChoice?.id?.toUpperCase() || 'A',
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

  // Single-workstation sequential phase: 'wash' -> 'boil' -> 'drain_rinse'
  const [currentPhase, setCurrentPhase] = useState(() => {
    if (isAlreadyCompleted || potStep >= 5) return 'drain_rinse';
    if (isWashed || potStep >= 1) return 'boil';
    return 'wash';
  });

  // Active colander draining transition state
  const [isDrainingActive, setIsDrainingActive] = useState(false);

  // Error Shake & Nudge Feedback
  const [sinkShake, setSinkShake] = useState(false);
  const sinkShakeTimeoutRef = React.useRef(null);

  const triggerSinkError = (msg = "This action cannot be done right now. Check Teacher Mia's instructions!") => {
    soundManager.playError();
    if (recordMistake) recordMistake();

    if (sinkShakeTimeoutRef.current) {
      clearTimeout(sinkShakeTimeoutRef.current);
    }

    setSinkShake(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSinkShake(true);
        sinkShakeTimeoutRef.current = setTimeout(() => {
          setSinkShake(false);
        }, 450);
      });
    });

    showToast('Incorrect Order', msg, 'danger');
  };

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 1 Completed! You have masterfully prepared, boiled, and washed the tender coconut pith clean. Thermal degradation of hemicellulose and pectin fibrils has converted the tough apical meristem into a tender texture, perfectly primed for mechanical grinding. You can review your work or proceed to Stage 2: Food Processing.',
        'happy',
        {
          badge: 'Stage 1 Complete',
          note: 'Drain the ubod properly so excess moisture does not affect the grinding consistency in Stage 2.',
          btnText: 'Click the “Proceed to stage 2”',
          onNext: () => setScene('mission2'),
        }
      );
    } else {
      speak(
        'Teacher Mia: we are wearing our PPE, choosing the tools and equipments, and choosing the ingredients. Let us now proceed with our stage 1 which is washing and boiling the Ubod first. Fresh Ubod is washed thoroughly to remove dirt and impurities.\n\nBefore proceeding to the steps, read the Recipe and safety reference from the upper left\nOn your middle left select and drop the ingredients.',
        'neutral',
        {
          badge: 'Step 1: Raw Preparation',
          note: 'Always wash the raw ubod thoroughly under clean running water to remove surface dirt, debris, and impurities.',
          hint: 'Tap "Raw Ubod Strips" in your inventory, then click or drop onto the sink colander.',
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
      prompt: 'Select the washed ubod. Put in the pot.',
      img: '/assets/pot_empty.png',
      fallbackIcon: '🥣',
      label: 'Empty Cooking Pot',
    },
    {
      stepIndex: 1,
      acceptedItems: ['water_pitcher', 'water', 'portion_water'],
      prompt: 'Select water then drop to the pot.',
      img: '/assets/pot_with_ubod.png',
      fallbackIcon: '💧',
      label: 'Cooking Pot with Ubod',
    },
    {
      stepIndex: 2,
      acceptedItems: ['sea_salt', 'salt', 'ing_salt_fresh'],
      prompt: 'Select salt then drop to the pot.',
      img: '/assets/pot_with_ubod_water.png',
      fallbackIcon: '🧂',
      label: 'Submerged Ubod in Water',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Click “Ignite burner” to boil the ubod',
      img: isBoilingTimerActive ? '/assets/pot_boiling_on_stove.png' : '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '♨️',
      label: isBoilingTimerActive ? 'Rolling Boil (100°C)' : 'Seasoned Ubod Ready to Boil',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander', 'stainless_colander', 'tool_colander_safe'],
      prompt: isDrainingActive
        ? 'Select stainless colander then drop to the pot.'
        : 'Select stainless colander then drop to the pot.',
      img: isDrainingActive ? '/assets/colander_boiled_ubod_draining.png' : '/assets/pot_boiling_done.png',
      fallbackIcon: '🥘',
      label: isDrainingActive ? 'Draining in Colander...' : 'Fork-Tender Boiled Ubod (Ready to Drain)',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: isCoolingRinseComplete
        ? 'Click “Turn faucet to cool” so the ubod will be cooled and drained'
        : 'Click “Turn faucet to cool” so the ubod will be cooled and drained',
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
      'Select the raw ubod and place it in the sink\n\nClick the “Click cross to rinse” to full washed the ubod',
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
      showToast('Ubod Sanitized!', 'Raw coconut pith rinsed clean! Moving to stove pot...', 'success');
      setTimeout(() => {
        setCurrentPhase('boil');
        speak(
          'Step 2: Excellent! The raw ubod has been washed thoroughly. Now we begin thermal tenderization. The tough cell wall matrix must be softened so that it can later be pureed into a fine, smooth slurry. Pick up the Washed Ubod from your inventory and place it into the stainless steel boiling pot on the stove.',
          'happy',
          {
            badge: 'Step 2: Transfer to Pot',
            note: 'Drain the ubod properly in the colander before transferring it to the cooking pot.',
            hint: 'Select Washed Ubod from your inventory and drop it into the Stainless Steel Boiling Pot.',
            hideButton: true,
          }
        );
      }, 700);
    }, 1200);
  };

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'washed_ubod') {
      soundManager.playPour();
      setPotStep(1);
      showToast('Ubod Added!', 'Now pour clean potable water to submerge the ubod.', 'success');
      speak(
        'Step 3: Great job loading the pot! Now we need an efficient thermal conduction medium. Clean potable water conducts heat uniformly across all plant tissues and hydrates the cellulose matrix. Pick up the Potable Water from your inventory and pour 1 cup into the pot to completely submerge the ubod.',
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
        'Step 3 (cont): Water is added! Now we introduce sodium chloride (pure sea salt). Dissolved sodium and chloride ions loosen ionic bonds between plant pectin and cellulose chains, accelerating thermal softening while evenly pre-seasoning the pith down to its cellular core. Pick up the Pure Sea Salt from the shelf and add a measured pinch to the pot.',
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
        'Step 4: Everything is in the pot! Before lighting the burner, always observe our lab safety check: ensure the burner ports are unobstructed, check for gas smell, and clear away nearby flammables. Now turn the stove burner dial to ignite medium-high heat and boil the ubod for 10–15 minutes until fork-tender.',
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
        showToast('Boiling Complete!', 'Ubod is fork-tender! Click Stainless Colander to drain.', 'success');
        speak(
          'Step 5: Thermal boiling complete! The coconut pith is now fork-tender and translucent. To prevent carryover heat from overcooking the ubod into a mushy consistency, we must drain the boiling water immediately. Click the Stainless Colander in your inventory or tap the pot to drain the water and transition to the cooling sink!',
          'happy',
          {
            badge: 'Step 5: Drain Boiled Ubod',
            note: 'Safety Note: Wear heat-resistant gloves or use oven mitts when handling the hot pan after boiling.',
            hint: 'Click the Stainless Colander in your inventory or tap the pot to drain.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleDrainUbod = () => {
    if (isDrainingActive) return;
    setIsDrainingActive(true);
    soundManager.playClick();
    soundManager.playPour();
    soundManager.playSuccess();
    setHoldingItem(null);
    showToast('Draining in Colander!', 'Boiling water draining away...', 'success');

    setTimeout(() => {
      setIsDrainingActive(false);
      setPotStep(5);
      setCurrentPhase('drain_rinse');
      showToast('Transferred to Sink!', 'Boiled ubod in colander ready for cooling rinse.', 'info');
      speak(
        'Step 6: The boiled ubod is now in the sink colander! While it rests in the colander, we must perform a cooling rinse. Cold running water immediately arrests carryover thermal cooking, washes away excess surface starch leachates, and cools the pith down to safe handling temperature. Turn the chrome cross valve handle to activate the faucet.',
        'neutral',
        {
          badge: 'Step 6: Residue & Cooling Rinse',
          note: 'Washing the boiled ubod removes excess surface starch residue and rapidly cools it down to stop carryover cooking.',
          hint: 'Click the chrome cross valve handle on the washing console to turn on the faucet.',
          hideButton: true,
        }
      );
    }, 850);
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
        'Step 7: Outstanding execution! The boiled ubod is sanitized, fork-tender, thoroughly drained, and cooled down. You have achieved the ideal moisture and texture balance required for smooth pureeing without excess water dilution. You are officially ready for Stage 2: Food Processing!',
        'happy',
        {
          badge: 'Stage 1 Complete',
          note: 'Drain the ubod properly so excess moisture does not affect the grinding consistency in Stage 2.',
          btnText: 'Click the “Proceed to stage 2”',
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
        triggerSinkError(
          holdingItem
            ? 'Place the Raw Ubod Strips into the sink colander first before adding other items!'
            : 'Select Raw Ubod Strips from your inventory first, then tap the sink colander!'
        );
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
      if (holdingItem?.id === 'water_pitcher' || holdingItem?.id === 'water' || holdingItem?.id === 'portion_water' || holdingItem?.id === 'sea_salt' || holdingItem?.id === 'salt') {
        triggerSinkError('Wash the raw ubod under running water first! Turn the faucet handle below.');
        speak(
          'Wash the raw coconut pith under clean running water first before cooking! Turn the faucet handle below.',
          'thinking',
          {
            badge: 'Wash Ubod First',
            hint: 'Click the faucet cross-handle knob below the sink to rinse the ubod.',
            hideButton: true,
          }
        );
        return;
      }
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
        showToast('Holding Washed Ubod!', 'Moving to Stove Boil...', 'info');
        setCurrentPhase('boil');
        speak(
          'Step 2: Transfer the washed ubod to the cooking pot. Drop or tap the Washed Ubod into the empty boiling pot!',
          'happy',
          {
            badge: 'Step 2: Transfer to Pot',
            note: 'Drain the ubod properly in the colander before transferring it to the cooking pot.',
            hint: 'Drop or tap the Washed Ubod into the Stainless Steel Boiling Pot.',
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
        triggerSinkError('Select the Stainless Colander from your inventory to drain the hot water!');
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
      if (holdingItem && holdingItem.id !== 'colander') {
        triggerSinkError('Turn the faucet knob below to rinse & cool the boiled ubod!');
        return;
      }
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
      } else if (!isUbodInColander) {
        triggerSinkError('Place the Raw Ubod Strips into the sink colander first before adding other items!');
      } else if (isUbodInColander && !isWashed) {
        triggerSinkError('Wash the raw ubod under running water first! Turn the faucet handle below.');
      } else if (potStep === 4 && (item.id === 'colander' || item.id === 'stainless_colander' || item.id === 'tool_colander_safe')) {
        handleDrainUbod();
      } else if (potStep === 4) {
        triggerSinkError('Select the Stainless Colander from your inventory to drain the hot water!');
      } else if (potStep >= 5 && !isCoolingRinseComplete) {
        triggerSinkError('Turn the faucet cross-handle knob below to run the cooling rinse!');
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
        explanation={STAGE_QUESTIONS.mission1.explanation}
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

        <div className="stage-content-row stage-single-workstation">
          <div className="station-center-card">
            {/* Dynamic Single Workstation Apparatus */}
            {currentPhase === 'wash' ? (
              <div
                className={`multi-state-workstation washing-workstation ${sinkShake ? 'error-shake' : ''} ${
                  !isUbodInColander && (holdingItem?.id === 'raw_ubod' || holdingItem?.id === 'washed_ubod')
                    ? 'compatible-target'
                    : ''
                }`}
              >
                {/* Workstation Header */}
                <div className="workstation-header">
                  <div className="workstation-titles">
                    <h4 className="workstation-name">Washing & Draining Sink</h4>
                    <span className="workstation-sub">Step 1: Potable Water Rinse & Residue Wash</span>
                  </div>
                  <div
                    className={`workstation-step-badge ${
                      isWashed
                        ? 'badge-success-glow'
                        : isWashingActive
                        ? 'badge-flow-glow'
                        : isUbodInColander
                        ? 'badge-amber-glow'
                        : ''
                    }`}
                  >
                    {isWashingActive ? (
                      <>
                        <span className="badge-icon">💧</span>
                        <span>Rinsing...</span>
                      </>
                    ) : isWashed ? (
                      <>
                        <span className="badge-icon-check">✓</span>
                        <span>Sanitized & Ready</span>
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
                    !isUbodInColander || (!isWashed && !isWashingActive) || (isWashed && potStep === 0)
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
                      ? 'Click to move to Stove Boil'
                      : 'Sanitized raw ubod'
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

                  {/* Step 2 Pick Up / Advance Guidance Pill */}
                  {isWashed && (
                    <div
                      className="sink-drain-guidance-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        setCurrentPhase('boil');
                      }}
                      title="Proceed to Stove Boil"
                    >
                      <span>👉 Washed Clean! Proceed to Stove Boil ➔</span>
                    </div>
                  )}

                  <div className="container-visual-wrapper">
                    <img
                      src={sinkImgSrc}
                      alt="Washing Sink & Colander"
                      className="sink-preview-img container-asset-img container-state-img"
                      style={{
                        filter: isWashingActive ? 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.45))' : undefined,
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

                {/* Workstation Footer */}
                <div className="workstation-footer has-custom-footer">
                  <FaucetKnobConsole
                    isReady={isUbodInColander && !isWashed}
                    isUbodLoaded={isUbodInColander}
                    isFlowing={isWashingActive}
                    isComplete={isWashed}
                    potStep={potStep}
                    onTurnOn={handleWashUbod}
                    isCoolingRinsePhase={false}
                    isCoolingRinseReady={false}
                    isCoolingRinseFlowing={false}
                    isCoolingRinseComplete={false}
                    onTurnOnCoolingRinse={() => {}}
                  />
                </div>
              </div>
            ) : currentPhase === 'boil' ? (
              <MultiStateContainer
                containerId="stockpot"
                title="Stainless Steel Boiling Pot"
                subtitle="Stage 1: Thermal Boiling & Softening on Gas Stove"
                currentStepIndex={potStep}
                steps={potSteps}
                onItemAccepted={handleItemAccepted}
                activeAnimation={isBoilingTimerActive ? 'boiling' : isDrainingActive ? 'boiling' : potStep === 4 ? 'steaming' : null}
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
                      potStep >= 4
                        ? 'spec-success'
                        : potStep >= 1
                        ? 'spec-amber'
                        : ''
                    }`}
                  >
                    {isDrainingActive
                      ? 'DRAINING IN COLANDER'
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
            ) : (
              /* Phase 3: Draining & Cooling Sink */
              <div
                className={`multi-state-workstation washing-workstation ${sinkShake ? 'error-shake' : ''} ${
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
                    <span className="workstation-sub">Step 3: Colander Drain & Rapid Cooling Rinse</span>
                  </div>
                  <div
                    className={`workstation-step-badge ${
                      isCoolingRinseComplete
                        ? 'badge-success-glow'
                        : isCoolingRinseActive
                        ? 'badge-flow-glow'
                        : potStep >= 5
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
                    ) : (
                      <span>Drain Hot Water</span>
                    )}
                  </div>
                </div>

                {/* Workstation Viewport */}
                <div
                  className={`workstation-viewport washing-viewport ${
                    potStep === 4 || (potStep >= 5 && !isCoolingRinseComplete && !isCoolingRinseActive)
                      ? 'interactive-sink'
                      : ''
                  }`}
                  style={{ flex: '1 1 auto' }}
                  onClick={handleSinkClick}
                  onDragOver={handleSinkDragOver}
                  onDrop={handleSinkDrop}
                  title={
                    potStep === 4
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
                  {isCoolingRinseActive && (
                    <div className="water-spray-overlay">
                      <span className="water-drop d1">💧</span>
                      <span className="water-drop d2">💧</span>
                      <span className="water-drop d3">💧</span>
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
                        filter: isCoolingRinseActive ? 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.45))' : undefined,
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

                {/* Workstation Footer */}
                <div className="workstation-footer has-custom-footer">
                  <FaucetKnobConsole
                    isReady={potStep >= 5 && !isCoolingRinseComplete}
                    isUbodLoaded={true}
                    isFlowing={isCoolingRinseActive}
                    isComplete={isCoolingRinseComplete}
                    potStep={potStep}
                    onTurnOn={() => {}}
                    isCoolingRinsePhase={true}
                    isCoolingRinseReady={potStep >= 5 && !isCoolingRinseComplete}
                    isCoolingRinseFlowing={isCoolingRinseActive}
                    isCoolingRinseComplete={isCoolingRinseComplete}
                    onTurnOnCoolingRinse={handleCoolingRinse}
                  />
                </div>
              </div>
            )}
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
              showToast('Raw Ubod Selected', 'Drop or tap into the sink colander to wash.', 'info');
            } else if (item.id === 'washed_ubod') {
              showToast('Washed Ubod Selected', 'Drop or tap into the cooking pot.', 'info');
            } else if (item.id === 'water_pitcher') {
              showToast('Potable Water Selected', 'Used to submerge ubod in the cooking pot.', 'info');
            } else if (item.id === 'sea_salt') {
              showToast('Sea Salt Selected', 'Used for seasoning in the cooking pot.', 'info');
            } else if (item.id === 'colander') {
              showToast('Stainless Colander Selected', 'Drop or tap into the cooking pot to drain boiled ubod.', 'info');
            }
          }
        }}
      />
    </div>
  );
};
