import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';
import { CheckpointQuestionModal } from '../components/CheckpointQuestionModal';
import { RecipeReferenceDrawer } from '../components/RecipeReferenceDrawer';

export const Mission3Mixing = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem, missionsCompleted, maxUnlockedStage } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.mission3);

  // Mixing bowl states:
  // 0: Empty stainless bowl -> accept rice_flour
  // 1: Bowl with rice flour -> accept salt
  // 2: Bowl with flour + salt -> accept ubod_paste
  // 3: Bowl with flour + salt + paste -> accept water
  // 4: All ingredients in bowl -> action: fold & mix paste
  // 5: Mixing in progress
  // 6: Smooth uniform paste ready
  const [bowlStep, setBowlStep] = useState(() => (isAlreadyCompleted ? 6 : 0));
  const [kneadProgress, setKneadProgress] = useState(0);
  const [isKneading, setIsKneading] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);

  useEffect(() => {
    if (isAlreadyCompleted) {
      speak(
        'Stage 3 Completed! Starch formulation has been smoothly blended and ready for molding.',
        'happy',
        {
          badge: 'Stage 3 Complete',
          note: 'Proper dough consistency is critical: uniform dough prevents cracks during dehydration and ensures even puffing during frying.',
          btnText: 'Proceed to Stage 4: Portioning & Molding ➔',
          onNext: () => setScene('mission4'),
        }
      );
    } else {
      speak(
        'Stage 3: Paste Formulation & Mixing! Step 1: In a large bowl, combine 1 cup of rice flour and 1 teaspoon of salt. Add 1 cup of ubod paste and gradually pour in 1 cup of water while gently mixing until all ingredients are well combined.',
        'neutral',
        {
          badge: 'Step 1: Formulation',
          note: 'Mix the ingredients gradually and gently. Add the water little by little while mixing until a uniform dough is formed.',
          hint: 'Select the Erawan Rice Flour from your inventory and add it into the bowl.',
          hideButton: true,
        }
      );
    }
  }, []);

  const bowlSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['rice_flour'],
      prompt: 'Pour 1 cup of Erawan Rice Flour into the large mixing bowl',
      img: '/assets/mixing_bowl_empty.png',
      fallbackIcon: '🥣',
      label: 'Empty Stainless Mixing Bowl',
    },
    {
      stepIndex: 1,
      acceptedItems: ['salt'],
      prompt: 'Add 1 teaspoon of Pure Sea Salt into the dry flour',
      img: '/assets/mixing_bowl_flour_added.png',
      fallbackIcon: '🌾',
      label: 'Bowl with Rice Flour',
    },
    {
      stepIndex: 2,
      acceptedItems: ['ubod_paste'],
      prompt: 'Add 1 cup of pureed Ubod Paste into the dry mixture',
      img: '/assets/mixing_bowl_dry_ingredients.png',
      fallbackIcon: '🧂',
      label: 'Flour + Salt Dry Mix',
    },
    {
      stepIndex: 3,
      acceptedItems: ['water_hydration', 'water'],
      prompt: 'Gradually pour in 1 cup of water while preparing to mix',
      img: '/assets/mixing_bowl_paste_added.png',
      fallbackIcon: '🥥',
      label: 'Flour + Paste Mixture',
    },
    {
      stepIndex: 4,
      acceptedItems: ['spatula', 'red_spatula'],
      prompt: 'All ingredients added! Select Red Spatula on shelf to mix dough',
      img: '/assets/mixing_bowl_water_pouring.png',
      fallbackIcon: '💧',
      label: 'Hydrated Formulation Mix',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Gently mixing and folding into a uniform, cohesive dough...',
      img: '/assets/mixing_bowl_mixing_in_progress.png',
      fallbackIcon: '🥣',
      label: 'Mixing in Progress',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Smooth, uniform coconut pith dough ready for Stage 4 molding!',
      img: '/assets/mixing_bowl_dough_uniform.png',
      fallbackIcon: '✨',
      label: 'Uniform Cracker Dough',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'rice_flour') {
      soundManager.playPour();
      setBowlStep(1);
      setHoldingItem(null);
      showToast('Rice Flour Added!', 'Next: Add 1 tsp Sea Salt to combine dry ingredients.', 'success');
      speak(
        'Rice flour added! Now add the Pure Sea Salt from your inventory so it blends thoroughly into the dry flour particles.',
        'neutral',
        {
          badge: 'Step 1: Dry Blending',
          note: 'Blending the dry ingredients (flour + salt) first ensures even salt dispersal without concentrated salty spots.',
          hint: 'Select Pure Sea Salt from your inventory and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && item.id === 'salt') {
      soundManager.playClick();
      setBowlStep(2);
      setHoldingItem(null);
      showToast('Salt Added!', 'Next: Add 1 Cup Ubod Paste (1:1 Ratio).', 'success');
      speak(
        'Salt blended! Now add the 1 cup of pureed Ubod Paste into the bowl to achieve our balanced 1:1 binder ratio.',
        'happy',
        {
          badge: 'Step 2: 1:1 Ratio Formulation',
          note: 'Rice flour acts as a binder holding the ubod fibers together and providing crispy expansion upon frying.',
          hint: 'Select Ubod Paste in your inventory and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && item.id === 'ubod_paste') {
      soundManager.playPour();
      setBowlStep(3);
      setHoldingItem(null);
      showToast('Ubod Paste Added!', 'Next: Pour in 1 Cup Water gradually.', 'success');
      speak(
        'Paste incorporated! Now gradually pour in 1 cup of water while gently mixing until all ingredients form a uniform dough.',
        'neutral',
        {
          badge: 'Step 3: Gradual Hydration',
          note: 'Pour the water gradually while mixing to achieve the right dough consistency without making it overly sticky or watery.',
          hint: 'Select Hydration Water and drop it into the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 3 && (item.id === 'water_hydration' || item.id === 'water')) {
      soundManager.playPour();
      setBowlStep(4);
      setHoldingItem(null);
      showToast('Water Added!', 'All ingredients combined! Select the Red Spatula to mix.', 'success');
      speak(
        'All formulation ingredients loaded! Select the Red Spatula from your inventory and click the bowl to mix gently until a uniform dough forms.',
        'happy',
        {
          badge: 'Step 4: Dough Mixing',
          note: 'Mix the ingredients gradually and gently until a uniform dough is formed.',
          hint: 'Select the Red Spatula on your shelf, then tap the bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 4 && (item.id === 'spatula' || item.id === 'red_spatula')) {
      handleMixDough();
    }
  };

  const handleMixDough = () => {
    if (isKneading || bowlStep !== 4) return;
    setIsKneading(true);
    setBowlStep(5);
    soundManager.playPour();
    showToast('Mixing Active!', 'Gently folding dough into uniform consistency...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setKneadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsKneading(false);
        setBowlStep(6);
        setHoldingItem(null);
        soundManager.playSuccess();
        unlockBadge('formulation_specialist', '1:1 Dough Master', '🥣');
        completeMission('mission3');
        showToast('Stage 3 Complete!', 'Uniform ubod cracker dough successfully formulated', 'success');
        speak(
          'We are done making our Ubod dough mixture! The dough is completely uniform and ready for portioning into the rectangular mold in Stage 4.',
          'happy',
          {
            badge: 'Stage 3 Complete',
            note: 'The 1:1 ratio of ubod paste to rice flour creates the optimal moisture-to-binder structure for steaming and crisp frying.',
            btnText: 'Proceed to Stage 4: Portioning & Molding ➔',
            onNext: () => setScene('mission4'),
          }
        );
      }
    }, 600);
  };

  const stage3Inventory = [
    {
      id: 'rice_flour',
      name: 'Erawan Rice Flour',
      measure: '1 Cup (1:1 Base)',
      img: '/assets/portion_rice_flour_1cup.png',
      fallbackIcon: '🌾',
      isUsed: bowlStep >= 1,
      isNext: bowlStep === 0,
      tooltip: 'Fine white rice flour providing amylose and amylopectin starches for structural expansion.',
    },
    {
      id: 'salt',
      name: 'Pure Sea Salt',
      measure: '1 tsp (Sea Salt)',
      img: '/assets/ing_salt_fresh.png',
      fallbackIcon: '🧂',
      isUsed: bowlStep >= 2,
      isNext: bowlStep === 1,
      tooltip: '1 tsp pure sea salt to enhance savoriness and reinforce paste binding.',
    },
    {
      id: 'ubod_paste',
      name: 'Silky Ubod Paste',
      measure: '1 Cup Puree',
      img: '/assets/portion_ubod_paste_1cup.png',
      fallbackIcon: '🥥',
      isUsed: bowlStep >= 3,
      isNext: bowlStep === 2,
      tooltip: 'Smooth boiled ubod puree adding dietary fiber, moisture, and delicate flavor notes.',
    },
    {
      id: 'water_hydration',
      name: 'Hydration Water',
      measure: '1 Cup (Gradual)',
      img: '/assets/portion_water_1cup.png',
      fallbackIcon: '💧',
      isUsed: bowlStep >= 4,
      isNext: bowlStep === 3,
      tooltip: 'Potable water added incrementally to hydrate starch granules into smooth paste.',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Fold & Mix',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: bowlStep >= 6,
      isNext: bowlStep === 4,
      tooltip: 'Silicone spatula for thorough folding, mixing, and homogeneous blending.',
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
      if (item.id === 'rice_flour') {
        showToast('Rice Flour Selected', 'Tap the mixing bowl to add.', 'info');
      } else if (item.id === 'salt') {
        showToast('Sea Salt Selected', 'Tap the mixing bowl to add salt.', 'info');
      } else if (item.id === 'ubod_paste') {
        showToast('Ubod Paste Selected', 'Tap the mixing bowl to add paste.', 'info');
      } else if (item.id === 'water_hydration') {
        showToast('Water Selected', 'Tap the mixing bowl to pour water.', 'info');
      } else if (item.id === 'spatula') {
        showToast('Spatula Selected', 'Tap the bowl to mix dough.', 'info');
      }
    }
  };

  const recipeItems = [
    { name: 'Rice Flour', measure: '1 Cup', icon: '🌾', isCompleted: bowlStep >= 1, isCurrent: bowlStep === 0 },
    { name: 'Pure Sea Salt', measure: '1 tsp', icon: '🧂', isCompleted: bowlStep >= 2, isCurrent: bowlStep === 1 },
    { name: 'Ubod Paste', measure: '1 Cup', icon: '🥥', isCompleted: bowlStep >= 3, isCurrent: bowlStep === 2 },
    { name: 'Potable Water', measure: '1 Cup', icon: '💧', isCompleted: bowlStep >= 4, isCurrent: bowlStep === 3 },
  ];

  const safetyChecklist = [
    {
      title: 'Gradual Water Addition',
      desc: 'Add water little by little while mixing gently to prevent lumps and over-wetting.',
      icon: '💧',
      isWarning: false,
    },
    {
      title: 'Uniform Dispersion',
      desc: 'Mix until all ingredients are well combined and a uniform dough is formed.',
      icon: '🥣',
      isWarning: false,
    },
  ];

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(() => !isAlreadyCompleted);

  return (
    <div className="workstation-scene mixing-scene">
      <div className="workstation-overlay" />

      {/* Interactive Checkpoint Modal (Appears before mixing if not answered) */}
      <CheckpointQuestionModal
        isOpen={isQuizModalOpen}
        stageTitle="Stage 3 Checkpoint: Dry vs Wet Ingredients"
        question="Teacher Mia asks: When combining our ingredients in the bowl, what should we blend together first?"
        choices={[
          {
            id: 'a',
            text: 'Dry Ingredients (1 cup rice flour + 1 tsp pure sea salt)',
            isCorrect: true,
            reason: 'Combining the dry ingredients first ensures salt and flour are uniformly distributed before adding wet ingredients and water.',
          },
          {
            id: 'b',
            text: 'Wet Ingredients (water + pureed ubod paste directly)',
            isCorrect: false,
            reason: 'Adding wet ingredients before blending dry flour and salt can cause uneven salty clumps.',
          },
        ]}
        onComplete={() => {
          setIsQuizModalOpen(false);
          showToast('Formulation Unlocked!', 'Add 1 cup Rice Flour into the bowl.', 'success');
        }}
      />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        {/* Floating Quick Recipe & Safety Drawer */}
        <RecipeReferenceDrawer
          stageTitle="Stage 3: Paste Formulation"
          recipeItems={recipeItems}
          safetyNotes={safetyChecklist}
          culinaryTip="Rice flour acts as a structural binder that traps starch granules. Adding the water little by little ensures maximum hydration without making the dough soggy."
        />

        <div className="stage-content-row stage-single-workstation">
          {/* Center: Stainless Mixing Bowl MultiStateContainer */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="mixing_bowl"
              title="Large Stainless Mixing Bowl"
              subtitle="Stage 3: 1:1 Rice Flour & Ubod Paste Formulation"
              currentStepIndex={bowlStep}
              steps={bowlSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isKneading ? 'mixing' : null}
              containerWidth="100%"
              statusDotClass={bowlStep >= 6 ? 'dot-success' : bowlStep >= 1 ? 'dot-amber' : ''}
              statusText={
                isKneading
                  ? `🥣 Mixing ingredients into uniform dough... ${kneadProgress}%`
                  : bowlSteps[bowlStep]?.prompt || 'Ready'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    bowlStep >= 6 ? 'spec-success' : bowlStep >= 1 ? 'spec-amber' : ''
                  }`}
                >
                  {bowlStep >= 6
                    ? 'DOUGH: UNIFORM'
                    : bowlStep === 5
                    ? 'MIXING: ACTIVE'
                    : bowlStep === 4
                    ? 'ACTION: MIX'
                    : bowlStep === 3
                    ? 'WATER: 1 CUP'
                    : bowlStep === 2
                    ? 'PASTE: 1 CUP'
                    : bowlStep === 1
                    ? 'SALT: 1 TSP'
                    : 'FLOUR: 1 CUP'}
                </span>
              }
            >
              {/* Step 4 Mixing Guidance Guide */}
              {bowlStep === 4 && !isKneading && (
                <div
                  className="spatula-scrape-guide"
                  onClick={() => {
                    if (holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula') {
                      handleMixDough();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Red Spatula in your inventory, then tap the bowl!', 'info');
                    }
                  }}
                  title="Tap with Red Spatula to mix dough"
                >
                  <span>
                    🥄 {holdingItem?.id === 'spatula' || holdingItem?.id === 'red_spatula' ? 'Tap Bowl to Mix Dough' : 'Select Red Spatula from Inventory'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 3 Formulation Ingredients & Mixing Tools"
        items={stage3Inventory}
        onItemClick={handleInventoryClick}
      />
    </div>
  );
};
