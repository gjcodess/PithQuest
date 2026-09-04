import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const Mission5Frying = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, recordMistake } = useGame();

  const [fryStep, setFryStep] = useState(0); // 0: Heat oil, 1: Drop chips, 2: Puffing & sizzling, 3: Scoop with skimmer, 4: Done
  const [oilTemp, setOilTemp] = useState(120); // Target: 180°C (Green zone 175-190°C)
  const [isHeating, setIsHeating] = useState(false);
  const [crackersPuffed, setCrackersPuffed] = useState(false);

  useEffect(() => {
    speak(
      'Stage 5: The Grand Finale (Deep Frying)! When dried pellets enter hot oil at 180°C, trapped micro-moisture flashes into steam, instantly puffing the starch matrix into golden, crispy crackers.',
      'neutral',
      {
        badge: 'Stage 5: Deep Frying',
        hint: 'Click the Burner Control to heat the cooking oil to 180°C.',
        hideButton: true,
      }
    );
  }, []);

  const handleStartHeating = () => {
    if (fryStep !== 0) return;
    soundManager.playClick();
    setIsHeating(true);
    showToast('Oil Heating Up', 'Watch the oil thermometer.', 'warning');
  };

  // Temperature rise loop
  useEffect(() => {
    let interval;
    if (isHeating && fryStep === 0) {
      interval = setInterval(() => {
        setOilTemp((prev) => {
          if (prev >= 185) {
            setIsHeating(false);
            setFryStep(1);
            soundManager.playSuccess();
            showToast('Optimal 180°C Reached!', 'Click or drop the dried pellets into the oil!', 'success');
            speak(
              'Oil is at the optimal 180°C frying temperature! Tap the Dried Pellets on the tray to drop them into the sizzling wok!',
              'happy',
              {
                badge: 'Thermal Optimum',
                hint: 'Tap Dried Pellets to drop into oil.',
                hideButton: true,
              }
            );
            return 185;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isHeating, fryStep]);

  const handleDropPellets = () => {
    if (fryStep !== 1) return;

    soundManager.playSizzle();
    setFryStep(2);
    setCrackersPuffed(true);
    showToast('Flash Puffing!', 'Steam expansion in action!', 'success');

    setTimeout(() => {
      soundManager.playSuccess();
      setFryStep(3);
      speak(
        'Look at that instant 3x expansion! Now click the Spider Skimmer to scoop the golden crackers onto the paper-towel cooling rack.',
        'happy',
        {
          badge: 'Scoop & Drain',
          hint: 'Click the Spider Skimmer to drain excess oil.',
          hideButton: true,
        }
      );
    }, 2000);
  };

  const handleScoopSkimmer = () => {
    if (fryStep !== 3) return;

    soundManager.playCrunch();
    soundManager.playFanfare();
    addScore(50);
    unlockBadge('golden_crunch_master', 'Master of the Golden Crunch', '👑');
    setFryStep(4);
    completeMission('mission5');
    showToast('Cracker Master!', '+50 Points! Golden, crispy batch complete.', 'success');
    speak(
      'Outstanding culinary execution! The Coconut Pith Crackers are light, bubbly, golden, and drained dry of excess oil. You have completed the entire food processing sequence!',
      'happy',
      {
        badge: 'All Missions Cleared',
        btnText: 'Proceed to Sensory & Certification ➔',
        onNext: () => setScene('evaluation'),
      }
    );
  };

  return (
    <div className="workstation-scene">
      <div className="workstation-overlay" />
      <div className="stage-center-zone">
        <div className="active-vessel-card frying-workstation">
          <div className="vessel-header">
            <span className="vessel-title">🍳 Deep Frying Wok: Thermal Expansion</span>
            <span className="vessel-badge">Pillar 3: Frying</span>
          </div>

          <div className="frying-station-layout">
            {/* The Wok / Frying Vessel */}
            <div
              className={`dropzone wok-zone ${fryStep === 1 ? 'highlight-ready' : ''} ${fryStep >= 2 ? 'sizzling-wok' : ''}`}
              onClick={fryStep === 1 ? handleDropPellets : fryStep === 3 ? handleScoopSkimmer : null}
            >
              <div className="wok-graphic">
                <span className="wok-rim">🥘</span>

                {fryStep === 0 && (
                  <div className="oil-heating-prompt" onClick={handleStartHeating}>
                    <span className="oil-temp-badge">Oil Temp: {oilTemp}°C</span>
                    <button className="btn-gold btn-heat-oil">
                      🔥 {isHeating ? 'Heating Oil...' : 'Click to Heat Oil to 180°C'}
                    </button>
                  </div>
                )}

                {fryStep === 1 && (
                  <div className="oil-ready-alert pop-in">
                    <span className="temp-ready">✓ 180°C Ready!</span>
                    <p>Tap here or tap tray to drop chips</p>
                  </div>
                )}

                {fryStep >= 2 && (
                  <div className="puffing-animation-container">
                    <div className="sizzle-bubbles">
                      <span className="bubble">🫧</span>
                      <span className="bubble">🫧</span>
                      <span className="bubble">🫧</span>
                    </div>

                    <div className={`crackers-in-oil ${crackersPuffed ? 'puffed-up' : ''}`}>
                      <img src="/assets/crackers_sample.jpg" alt="Puffed Crackers" className="puffed-cracker-img" />
                      <span className="puff-multiplier-tag">3x Starch Expansion! ✨</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Frying Tools Panel */}
            <div className="frying-tools-sidebar">
              <div className="thermometer-gauge">
                <span className="thermometer-icon">🌡️</span>
                <div className="therm-bar">
                  <div className="therm-target-band" style={{ bottom: '70%', height: '15%' }} />
                  <div className="therm-fill" style={{ height: `${(oilTemp / 220) * 100}%` }} />
                </div>
                <span className="therm-readout">{oilTemp}°C</span>
                <span className="therm-sub">Target: 180°C</span>
              </div>

              {fryStep >= 3 && (
                <div className="skimmer-tool-box pop-in" onClick={handleScoopSkimmer}>
                  <span className="skimmer-icon">🕸️</span>
                  <button className="btn-primary btn-skimmer">Scoop with Skimmer!</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Shelf */}
      <div className="inventory-tray">
        <div className="tray-title-bar">
          <span className="tray-label">🧰 Frying Supplies:</span>
          <span className="tray-hint">Click dried pellets when oil is 180°C</span>
        </div>
        <div className="items-carousel">
          <div
            className={`drag-card ${fryStep === 1 ? 'selected-tap pulse' : ''} ${fryStep > 1 ? 'used' : ''}`}
            onClick={fryStep === 1 ? handleDropPellets : null}
          >
            <span className="card-icon-emoji">✨</span>
            <span className="card-title">Dried Pellets</span>
            <span className="card-measure">Glassy 9%</span>
          </div>

          <div className="drag-card used">
            <span className="card-icon-emoji">🌻</span>
            <span className="card-title">Cooking Oil</span>
            <span className="card-measure">500ml in Wok</span>
          </div>
        </div>
      </div>
    </div>
  );
};
