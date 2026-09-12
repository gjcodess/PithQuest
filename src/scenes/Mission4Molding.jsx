import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

export const Mission4Molding = () => {
  const { setScene, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem, missionsCompleted, maxUnlockedStage, stageAnswers, recordStageAnswer } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission4);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(() => !isAlreadyCompleted && !stageAnswers?.mission4);

  const handleCheckpointComplete = (selectedChoice, questionChoices) => {
    const choicesList = questionChoices || STAGE_QUESTIONS.mission4.choices;
    const correctChoice = choicesList.find((c) => c.isCorrect);
    recordStageAnswer('mission4', {
      stageNum: 4,
      stageTitle: STAGE_QUESTIONS.mission4.stageTitle,
      question: STAGE_QUESTIONS.mission4.question,
      selectedOptionId: selectedChoice.displayLetter || selectedChoice.selectedOptionId || selectedChoice.id,
      selectedText: selectedChoice.text,
      isCorrect: selectedChoice.isCorrect,
      reason: selectedChoice.reason,
      explanation: STAGE_QUESTIONS.mission4.explanation,
      choices: choicesList,
      correctOptionId: correctChoice?.displayLetter || correctChoice?.id?.toUpperCase() || 'A',
    });
    setIsCheckpointOpen(false);
  };

  // Mold Step States:
  // 0: Empty Mold -> accept measuring spoon / paste portion
  // 1: 1 Cavity Calibrated -> accept measuring spoon OR quick fill button
  // 2: 24 Cavities Filled (Unleveled) -> accept leveling spatula
  // 3: 24 Cavities Completely Leveled -> Complete!
  const [moldStep, setMoldStep] = useState(() => (isAlreadyCompleted ? 3 : 0));
  const [isLeveling, setIsLeveling] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 4 Completed! All 24 rectangular crackers are molded and leveled to uniform thickness.',
        'happy',
        {
          badge: 'Stage 4 Complete',
          note: 'Evenly molded pieces are now ready for steaming to set the starch matrix before dehydration.',
          btnText: 'Proceed to Stage 5: Starch Steaming ➔',
          onNext: () => setScene('mission5'),
        }
      );
    } else {
      speak(
        'Stage 4: Portioning & Rectangular Molding! Step 1: After mixing the dough, portion it into the molder. Use approximately 3 teaspoons per piece to achieve a uniform size and thickness.',
        'neutral',
        {
          badge: 'Step 1: Portioning & Molding',
          note: "Using the same amount of dough for each piece helps produce crackers with uniform size and thickness, which promotes more even cooking and drying. Don't forget to wear gloves!",
          hint: 'Select the Ubod Dough from your inventory, then tap the mold to place a portion.',
          hideButton: true,
        }
      );
    }
  }, []);

  const moldSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['dough_bowl', 'dough_portion', 'measuring_spoon'],
      prompt: 'Portion 3 teaspoons of dough into the silicone mold',
      img: '/assets/molder_empty.png',
      fallbackIcon: '🌸',
      label: 'Clean 24-Cavity Silicone Mold',
    },
    {
      stepIndex: 1,
      acceptedItems: ['dough_bowl', 'dough_portion', 'measuring_spoon'],
      prompt: 'Standard 3 tsp portion calibrated! Fill remaining cavities or click Quick-Fill',
      img: '/assets/molder_single_piece.png',
      fallbackIcon: '🧈',
      label: '1 Cavity Calibrated (3 tsp)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['leveling_spatula', 'spatula'],
      prompt: 'Cavities filled! Select the Leveling Spatula to scrape and level flat',
      img: '/assets/molder_partially_filled.png',
      fallbackIcon: '🥄',
      label: 'Cavities Portioned (Unleveled)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'All 24 rectangular crackers uniformly leveled and ready for steaming!',
      img: '/assets/molder_completely_filled.png',
      fallbackIcon: '✨',
      label: 'All 24 Pieces Uniform & Leveled',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'dough_bowl' || item.id === 'dough_portion' || item.id === 'measuring_spoon')) {
      soundManager.playSuccess();
      setMoldStep(1);
      setHoldingItem(null);
      showToast('Cavity Calibrated!', 'First cavity filled with 3 tsp portion', 'success');
      speak(
        'Excellent portion control! Exactly 3 teaspoons produces our standard uniform thickness. Continue filling or click "Fill Remaining Tray"!',
        'happy',
        {
          badge: 'Step 1: Portioning Calibration',
          note: 'Uniform thickness prevents thin edges from overcooking or burning while thicker centers remain undercooked.',
          hint: 'Place more portions or click "Fill Remaining Tray".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'dough_bowl' || item.id === 'dough_portion' || item.id === 'measuring_spoon')) {
      handleFillBatch();
    } else if (stepIndex === 2 && (item.id === 'leveling_spatula' || item.id === 'spatula')) {
      handleLevelDough();
    }
  };

  const handleFillBatch = () => {
    soundManager.playPour();
    setMoldStep(2);
    setHoldingItem(null);
    showToast('All 24 Cavities Portioned!', 'Now select the Leveling Spatula to level the surfaces flat.', 'info');
    speak(
      'All 24 cavities are portioned with 3 tsp each! Step 2: Now select the Leveling Spatula from your inventory to scrape excess dough and level the surface flat.',
      'neutral',
      {
        badge: 'Step 2: Leveling & Compacting',
        note: 'Leveling creates a flat, even surface across every mold cavity so all crackers cook identically.',
        hint: 'Select the Leveling Spatula from your inventory, then tap the mold.',
        hideButton: true,
      }
    );
  };

  const handleLevelDough = () => {
    if (isLeveling || moldStep !== 2) return;
    setIsLeveling(true);
    soundManager.playPour();
    showToast('Leveling Surfaces...', 'Scraping excess dough flush with mold edges...', 'info');

    setTimeout(() => {
      setIsLeveling(false);
      setMoldStep(3);
      setHoldingItem(null);
      soundManager.playSuccess();
      unlockBadge('mold_artisan', 'Uniform Wafer Shaper', '📐');
      completeMission('mission4');
      showToast('Stage 4 Complete!', '24 rectangular crackers uniformly molded & leveled', 'success');
      speak(
        'Outstanding molding! All 24 rectangular crackers are leveled to uniform thickness and ready for steaming in Stage 5.',
        'happy',
        {
          badge: 'Stage 4 Complete',
          note: 'Uniform thickness ensures equal heat penetration during steaming and even moisture loss during dehydration.',
          btnText: 'Proceed to Stage 5: Starch Steaming ➔',
          onNext: () => setScene('mission5'),
        }
      );
    }, 700);
  };

  const stage4Inventory = [
    {
      id: 'dough_bowl',
      name: 'Ubod Dough',
      measure: '3 tsp Standard Portion',
      img: '/assets/mixing_bowl_ubod_only.png',
      fallbackIcon: '🥣',
      isUsed: moldStep >= 2,
      isNext: moldStep < 2,
      tooltip: 'Formulated dough batch. Calibrated 3 tsp portion per rectangular cavity.',
    },
    {
      id: 'leveling_spatula',
      name: 'Leveling Spatula',
      measure: 'Flat Edge Scraper',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '📐',
      isUsed: moldStep >= 3,
      isNext: moldStep === 2,
      tooltip: 'Flat straight-edge scraper to level dough flush with silicone rims for identical thickness.',
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
        icon: item.fallbackIcon || '🥣',
      });
      if (item.id === 'dough_bowl') {
        showToast('Ubod Dough Selected', '3 tsp portion ready. Tap the silicone mold to place!', 'info');
      } else if (item.id === 'leveling_spatula') {
        showToast('Leveling Spatula Selected', 'Tap the silicone mold to scrape and level flat!', 'info');
      }
    }
  };

  const recipeItems = [
    { name: 'Portion per Piece', measure: '~3 Teaspoons', icon: '🥄', isCompleted: moldStep >= 2, isCurrent: moldStep < 2 },
    { name: 'Total Batch', measure: '24 Pieces', icon: '🧈', isCompleted: moldStep >= 3, isCurrent: moldStep === 2 },
  ];

  const safetyChecklist = [
    {
      title: 'Food-Grade Gloves Required',
      desc: "Don't forget to wear clean food-grade gloves when portioning and handling room-temperature dough.",
      icon: '🧤',
      isWarning: true,
    },
    {
      title: 'Uniform Thickness Standard',
      desc: 'Using the same amount of dough per piece promotes more even cooking in the steamer and even drying in the dehydrator.',
      icon: '📐',
      isWarning: false,
    },
  ];

  return (
    <div className="workstation-scene molding-scene">
      <div className="workstation-overlay" />

      {/* Stage 4 Pre-Check Question Modal */}
      <CheckpointQuestionModal
        isOpen={isCheckpointOpen}
        stageTitle={STAGE_QUESTIONS.mission4.stageTitle}
        question={STAGE_QUESTIONS.mission4.question}
        choices={STAGE_QUESTIONS.mission4.choices}
        onComplete={handleCheckpointComplete}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 4: Portioning & Molding"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Using the exact same amount of dough (~3 tsp) per mold ensures every cracker cooks at the same speed in the steamer and dehydrates uniformly without brittle edges."
        />

        <div className="stage-content-row stage-single-workstation">
          {/* Center: 24-Slot Rectangular Silicone Mold MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="silicone_mold"
              title="Rectangular Silicone Mold"
              subtitle="Stage 4: 24-Cavity Portioning (3 tsp) & Thickness Leveling"
              currentStepIndex={moldStep}
              steps={moldSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="100%"
              statusDotClass={moldStep >= 3 ? 'dot-success' : moldStep >= 1 ? 'dot-amber' : ''}
              statusText={
                isLeveling
                  ? 'Scraping and leveling dough flush with cavity rims...'
                  : moldSteps[moldStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    moldStep >= 3 ? 'spec-success' : moldStep >= 1 ? 'spec-amber' : ''
                  }`}
                >
                  {moldStep >= 3
                    ? 'BATCH: LEVELED'
                    : moldStep === 2
                    ? 'TOOL: SPATULA'
                    : moldStep === 1
                    ? 'CAL: 1/24'
                    : 'SPEC: 3 TSP'}
                </span>
              }
            >
              {/* Spatula Leveling Motion Overlay */}
              {isLeveling && (
                <div className="mold-scraping-overlay">
                  <img
                    src="/assets/tool_spatula_red.png"
                    alt="Leveling Spatula"
                    className="mold-leveling-anim"
                  />
                </div>
              )}

              {/* Step 1 Quick-Fill Action Prompt inside mold */}
              {moldStep === 1 && (
                <div
                  className="spatula-scrape-guide"
                  onClick={handleFillBatch}
                  title="Click to fill all remaining 23 cavities"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    borderColor: '#0284c7',
                  }}
                >
                  <span>⚡ Click to Fill Remaining Tray</span>
                </div>
              )}

              {/* Step 2 Leveling Guidance Guide */}
              {moldStep === 2 && !isLeveling && (
                <div
                  className="spatula-scrape-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula') {
                      handleLevelDough();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Leveling Spatula in your inventory, then tap the mold!', 'info');
                    }
                  }}
                  title="Tap with Leveling Spatula to scrape"
                >
                  <span>
                    📐 {holdingItem?.id === 'leveling_spatula' || holdingItem?.id === 'spatula' ? 'Tap Mold to Scrape & Level' : 'Select Leveling Spatula from Inventory'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 4 Portioning & Leveling Tools"
        items={stage4Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};
