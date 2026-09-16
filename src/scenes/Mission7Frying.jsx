import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

export const Mission7Frying = () => {
  const { setScene, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem, missionsCompleted, stageAnswers, recordStageAnswer } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission7);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission7);

  const handleCheckpointComplete = (selectedChoice, questionChoices) => {
    const choicesList = questionChoices || STAGE_QUESTIONS.mission7.choices;
    const correctChoice = choicesList.find((c) => c.isCorrect);
    recordStageAnswer('mission7', {
      stageNum: 7,
      stageTitle: STAGE_QUESTIONS.mission7.stageTitle,
      question: STAGE_QUESTIONS.mission7.question,
      selectedOptionId: selectedChoice.displayLetter || selectedChoice.selectedOptionId || selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission7.explanation,
      choices: choicesList,
      correctOptionId: correctChoice?.displayLetter || correctChoice?.id?.toUpperCase() || 'A',
    });
    setIsCheckpointOpen(false);
  };

  // Frying states:
  // 0: Empty pan on stove -> accept cooking_oil (5 cups)
  // 1: Oil in pan -> click burner dial to preheat oil
  // 2: Oil preheated over medium heat -> accept dehydrated_pellets
  // 3: Pellets in oil -> 10-second flash expansion active
  // 4: Flash puff complete (10s) -> accept colander / tongs to lift & drain
  // 5: Crackers in colander draining excess oil -> action: allow to cool completely / transfer to platter
  // 6: Cooled & Crispy on Platter -> Complete!
  const [fryStep, setFryStep] = useState(() => (isAlreadyCompleted ? 6 : 0));
  const [oilTemp, setOilTemp] = useState(() => (isAlreadyCompleted ? 180 : 25));
  const [isHeatingOil, setIsHeatingOil] = useState(false);
  const [puffProgress, setPuffProgress] = useState(0);
  const [isPuffing, setIsPuffing] = useState(false);
  const isBurnerOn = isHeatingOil || fryStep === 2 || fryStep === 3;

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 7 Completed: Flash Deep Frying & Oil Drainage!\n\nYour dehydrated coconut pith pellets have been successfully transformed into delicate, golden Ubod Crackers! Under the intense 180°C thermal energy of the vegetable oil, residual bound moisture flashed instantaneously into high-pressure steam, puffing the gelatinized rice-pith starch matrix to three times its original size in just 10 seconds.\n\nAll excess surface oil has been drained through the colander, and the crackers have cooled completely to room temperature, preventing soggy condensation and locking in their signature brittle acoustic snap.',
        'happy',
        {
          badge: 'Stage 7 Complete: Flash Expansion',
          note: 'Sensory Quality Rule: Crackers must cool completely to ambient room temperature before sealing in Stage 8 to prevent trapped steam from ruining crispness.',
          btnText: 'Proceed to Stage 8: Barrier Packaging ➔',
          onNext: () => setScene('mission8'),
        }
      );
    } else {
      speak(
        'Welcome to Stage 7: Flash Deep Frying & Oil Drainage!\n\nAfter 12 hours in the convective cabinet dehydrator, our ubod wafers are in a vitrified, glassy state with under 10% moisture content. In this stage, we will rapidly submerge them in hot vegetable oil. The sudden heat transfer will flash that tightly bound residual moisture into superheated steam, causing the starch matrix to instantly expand and puff into a brittle, airy cracker in approximately 10 seconds.\n\nStep 1: Before we can fry, we must establish our convective heating medium. Select the Vegetable Cooking Oil (5 Cups) from your inventory shelf and pour it into the frying pan.',
        'neutral',
        {
          badge: 'Step 1: Oil Loading & Preheating',
          note: 'Thermal Physics & Safety: Deep frying uses oil as a rapid thermal conductor. Maintain safe distance from the stove, avoid water droplets near hot oil to prevent violent splattering, and always use long tongs.',
          hint: 'Select the Vegetable Oil (5 Cups) from your inventory and pour into the frying pan.',
          hideButton: true,
        }
      );
    }
  }, []);

  const frySteps = [
    {
      stepIndex: 0,
      acceptedItems: ['cooking_oil', 'portion_oil_5cups', 'oil_pitcher', 'vegetable_oil', 'oil', 'ing_oil_fresh'],
      prompt: 'Pour 5 cups of fresh vegetable oil into the frying pan',
      img: '/assets/frying_pan_empty.png',
      fallbackIcon: '🍳',
      label: 'Empty Frying Pan',
    },
    {
      stepIndex: 1,
      acceptedItems: [],
      prompt: 'Oil loaded! Click the burner dial below to preheat oil over medium heat',
      img: '/assets/frying_pan_with_oil.png',
      fallbackIcon: '🛢️',
      label: 'Pan with 5 Cups Oil (Cold)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['dehydrated_pellets', 'pellets', 'tongs_chip', 'container_dehydrated_chips', 'dehydrated_chips', 'storage_container'],
      prompt: 'Oil preheated! Carefully drop the dehydrated ubod pellets into the hot oil',
      img: '/assets/frying_pan_oil_hot.png',
      fallbackIcon: '🔥',
      label: 'Preheated Oil (Medium Heat)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: '10-Second Flash Frying in progress... Starch matrix puffing & expanding...',
      img: '/assets/frying_pan_frying_puffing.png',
      fallbackIcon: '💥',
      label: '10-Second Flash Expansion',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander', 'tool_colander_safe', 'skimmer', 'tongs', 'tool_tongs_stainless'],
      prompt: 'Puffed cracker ready! Lift with tongs/colander to drain excess oil',
      img: '/assets/tongs_holding_puffed_cracker.png',
      fallbackIcon: '🥢',
      label: 'Expanded Cracker on Tongs',
    },
    {
      stepIndex: 5,
      acceptedItems: ['platter', 'icon_cracker_platter', 'platter_empty'],
      prompt: 'Step 4: Oil draining in colander. Tap to transfer to platter and cool completely',
      img: '/assets/colander_fried_crackers_draining.png',
      fallbackIcon: '🥣',
      label: 'Draining Oil in Colander',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Golden, crispy Ubod Crunch cooled completely & ready for Stage 8 packaging!',
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      label: 'Cooled Crispy Crackers',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'cooking_oil' || item.id === 'portion_oil_5cups' || item.id === 'oil_pitcher' || item.id === 'vegetable_oil' || item.id === 'oil' || item.id === 'ing_oil_fresh')) {
      soundManager.playPour();
      setFryStep(1);
      setHoldingItem(null);
      showToast('Oil Added!', '5 Cups of oil loaded. Click the burner dial to preheat.', 'success');
      speak(
        '5 cups of vegetable oil poured into the frying pan!\n\nThis provides ample volume to fully submerge the dehydrated pellets without causing a severe temperature drop. Now turn the rotary burner knob to ignite the stove and preheat the oil to the critical flash-expansion temperature of 180°C.',
        'neutral',
        {
          badge: 'Step 1: Oil Preheating (180°C)',
          note: 'Optimal Frying Physics: Preheating to 180°C ensures instantaneous expansion. If the oil is below 160°C, the starch absorbs oil and becomes soggy rather than crisp. If above 200°C, starches scorch.',
          hint: 'Click the stove burner dial below to ignite and preheat the oil.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'dehydrated_pellets' || item.id === 'pellets' || item.id === 'tongs_chip' || item.id === 'container_dehydrated_chips' || item.id === 'dehydrated_chips' || item.id === 'storage_container')) {
      handleStartFlashFrying();
    } else if (stepIndex === 4 && (item.id === 'colander' || item.id === 'tool_colander_safe' || item.id === 'skimmer' || item.id === 'tongs' || item.id === 'tool_tongs_stainless')) {
      handleLiftToColander();
    } else if (stepIndex === 5 && (item.id === 'platter' || item.id === 'icon_cracker_platter' || item.id === 'platter_empty')) {
      handleTransferToPlatter();
    }
  };

  const handlePreheatOil = () => {
    soundManager.playIgnite?.() || soundManager.playBoil();
    setIsHeatingOil(true);
    showToast('Burner Ignited!', 'Preheating 5 cups vegetable oil over medium heat...', 'info');

    let current = 25;
    const interval = setInterval(() => {
      current += 31;
      setOilTemp(Math.min(180, current));
      if (current >= 180) {
        clearInterval(interval);
        setOilTemp(180);
        setIsHeatingOil(false);
        setFryStep(2);
        soundManager.playSuccess();
        showToast('Oil Ready!', 'Optimal frying temperature reached. Drop dehydrated pieces!', 'success');
        speak(
          'Step 2: Flash Frying Dehydrated Ubod Pellets!\n\nThe vegetable oil has reached our target temperature of 180°C. Notice the subtle convection currents and shimmer on the oil surface, confirming optimal heat transfer readiness.\n\nSelect the Dehydrated Pellets from your inventory shelf and gently introduce them into the hot oil. They will fry for approximately 10 seconds until fully puffed and golden-crisp!',
          'happy',
          {
            badge: 'Step 2: Flash Frying Submersion',
            note: 'Flash Expansion Protocol: Residual bound moisture will vaporize into high-pressure steam in seconds. Maintain a safe clearance and always use long stainless steel tongs.',
            hint: 'Select "Dehydrated Pellets" from your inventory, then tap the hot frying pan.',
            hideButton: true,
          }
        );
      }
    }, 400);
  };

  const handleStartFlashFrying = () => {
    soundManager.playSizzle();
    setIsPuffing(true);
    setFryStep(3);
    setHoldingItem(null);
    showToast('Flash Frying!', '10-second flash expansion active! Starches puffing...', 'info');
    speak(
      'Instant Flash Expansion in Progress!\n\nObserve the vigorous bubbling around the crackers! As the 180°C oil conducts heat into the vitrified pellets, trapped water flashes violently into superheated steam. This immense internal vapor pressure balloons the gelatinized starch polymers outward into an airy honeycomb cellular structure.\n\nKeep a close watch—flash frying takes only 10 seconds!',
      'happy',
      {
        badge: 'Step 2: 10-Second Vapor Expansion',
        note: 'Thermal Precision: Ubod crackers expand in just 10 seconds. Prolonged immersion causes Maillard browning to overshoot, scorching the delicate natural coconut sweetness.',
        hint: 'Wait for the 10-second frying cycle to complete.',
        hideButton: true,
      }
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setPuffProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPuffing(false);
        setFryStep(4);
        soundManager.playSuccess();
        showToast('Frying Complete!', 'Crackers are golden and crispy. Use colander to lift and drain!', 'success');
        speak(
          'Step 3: Oil Drainage & Removal!\n\nThe 10-second flash expansion cycle is complete! The crackers have puffed to three times their original size with an irresistible pale golden hue.\n\nUsing your heat-resistant stainless steel colander or skimmer tongs, immediately lift the hot crackers from the pan and transfer them into the draining colander to allow excess surface oil to drip away.',
          'happy',
          {
            badge: 'Step 3: Oil Drainage',
            note: 'Lipid Drainage Quality Rule: Draining excess oil immediately in the colander prevents lipid accumulation, ensuring a light, clean, non-greasy mouthfeel and acoustic crunch.',
            hint: 'Select "Draining Colander" from your inventory, then tap the pan to lift and drain.',
            hideButton: true,
          }
        );
      }
    }, 400);
  };

  const handleLiftToColander = () => {
    soundManager.playClick();
    setFryStep(5);
    setHoldingItem(null);
    showToast('Draining in Colander!', 'Excess oil draining. Step 4: Allow crackers to cool completely.', 'info');
    speak(
      'Step 4: Presentation & Complete Cooling!\n\nAll excess surface oil has successfully drained away in the colander. However, the crackers are still hot and actively releasing residual steam.\n\nSelect the Presentation Platter from your inventory shelf to transfer the crackers, and let them cool down 100% to ambient room temperature before we can safely proceed to Stage 8 packaging.',
      'neutral',
      {
        badge: 'Step 4: Ambient Cooling',
        note: 'Condensation Prevention Principle: Sealing warm crackers inside barrier packaging traps escaping steam, causing condensation droplets that dissolve starch bonds and turn crackers limp within hours.',
        hint: 'Select "Presentation Platter" from your inventory and tap to transfer.',
        hideButton: true,
      }
    );
  };

  const handleTransferToPlatter = () => {
    soundManager.playClick();
    setFryStep(6);
    setHoldingItem(null);
    unlockBadge('fry_artisan', 'Flash Expansion Specialist', '🍳');
    completeMission('mission7');
    showToast('Stage 7 Complete!', 'Crackers are crispy, drained of oil, and completely cooled', 'success');
    speak(
      'Outstanding Frying Mastery, Food Technologist!\n\nYour Ubod Crackers are golden, airy, perfectly puffed, thoroughly drained of excess oil, and completely cooled to room temperature. Notice the delicate open-cell texture and signature fracture snap that will give our product its commercial appeal.\n\nYou have unlocked the "Flash Expansion Specialist" badge! Click the green button below to proceed to Stage 8: Barrier Packaging & Retail Carton.',
      'happy',
      {
        badge: 'Stage 7 Complete: Master Fryer',
        note: 'Commercial Production Milestone: Proper flash frying at 180°C followed by thorough oil drainage and room-temperature cooling ensures superior sensory quality and extended shelf life.',
        btnText: 'Proceed to Stage 8: Barrier Packaging ➔',
        onNext: () => setScene('mission8'),
      }
    );
  };

  const stage7Inventory = [
    {
      id: 'cooking_oil',
      name: 'Vegetable Cooking Oil',
      measure: '5 Cups (Deep Frying)',
      img: '/assets/portion_oil_5cups.png',
      fallbackIcon: '🫗',
      isUsed: fryStep >= 1,
      isNext: fryStep === 0,
      tooltip: 'High smoke-point vegetable oil heated to 180°C–190°C for instantaneous expansion.',
    },
    {
      id: 'dehydrated_pellets',
      name: 'Dehydrated Pellets',
      measure: '<8% Moisture Pellets',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      isUsed: fryStep >= 3,
      isNext: fryStep === 2,
      tooltip: 'Glassy dry pellets whose internal moisture flashes to steam, ballooning the cracker.',
    },
    {
      id: 'colander',
      name: 'Draining Colander',
      measure: 'Paper Towel Lined',
      img: '/assets/tool_colander_safe.png',
      fallbackIcon: '🥣',
      isUsed: fryStep >= 5,
      isNext: fryStep === 4,
      tooltip: 'Perforated colander with absorbent paper to drain excess oil and preserve crispness.',
    },
    {
      id: 'platter',
      name: 'Presentation Platter',
      measure: 'Finished Batch Platter',
      img: '/assets/platter_empty.png',
      fallbackIcon: '✨',
      isUsed: fryStep >= 6,
      isNext: fryStep === 5,
      tooltip: 'Sanitized tray for cooling golden, airy, non-greasy ubod kropek crackers.',
    },
  ];

  const handleInventoryClick = (item) => {
    if (item.isUsed) return;
    soundManager.playClick();

    if (holdingItem?.id === item.id) {
      setHoldingItem(null);
    } else {
      setHoldingItem({
        id: item.id,
        name: item.name,
        img: item.img,
        icon: item.fallbackIcon || '🍳',
      });
      if (item.id === 'cooking_oil' || item.id === 'oil_pitcher') {
        showToast('Oil Selected', 'Tap the frying pan to pour 5 cups oil.', 'info');
      } else if (item.id === 'dehydrated_pellets' || item.id === 'dehydrated_chips') {
        showToast('Dehydrated Pellets Selected', 'Tap the preheated oil to flash fry.', 'info');
      } else if (item.id === 'colander' || item.id === 'tongs') {
        showToast('Colander Selected', 'Tap the pan to remove fried crackers to colander.', 'info');
      } else if (item.id === 'platter') {
        showToast('Platter Selected', 'Tap the colander to transfer crackers to cool.', 'info');
      }
    }
  };

  const recipeItems = [
    { name: 'Vegetable Oil', measure: '5 Cups', icon: '🛢️', isCompleted: fryStep >= 1, isCurrent: fryStep === 0 },
    { name: 'Frying Duration', measure: '~10 Seconds', icon: '⏱️', isCompleted: fryStep >= 4, isCurrent: fryStep === 3 },
    { name: 'Oil Drainage', measure: 'Colander Drain', icon: '🥣', isCompleted: fryStep >= 5, isCurrent: fryStep === 4 },
  ];

  const safetyChecklist = [
    {
      title: 'Hot Oil Safety Distance',
      desc: 'Keep a safe distance from the hot oil and always use long tongs when handling crackers.',
      icon: '🔥',
      isWarning: true,
    },
    {
      title: 'No Thin Gloves Near Oil',
      desc: 'Never wear thin disposable plastic gloves near hot oil as they can melt; use stainless tongs.',
      icon: '🥢',
      isWarning: true,
    },
    {
      title: 'Complete Cooling (Step 22)',
      desc: 'Allow crackers to cool completely to room temperature before proceeding to packaging.',
      icon: '❄️',
      isWarning: false,
    },
  ];

  return (
    <div className="workstation-scene frying-scene">
      <div className="workstation-overlay" />

      {/* Stage 7 Pre-Check Question Modal */}
      <CheckpointQuestionModal
        isOpen={isCheckpointOpen}
        stageTitle={STAGE_QUESTIONS.mission7.stageTitle}
        question={STAGE_QUESTIONS.mission7.question}
        choices={STAGE_QUESTIONS.mission7.choices}
        explanation={STAGE_QUESTIONS.mission7.explanation}
        onComplete={handleCheckpointComplete}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 7: Flash Frying"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Flash frying takes only 10 seconds in preheated oil. The remaining moisture inside the dehydrated pieces expands rapidly into steam, creating a light, airy, ultra-crisp texture."
        />

        <div className="stage-content-row stage-single-workstation">
          {/* Center: Frying Pan MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="frying_pan"
              title="Heavy-Gauge Frying Pan"
              subtitle="Stage 7: 180°C Flash Frying (10 sec) & Oil Drainage"
              currentStepIndex={fryStep}
              steps={frySteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isHeatingOil || isPuffing ? 'sizzling' : fryStep === 2 || fryStep === 3 ? 'sizzling' : null}
              containerWidth="100%"
              statusDotClass={fryStep >= 6 ? 'dot-success' : fryStep >= 2 ? 'dot-amber' : ''}
              statusText={
                isPuffing
                  ? `💥 Flash expansion in progress... ${puffProgress}%`
                  : isHeatingOil
                  ? `🔥 Preheating oil over medium heat... ${oilTemp}°C`
                  : frySteps[fryStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    fryStep >= 6 ? 'spec-success' : fryStep >= 2 ? 'spec-amber' : ''
                  }`}
                >
                  {fryStep >= 6
                    ? 'CRISP: COOLED'
                    : fryStep === 5
                    ? 'DRAIN: COLANDER'
                    : fryStep === 4
                    ? 'STATUS: PUFFED'
                    : fryStep === 3
                    ? 'TIME: 10 SEC'
                    : fryStep === 2
                    ? 'OIL: PREHEATED'
                    : fryStep === 1
                    ? 'OIL: 5 CUPS'
                    : 'HEAT: MEDIUM'}
                </span>
              }
              customFooter={
                <StoveBurnerConsole
                  isIgnited={isBurnerOn}
                  isActive={isBurnerOn}
                  isReady={fryStep === 1}
                  isComplete={fryStep >= 4}
                  progress={
                    isHeatingOil
                      ? Math.round((oilTemp / 180) * 100)
                      : isPuffing
                      ? puffProgress
                      : 100
                  }
                  onIgnite={handlePreheatOil}
                  standbyHint={fryStep === 0 ? 'Pour 5 cups vegetable oil first' : 'Turn dial to ignite'}
                  readyHint="👉 Click dial to preheat oil"
                  activeHint={
                    isHeatingOil
                      ? () => `🔥 Preheating oil... ${oilTemp}°C`
                      : isPuffing
                      ? () => `💥 Flash frying... ${puffProgress}%`
                      : '🔥 Oil at 180°C — Add dehydrated pellets!'
                  }
                  completeHint="✓ Frying complete • Burner extinguished"
                  modeTitleIgnited={
                    isHeatingOil
                      ? 'MEDIUM HEAT: PREHEATING'
                      : isPuffing
                      ? 'FLASH EXPANSION (10s)'
                      : 'MEDIUM HEAT: 180°C READY'
                  }
                  modeTitleActive={
                    isHeatingOil
                      ? 'MEDIUM HEAT: PREHEATING'
                      : isPuffing
                      ? 'FLASH EXPANSION (10s)'
                      : 'MEDIUM HEAT: 180°C READY'
                  }
                  modeTitleReady="IGNITE BURNER"
                  modeTitleStandby="BURNER: OFF"
                  modeTitleComplete="BURNER: OFF (COOKED)"
                  disabled={isBurnerOn || fryStep >= 4}
                />
              }
            />
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 7 Frying Materials & Tongs"
        items={stage7Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};
