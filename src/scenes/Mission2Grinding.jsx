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
  const [isScraping, setIsScraping] = useState(false);

  useEffect(() => {
    speak(
      'Stage 2: Food Processing & Pureeing! Step 8: Transfer the boiled ubod to a food processor. Add 1 teaspoon of salt for every 1 cup of ubod.',
      'neutral',
      {
        badge: 'Step 8: Load Processor',
        note: 'Safety Check: Check first the wiring, outlet, and the food processor itself before operating.',
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
      acceptedItems: ['spatula', 'red_spatula'],
      prompt: 'Select Red Spatula on bottom shelf & tap bowl to scrape paste',
      img: '/assets/processor_open_paste.png',
      fallbackIcon: '🥣',
      label: 'Silky Ubod Paste (Ready to Scrape)',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'All silky ubod paste scraped & collected into prep bowl',
      img: '/assets/processor_empty.png',
      fallbackIcon: '✨',
      label: 'Clean Processor Bowl (Paste Collected)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'boiled_ubod') {
      soundManager.playPour();
      setProcessorStep(1);
      addScore(25);
      showToast('Boiled Ubod Loaded!', 'Now add salt according to client ratio (1 tsp per cup).', 'success');
      speak(
        'Great! Now add 1 teaspoon of Pure Sea Salt from the bottom tray into the processor bowl (1 tsp per 1 cup ubod).',
        'neutral',
        {
          badge: 'Calibrated Salting',
          note: 'Salt assists in cell rupture during blending and distributes seasoning evenly throughout the puree.',
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
          note: 'Safety Note: Never operate electrical kitchen appliances with exposed blades or without securely locking safety lids.',
          hint: 'Click "Lock Safety Lid" to engage the interlock switch.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 4 && (item.id === 'spatula' || item.id === 'red_spatula')) {
      handleScrapePaste();
    }
  };

  const handleLockLid = () => {
    soundManager.playClick();
    soundManager.playSuccess();
    setIsLidLocked(true);
    addScore(15);
    showToast('Interlock Engaged!', 'Safety lid locked onto bowl. Motor armed and ready! (+15 pts)', 'success');
    speak(
      'Step 9: Process the ubod until it becomes fine and paste-like in consistency. Press the High-Speed Puree button to start!',
      'happy',
      {
        badge: 'Step 9: Pureeing',
        note: 'Process the ubod until it reaches a smooth, uniform, paste-like consistency with no large fibrous chunks.',
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
          'Step 10: Once finely processed, transfer the ubod paste to a separate clean bowl. Pick up the red silicone spatula to scrape!',
          'happy',
          {
            badge: 'Step 10: Transfer Paste',
            note: 'Use a clean spatula to scrape down the bowl sides to minimize ingredient loss and maintain accurate batch yield.',
            hint: 'Select Red Spatula on the shelf, then tap the processor bowl to scrape.',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleScrapePaste = () => {
    if (isScraping) return;
    setIsScraping(true);
    setHoldingItem(null);

    try {
      if (typeof soundManager.playScrape === 'function') {
        soundManager.playScrape();
      } else {
        soundManager.playPour();
      }
    } catch (err) {
      console.warn(err);
    }

    setTimeout(() => {
      setIsScraping(false);
      soundManager.playSuccess();
      setProcessorStep(5);
      addScore(30);
      unlockBadge('puree_artisan', 'Micro-Fiber Milling Artisan', '⚙️');
      completeMission('mission2');
      showToast('Paste Collected!', 'Silky ubod puree scraped cleanly into prep bowl (+30 pts)', 'success');
      speak(
        'Superb extraction! We have our pureed coconut pith paste. Now let\'s proceed to Stage 3: Dough Formulation & Mixing!',
        'happy',
        {
          badge: 'Stage 2 Complete',
          note: 'Smooth ubod paste will blend uniformly with rice flour in Stage 3 to produce a cohesive dough structure.',
          btnText: 'Proceed to Stage 3: Dough Formulation ➔',
          onNext: () => setScene('mission3'),
        }
      );
    }, 550);
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
      tooltip: 'Fork-tender boiled coconut pith strips ready for mechanical fiber disintegration.',
    },
    {
      id: 'salt_portion',
      name: 'Measured Sea Salt',
      measure: '1 tsp (Per Cup)',
      img: '/assets/portion_salt_1tsp.png',
      fallbackIcon: '🧂',
      isUsed: processorStep >= 2,
      isNext: processorStep === 1,
      tooltip: '1 tsp pure sea salt to enhance natural sweetness and homogenize cell pureeing.',
    },
    {
      id: 'spatula',
      name: 'Red Spatula',
      measure: 'Scrape & Clean',
      img: '/assets/tool_spatula_red.png',
      fallbackIcon: '🥄',
      isUsed: processorStep >= 5,
      isNext: processorStep === 4,
      tooltip: 'Flexible silicone spatula to thoroughly scrape pureed paste from processor walls.',
    },
    {
      id: 'prep_bowl',
      name: 'Stainless Prep Bowl',
      measure: 'Collection Vessel',
      img: '/assets/tool_mixing_bowl_large.png',
      fallbackIcon: '🥣',
      isUsed: processorStep >= 5,
      isNext: false,
      tooltip: 'Sanitized stainless mixing bowl to collect and weigh 1 cup of smooth pureed paste.',
    },
  ];

  return (
    <div className="workstation-scene grinding-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
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
              containerWidth="520px"
              containerHeight="330px"
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
                    if (holdingItem?.id === 'spatula') {
                      handleScrapePaste();
                    } else {
                      soundManager.playClick();
                      showToast('Select Spatula First', 'Click the Red Spatula on the bottom shelf, then tap the bowl!', 'info');
                      speak(
                        'Pick up the red silicone spatula from your bottom shelf first, then tap the bowl to scrape the paste!',
                        'thinking',
                        {
                          badge: 'Select Spatula',
                          hint: 'Tap "Red Spatula" on the bottom tray, then tap the bowl.',
                        }
                      );
                    }
                  }}
                  title="Tap with Red Spatula to scrape"
                >
                  <span>
                    🥄 {holdingItem?.id === 'spatula' ? 'Tap Bowl to Scrape Paste' : 'Pick Up Red Spatula Below'}
                  </span>
                </div>
              )}

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

          {/* Right Side: Extraction Vessel Workstation */}
          <div
            className={`multi-state-workstation extraction-workstation ${
              processorStep === 4 && holdingItem?.id === 'spatula' ? 'compatible-target' : ''
            }`}
            style={{
              width: '440px',
              cursor: processorStep === 4 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (processorStep === 4) {
                if (holdingItem?.id === 'spatula') {
                  handleScrapePaste();
                } else {
                  soundManager.playClick();
                  showToast('Select Spatula First', 'Click the Red Spatula on the bottom shelf, then tap here to scrape!', 'info');
                  speak(
                    'Pick up the red silicone spatula from your bottom shelf first, then tap to transfer the paste into the prep bowl!',
                    'thinking',
                    {
                      badge: 'Select Spatula',
                      hint: 'Tap "Red Spatula" on the bottom tray first.',
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
                  if (item.id === 'spatula') {
                    handleScrapePaste();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Extraction & Puree Holding Workstation"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Stainless Prep Bowl</h4>
                <span className="workstation-sub">Puree collection & holding vessel</span>
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
                {processorStep >= 5 ? '✅ Collected' : processorStep === 4 ? '🥣 Ready to Scrape' : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className={`workstation-viewport extraction-viewport ${
                processorStep === 4 ? 'interactive-vessel' : ''
              }`}
              style={{ minHeight: '330px', flex: '1 1 auto' }}
            >
              {/* Floating guidance pill at step 4 */}
              {processorStep === 4 && !isScraping && (
                <div className="vessel-transfer-guide">
                  <span>🥣 {holdingItem?.id === 'spatula' ? 'Tap to Transfer Paste' : 'Pick Up Spatula Below'}</span>
                </div>
              )}

              <div className="container-visual-wrapper">
                <img
                  src={
                    processorStep >= 5
                      ? '/assets/bowl_ubod_paste_fresh.png'
                      : '/assets/tool_mixing_bowl_large.png'
                  }
                  alt={processorStep >= 5 ? 'Fresh Silky Ubod Paste' : 'Sanitized Prep Bowl'}
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
                    : '🥣 Clean & Sanitized Stainless Bowl'}
                </span>
              </div>
            </div>

            {/* Workstation Footer (86px) */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <span className={`status-dot ${processorStep >= 5 ? 'dot-success' : ''}`} />
                <span className="status-text">
                  {processorStep >= 5
                    ? '1 Cup pureed ubod paste ready for Stage 3'
                    : processorStep === 4
                    ? 'Tap with Spatula to collect puree'
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
        title="Station 2 Inventory & Pureeing Tools"
        items={stage2Inventory}
      />
    </div>
  );
};

