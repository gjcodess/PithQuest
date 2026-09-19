import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

export const Mission5Steaming = () => {
  const { setScene, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem, missionsCompleted, maxUnlockedStage, stageAnswers, recordStageAnswer } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission5);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission5);

  const handleCheckpointComplete = (selectedChoice, questionChoices) => {
    const choicesList = questionChoices || STAGE_QUESTIONS.mission5.choices;
    const correctChoice = choicesList.find((c) => c.isCorrect);
    recordStageAnswer('mission5', {
      stageNum: 5,
      stageTitle: STAGE_QUESTIONS.mission5.stageTitle,
      question: STAGE_QUESTIONS.mission5.question,
      selectedOptionId: selectedChoice.displayLetter || selectedChoice.selectedOptionId || selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission5.explanation,
      choices: choicesList,
      correctOptionId: correctChoice?.displayLetter || correctChoice?.id?.toUpperCase() || 'A',
    });
    setIsCheckpointOpen(false);
  };

  // Steamer step states:
  // 0: Base pot empty -> accept steamer_water (1 cup)
  // 1: Base pot with water -> accept perforated_tier
  // 2: Perforated tier seated -> accept molded_tray
  // 3: Molded tray seated inside tier -> accept lid / click burner dial
  // 4: Steaming in progress (10-minute countdown)
  // 5: Steaming complete -> accept silicone heat mitts to transfer to cooling rack
  // 6: Transferred to cooling rack -> Complete!
  const [steamerStep, setSteamerStep] = useState(() => (isAlreadyCompleted ? 6 : 0));
  const [steamProgress, setSteamProgress] = useState(0);
  const [isSteaming, setIsSteaming] = useState(false);

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 5 Completed! Starch gelatinization is complete. The molded crackers have undergone thermal swelling where amylose and amylopectin polymers unfurled into a cohesive, translucent gel network. The pieces have been transferred to cool before entering cabinet dehydration.',
        'happy',
        {
          badge: 'Stage 5 Complete',
          note: 'Steaming sets the starch matrix and solidifies the shape of the crackers for safe handling in Stage 6.',
          btnText: 'Click “Proceed to stage 6”',
          onNext: () => setScene('mission6'),
        }
      );
    } else {
      speak(
        'Teacher Mia: We are now in stage 5 steaming the mixture. The mixture is steamed fully to cook the ingredients and bind them together.\n\nBefore proceeding to the steps, read the Recipe and safety reference from the upper left\n\nOn your middle left select and drop the ingredients.',
        'neutral',
        {
          badge: 'Step 1: Steamer Base',
          note: 'Safety Note: Check the Stove, Gas Smell, Gas Hose & Regulator, and Nearby Materials before lighting the burner.',
          hint: 'Select the Potable Water from your inventory and pour into the base pot.',
          hideButton: true,
        }
      );
    }
  }, []);

  const steamerSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['steamer_water', 'water', 'water_pitcher'],
      prompt: 'Select water then drop to the steamer',
      img: '/assets/steamer_base_empty.png',
      fallbackIcon: '🫕',
      label: 'Empty Steamer Base Pot',
    },
    {
      stepIndex: 1,
      acceptedItems: ['perforated_tier', 'steamer_tier', 'tier'],
      prompt: 'Select the steam tier then drop to the steamer',
      img: '/assets/steamer_base_water.png',
      fallbackIcon: '💧',
      label: 'Base Pot with Water',
    },
    {
      stepIndex: 2,
      acceptedItems: ['molded_tray', 'silicone_mold', 'tray'],
      prompt: 'Select the molded tray then drop to the steamer',
      img: '/assets/steamer_tier_empty.png',
      fallbackIcon: '♨️',
      label: 'Perforated Middle Tier',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Click “Ignite burner” to close it and for it to be steamed',
      img: '/assets/steamer_tier_with_tray.png',
      fallbackIcon: '🧈',
      label: 'Assembled Steamer with Ubod Tray',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'Click “Ignite burner” to close it and for it to be steamed',
      img: '/assets/steamer_assembled_steaming.png',
      fallbackIcon: '♨️',
      label: 'Active 10-Min Steaming',
    },
    {
      stepIndex: 5,
      acceptedItems: ['heat_mitts', 'ppe_heat_gloves'],
      prompt: 'Select silicon heat mittens then drop to the molded tray',
      img: '/assets/steamer_opened_cooked.png',
      fallbackIcon: '✨',
      label: 'Gelatinized & Set (Hot)',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Click “Proceed to stage 6”',
      img: '/assets/steamed_mold_on_cooling_rack.png',
      fallbackIcon: '🧊',
      label: 'Cooled on Wire Rack',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'steamer_water' || item.id === 'water' || item.id === 'water_pitcher')) {
      soundManager.playPour();
      setSteamerStep(1);
      setHoldingItem(null);
      showToast('Water Added!', 'Now seat the perforated steam tier on top of the base.', 'success');
      speak(
        'Potable water added to the base! Step 2: Now select the perforated stainless steam tier from your shelf and attach it securely on top of the base pot. The perforated floor allows hot steam vapor to circulate freely while keeping the food elevated above boiling water.',
        'neutral',
        {
          badge: 'Step 2: Steam Tier',
          note: 'The perforated middle rack holds the food above the boiling water so it cooks purely via hot convection steam.',
          hint: 'Select "Perforated Tier" from your shelf and place onto the steamer.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'perforated_tier' || item.id === 'steamer_tier' || item.id === 'tier')) {
      soundManager.playClick();
      setSteamerStep(2);
      setHoldingItem(null);
      showToast('Steam Tier Positioned!', 'Now place the molded ubod tray inside the perforated tier.', 'success');
      speak(
        'Steam tier positioned! Step 3: Now select the Molded Ubod Tray from your inventory and place it horizontally inside the perforated tier. Ensure the silicone tray rests flat so steam circulates identically across all 24 cavities.',
        'neutral',
        {
          badge: 'Step 3: Load Molded Tray',
          note: 'Ensure the silicone mold rests evenly flat so that steam penetrates all 24 cavities identically.',
          hint: 'Select "Molded Ubod Tray" from your shelf and drop into the steamer.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'molded_tray' || item.id === 'silicone_mold' || item.id === 'tray')) {
      soundManager.playClick();
      setSteamerStep(3);
      setHoldingItem(null);
      showToast('Molded Tray Loaded!', 'Click the Burner Control Dial below to ignite medium heat (10 min).', 'success');
      speak(
        'All assembled and secured! Step 4: Click the Burner Control Dial below to ignite medium-high heat. We will steam the crackers for exactly 10 minutes at 100°C until the starch mixture turns firm and translucent.',
        'happy',
        {
          badge: 'Step 4: 10-Min Steaming',
          note: 'Cook in a steamer for 10 minutes or until the ubod mixture becomes firm and translucent.',
          hint: 'Click the orange "Ignite 10-Min Steam" button below.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 5 && (item.id === 'heat_mitts' || item.id === 'ppe_heat_gloves')) {
      handleTransferToCoolingRack();
    }
  };

  const handleStartSteaming = () => {
    soundManager.playIgnite();
    soundManager.playBoil();
    setIsSteaming(true);
    setSteamerStep(4);
    showToast('Steamer Ignited!', '100°C steam gelatinizing starch matrix...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setSteamProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsSteaming(false);
        setSteamerStep(5);
        soundManager.playSuccess();
        showToast('Steaming Complete!', 'Wafers are firm & translucent. Don heat mitts to remove!', 'success');
        speak(
          'The 10-minute steam cycle is complete! Notice how the crackers have turned firm, cohesive, and translucent. For thermal safety, never touch hot steam tiers with bare hands! Select the Silicone Thermal Heat Mitts from your inventory to safely transfer the hot mold to the cooling rack.',
          'happy',
          {
            badge: 'Step 5: Cooling Transfer',
            note: 'Always wear silicone thermal mitts when removing hot items from the steamer to prevent steam burns.',
            hint: 'Select "Silicone Heat Mitts" from your inventory, then tap the steamer.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleTransferToCoolingRack = () => {
    soundManager.playClick();
    setSteamerStep(6);
    setHoldingItem(null);
    unlockBadge('steam_master', 'Starch Gelatinization Specialist', '♨️');
    completeMission('mission5');
    showToast('Transferred to Cooling Rack!', 'Firm, translucent ubod crackers cooled for Stage 6', 'success');
    speak(
      'Outstanding steaming execution! Starches are fully gelatinized, locking in moisture and solidifying the geometric wafer shape. The cooled crackers are now stable and ready for single-layer loading in Stage 6: Cabinet Dehydration!',
      'happy',
      {
        badge: 'Stage 5 Complete',
        note: 'Gelatinization traps moisture within the starch web; dehydration in Stage 6 will vitrify it into brittle pellets.',
        btnText: 'Click “Proceed to stage 6”',
        onNext: () => setScene('mission6'),
      }
    );
  };

  const stage5Inventory = [
    {
      id: 'steamer_water',
      name: 'Potable Water Pitcher',
      measure: '1 Cup (Base Pot)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: steamerStep >= 1,
      isNext: steamerStep === 0,
      tooltip: 'Potable water poured into base tier to generate 100°C saturated steam.',
    },
    {
      id: 'perforated_tier',
      name: 'Perforated Steam Tier',
      measure: 'Vented Middle Rack',
      img: '/assets/tier_perforated_icon.png',
      fallbackIcon: '♨️',
      isUsed: steamerStep >= 2,
      isNext: steamerStep === 1,
      tooltip: 'Perforated aluminum tier allowing 360° convection steam penetration.',
    },
    {
      id: 'molded_tray',
      name: 'Molded Ubod Tray',
      measure: '24 Rectangular Cavities',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '🧈',
      isUsed: steamerStep >= 3,
      isNext: steamerStep === 2,
      tooltip: '24 leveled paste portions loaded for 10-minute starch gelatinization.',
    },
    {
      id: 'heat_mitts',
      name: 'Silicone Heat Mitts',
      measure: 'Thermal PPE (100°C)',
      img: '/assets/ppe_heat_gloves.png',
      fallbackIcon: '🧤',
      isUsed: steamerStep >= 6,
      isNext: steamerStep === 5,
      tooltip: 'Certified thermal PPE gloves to safely transfer hot 100°C silicone molds to cooling racks.',
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
        icon: item.fallbackIcon || '♨️',
      });
      if (item.id === 'steamer_water') {
        showToast('Water Selected', 'Tap the base pot to pour water.', 'info');
      } else if (item.id === 'perforated_tier') {
        showToast('Steam Tier Selected', 'Tap the base pot to attach the middle tier.', 'info');
      } else if (item.id === 'molded_tray') {
        showToast('Molded Tray Selected', 'Tap the steamer to place tray inside.', 'info');
      } else if (item.id === 'heat_mitts') {
        showToast('Heat Mitts Selected', 'Tap the hot steamer to safely transfer mold to cooling rack.', 'info');
      }
    }
  };

  const recipeItems = [
    { name: 'Base Water Level', measure: '1 Cup', icon: '💧', isCompleted: steamerStep >= 1, isCurrent: steamerStep === 0 },
    { name: 'Molded Pieces', measure: '24 Pieces', icon: '🧈', isCompleted: steamerStep >= 3, isCurrent: steamerStep === 2 },
    { name: 'Target Steaming Time', measure: '10 Minutes', icon: '⏱️', isCompleted: steamerStep >= 5, isCurrent: steamerStep === 4 },
  ];

  const safetyChecklist = [
    {
      title: 'Stove & Gas Inspection',
      desc: 'Check the stove, gas smell, gas hose and regulator, and nearby materials before ignition.',
      icon: '🔥',
      isWarning: true,
    },
    {
      title: 'Heat-Resistant Gloves Rule',
      desc: 'Always wear heat-resistant gloves or oven mitts when handling hot steaming equipment (never thin plastic gloves).',
      icon: '🧤',
      isWarning: true,
    },
    {
      title: 'Medium Heat Control',
      desc: 'Use medium heat to maintain steady steam without allowing the water to boil too aggressively.',
      icon: '♨️',
      isWarning: false,
    },
  ];

  return (
    <div className="workstation-scene steaming-scene">
      <div className="workstation-overlay" />

      {/* Stage 5 Pre-Check Question Modal */}
      <CheckpointQuestionModal
        isOpen={isCheckpointOpen}
        stageTitle={STAGE_QUESTIONS.mission5.stageTitle}
        question={STAGE_QUESTIONS.mission5.question}
        choices={STAGE_QUESTIONS.mission5.choices}
        explanation={STAGE_QUESTIONS.mission5.explanation}
        onComplete={handleCheckpointComplete}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 5: Starch Steaming"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Steaming for 10 minutes gelatinizes the rice flour starches, locking the rectangular shape. Allowing pieces to cool before loading into the dehydrator prevents them from tearing or sticking to wire trays."
        />

        <div className="stage-content-row stage-single-workstation">
          {/* Center: Steamer MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="tier_steamer"
              title="Stainless Steel Tiered Steamer"
              subtitle="Stage 5: 10-Minute Starch Gelatinization & Steaming"
              currentStepIndex={steamerStep}
              steps={steamerSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="100%"
              statusDotClass={steamerStep >= 6 ? 'dot-success' : steamerStep >= 3 ? 'dot-amber' : ''}
              statusText={
                isSteaming
                  ? `♨️ 10-Minute steam gelatinization active... ${steamProgress}%`
                  : steamerSteps[steamerStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    steamerStep >= 6 ? 'spec-success' : steamerStep >= 4 ? 'spec-amber' : ''
                  }`}
                >
                  {steamerStep >= 6
                    ? 'PIECES: COOLED'
                    : steamerStep === 5
                    ? 'STATUS: HOT'
                    : steamerStep === 4
                    ? 'STEAMING: 10 MIN'
                    : steamerStep === 3
                    ? 'HEAT: MEDIUM'
                    : steamerStep === 2
                    ? 'TRAY: LOADED'
                    : steamerStep === 1
                    ? 'TIER: POSITIONED'
                    : 'WATER: 1 CUP'}
                </span>
              }
              customFooter={
                <StoveBurnerConsole
                  isActive={isSteaming}
                  isReady={steamerStep === 3}
                  isComplete={steamerStep >= 5}
                  progress={steamProgress}
                  onIgnite={handleStartSteaming}
                  standbyHint={
                    steamerStep === 0
                      ? 'Add water to base pot first'
                      : steamerStep === 1
                      ? 'Place perforated steam tier'
                      : steamerStep === 2
                      ? 'Place molded tray inside tier'
                      : 'Turn dial to HIGH to ignite'
                  }
                  readyHint="👉 Click dial to turn to HIGH"
                  activeHint={(p) => `♨️ Rolling steam... ${p}%`}
                  completeHint="✓ 10-Min gelatinization complete"
                  modeTitleActive="STEAMING: MEDIUM HEAT"
                  modeTitleReady="IGNITE BURNER"
                  modeTitleStandby="BURNER: OFF"
                  modeTitleComplete="BURNER: OFF (COOKED)"
                  disabled={isSteaming || steamerStep >= 6}
                />
              }
            />
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 5 Steaming Equipment & Thermal PPE"
        items={stage5Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};
