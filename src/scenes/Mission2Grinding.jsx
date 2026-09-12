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

  const handleCheckpointComplete = (selectedChoice) => {
    recordStageAnswer('mission2', {
      stageNum: 2,
      stageTitle: STAGE_QUESTIONS.mission2.stageTitle,
      question: STAGE_QUESTIONS.mission2.question,
      selectedOptionId: selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission2.explanation,
      choices: STAGE_QUESTIONS.mission2.choices,
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
        'Stage 2 Completed! Smooth pureed coconut pith paste has been milled and collected into the prep bowl.',
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
        'Stage 2: Food Processing & Pureeing! Step 1: Transfer the boiled ubod to a food processor. Add 1 teaspoon of salt for every 1 cup of ubod.',
        'neutral',
        {
          badge: 'Step 1: Load Processor',
          note: 'Safety Check: Check first the wiring, outlet, and the food processor itself before operating.',
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
      prompt: 'All silky ubod paste scraped & collected into clean bowl',
      img: '/assets/processor_empty.png',
      fallbackIcon: '✨',
      label: 'Clean Processor Bowl (Paste Collected)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'boiled_ubod') {
      soundManager.playPour();
      setProcessorStep(1);
      setHoldingItem(null);
      showToast('Boiled Ubod Loaded!', 'Now add salt according to recipe ratio (1 tsp per cup).', 'success');
      speak(
        'Great! Now add 1 teaspoon of Pure Sea Salt from your inventory into the processor bowl (1 tsp per 1 cup ubod).',
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
        'Ingredients loaded! Now select the transparent Processor Safety Lid from your inventory and place it onto the bowl to engage the safety interlock.',
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
      'Step 2: Process the ubod until it becomes fine and paste-like in consistency. Press the High-Speed Puree button to start!',
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
          'Step 3: Once finely processed, transfer the ubod paste to a separate clean bowl. Select the Red Spatula to scrape all paste!',
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
        'Outstanding pureeing! 1 cup of smooth coconut pith paste is ready for mixing with rice flour in Stage 3.',
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

        <div className="stage-content-row">
          {/* Left: Electric Food Processor */}
          <div className="station-center-card" style={{ flex: '1 1 50%', maxWidth: '520px' }}>
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
                    ? 'PASTE: COLLECTED'
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

          {/* Right: Stainless Prep / Mixing Bowl Workstation */}
          <div
            className={`multi-state-workstation extraction-workstation ${
              processorStep === 4 && (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') ? 'compatible-target' : ''
            }`}
            style={{
              cursor: processorStep === 4 ? 'pointer' : 'inherit',
              flex: '1 1 50%',
              maxWidth: '520px',
            }}
            onClick={() => {
              if (processorStep === 4) {
                if (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') {
                  handleScrapePaste();
                } else {
                  soundManager.playClick();
                  showToast('Select Spatula First', 'Click the Red Spatula in your inventory, then tap here to transfer paste!', 'info');
                  speak(
                    'Step 10: Pick up the Red Spatula from your inventory, then tap the mixing bowl to collect the pureed paste!',
                    'thinking',
                    {
                      badge: 'Select Spatula',
                      hint: 'Tap "Red Spatula" in your inventory first.',
                      hideButton: true,
                    }
                  );
                }
              }
            }}
            onDragOver={(e) => {
              if (processorStep === 4) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (processorStep === 4) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (item.id === 'spatula' || item.id === 'red_spatula') {
                    handleScrapePaste();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Stainless Prep / Mixing Bowl"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Stainless Mixing Bowl</h4>
                <span className="workstation-sub">Step 10: Puree Collection & Holding Vessel</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  processorStep >= 5
                    ? 'badge-success-glow'
                    : processorStep === 4
                    ? 'badge-flow-glow'
                    : ''
                }`}
              >
                {processorStep >= 5 ? '✓ 1 Cup Collected' : processorStep === 4 ? '🥣 Ready to Scrape' : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className={`workstation-viewport extraction-viewport ${
                processorStep === 4 ? 'interactive-vessel' : ''
              }`}
            >
              {/* Floating guidance pill at step 4 */}
              {processorStep === 4 && !isScraping && (
                <div className="vessel-transfer-guide">
                  <span>🥣 {holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula' ? 'Tap to Transfer Paste' : 'Select Spatula from Inventory'}</span>
                </div>
              )}

              <div className="container-visual-wrapper">
                <img
                  src={
                    processorStep >= 5
                      ? '/assets/bowl_ubod_paste_fresh.png'
                      : '/assets/tool_mixing_bowl_large.png'
                  }
                  alt={processorStep >= 5 ? 'Fresh Silky Ubod Paste' : 'Sanitized Mixing Bowl'}
                  className={`container-state-img ${processorStep >= 5 ? 'paste-collected-pop' : 'bowl-resting'}`}
                  style={{
                    maxHeight: '75%',
                    filter: processorStep >= 5 
                      ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2))' 
                      : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.14))',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />
              </div>

              {/* Bottom Status Pill in Viewport */}
              <div
                className={`sink-status-pill ${
                  processorStep >= 5 ? 'washed' : processorStep === 4 ? 'empty' : 'unwashed'
                }`}
              >
                <span>
                  {processorStep >= 5
                    ? 'Silky Ubod Paste (1 Cup Collected)'
                    : processorStep === 4
                    ? '👉 Awaiting Paste Transfer'
                    : '🥣 Clean & Sanitized Stainless Mixing Bowl'}
                </span>
              </div>
            </div>

            {/* Workstation Footer */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <span className={`status-dot ${processorStep >= 5 ? 'dot-success' : processorStep === 4 ? 'dot-amber' : ''}`} />
                <span className="status-text">
                  {processorStep >= 5
                    ? '1 Cup pureed ubod paste ready for Stage 3'
                    : processorStep === 4
                    ? 'Tap with Red Spatula to collect puree'
                    : 'Awaiting pureed ubod from processor'}
                </span>
              </div>
              <span className={`spec-badge ${processorStep >= 5 ? 'spec-success' : ''}`}>
                {processorStep >= 5 ? 'YIELD: 1 CUP' : 'CAP: 2 QT'}
              </span>
            </div>
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
