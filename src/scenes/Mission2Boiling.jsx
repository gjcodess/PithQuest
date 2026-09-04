import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const Mission2Boiling = () => {
  const { setScene, addScore, speak, showToast, completeMission } = useGame();

  const [boilStep, setBoilStep] = useState(0); // 0: Add water, 1: Turn on stove, 2: Add ubod, 3: Boiling gauge, 4: Puree in blender, 5: Done
  const [selectedItem, setSelectedItem] = useState(null);
  const [tenderProgress, setTenderProgress] = useState(0);
  const [isBoiling, setIsBoiling] = useState(false);

  useEffect(() => {
    speak(
      'Stage 2: Thermal Softening (Boiling)! Coconut pith fibers are tough. We must boil them in our stockpot until tender before pureeing.',
      'neutral',
      {
        badge: 'Stage 2: Boiling',
        hint: 'Select the Water Pitcher to fill the stockpot with 500ml water.',
        hideButton: true,
      }
    );
  }, []);

  const handleItemClick = (item) => {
    soundManager.playClick();
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handlePotClick = () => {
    if (boilStep === 0) {
      if (selectedItem?.id === 'water_pitcher') {
        soundManager.playPour();
        setBoilStep(1);
        setSelectedItem(null);
        showToast('Water Added!', 'Now turn on the stove burner flame.', 'success');
        speak(
          'Great! Water is in the pot. Click the burner knob below the stove to ignite the heat and bring it to a boil.',
          'thinking',
          {
            badge: 'Ignition Step',
            hint: 'Click the stove heat control knob.',
            hideButton: true,
          }
        );
      } else {
        soundManager.playError();
        showToast('Add Water First!', 'The pot needs water before heating.', 'danger');
      }
    } else if (boilStep === 2) {
      if (selectedItem?.id === 'sliced_ubod') {
        soundManager.playPour();
        soundManager.playBoil();
        setBoilStep(3);
        setSelectedItem(null);
        setIsBoiling(true);
        showToast('Boiling Ubod!', 'Watch the tenderness gauge.', 'success');
        speak(
          'The sliced ubod is in boiling water! Watch the tenderness gauge. When it hits the green TENDER zone (between 70% and 90%), click STOP BOILING!',
          'neutral',
          {
            badge: 'Boiling Science',
            hint: 'Click the Stop button when the needle reaches the green zone.',
            hideButton: true,
          }
        );
      }
    }
  };

  const handleBurnerToggle = () => {
    if (boilStep === 1) {
      soundManager.playClick();
      soundManager.playBoil();
      setBoilStep(2);
      showToast('Burner Ignited!', 'Now add the sliced ubod into the pot.', 'success');
      speak(
        'The water is heating up! Now select the Sliced Ubod and add it into the boiling stockpot.',
        'thinking',
        {
          badge: 'Add Ingredients',
          hint: 'Select Sliced Ubod from the tray and tap the boiling pot.',
          hideButton: true,
        }
      );
    }
  };

  // Tenderness gauge loop
  useEffect(() => {
    let interval;
    if (isBoiling && boilStep === 3) {
      interval = setInterval(() => {
        setTenderProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isBoiling, boilStep]);

  const handleStopBoil = () => {
    if (boilStep !== 3) return;
    setIsBoiling(false);

    if (tenderProgress >= 65 && tenderProgress <= 95) {
      soundManager.playSuccess();
      addScore(30);
      setBoilStep(4);
      showToast('Perfect Softness!', '+30 Points! Now transfer to the blender.', 'success');
      speak(
        'Perfect tenderness! The cellulose fibers are softened. Now click the Blender to puree the softened ubod into a smooth paste.',
        'happy',
        {
          badge: 'Puree Step',
          hint: 'Click the food processor/blender on the right.',
          hideButton: true,
        }
      );
    } else {
      soundManager.playClick();
      addScore(15);
      setBoilStep(4);
      showToast('Boiled Soft', '+15 Points. Proceeding to pureeing.', 'warning');
    }
  };

  const handleBlenderClick = () => {
    if (boilStep === 5) {
      soundManager.playSuccess();
      speak(
        'Excellent! The ubod is pureed into a smooth, homogenous paste. This will bind flawlessly with our starch and seasonings in Stage 3: Formulation!',
        'happy',
        {
          badge: 'Stage 2 Cleared',
          btnText: 'Proceed to Stage 3: Mixing ➔',
          onNext: () => setScene('mission3'),
        }
      );
      return;
    }

    if (boilStep === 4) {
      soundManager.playPour();
      soundManager.playSuccess();
      addScore(20);
      setBoilStep(5);
      completeMission('mission2');
      showToast('Puree Ready!', '+20 Points! Smooth ubod pulp achieved.', 'success');
      speak(
        'Excellent! The ubod is pureed into a smooth, homogenous paste. This will bind flawlessly with our starch and seasonings in Stage 3: Formulation!',
        'happy',
        {
          badge: 'Stage 2 Cleared',
          btnText: 'Proceed to Stage 3: Mixing ➔',
          onNext: () => setScene('mission3'),
        }
      );
    }
  };

  return (
    <div className="workstation-scene">
      <div className="workstation-overlay" />
      <div className="stage-center-zone">
        <div className="active-vessel-card boiling-workstation">
          <div className="vessel-header">
            <span className="vessel-title">
              <img src="/assets/icon_stockpot.png" alt="" className="vessel-header-icon" />
              Stovetop Station: Boiling & Softening
            </span>
            <span className="vessel-badge">Pillar 1: Boiling</span>
          </div>

          <div className="stovetop-layout">
            {/* The Stockpot */}
            <div
              className={`dropzone stockpot-zone ${selectedItem ? 'highlight-ready' : ''} ${boilStep >= 2 ? 'simmering' : ''}`}
              onClick={handlePotClick}
            >
              {boilStep >= 2 && <div className="steam-particles"><div className="steam" /><div className="steam" /></div>}
              <div className="pot-graphic">
                <img src="/assets/icon_stockpot.png" alt="Stockpot" className="pot-img" />
                {boilStep === 0 && <span className="pot-status-text">Empty Stockpot (Needs Water)</span>}
                {boilStep === 1 && <span className="pot-status-text">Water Added (Needs Heat)</span>}
                {boilStep === 2 && <span className="pot-status-text">Water Boiling 🔥 (Add Ubod)</span>}
                {boilStep === 3 && (
                  <div className="boiling-active-info">
                    <span className="pot-status-text">Boiling Fibers Tender...</span>
                    {/* Tenderness Gauge */}
                    <div className="tenderness-meter">
                      <div className="gauge-track">
                        <div className="gauge-green-zone" style={{ left: '65%', width: '30%' }} />
                        <div className="gauge-fill" style={{ width: `${tenderProgress}%` }} />
                      </div>
                      <span className="gauge-label">{tenderProgress}% Tender (Target: 70-90%)</span>
                    </div>
                    <button className="btn-gold btn-stop-boil" onClick={(e) => { e.stopPropagation(); handleStopBoil(); }}>
                      Stop Boiling!
                    </button>
                  </div>
                )}
                {boilStep >= 4 && <span className="pot-status-text">✓ Softened Ubod Ready</span>}
              </div>

              {/* Burner Toggle Control */}
              <div className="burner-control-panel" onClick={(e) => { e.stopPropagation(); handleBurnerToggle(); }}>
                <div className={`burner-knob ${boilStep >= 2 ? 'flame-on' : ''}`}>
                  <span>🔥</span>
                </div>
                <span className="burner-label">{boilStep >= 2 ? 'Flame ON (100°C)' : 'Click to Ignite'}</span>
              </div>
            </div>

            {/* The Blender / Pureer Appliance */}
            <div
              className={`blender-appliance ${boilStep === 4 ? 'pulse-blender' : ''} ${boilStep >= 5 ? 'blender-ready' : ''}`}
              onClick={handleBlenderClick}
              title="Food Processor / Blender"
            >
              <img src="/assets/icon_blender.png" alt="Puree Blender" className="blender-img" />
              <h4>Puree Blender</h4>
              <p>{boilStep >= 5 ? '✓ Smooth Ubod Pulp' : boilStep === 4 ? 'Tap to Puree Soft Ubod!' : 'Awaiting Boiled Ubod'}</p>
              {boilStep >= 5 && (
                <button
                  className="btn-gold btn-next-stage pulse"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    setScene('mission3');
                  }}
                >
                  Proceed to Stage 3: Mixing ➔
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Tray */}
      <div className="inventory-tray">
        <div className="tray-title-bar">
          <span className="tray-label">Boiling Station Supplies:</span>
          <span className="tray-hint">Click item, then click the stockpot</span>
        </div>
        <div className="items-carousel">
          <div
            className={`drag-card ${selectedItem?.id === 'water_pitcher' ? 'selected-tap' : ''} ${boilStep > 0 ? 'used' : ''}`}
            onClick={() => boilStep === 0 && handleItemClick({ id: 'water_pitcher', name: 'Water' })}
          >
            <img src="/assets/icon_water_pitcher.png" alt="Water Pitcher" className="card-icon-img" />
            <span className="card-title">Water Pitcher</span>
            <span className="card-measure">500ml</span>
          </div>

          <div
            className={`drag-card ${selectedItem?.id === 'sliced_ubod' ? 'selected-tap' : ''} ${boilStep !== 2 ? 'used' : ''}`}
            onClick={() => boilStep === 2 && handleItemClick({ id: 'sliced_ubod', name: 'Sliced Ubod' })}
          >
            <img src="/assets/icon_prep_bowl_filled.png" alt="Sliced Ubod" className="card-icon-img" />
            <span className="card-title">Sliced Ubod</span>
            <span className="card-measure">200g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

