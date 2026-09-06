import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { StoveBurnerConsole } from '../components/StoveBurnerConsole';
import { InventoryTray } from '../components/InventoryTray';

export const Mission7Frying = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Frying states:
  // 0: Empty wok on stove -> accept cooking_oil
  // 1: Wok with oil -> ignite burner & preheat oil to 180°C (medium-high heat)
  // 2: Hot oil ready (180°C) -> accept dehydrated_pellets / tongs_chip
  // 3: 10-Second Flash Puffing Animation (expansion from hard pellet to airy cracker)
  // 4: Golden puffed cracker lifted with tongs -> accept colander to drain
  // 5: Draining in colander -> accept platter to transfer to cooled platter
  // 6: Cooled golden crackers on platter -> complete & proceed to packaging
  const [fryStep, setFryStep] = useState(0);
  const [oilTemp, setOilTemp] = useState(25);
  const [isHeatingOil, setIsHeatingOil] = useState(false);
  const [isPuffing, setIsPuffing] = useState(false);
  const [puffProgress, setPuffProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 7: Deep Frying & Oil Draining! Step 19: Preheat the frying pan with 5 cups of vegetable oil over medium heat.',
      'neutral',
      {
        badge: 'Step 19: Oil Preheat',
        note: 'Safety Note: Keep a safe distance from the hot oil and use tongs when handling the crackers.',
        hint: 'First, select Vegetable Oil from the bottom shelf and drop it into the empty wok.',
        hideButton: true,
      }
    );
  }, []);

  const wokSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['cooking_oil', 'oil', 'portion_oil_5cups', 'ing_oil_fresh'],
      prompt: 'Pour 5 cups vegetable cooking oil into wok',
      img: '/assets/frying_pan_empty.png',
      fallbackIcon: '🍳',
      label: 'Heavy Frying Wok',
    },
    {
      stepIndex: 1,
      acceptedItems: [],
      prompt: 'Turn stove dial to ignite & heat oil to 180°C',
      img: '/assets/frying_pan_with_oil.png',
      fallbackIcon: '🫗',
      label: 'Wok Filled with Oil',
    },
    {
      stepIndex: 2,
      acceptedItems: ['dehydrated_pellets', 'pellets', 'tongs_chip', 'container_dehydrated_chips'],
      prompt: 'Oil at 180°C! Drop dehydrated ubod pellets',
      img: '/assets/frying_pan_oil_hot.png',
      fallbackIcon: '🔥',
      label: 'Hot Shimmering Oil (180°C)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Flash expansion! 10-second puffing active...',
      img: '/assets/frying_pan_frying_puffing.png',
      fallbackIcon: '💥',
      label: '10-Second Flash Puffing',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander', 'tool_colander_safe', 'skimmer'],
      prompt: 'Puffed cracker ready! Lift with tongs to colander',
      img: '/assets/tongs_holding_puffed_cracker.png',
      fallbackIcon: '🥢',
      label: 'Expanded Cracker on Tongs',
    },
    {
      stepIndex: 5,
      acceptedItems: ['platter', 'icon_cracker_platter'],
      prompt: 'Draining surface oil. Transfer to platter',
      img: '/assets/colander_fried_crackers_draining.png',
      fallbackIcon: '🥣',
      label: 'Draining Oil in Colander',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Crispy golden Ubod Crunch ready for packaging!',
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      label: 'Golden Crackers on Serving Platter',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'cooking_oil' || item.id === 'oil' || item.id === 'portion_oil_5cups' || item.id === 'ing_oil_fresh')) {
      soundManager.playPour();
      setFryStep(1);
      addScore(25);
      setHoldingItem(null);
      showToast('Oil Poured!', 'Wok filled with 5 cups vegetable oil. Preheat burner (+25 pts)', 'success');
      speak(
        'Oil is loaded! Click the stove dial below to ignite the burner and preheat oil to medium heat (~180°C).',
        'neutral',
        {
          badge: 'Thermal Heating',
          note: 'Ensure oil reaches proper frying temperature (~175°C–180°C) before dropping crackers to avoid oil absorption.',
          hint: 'Click the stove dial below to ignite burner.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'dehydrated_pellets' || item.id === 'pellets' || item.id === 'tongs_chip' || item.id === 'container_dehydrated_chips')) {
      handleDropPellets();
    } else if (stepIndex === 4 && (item.id === 'colander' || item.id === 'tool_colander_safe' || item.id === 'skimmer')) {
      handleLiftToDrain();
    } else if (stepIndex === 5 && (item.id === 'platter' || item.id === 'icon_cracker_platter')) {
      handleTransferToPlatter();
    }
  };

  const handlePreheatOil = () => {
    soundManager.playIgnite();
    setIsHeatingOil(true);
    showToast('Burner Ignited...', 'Oil temperature rising to 180°C...', 'info');

    let current = 25;
    const interval = setInterval(() => {
      current += 31;
      setOilTemp(current);
      if (current >= 180) {
        clearInterval(interval);
        setOilTemp(180);
        setIsHeatingOil(false);
        setFryStep(2);
        soundManager.playSuccess();
        addScore(20);
        showToast('Optimal Temperature Reached!', 'Oil ready at 180°C green zone (+20 pts)', 'success');
        speak(
          'Step 20: Carefully fry the dehydrated ubod pieces for approximately 10 seconds or until they become crispy. Drop the dehydrated pellets into the hot oil!',
          'happy',
          {
            badge: 'Step 20: Flash Frying',
            note: 'Carefully fry for only about 10 seconds per batch. Coconut pith crackers puff up and become crispy almost immediately!',
            hint: 'Select Dehydrated Pellets from bottom shelf and drop into the hot oil.',
            hideButton: true,
          }
        );
      }
    }, 400);
  };

  const handleDropPellets = () => {
    soundManager.playSizzle();
    setFryStep(3);
    setIsPuffing(true);
    setHoldingItem(null);
    addScore(30);
    showToast('Chips Dropped!', 'Rapid steam expansion active! 10-second puff...', 'info');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setPuffProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPuffing(false);
        setFryStep(4);
        soundManager.playSuccess();
        addScore(35);
        showToast('Puffed to Perfection!', 'Glassy chips expanded 3x into golden crispy crackers (+35 pts)', 'success');
        speak(
          'Step 21: Using tongs, remove the fried ubod crackers and transfer them to a colander to drain the excess oil.',
          'happy',
          {
            badge: 'Step 21: Drain Excess Oil',
            note: 'Safety Note: Never touch crackers directly with hands while in hot oil. Always use tongs or a skimmer.',
            hint: 'Select Draining Colander from inventory and tap the wok to drain.',
            hideButton: true,
          }
        );
      }
    }, 500);
  };

  const handleLiftToDrain = () => {
    soundManager.playClick();
    setFryStep(5);
    setHoldingItem(null);
    addScore(20);
    showToast('Draining Oil...', 'Surface oil draining through paper towel lined colander (+20 pts)', 'info');
    speak(
      'Step 22: Allow the crackers to cool completely before proceeding to the packaging stage. Select the Presentation Platter to arrange the crackers!',
      'neutral',
      {
        badge: 'Step 22: Complete Cooling',
        note: 'Allow crackers to cool completely to room temperature before packaging to maintain crunchiness and prevent moisture condensation inside the pouch.',
        hint: 'Select Presentation Platter from inventory and tap the colander.',
        hideButton: true,
      }
    );
  };

  const handleTransferToPlatter = () => {
    soundManager.playClick();
    setFryStep(6);
    setHoldingItem(null);
    addScore(35);
    unlockBadge('puff_master', 'Aeration Expansion Master', '🍳');
    completeMission('mission7');
    showToast('Crackers Cooled!', 'Crisp, golden, and non-greasy (+35 pts)', 'success');
    speak(
      'Outstanding frying! The crackers are golden, crispy, and thoroughly cooled. Now let’s move on to the Packaging Process in Stage 8!',
      'happy',
      {
        badge: 'Stage 7 Complete',
        note: 'Follow proper packaging procedures and wear required hygiene PPE in the packaging room.',
        btnText: 'Proceed to Stage 8: Packaging & Labeling ➔',
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
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      isUsed: fryStep >= 6,
      isNext: fryStep === 5,
      tooltip: 'Sanitized tray for cooling golden, airy, non-greasy ubod kropek crackers.',
    },
  ];

  return (
    <div className="workstation-scene frying-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Left: Deep Frying Heavy Wok Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="wok"
              title="Deep Frying Heavy Wok"
              subtitle="180°C Thermal Flash Expansion • 10 Seconds"
              currentStepIndex={fryStep}
              steps={wokSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={fryStep >= 2 && fryStep <= 3 ? 'sizzling' : null}
              containerWidth="520px"
              containerHeight="330px"
              statusDotClass={fryStep >= 6 ? 'dot-success' : isPuffing ? 'dot-amber' : ''}
              statusText={
                fryStep >= 6
                  ? 'Crispy golden ubod crackers cooled and ready for packaging.'
                  : fryStep === 5
                  ? 'Draining excess oil in colander. Transfer to platter.'
                  : fryStep === 4
                  ? 'Puffed cracker ready! Scoop into colander to drain oil.'
                  : fryStep === 3
                  ? `Flash expanding... ${puffProgress}% (10-Second Steam Ballooning)`
                  : fryStep === 2
                  ? 'Oil shimmering at 180°C! Drop dehydrated pellets.'
                  : fryStep === 1
                  ? isHeatingOil
                    ? `Preheating oil to 180°C (${oilTemp}°C)...`
                    : 'Turn stove dial to ignite burner and preheat oil.'
                  : 'Pour 5 cups of cooking oil into empty heavy wok.'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    fryStep >= 6
                      ? 'spec-success'
                      : oilTemp >= 175
                      ? 'spec-success'
                      : fryStep >= 1
                      ? 'spec-amber'
                      : ''
                  }`}
                >
                  {fryStep >= 6
                    ? 'TEXTURE: CRISP'
                    : fryStep >= 3
                    ? 'PUFF: 3X'
                    : oilTemp >= 175
                    ? 'TEMP: 180°C'
                    : fryStep >= 1
                    ? `TEMP: ${Math.round(oilTemp)}°C`
                    : 'OIL: 5 CUPS'}
                </span>
              }
              customFooter={
                fryStep <= 2 ? (
                  <StoveBurnerConsole
                    isReady={fryStep === 1 && !isHeatingOil}
                    isIgnited={isHeatingOil || (fryStep >= 2 && fryStep <= 3)}
                    isComplete={fryStep >= 4}
                    progress={Math.round((oilTemp / 180) * 100)}
                    onIgnite={handlePreheatOil}
                    standbyHint="Pour 5 cups vegetable oil into wok"
                    readyHint="👉 Turn dial to ignite & heat oil to 180°C"
                    activeHint={(p) => (isHeatingOil ? `🔥 Preheating oil... ${p}%` : '✨ Oil ready at 180°C')}
                    modeTitleStandby="BURNER: STANDBY"
                    modeTitleReady="CLICK TO IGNITE"
                    modeTitleIgnited={isHeatingOil ? `PREHEATING OIL • ${Math.round(oilTemp)}°C` : 'OIL READY • 180°C HIGH'}
                    modeTitleComplete="BURNER: OFF"
                  />
                ) : null
              }
            />
          </div>

          {/* Right: Thermal Flash Expansion QC & Oil Monitor */}
          <div
            className={`multi-state-workstation qc-workstation ${
              (fryStep === 4 && (holdingItem?.id === 'colander' || holdingItem?.id === 'tool_colander_safe' || holdingItem?.id === 'skimmer')) ||
              (fryStep === 5 && (holdingItem?.id === 'platter' || holdingItem?.id === 'icon_cracker_platter'))
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '440px',
              cursor:
                fryStep === 4 || fryStep === 5
                  ? 'url("/assets/cursor_hover_32.png") 2 2, pointer'
                  : 'inherit',
            }}
            onClick={() => {
              if (fryStep === 4) handleLiftToDrain();
              else if (fryStep === 5) handleTransferToPlatter();
            }}
            onDragOver={(e) => {
              if (fryStep === 4 || fryStep === 5) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (fryStep === 4 || fryStep === 5) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (fryStep === 4 && (item.id === 'colander' || item.id === 'tool_colander_safe' || item.id === 'skimmer')) {
                    handleLiftToDrain();
                  } else if (fryStep === 5 && (item.id === 'platter' || item.id === 'icon_cracker_platter')) {
                    handleTransferToPlatter();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Thermal Flash Expansion QC & Oil Monitor"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Thermal Flash Expansion QC</h4>
                <span className="workstation-sub">Step 16: Aeration & Oil Drainage</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  fryStep >= 6
                    ? 'badge-success-glow'
                    : fryStep >= 4
                    ? 'badge-flow-glow'
                    : oilTemp >= 175
                    ? 'badge-success-glow'
                    : fryStep >= 1
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {fryStep >= 6
                  ? '✨ Cooled & Crispy'
                  : fryStep === 5
                  ? '🥣 Oil Draining'
                  : fryStep === 4
                  ? '🥢 Puffed & Lifted'
                  : fryStep === 3
                  ? '💥 10s Flash Puff'
                  : oilTemp >= 175
                  ? '🔥 180°C Optimal'
                  : fryStep >= 1
                  ? `${Math.round(oilTemp)}°C Heating`
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className="workstation-viewport frying-qc-viewport"
              style={{ height: '330px', minHeight: '330px', maxHeight: '330px', flex: '0 0 auto' }}
            >
              {/* Oil Thermometer & Expansion Ratio Spec Card */}
              <div className="frying-spec-card">
                <div className="frying-spec-header">
                  <span>🌡️ Oil Temp & Expansion</span>
                  <span
                    className={`station-badge-mini ${
                      oilTemp >= 175 ? 'badge-success' : 'badge-pending'
                    }`}
                  >
                    {oilTemp >= 175 ? '✨ 180°C Green' : `${Math.round(oilTemp)}°C Preheating`}
                  </span>
                </div>

                <div className="frying-spec-grid">
                  <div className="frying-spec-item">
                    <span className="spec-title">Frying Oil Temp</span>
                    <span
                      className="spec-val"
                      style={{ color: oilTemp >= 175 ? '#10b981' : '#f59e0b' }}
                    >
                      {Math.round(oilTemp)}°C
                    </span>
                  </div>
                  <div className="frying-spec-item">
                    <span className="spec-title">Expansion Ratio</span>
                    <span
                      className="spec-val"
                      style={{ color: fryStep >= 4 ? '#10b981' : '#0284c7' }}
                    >
                      {fryStep >= 4 ? '3x Expanded' : isPuffing ? '2x Ballooning' : '1x Raw'}
                    </span>
                  </div>
                </div>

                {/* 10-Second Flash Puffing Progress Row */}
                <div className="frying-cycle-row">
                  <div className="frying-cycle-header">
                    <span>10-Second Flash Expansion:</span>
                    <strong>{fryStep >= 4 ? '100% (Complete)' : isPuffing ? `${Math.round(puffProgress)}%` : '0%'}</strong>
                  </div>
                  <div className="frying-cycle-bar-bg">
                    <div
                      className="frying-cycle-bar-fill"
                      style={{
                        width: fryStep >= 4 ? '100%' : isPuffing ? `${Math.round(puffProgress)}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Texture Transition Comparison */}
              <div className="frying-texture-compare">
                <div className={`texture-compare-box ${fryStep < 4 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Vitrified Pellet</span>
                  <span className="texture-box-desc">&lt;8% H2O • Hard & Glassy</span>
                </div>
                <div className={`texture-compare-box ${fryStep >= 4 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Puffed Ubod Chip</span>
                  <span className="texture-box-desc">3x Volume • Light & Airy</span>
                </div>
              </div>

              {/* Food Science Note */}
              <div className="frying-science-note">
                <strong>🔬 Science Principle: </strong>
                Residual water flashes instantly into superheated steam at 180°C, puffing glassy starch 3x in 10s.
              </div>
            </div>

            {/* Workstation Footer */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <div
                  className={`status-dot ${
                    fryStep >= 6
                      ? 'dot-success'
                      : fryStep >= 3
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {fryStep >= 6
                    ? 'Crackers cooled & drained. Ready to pack.'
                    : fryStep === 5
                    ? 'Draining oil in colander. Transfer to platter.'
                    : fryStep === 4
                    ? '10s flash puff complete. Drain in colander.'
                    : fryStep === 3
                    ? 'Flash puffing active! Matrix ballooning 3x...'
                    : oilTemp >= 175
                    ? 'Oil shimmering at 180°C. Drop pellets.'
                    : 'Preheat oil to 180°C flash-frying zone.'}
                </span>
              </div>
              <span className="spec-badge">
                {fryStep >= 6
                  ? 'CRISP: 100%'
                  : fryStep >= 3
                  ? 'PUFF: 3X'
                  : oilTemp >= 175
                  ? 'TEMP: 180°C'
                  : 'OIL: 180°C'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 7 Frying Cookware & Pellets"
        items={stage7Inventory}
      />
    </div>
  );
};

