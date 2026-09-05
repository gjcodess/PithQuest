import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

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
  const [isLidLocked, setIsLidLocked] = useState(false);

  useEffect(() => {
    speak(
      'Stage 2: Food Processing & Pureeing! We need to break down the boiled ubod into a silky smooth paste using our food processor.',
      'neutral',
      {
        badge: 'Stage 2: Food Processing',
        hint: 'Drop the Drained Boiled Ubod from your bottom inventory shelf into the food processor bowl.',
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
      prompt: isLidLocked
        ? 'Safety interlock locked! Press Pulse/Blend to puree'
        : 'Align & lock safety lid onto bowl to engage interlock',
      img: '/assets/processor_with_ubod_salt.png',
      fallbackIcon: '🌀',
      label: isLidLocked ? 'Lid Locked & Ready to Puree' : 'Ubod + Salt (Lid Open)',
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
        'Great! Now add 1 teaspoon of Pure Sea Salt from the bottom tray into the processor bowl.',
        'neutral',
        {
          badge: 'Calibrated Salting',
          hint: 'Select Measured Sea Salt from the bottom shelf and drop it into the processor.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'salt_portion' || item.id === 'salt')) {
      soundManager.playClick();
      setProcessorStep(2);
      addScore(25);
      showToast('Salt Added!', 'Ingredients loaded. Now lock the safety lid to engage the interlock.', 'success');
      speak(
        'Ingredients loaded! Now align and lock the transparent safety lid onto the bowl to engage the motor safety interlock.',
        'thinking',
        {
          badge: 'Safety Interlock Required',
          hint: 'Click "Lock Safety Lid" to engage the interlock switch.',
          hideButton: true,
        }
      );
    }
  };

  const handleLockLid = () => {
    soundManager.playClick();
    soundManager.playSuccess();
    setIsLidLocked(true);
    addScore(15);
    showToast('Interlock Engaged!', 'Safety lid locked onto bowl. Motor armed and ready! (+15 pts)', 'success');
    speak(
      'Safety interlock engaged! The motor is armed. Now press the Orange High-Speed Puree button on the console to start blending!',
      'happy',
      {
        badge: 'Motor Armed',
        hint: 'Press the Orange High-Speed Puree button on the control console.',
        hideButton: true,
      }
    );
  };

  const handleStartBlending = () => {
    try {
      if (typeof soundManager.playBlend === 'function') {
        soundManager.playBlend();
      } else {
        soundManager.playClick();
      }
    } catch (err) {
      console.warn('Audio playback error', err);
    }
    setIsBlending(true);
    setProcessorStep(3);
    showToast('Pureeing Ubod...', 'Stainless S-blade spinning at 3,000 RPM...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBlendProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsBlending(false);
        setProcessorStep(4);
        soundManager.playSuccess();
        addScore(30);
        showToast('Puree Ready!', 'Cellulose fibers pulverized into uniform, silky paste (+30 pts)', 'success');
        speak(
          'Perfect consistency! All cellulose fibers are completely broken down. Now use the red silicone spatula on your bottom shelf to scrape the paste into the stainless bowl.',
          'happy',
          {
            badge: 'Puree Complete',
            hint: 'Select Red Spatula on the shelf (or click Scrape Paste below).',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleScrapePaste = () => {
    soundManager.playPour();
    soundManager.playSuccess();
    setProcessorStep(5);
    addScore(30);
    unlockBadge('puree_artisan', 'Micro-Fiber Milling Artisan', '⚙️');
    completeMission('mission2');
    showToast('Paste Collected!', 'Silky ubod puree transferred to bowl (+30 pts)', 'success');
    speak(
      'Superb extraction! We have our pureed coconut pith paste. Now let\'s proceed to Stage 3: Dough Formulation & Mixing!',
      'happy',
      {
        badge: 'Stage 2 Complete',
        btnText: 'Proceed to Stage 3: Dough Formulation ➔',
        onNext: () => setScene('mission3'),
      }
    );
  };

  const stage2Inventory = [
    {
      id: 'boiled_ubod',
      name: 'Boiled Ubod',
      measure: '1 Cup (Tender)',
      img: '/assets/colander_boiled_ubod_ready.png',
      fallbackIcon: '🥥',
      isUsed: processorStep >= 1,
      isNext: processorStep === 0,
      tooltip: 'Fork-tender boiled coconut pith',
    },
    {
      id: 'salt_portion',
      name: 'Measured Sea Salt',
      measure: '1 tsp (Per Cup)',
      img: '/assets/portion_salt_1tsp.png',
      fallbackIcon: '🧂',
      isUsed: processorStep >= 2,
      isNext: processorStep === 1,
      tooltip: '1 tsp pure sea salt',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Scrape & Clean',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: processorStep >= 5,
      isNext: processorStep === 4,
      onClick: processorStep === 4 ? handleScrapePaste : undefined,
      tooltip: 'Red silicone spatula for bowl scraping',
    },
    {
      id: 'prep_bowl',
      name: 'Stainless Prep Bowl',
      measure: 'Collection Vessel',
      img: '/assets/tool_mixing_bowl_large.png',
      fallbackIcon: '🥣',
      isUsed: processorStep >= 5,
      isNext: false,
      tooltip: 'Sanitized large mixing bowl for collecting puree',
    },
  ];

  return (
    <div className="workstation-scene grinding-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '880px' }}>
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
              containerWidth="440px"
              containerHeight="290px"
              interactiveAction={
                processorStep === 2
                  ? (!isLidLocked
                      ? {
                          label: 'Twist & Lock Safety Lid',
                          onClick: handleLockLid,
                          icon: '🔒',
                          variant: 'interlock-lock',
                        }
                      : {
                          label: 'High-Speed Puree',
                          onClick: handleStartBlending,
                          icon: '⚡',
                          variant: 'processor-pulse',
                          onKeyClick: (key) => {
                            soundManager.playClick();
                            if (key === 'stop') {
                              showToast('Safety Switch', 'Appliance is in standby. Press the Orange High-Speed button to puree!', 'info');
                            } else if (key === 'low') {
                              showToast('Speed Control', 'Recipe standard requires High-Speed Puree for fine cracker paste.', 'warning');
                            }
                          },
                        })
                  : processorStep === 3
                  ? {
                      label: `Pureeing... ${blendProgress}%`,
                      disabled: true,
                      icon: '⚡',
                      variant: 'processor-pulse',
                      isActive: true,
                    }
                  : processorStep === 4
                  ? {
                      label: 'Scrape Paste into Prep Bowl',
                      onClick: handleScrapePaste,
                      icon: '🥣',
                    }
                  : null
              }
            >
              {processorStep === 2 && !isLidLocked && (
                <div
                  className="lid-interlock-guide"
                  onClick={handleLockLid}
                  title="Click to lock transparent safety lid"
                >
                  <span>🔒 Click to Lock Safety Lid</span>
                </div>
              )}
              {processorStep === 2 && isLidLocked && (
                <div className="interlock-status-badge">
                  <span>✅ Safety Interlock: LOCKED</span>
                </div>
              )}
            </MultiStateContainer>
          </div>

          {/* Right Side: Extraction Vessel Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🥣 Extraction Vessel</span>
              <span className={`station-badge-mini ${processorStep >= 5 ? 'badge-success' : 'badge-pending'}`}>
                {processorStep >= 5 ? '✅ Collected' : 'Ready'}
              </span>
            </div>
            <div className="collection-preview-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px' }}>
              <img
                src="/assets/bowl_ubod_paste_fresh.png"
                alt="Ubod Paste Bowl"
                style={{
                  width: '120px',
                  height: '100px',
                  objectFit: 'contain',
                  opacity: processorStep >= 4 ? 1 : 0.35,
                  filter: processorStep >= 4 ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' : 'grayscale(1)',
                  transition: 'all 0.3s ease',
                }}
              />
              <div className="bowl-status-text" style={{ textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                {processorStep >= 5 ? (
                  <span style={{ color: '#16a34a' }}>✨ Silky Ubod Paste Collected</span>
                ) : processorStep === 4 ? (
                  <span style={{ color: '#0284c7' }}>👉 Ready to Scrape into Bowl</span>
                ) : (
                  <span style={{ color: '#64748b' }}>Awaiting Pureed Mixture</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 2 Inventory & Pureeing Tools"
        items={stage2Inventory}
      />
    </div>
  );
};
