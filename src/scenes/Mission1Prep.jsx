import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission, holdingItem, setHoldingItem, unlockBadge } = useGame();

  // Wash step: 0: raw ubod in colander, 1: washed ubod
  const [isWashed, setIsWashed] = useState(false);
  // Pot state: 0: empty, 1: +ubod, 2: +water, 3: +salt, 4: boiling, 5: drained
  const [potStep, setPotStep] = useState(0);
  const [isBoilingTimerActive, setIsBoilingTimerActive] = useState(false);
  const [boilProgress, setBoilProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 1: Washing & Pre-Cooking! First, wash the cut raw coconut pith under running potable water to remove surface dirt and starch residues.',
      'neutral',
      {
        badge: 'Stage 1: Washing',
        hint: 'Tap "Wash Ubod" under the sink, then pick up the clean washed ubod.',
        hideButton: true,
      }
    );
  }, []);

  // MultiStateContainer step configurations
  const potSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['washed_ubod'],
      prompt: 'Add washed ubod strips into the empty stockpot',
      img: '/assets/pot_empty.png',
      fallbackIcon: '🫕',
      label: 'Empty Stockpot',
    },
    {
      stepIndex: 1,
      acceptedItems: ['water_pitcher', 'water'],
      prompt: 'Pour clean potable water to submerge the ubod',
      img: '/assets/pot_with_ubod.png',
      fallbackIcon: '🥣',
      label: 'Stockpot with Ubod',
    },
    {
      stepIndex: 2,
      acceptedItems: ['sea_salt', 'salt'],
      prompt: 'Add sea salt into the pot for moisture regulation & seasoning',
      img: '/assets/pot_with_ubod_water_salt.png',
      fallbackIcon: '🧂',
      label: 'Submerged Ubod + Salt',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Ignite stove burner to bring water to a rolling boil',
      img: '/assets/pot_boiling_on_stove.png',
      fallbackIcon: '♨️',
      label: 'Rolling Boil (100°C)',
    },
    {
      stepIndex: 4,
      acceptedItems: ['colander'],
      prompt: 'Drain boiled ubod into colander to remove water and steam-cool',
      img: '/assets/colander_boiled_ubod_draining.png',
      fallbackIcon: '🍲',
      label: 'Fork-Tender Boiled Ubod',
    },
  ];

  const handleWashUbod = () => {
    soundManager.playPour();
    setIsWashed(true);
    addScore(20);
    showToast('Ubod Washed!', 'Raw coconut pith is now sanitized and ready for boiling (+20 pts)', 'success');
    speak(
      'Great job! The ubod is washed and clean. Now tap or drag the Washed Ubod into the empty stockpot!',
      'happy',
      {
        badge: 'Submerge in Pot',
        hint: 'Click "Washed Ubod" in inventory, then drop into the stockpot.',
        hideButton: true,
      }
    );
  };

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && item.id === 'washed_ubod') {
      soundManager.playPour();
      setPotStep(1);
      addScore(20);
      showToast('Ubod Added!', 'Now pour clean potable water to submerge the ubod.', 'success');
      speak(
        'Excellent! Coconut pith is loaded. Now pick up the Water Pitcher and pour clean water until the ubod is fully submerged.',
        'neutral',
        {
          badge: 'Water Hydration',
          hint: 'Select the Water Pitcher and drop it into the stockpot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'water_pitcher' || item.id === 'water')) {
      soundManager.playPour();
      setPotStep(2);
      addScore(20);
      showToast('Water Added!', 'Now add Sea Salt to season and regulate osmotic moisture.', 'success');
      speak(
        'Perfect liquid level! Now add measured Pure Sea Salt into the pot.',
        'neutral',
        {
          badge: 'Salting Step',
          hint: 'Select Sea Salt and drop it into the pot.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'sea_salt' || item.id === 'salt')) {
      soundManager.playClick();
      setPotStep(3);
      addScore(20);
      showToast('Salt Added!', 'Pot is ready! Ignite the high heat burner.', 'success');
      speak(
        'All ingredients are in the pot! Press the "Ignite Burner" button to bring the water to a rolling boil until the ubod is fork-tender.',
        'thinking',
        {
          badge: 'Thermal Softening',
          hint: 'Click the "Ignite High Heat Burner" button on the workstation.',
          hideButton: true,
        }
      );
    }
  };

  const handleIgniteBurner = () => {
    soundManager.playBoil();
    setIsBoilingTimerActive(true);
    showToast('Burner Ignited!', 'Water reaching 100°C rolling boil...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBoilProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsBoilingTimerActive(false);
        setPotStep(4);
        soundManager.playSuccess();
        addScore(30);
        showToast('Boiling Complete!', 'Ubod fibers are fork-tender and translucent (+30 pts)', 'success');
        speak(
          'Boiling complete! The tough cellulose fibers have softened into translucent, tender pieces. Now use the colander to drain all boiling liquid.',
          'happy',
          {
            badge: 'Drain & Cool',
            hint: 'Select the Colander and drop it into the pot (or tap Drain).',
            hideButton: true,
          }
        );
      }
    }, 600);
  };

  const handleDrainUbod = () => {
    soundManager.playPour();
    setPotStep(5);
    addScore(30);
    unlockBadge('boil_master', 'Thermal Softening Specialist', '🫕');
    completeMission('mission1');
    showToast('Drained & Cooled!', 'Boiled ubod drained in colander (+30 pts)', 'success');
    speak(
      'Outstanding! The boiled ubod is drained and cooling. The softened fibers are now ready for food processing into a fine paste!',
      'happy',
      {
        badge: 'Stage 1 Complete',
        btnText: 'Proceed to Stage 2: Food Processing ➔',
        onNext: () => setScene('mission2'),
      }
    );
  };

  return (
    <div className="workstation-scene prep-scene">
      <div className="workstation-overlay" />

      {/* Main Countertop Layout */}
      <div className="stage-content-row">
        {/* Left Side: Washing Station */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🚰 Washing Station</span>
          </div>
          <div className="sink-box">
            <div className="sink-colander-preview">
              <img
                src={isWashed ? '/assets/sink_colander_washing.png' : '/assets/sink_colander_ubod.png'}
                alt="Sink Colander"
                className="sink-preview-img"
                style={{ width: '110px', height: '90px', objectFit: 'contain' }}
              />
              <div className={`sink-ubod-item ${isWashed ? 'washed' : ''}`}>
                <span>{isWashed ? '✨ Washed Ubod' : '🌿 Cut Raw Ubod'}</span>
              </div>
            </div>
            {!isWashed ? (
              <button className="btn-wash-action" onClick={handleWashUbod}>
                <span>💧 Wash Ubod Under Faucet</span>
              </button>
            ) : (
              <div
                className={`inventory-draggable-pill ${holdingItem?.id === 'washed_ubod' ? 'active-held' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setHoldingItem(holdingItem?.id === 'washed_ubod' ? null : { id: 'washed_ubod', name: 'Washed Ubod', img: '/assets/portion_ubod_raw_1cup.png', icon: '🥥' });
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'washed_ubod', name: 'Washed Ubod' }));
                }}
              >
                <img src="/assets/portion_ubod_raw_1cup.png" alt="Washed Ubod" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <span>Washed Ubod (Ready)</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Multi-State Stockpot Workstation */}
        <div className="station-center-card">
          <MultiStateContainer
            containerId="stockpot"
            title="Stainless Steel Boiling Pot"
            subtitle="Thermal softening on gas burner"
            currentStepIndex={potStep}
            steps={potSteps}
            onItemAccepted={handleItemAccepted}
            activeAnimation={isBoilingTimerActive ? 'boiling' : potStep === 4 ? 'steaming' : null}
            containerWidth="380px"
            containerHeight="260px"
            interactiveAction={
              potStep === 3
                ? {
                    label: isBoilingTimerActive ? `Boiling... ${boilProgress}%` : '🔥 Ignite Burner (High Heat)',
                    onClick: handleIgniteBurner,
                    disabled: isBoilingTimerActive,
                  }
                : potStep === 4
                ? {
                    label: '🥣 Drain Boiled Ubod into Colander',
                    onClick: handleDrainUbod,
                    icon: '🥣',
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Ingredient & Tool Dispensers */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>📦 Station Inventory</span>
          </div>
          <div className="inventory-vertical-list">
            {/* Water Pitcher */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'water_pitcher' ? 'active-held' : ''} ${potStep === 1 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'water_pitcher' ? null : { id: 'water_pitcher', name: 'Water Pitcher', img: '/assets/portion_water_1cup.png', icon: '💧' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'water_pitcher', name: 'Water Pitcher' }));
              }}
            >
              <img src="/assets/portion_water_1cup.png" alt="Water" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Potable Water</strong>
                <span>4 Cups for Submerging</span>
              </div>
            </div>

            {/* Pure Sea Salt */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'sea_salt' ? 'active-held' : ''} ${potStep === 2 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'sea_salt' ? null : { id: 'sea_salt', name: 'Pure Sea Salt', img: '/assets/portion_salt_1tsp.png', icon: '🧂' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'sea_salt', name: 'Pure Sea Salt' }));
              }}
            >
              <img src="/assets/portion_salt_1tsp.png" alt="Salt" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Pure Sea Salt</strong>
                <span>Seasoning & Osmosis</span>
              </div>
            </div>

            {/* Colander for draining */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'colander' ? 'active-held' : ''} ${potStep === 4 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'colander' ? null : { id: 'colander', name: 'Stainless Colander', img: '/assets/tool_colander_safe.png', icon: '🥣' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'colander', name: 'Stainless Colander' }));
              }}
            >
              <img src="/assets/tool_colander_safe.png" alt="Colander" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Stainless Colander</strong>
                <span>For Water Drainage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
