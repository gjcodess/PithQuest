import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

export const Mission2Grinding = () => {
  const { setScene, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge, missionsCompleted, maxUnlockedStage, stageAnswers, recordStageAnswer } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission2);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission2);

  const handleCheckpointComplete = (selectedChoice, questionChoices) => {
    const choicesList = questionChoices || STAGE_QUESTIONS.mission2.choices;
    const correctChoice = choicesList.find((c) => c.isCorrect);
    recordStageAnswer('mission2', {
      stageNum: 2,
      stageTitle: STAGE_QUESTIONS.mission2.stageTitle,
      question: STAGE_QUESTIONS.mission2.question,
      selectedOptionId: selectedChoice.displayLetter || selectedChoice.selectedOptionId || selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission2.explanation,
      choices: choicesList,
      correctOptionId: correctChoice?.displayLetter || correctChoice?.id?.toUpperCase() || 'A',
    });
    setIsCheckpointOpen(false);
  };

  // Processor states: 
  // 0: Empty bowl on motor base -> accept boiled_ubod
  // 1: Boiled ubod in processor -> accept salt_portion
  // 2: Ubod + Salt in processor -> action: lock lid & blend
  // 3: Blending active (spinning vortex)
  // 4: Smooth ubod paste ready -> action: scrape into prep bowl
  // 5: Complete
  const [processorStep, setProcessorStep] = useState(() => (isAlreadyCompleted ? 5 : 0));
  const [blendProgress, setBlendProgress] = useState(0);
  const [isBlending, setIsBlending] = useState(false);
  const [isLidLocked, setIsLidLocked] = useState(() => isAlreadyCompleted);
  const [isScraping, setIsScraping] = useState(false);

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 2 Completed! Smooth pureed coconut pith paste has been milled and collected into the prep bowl. The physical cell rupture achieved here ensures uniform gelatinization when blended with rice flour in Stage 3.',
        'happy',
        {
          badge: 'Stage 2 Complete',
          note: 'Smooth ubod paste will blend uniformly with rice flour in Stage 3 to produce a cohesive paste structure.',
          btnText: 'Proceed to Stage 3: Paste Formulation ➔',
          onNext: () => setScene('mission3'),
        }
      );
    } else {
      speak(
        'Welcome to Stage 2: Food Processing & Mechanical Pureeing! In order for the coconut pith to form a cohesive, elastic dough with rice flour later on, its fibrous tissue must be mechanically pulverized into an ultra-smooth paste. Pick up the Drained Boiled Ubod from your inventory shelf and transfer it into the food processor bowl equipped with the sharp stainless steel S-blade.',
        'neutral',
        {
          badge: 'Step 1: Load Processor',
          note: 'Safety Check: Always inspect the electrical cord, outlet, and blade assembly before operating high-speed motor equipment.',
          hint: 'Drop the Drained Boiled Ubod from your inventory into the food processor bowl.',
          hideButton: true,
        }
      );
    }
  }, []);

  const processorSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['boiled_ubod'],
      prompt: 'Place tender boiled ubod into the processor bowl',
      img: '/assets/processor_empty.png',
      fallbackIcon: '⚙️',
      label: 'Processor Bowl & S-Blade',
    },
    {
      stepIndex: 1,
      acceptedItems: ['salt_portion', 'salt'],
      prompt: 'Add 1 teaspoon of sea salt per cup of boiled ubod',
      img: '/assets/processor_with_boiled_ubod.png',
      fallbackIcon: '🧂',
      label: 'Loaded Ubod in Bowl',
    },
    {
      stepIndex: 2,
      acceptedItems: !isLidLocked ? ['processor_lid', 'lid'] : [],
      prompt: isLidLocked
        ? 'Safety interlock locked! Press High-Speed Puree to blend'
        : 'Select Processor Safety Lid from inventory & attach to bowl',
      img: isLidLocked ? '/assets/processor_close_lid.png' : '/assets/processor_with_ubod_salt.png',
      fallbackIcon: '🔒',
      label: isLidLocked ? 'Lid Locked & Ready to Puree' : 'Ubod + Salt (Awaiting Safety Lid)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Pureeing boiled ubod fibers into uniform silky paste...',
      img: '/assets/processor_running_blur.png',
      fallbackIcon: '🌪️',
      label: 'High-Speed Pureeing',
    },
    {
      stepIndex: 4,
      acceptedItems: ['spatula', 'red_spatula'],
      prompt: 'Select Red Spatula from inventory & tap bowl to scrape paste',
      img: '/assets/processor_open_paste.png',
      fallbackIcon: '🥣',
      label: 'Silky Ubod Paste (Ready to Scrape)',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'All silky ubod paste scraped & collected into clean bowl (1 Cup Yield)',
      img: '/assets/bowl_ubod_paste_fresh.png',
      fallbackIcon: '✨',
      label: 'Pureed Ubod Paste (1 Cup Collected)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'boiled_ubod') {
      soundManager.playPour();
      setProcessorStep(1);
      setHoldingItem(null);
      showToast('Boiled Ubod Loaded!', 'Now add salt according to recipe ratio (1 tsp per cup).', 'success');
      speak(
        'Excellent! The tender boiled ubod is loaded into the processor bowl. Now we add our formulation seasoning: exactly 1 teaspoon of Pure Sea Salt per cup of ubod. Salt enhances cell wall shearing during high-speed blending and balances the natural coconut sweetness. Pick up the Measured Pure Sea Salt from the shelf and add it to the bowl.',
        'neutral',
        {
          badge: 'Calibrated Salting',
          note: 'Salt assists in cell rupture during blending and distributes seasoning evenly throughout the puree.',
          hint: 'Select Measured Sea Salt from your inventory and drop it into the processor.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'salt_portion' || item.id === 'salt')) {
      soundManager.playClick();
      setProcessorStep(2);
      setHoldingItem(null);
      showToast('Salt Added!', 'Ingredients loaded. Now select and attach the Safety Lid from your inventory.', 'success');
      speak(
        'Ingredients are loaded! For laboratory safety, high-speed appliances must never be operated with open containers. Pick up the transparent Processor Safety Lid from your inventory shelf and fit it securely onto the bowl to engage the motor safety interlock mechanism.',
        'thinking',
        {
          badge: 'Safety Interlock Required',
          note: 'Safety Note: Never operate electrical kitchen appliances with exposed blades or without securely locking safety lids.',
          hint: 'Select "Processor Safety Lid" from your inventory and drop it onto the food processor bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'processor_lid' || item.id === 'lid')) {
      handleLockLid();
    } else if (stepIndex === 4 && (item.id === 'spatula' || item.id === 'red_spatula')) {
      handleScrapePaste();
    }
  };

  const handleLockLid = () => {
    soundManager.playClick();
    soundManager.playSuccess();
    setHoldingItem(null);
    setIsLidLocked(true);
    showToast('Interlock Engaged!', 'Safety lid locked onto bowl. Motor armed and ready!', 'success');
    speak(
      'Step 2: Safety interlock engaged and motor armed! We need to process the ubod until all fibrous strands are fully sheared into a velvety, homogeneous paste. Click the orange "High-Speed Puree" button on the motor base to initiate blending.',
      'happy',
      {
        badge: 'Step 2: Pureeing',
        note: 'Pureeing ruptures the cellular walls of the ubod, releasing fibers and natural binders.',
        hint: 'Click the orange "High-Speed Puree" button on the processor.',
        hideButton: true,
      }
    );
  };

  const handleStartBlending = () => {
    soundManager.playMotor();
    setIsBlending(true);
    setProcessorStep(3);
    showToast('Pureeing Active!', 'High-speed S-blade pureeing ubod fibers...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBlendProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsBlending(false);
        setProcessorStep(4);
        soundManager.playSuccess();
        showToast('Pureeing Complete!', 'Ubod is now a smooth, lump-free paste', 'success');
        speak(
          'Step 3: Pureeing complete! The coconut pith has reached a smooth, lump-free paste consistency. Now we must harvest every bit of the puree from the processor bowl. Select the flexible Red Silicone Spatula from your inventory to cleanly scrape the paste into our prep bowl without scratching the container walls.',
          'happy',
          {
            badge: 'Step 3: Collection',
            note: 'Use a flexible silicone spatula to scrape all paste cleanly from the sides without scratching the container.',
            hint: 'Select "Red Spatula" from your inventory, then tap the processor bowl to scrape.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleScrapePaste = () => {
    if (isScraping || processorStep !== 4) return;
    setHoldingItem(null);
    setIsScraping(true);
    soundManager.playPour();

    setTimeout(() => {
      setIsScraping(false);
      setProcessorStep(5);
      unlockBadge('grind_expert', 'Milling & Pureeing Specialist', '⚙️');
      completeMission('mission2');
      showToast('Stage 2 Complete!', '1 cup of smooth ubod paste collected in clean bowl', 'success');
      speak(
        'Outstanding pureeing! Exactly 1 cup of smooth coconut pith paste has been milled and transferred cleanly into the prep bowl. The fine particle size guarantees optimal contact area with rice starch granules, establishing superior dough elasticity in Stage 3: Paste Formulation!',
        'happy',
        {
          badge: 'Stage 2 Complete',
          note: 'The fine paste texture allows maximum contact with rice starch granules for superior dough elasticity.',
          btnText: 'Proceed to Stage 3: Paste Formulation ➔',
          onNext: () => setScene('mission3'),
        }
      );
    }, 480);
  };

  const stage2Inventory = [
    {
      id: 'boiled_ubod',
      name: 'Drained Boiled Ubod',
      measure: '1 Cup (Cooked)',
      img: '/assets/colander_ubod_only.png',
      fallbackIcon: '🥥',
      isUsed: processorStep >= 1,
      isNext: processorStep === 0,
      tooltip: 'Tender boiled ubod drained of cooking liquor, ready for cell rupture milling.',
    },
    {
      id: 'salt_portion',
      name: 'Measured Sea Salt',
      measure: '1 tsp (Per 1 Cup Ubod)',
      img: '/assets/portion_salt_1tsp.png',
      fallbackIcon: '🧂',
      isUsed: processorStep >= 2,
      isNext: processorStep === 1,
      tooltip: '1 tsp pure sea salt added per cup of boiled ubod for osmotic extraction and seasoning.',
    },
    {
      id: 'processor_lid',
      name: 'Processor Safety Lid',
      measure: 'Interlock Cover',
      img: '/assets/processor_lid.png',
      fallbackIcon: '🔒',
      isUsed: isLidLocked || processorStep >= 3,
      isNext: processorStep === 2 && !isLidLocked,
      tooltip: 'Safety cover with mechanical interlock tab. Must be locked before motor activates.',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Scrape & Transfer',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: processorStep >= 5,
      isNext: processorStep === 4,
      tooltip: 'Flexible silicone spatula to thoroughly scrape pureed paste into the prep bowl.',
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
        icon: item.fallbackIcon || '⚙️',
      });
      if (item.id === 'boiled_ubod') {
        showToast('Boiled Ubod Selected', 'Tap the food processor bowl to load.', 'info');
      } else if (item.id === 'salt_portion') {
        showToast('Sea Salt Selected', 'Tap the food processor to add 1 tsp salt.', 'info');
      } else if (item.id === 'processor_lid') {
        showToast('Safety Lid Selected', 'Tap the food processor to attach and lock lid.', 'info');
      } else if (item.id === 'spatula') {
        showToast('Spatula Selected', 'Tap the bowl to scrape pureed paste into prep bowl.', 'info');
      }
    }
  };

  const recipeItems = [
    { name: 'Boiled Ubod Pith', measure: '1 Cup', icon: '🥥', isCompleted: processorStep >= 1, isCurrent: processorStep === 0 },
    { name: 'Pure Sea Salt', measure: '1 tsp (Per Cup)', icon: '🧂', isCompleted: processorStep >= 2, isCurrent: processorStep === 1 },
  ];

  const safetyChecklist = [
    {
      title: 'Electrical & Appliance Check',
      desc: 'Check electrical wiring, wall outlet, and processor housing before plugging in.',
      icon: '🔌',
      isWarning: true,
    },
    {
      title: 'Safety Interlock Rule',
      desc: 'Always lock safety lid securely before starting motor; never operate exposed blades.',
      icon: '🔒',
      isWarning: true,
    },
    {
      title: 'Clean Towel Drying',
      desc: 'Ensure all parts are dried thoroughly with a clean towel after cleaning.',
      icon: '🧼',
      isWarning: false,
    },
  ];

  return (
    <div className="workstation-scene grinding-scene">
      <div className="workstation-overlay" />

      {/* Stage 2 Pre-Check Question Modal */}
      <CheckpointQuestionModal
        isOpen={isCheckpointOpen}
        stageTitle={STAGE_QUESTIONS.mission2.stageTitle}
        question={STAGE_QUESTIONS.mission2.question}
        choices={STAGE_QUESTIONS.mission2.choices}
        onComplete={handleCheckpointComplete}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 2: Food Processing"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Processing the boiled coconut pith until it becomes fine and paste-like ensures smooth starch incorporation in Stage 3, producing uniform crackers without hard fibrous pockets."
        />

        <div className="stage-content-row stage-single-workstation">
          {/* Centered Electric Food Processor Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="food_processor"
              title="Electric Food Processor"
              subtitle="Stage 2: High-Speed Pureeing to Fine Paste"
              currentStepIndex={processorStep}
              steps={processorSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isBlending ? 'blending' : null}
              containerWidth="100%"
              statusDotClass={processorStep >= 5 ? 'dot-success' : processorStep >= 1 ? 'dot-amber' : ''}
              statusText={
                isBlending
                  ? `⚡ Pureeing boiled fibers at high speed... ${blendProgress}%`
                  : processorSteps[processorStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    processorStep >= 5
                      ? 'spec-success'
                      : processorStep >= 1
                      ? 'spec-amber'
                      : ''
                  }`}
                >
                  {processorStep >= 5
                    ? 'PASTE: COLLECTED (1 CUP)'
                    : processorStep === 4
                    ? 'ACTION: SCRAPE'
                    : processorStep === 3
                    ? 'MOTOR: HIGH (12,000 RPM)'
                    : processorStep === 2 && isLidLocked
                    ? 'LID: LOCKED & SAFE'
                    : processorStep === 2
                    ? 'LID: UNLOCKED (INTERLOCK)'
                    : processorStep === 1
                    ? 'SALT: 1 TSP / CUP'
                    : 'UBOD: 1 CUP'}
                </span>
              }
              interactiveAction={
                processorStep === 2 && isLidLocked
                  ? {
                      label: 'High-Speed Puree',
                      onClick: handleStartBlending,
                      icon: '⚡',
                      variant: 'processor-pulse',
                    }
                  : processorStep === 4
                  ? {
                      label: 'Scrape with Spatula',
                      onClick: handleScrapePaste,
                      icon: '🥄',
                      variant: 'btn-action-scrape',
                    }
                  : processorStep === 3
                  ? {
                      label: `Pureeing... ${blendProgress}%`,
                      disabled: true,
                      icon: '⚡',
                      variant: 'processor-pulse',
                      isActive: true,
                    }
                  : null
              }
            >
              {/* Spatula Scraping Motion Overlay */}
              {isScraping && (
                <div className="spatula-scraping-overlay">
                  <img
                    src="/assets/tool_spatula_red.png"
                    alt="Scraping Spatula"
                    className="spatula-wiping-anim"
                  />
                </div>
              )}

              {/* Step 4 Spatula Guidance Guide */}
              {processorStep === 4 && !isScraping && (
                <div
                  className="spatula-scrape-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') {
                      handleScrapePaste();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Red Spatula in your inventory, then tap here to scrape!', 'info');
                    }
                  }}
                  title="Tap with Red Spatula to scrape"
                >
                  <span>
                    🥄 {holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula' ? 'Tap Bowl to Scrape Paste' : 'Select Red Spatula from Inventory'}
                  </span>
                </div>
              )}

              {processorStep === 2 && !isLidLocked && (
                <div
                  className="lid-interlock-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'processor_lid' || holdingItem?.id === 'lid') {
                      handleLockLid();
                    } else {
                      soundManager.playClick();
                      showToast('Select Safety Lid First', 'Click the Processor Safety Lid in your inventory, then place on bowl!', 'info');
                    }
                  }}
                  title="Place Processor Safety Lid onto bowl"
                >
                  <span>
                    🔒 {holdingItem?.id === 'processor_lid' || holdingItem?.id === 'lid' ? 'Tap Bowl to Lock Safety Lid' : 'Select Safety Lid from Inventory'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 2 Processing Ingredients & Tools"
        items={stage2Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};
