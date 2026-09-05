import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission7Frying = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Frying states:
  // 0: Empty wok on stove -> accept cooking_oil
  // 1: Wok with oil -> action: heat oil to 180°C (medium heat)
  // 2: Hot oil ready (shimmering) -> accept dehydrated_pellets
  // 3: 10-Second Flash Puffing Animation (expansion from hard pellet to airy cracker)
  // 4: Golden puffed crackers floating -> action: scoop into colander to drain
  // 5: Complete
  const [fryStep, setFryStep] = useState(0);
  const [oilTemp, setOilTemp] = useState(25);
  const [isHeatingOil, setIsHeatingOil] = useState(false);
  const [isPuffing, setIsPuffing] = useState(false);
  const [puffProgress, setPuffProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 7: Deep Frying & Oil Draining! Pour 5 cups of Baguio Orchids Vegetable Oil into the deep wok, preheat to medium heat (~180°C), and drop the chips for a 10-second rapid flash puff!',
      'neutral',
      {
        badge: 'Stage 7: Flash Frying',
        hint: 'First, pour the Vegetable Cooking Oil into the empty wok.',
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
      acceptedItems: ['dehydrated_pellets', 'pellets'],
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
      acceptedItems: ['skimmer', 'colander'],
      prompt: 'Scoop golden puffed crackers with skimmer into colander to drain oil',
      img: '/assets/colander_fried_crackers_draining.png',
      fallbackIcon: '✨',
      label: 'Puffed Ubod Crackers (Ready)',
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
    } else if (stepIndex === 2 && (item.id === 'dehydrated_pellets' || item.id === 'pellets')) {
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
            '10 seconds exactly! The crackers have fully expanded into light, golden wafers with thousands of micro-air pockets. Scoop them with the spider skimmer into the colander to drain surface oil!',
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
          'Target temperature reached: 180°C! Now pick up the Dehydrated Pellets with tongs and drop them into the hot shimmering oil.',
          'happy',
          {
            badge: '180°C Ready',
            hint: 'Select Dehydrated Pellets and drop into the wok.',
            hideButton: true,
          }
        );
      }
    }, 400);
  };

  const handleDrainOil = () => {
    soundManager.playClick();
    setFryStep(5);
    addScore(35);
    unlockBadge('puff_master', 'Aeration Expansion Master', '🍳');
    completeMission('mission7');
    showToast('Crackers Drained!', 'Oil drained in colander lined with paper towels (+35 pts)', 'success');
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

  return (
    <div className="workstation-scene frying-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Ingredients & Temperature Thermometer */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🫗 Frying Medium & Pellets</span>
          </div>
          <div className="inventory-vertical-list">
            {/* Oil */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'cooking_oil' ? 'active-held' : ''} ${fryStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'cooking_oil' ? null : { id: 'cooking_oil', name: 'Vegetable Oil', img: '/assets/portion_oil_5cups.png', icon: '🫗' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'cooking_oil', name: 'Vegetable Oil' }));
              }}
            >
              <img src="/assets/portion_oil_5cups.png" alt="Vegetable Oil" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Vegetable Oil</strong>
                <span>5 Cups (Deep Frying)</span>
              </div>
            </div>

            {/* Pellets */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'dehydrated_pellets' ? 'active-held' : ''} ${fryStep === 2 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'dehydrated_pellets' ? null : { id: 'dehydrated_pellets', name: 'Dehydrated Pellets', img: '/assets/tongs_holding_chip.png', icon: '🧈' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'dehydrated_pellets', name: 'Dehydrated Pellets' }));
              }}
            >
              <img src="/assets/tongs_holding_chip.png" alt="Tongs with Pellets" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Dehydrated Pellets</strong>
                <span>Hard Translucent Chips</span>
              </div>
            </div>

            {/* Thermometer Display */}
            <div className="thermometer-card-box">
              <div className="thermo-label">Oil Temperature:</div>
              <div className="thermo-value">{oilTemp}°C</div>
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${oilTemp >= 175 ? 'temp-optimal' : 'temp-heating'}`}
                  style={{ width: `${(oilTemp / 200) * 100}%` }}
                />
              </div>
              <span className="thermo-sub">
                {oilTemp < 175 ? 'Heating up...' : oilTemp <= 185 ? '✨ Optimal Green Zone (180°C)' : 'Too Hot (Smoking)!'}
              </span>
            </div>
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
                    label: '🥣 Scoop into Colander to Drain Oil',
                    onClick: handleDrainOil,
                    icon: '🥣',
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Science Concept Card */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🔬 Aeration Physics</span>
          </div>
          <div className="specs-card-content">
            <div className="spec-point">
              <strong>10-Second Rule:</strong>
              <p>Because residual moisture is under 8%, steam forms instantly upon contact with 180°C oil. Frying longer than 10 seconds causes oil absorption and darkening!</p>
            </div>
            <div className="spec-point">
              <strong>Colander Drainage:</strong>
              <p>Draining immediately in a colander lined with paper towels ensures a light, non-greasy texture with maximum crispness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
