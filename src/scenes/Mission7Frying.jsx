import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission7Frying = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Frying states:
  // 0: Empty wok on stove -> accept cooking_oil
  // 1: Wok with oil -> action: heat oil to 180°C (medium heat)
  // 2: Hot oil ready (shimmering) -> accept dehydrated_pellets
  // 3: 10-Second Flash Puffing Animation (expansion from hard pellet to airy cracker)
  // 4: Golden puffed cracker lifted with tongs -> action: scoop into colander to drain
  // 5: Draining in colander -> action: transfer to cooled platter
  // 6: Cooled golden crackers on platter -> complete & proceed to packaging
  const [fryStep, setFryStep] = useState(0);
  const [oilTemp, setOilTemp] = useState(25);
  const [isHeatingOil, setIsHeatingOil] = useState(false);
  const [isPuffing, setIsPuffing] = useState(false);
  const [puffProgress, setPuffProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 7: Deep Frying & Oil Draining! Select the 5 cups of Vegetable Oil from the bottom inventory, pour into the deep wok, and preheat to 180°C.',
      'neutral',
      {
        badge: 'Stage 7: Flash Frying',
        hint: 'First, select Vegetable Oil from the bottom shelf and drop it into the empty wok.',
        hideButton: true,
      }
    );
  }, []);

  const wokSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['cooking_oil', 'oil'],
      prompt: 'Pour 5 cups of vegetable cooking oil into the empty wok',
      img: '/assets/frying_pan_empty.png',
      fallbackIcon: '🍳',
      label: 'Empty Frying Wok',
    },
    {
      stepIndex: 1,
      acceptedItems: [],
      prompt: 'Wok filled with oil. Heat burner to 180°C (Medium Heat)',
      img: '/assets/frying_pan_with_oil.png',
      fallbackIcon: '🫗',
      label: 'Wok with Oil',
    },
    {
      stepIndex: 2,
      acceptedItems: ['dehydrated_pellets', 'pellets', 'tongs_chip'],
      prompt: 'Oil is at optimal 180°C! Drop dehydrated ubod pellets with tongs',
      img: '/assets/frying_pan_oil_hot.png',
      fallbackIcon: '🔥',
      label: 'Hot Shimmering Oil (180°C)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Thermal steam expansion! Pellets rapidly ballooning into airy crackers (10 sec)...',
      img: '/assets/frying_pan_frying_puffing.png',
      fallbackIcon: '💥',
      label: '10-Second Flash Puffing',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'Puffed golden cracker lifted with stainless tongs! Crisp and airy',
      img: '/assets/tongs_holding_puffed_cracker.png',
      fallbackIcon: '🥢',
      label: 'Expanded Cracker Lifted with Tongs',
    },
    {
      stepIndex: 5,
      acceptedItems: ['skimmer', 'colander'],
      prompt: 'Scoop batch into colander lined with paper towels to drain excess surface oil',
      img: '/assets/colander_fried_crackers_draining.png',
      fallbackIcon: '🥣',
      label: 'Draining Oil in Colander',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Cooled, airy, crispy golden Ubod Crunch crackers ready for packaging!',
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      label: 'Golden Crackers on Serving Platter',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'cooking_oil' || item.id === 'oil')) {
      soundManager.playPour();
      setFryStep(1);
      addScore(25);
      showToast('Oil Poured!', 'Wok filled with 5 cups vegetable oil. Preheat burner.', 'success');
      speak(
        'Oil is loaded! Click "Preheat Oil to 180°C" to bring the oil to medium deep-frying temperature.',
        'neutral',
        {
          badge: 'Thermal Heating',
          hint: 'Click "Preheat Oil to 180°C".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'dehydrated_pellets' || item.id === 'pellets' || item.id === 'tongs_chip')) {
      soundManager.playSizzle();
      setFryStep(3);
      setIsPuffing(true);
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
            '10 seconds exactly! The crackers have fully expanded into light, golden wafers with thousands of micro-air pockets. Scoop them with the skimmer into the colander to drain surface oil!',
            'happy',
            {
              badge: 'Flash Expansion Complete',
              hint: 'Click "Scoop into Colander to Drain Oil".',
              hideButton: true,
            }
          );
        }
      }, 500);
    }
  };

  const handlePreheatOil = () => {
    soundManager.playClick();
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
          'Target temperature reached: 180°C! Now select the Dehydrated Pellets with tongs from your bottom shelf and drop them into the hot shimmering oil.',
          'happy',
          {
            badge: '180°C Ready',
            hint: 'Select Dehydrated Pellets from bottom shelf and drop into the wok.',
            hideButton: true,
          }
        );
      }
    }, 400);
  };

  const handleLiftToDrain = () => {
    soundManager.playClick();
    setFryStep(5);
    addScore(20);
    showToast('Draining Oil...', 'Surface oil draining through perforated colander', 'info');
    speak(
      'The crackers are draining in the colander lined with paper towels. Once excess surface oil is removed, click below to transfer them to the presentation platter!',
      'neutral',
      {
        badge: 'Oil Drainage',
        hint: 'Click "Transfer to Presentation Platter".',
        hideButton: true,
      }
    );
  };

  const handleTransferToPlatter = () => {
    soundManager.playClick();
    setFryStep(6);
    addScore(35);
    unlockBadge('puff_master', 'Aeration Expansion Master', '🍳');
    completeMission('mission7');
    showToast('Crackers Cooled!', 'Crisp, golden, and non-greasy (+35 pts)', 'success');
    speak(
      'Outstanding frying! The crackers are golden, crisp, and properly drained of excess oil. Now let\'s package and heat-seal our final product in Stage 8!',
      'happy',
      {
        badge: 'Stage 7 Complete',
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
      tooltip: '5 cups fresh vegetable cooking oil for deep submerging',
    },
    {
      id: 'dehydrated_pellets',
      name: 'Dehydrated Chip Container',
      measure: 'Airtight Glassy Pellets',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      isUsed: fryStep >= 3,
      isNext: fryStep === 2,
      tooltip: 'Dry translucent pellets held in airtight clip container',
    },
    {
      id: 'tongs_chip',
      name: fryStep >= 2 ? 'Tongs Gripping Pellet' : 'Stainless Kitchen Tongs',
      measure: fryStep >= 2 ? 'Ready to Drop in Oil' : 'Precision Heat Handling',
      img: fryStep >= 2 ? '/assets/tongs_holding_chip.png' : '/assets/tool_tongs_stainless.png',
      fallbackIcon: '🥢',
      isUsed: fryStep >= 3,
      isNext: fryStep === 2,
      tooltip: 'Long stainless steel tongs for safe drop and pickup in hot oil',
    },
    {
      id: 'colander',
      name: 'Draining Colander',
      measure: 'Paper Towel Lined',
      img: '/assets/colander_fried_crackers_draining.png',
      fallbackIcon: '🥣',
      isUsed: fryStep >= 6,
      isNext: fryStep === 4,
      tooltip: 'Perforated colander to drain surface oil quickly',
    },
    {
      id: 'platter',
      name: 'Presentation Platter',
      measure: 'Finished Batch Platter',
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      isUsed: fryStep >= 6,
      isNext: fryStep === 5,
      tooltip: 'Cooled, crunchy, golden crackers ready for packaging',
    },
  ];

  return (
    <div className="workstation-scene frying-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '980px' }}>
          {/* Left Side: Temperature Thermometer & Fry Status */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🌡️ Oil Thermometer</span>
              <span className={`station-badge-mini ${oilTemp >= 175 ? 'badge-success' : 'badge-pending'}`}>
                {oilTemp >= 175 ? '180°C Ready' : `${oilTemp}°C`}
              </span>
            </div>

            <div className="thermometer-card-box" style={{ marginTop: '12px' }}>
              <div className="thermo-label">Frying Oil Temperature:</div>
              <div className="thermo-value" style={{ fontSize: '2rem', fontWeight: 800, color: oilTemp >= 175 ? '#10b981' : '#f59e0b' }}>
                {oilTemp}°C
              </div>
              <div className="progress-bar-bg" style={{ margin: '8px 0' }}>
                <div
                  className={`progress-bar-fill ${oilTemp >= 175 ? 'temp-optimal' : 'temp-heating'}`}
                  style={{ width: `${(oilTemp / 200) * 100}%` }}
                />
              </div>
              <span className="thermo-sub" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {oilTemp < 175 ? 'Heating up burner...' : oilTemp <= 185 ? '✨ Optimal Green Zone (180°C)' : 'Too Hot (Smoking)!'}
              </span>
            </div>

            <div className="spec-point" style={{ marginTop: '16px' }}>
              <strong>Flash Frying Duration:</strong>
              <p>Exactly 10 seconds. Rapid expansion occurs instantaneously.</p>
            </div>
          </div>

          {/* Center: Multi-State Frying Wok */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="wok"
              title="Deep Frying Heavy Wok"
              subtitle="180°C Thermal Flash Expansion (10 Seconds)"
              currentStepIndex={fryStep}
              steps={wokSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={fryStep >= 2 && fryStep < 4 ? 'sizzling' : null}
              containerWidth="380px"
              containerHeight="260px"
              interactiveAction={
                fryStep === 1
                  ? {
                      label: isHeatingOil ? `Preheating... ${oilTemp}°C` : '🔥 Preheat Oil to 180°C',
                      onClick: handlePreheatOil,
                      disabled: isHeatingOil,
                    }
                  : fryStep === 3
                  ? {
                      label: `Flash Puffing... ${puffProgress}% (10s)`,
                      disabled: true,
                    }
                  : fryStep === 4
                  ? {
                      label: '🥢 Scoop into Colander to Drain Oil',
                      onClick: handleLiftToDrain,
                      icon: '🥣',
                    }
                  : fryStep === 5
                  ? {
                      label: '✨ Transfer to Cooled Serving Platter',
                      onClick: handleTransferToPlatter,
                      icon: '✨',
                    }
                  : null
              }
            />
          </div>

          {/* Right Side: Science Concept Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🔬 Aeration Physics</span>
            </div>
            <div className="specs-card-content">
              <div className="spec-point">
                <strong>10-Second Expansion:</strong>
                <p>Because residual moisture is under 8%, steam forms instantly upon contact with 180°C oil. Frying longer than 10 seconds causes oil absorption and darkening!</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px' }}>
                <strong>Colander Drainage:</strong>
                <p>Draining immediately in a colander lined with paper towels ensures a light, non-greasy texture with maximum crispness.</p>
              </div>
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
