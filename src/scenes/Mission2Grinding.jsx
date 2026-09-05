import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission2Grinding = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge } = useGame();

  // Processor states: 
  // 0: Empty bowl on motor base -> accept boiled_ubod
  // 1: Boiled ubod in processor -> accept salt_portion
  // 2: Ubod + Salt in processor -> action: lock lid & blend
  // 3: Blending active (spinning vortex)
  // 4: Smooth ubod paste ready -> action: scrape into prep bowl
  // 5: Complete
  const [processorStep, setProcessorStep] = useState(0);
  const [blendProgress, setBlendProgress] = useState(0);
  const [isBlending, setIsBlending] = useState(false);

  useEffect(() => {
    speak(
      'Stage 2: Food Processing & Pureeing! We need to break down the boiled ubod into a silky smooth paste using our food processor.',
      'neutral',
      {
        badge: 'Stage 2: Food Processing',
        hint: 'Drop the Drained Boiled Ubod into the food processor bowl.',
        hideButton: true,
      }
    );
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
      acceptedItems: [],
      prompt: 'Lock safety lid and press Pulse/Blend to puree',
      img: '/assets/processor_with_ubod_salt.png',
      fallbackIcon: '🌀',
      label: 'Ubod + Salt Ready to Puree',
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
      acceptedItems: ['prep_bowl', 'spatula'],
      prompt: 'Scrape smooth ubod paste into the stainless prep bowl',
      img: '/assets/processor_open_paste.png',
      fallbackIcon: '🥣',
      label: 'Silky Ubod Paste (Ready)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'boiled_ubod') {
      soundManager.playPour();
      setProcessorStep(1);
      addScore(25);
      showToast('Boiled Ubod Loaded!', 'Now add salt according to client ratio (1 tsp per cup).', 'success');
      speak(
        'Great! Now add 1 teaspoon of Pure Sea Salt per cup of boiled ubod to season the mixture and assist cellular breakdown.',
        'neutral',
        {
          badge: 'Calibrated Salting',
          hint: 'Select Salt Portion and drop it into the processor bowl.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'salt_portion' || item.id === 'salt')) {
      soundManager.playClick();
      setProcessorStep(2);
      addScore(25);
      showToast('Salt Added!', 'Safety lid ready. Press Blend to puree the ubod.', 'success');
      speak(
        'Lock the safety lid and press "Start High-Speed Puree" to grind the fibers into a completely smooth paste.',
        'thinking',
        {
          badge: 'Safety Interlock Engaged',
          hint: 'Tap the "Start High-Speed Puree" button.',
          hideButton: true,
        }
      );
    }
  };

  const handleStartBlending = () => {
    soundManager.playBoil();
    setIsBlending(true);
    setProcessorStep(3);
    showToast('Pureeing Ubod...', 'S-blade spinning at high RPM...', 'info');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setBlendProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsBlending(false);
        setProcessorStep(4);
        soundManager.playSuccess();
        addScore(35);
        showToast('Pureeing Complete!', 'Ubod fibers turned into silky creamy paste (+35 pts)', 'success');
        speak(
          'Incredible texture! All stringy fibers have vanished into a silky, cohesive coconut pith puree. Now scrape the paste into the stainless prep bowl.',
          'happy',
          {
            badge: 'Puree Extraction',
            hint: 'Select the Prep Bowl / Spatula to collect the finished paste.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleScrapePaste = () => {
    soundManager.playPour();
    setProcessorStep(5);
    addScore(35);
    unlockBadge('puree_specialist', 'Puree Milling Specialist', '⚙️');
    completeMission('mission2');
    showToast('Paste Collected!', 'Ready for dough formulation (+35 pts)', 'success');
    speak(
      'Outstanding work! Your pureed coconut pith paste is ready in the prep bowl. Now let\'s formulate our dough with Erawan rice flour in Stage 3!',
      'happy',
      {
        badge: 'Stage 2 Complete',
        btnText: 'Proceed to Stage 3: Dough Formulation ➔',
        onNext: () => setScene('mission3'),
      }
    );
  };

  return (
    <div className="workstation-scene grinding-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Ingredients to Load */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🥗 Boiled Ingredients</span>
          </div>
          <div className="inventory-vertical-list">
            <div
              className={`dispenser-card ${holdingItem?.id === 'boiled_ubod' ? 'active-held' : ''} ${processorStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'boiled_ubod' ? null : { id: 'boiled_ubod', name: 'Boiled Ubod', img: '/assets/colander_boiled_ubod_ready.png', icon: '🥥' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'boiled_ubod', name: 'Boiled Ubod' }));
              }}
            >
              <img src="/assets/colander_boiled_ubod_ready.png" alt="Boiled Ubod" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Boiled Ubod</strong>
                <span>Fork-Tender & Drained</span>
              </div>
            </div>

            <div
              className={`dispenser-card ${holdingItem?.id === 'salt_portion' ? 'active-held' : ''} ${processorStep === 1 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'salt_portion' ? null : { id: 'salt_portion', name: 'Salt (1 tsp/cup)', img: '/assets/portion_salt_1tsp.png', icon: '🧂' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'salt_portion', name: 'Salt (1 tsp/cup)' }));
              }}
            >
              <img src="/assets/portion_salt_1tsp.png" alt="Salt" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Measured Sea Salt</strong>
                <span>1 tsp per Cup of Ubod</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Food Processor MultiStateContainer */}
        <div className="station-center-card">
          <MultiStateContainer
            containerId="food_processor"
            title="Electric Food Processor"
            subtitle="Retro Sanyo with Stainless S-Blade"
            currentStepIndex={processorStep}
            steps={processorSteps}
            onItemAccepted={handleItemAccepted}
            activeAnimation={isBlending ? 'blending' : null}
            containerWidth="380px"
            containerHeight="260px"
            interactiveAction={
              processorStep === 2
                ? {
                    label: '⚙️ Start High-Speed Puree',
                    onClick: handleStartBlending,
                  }
                : processorStep === 3
                ? {
                    label: `Pureeing... ${blendProgress}%`,
                    disabled: true,
                  }
                : processorStep === 4
                ? {
                    label: '🥣 Scrape Paste into Prep Bowl',
                    onClick: handleScrapePaste,
                    icon: '🥣',
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Extraction Vessel */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🥣 Collection Bowl</span>
          </div>
          <div className="collection-preview-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '12px' }}>
            <img
              src="/assets/bowl_ubod_paste_fresh.png"
              alt="Ubod Paste Bowl"
              style={{
                width: '120px',
                height: '100px',
                objectFit: 'contain',
                opacity: processorStep >= 4 ? 1 : 0.4,
                filter: processorStep >= 4 ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' : 'grayscale(1)',
                transition: 'all 0.3s ease',
              }}
            />
            <div className="bowl-status-text">
              {processorStep >= 5 ? (
                <span className="badge-ready">✨ Filled with Silky Ubod Paste</span>
              ) : processorStep === 4 ? (
                <span className="badge-ready">👉 Ready to Scrape Paste</span>
              ) : (
                <span className="badge-waiting">Awaiting Puree Extraction</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
