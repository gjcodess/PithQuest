import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

const TOTAL_SLOTS = 24;

export const Mission4Molding = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Array of 24 boolean slots indicating filled cavities
  const [filledSlots, setFilledSlots] = useState(Array(TOTAL_SLOTS).fill(false));
  const [isQuickFilling, setIsQuickFilling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const filledCount = filledSlots.filter(Boolean).length;

  useEffect(() => {
    speak(
      'Stage 4: Portioning & Rectangular Molding! Using our pink silicone mold, portion exactly 3 teaspoons of dough per rectangular cavity to ensure uniform cooking.',
      'neutral',
      {
        badge: 'Stage 4: Molding',
        hint: 'Pick up the Dough Portion (3 tsp) and drop or click on an empty rectangular mold cavity.',
        hideButton: true,
      }
    );
  }, []);

  const handleSlotClick = (index) => {
    if (filledSlots[index]) return;

    soundManager.playSuccess();
    const updated = [...filledSlots];
    updated[index] = true;
    setFilledSlots(updated);
    addScore(15);
    setHoldingItem(null);

    const newFilledCount = updated.filter(Boolean).length;
    showToast('Cavity Filled!', `Slot ${index + 1} filled with 3 tsp portion (${newFilledCount}/24)`, 'success');

    if (newFilledCount === 3) {
      speak(
        'Excellent portion control! Your 3 portions are level and uniform. You can continue filling manually, or click "Fill Remaining Tray" to complete the batch!',
        'happy',
        {
          badge: 'Portioning Mastery',
          hint: 'Click "Fill Remaining Tray" or continue manual placement.',
          hideButton: true,
        }
      );
    } else if (newFilledCount === TOTAL_SLOTS) {
      finishMolding();
    }
  };

  const handleQuickFill = () => {
    soundManager.playFanfare();
    setIsQuickFilling(true);
    showToast('Filling Remaining Cavities...', 'Leveling all 24 portions evenly...', 'info');

    let current = [...filledSlots];
    let idx = 0;
    const interval = setInterval(() => {
      while (idx < TOTAL_SLOTS && current[idx]) {
        idx++;
      }
      if (idx < TOTAL_SLOTS) {
        current[idx] = true;
        setFilledSlots([...current]);
        soundManager.playClick();
        idx++;
      } else {
        clearInterval(interval);
        setIsQuickFilling(false);
        finishMolding();
      }
    }, 80);
  };

  const finishMolding = () => {
    soundManager.playSuccess();
    addScore(50);
    unlockBadge('molding_master', 'Geometric Portioning Master', '🧈');
    completeMission('mission4');
    setIsCompleted(true);
    showToast('Mold Complete!', 'All 24 rectangular cavities filled and leveled (+50 pts)', 'success');
    speak(
      'Superb work! All 24 rectangular crackers are molded to uniform thickness. Now let\'s transfer the tray to our 3-tier aluminum steamer in Stage 5!',
      'happy',
      {
        badge: 'Stage 4 Complete',
        btnText: 'Proceed to Stage 5: Starch Steaming ➔',
        onNext: () => setScene('mission5'),
      }
    );
  };

  return (
    <div className="workstation-scene molding-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Dough Dispenser */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🥯 Dough Portioning</span>
          </div>
          <div className="inventory-vertical-list">
            <div
              className={`dispenser-card ${holdingItem?.id === 'dough_portion' ? 'active-held' : ''} ${filledCount < 3 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'dough_portion' ? null : { id: 'dough_portion', name: '3 tsp Dough Portion', img: '/assets/molder_single_piece.png', icon: '🧈' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'dough_portion', name: '3 tsp Dough Portion' }));
              }}
            >
              <img src="/assets/tool_measuring_spoons.png" alt="3 tsp measure" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Dough Portion</strong>
                <span>Exact 3 Teaspoons (Level)</span>
              </div>
            </div>

            <div className="molding-stats-box">
              <div className="stat-label">Progress:</div>
              <div className="stat-value">{filledCount} / {TOTAL_SLOTS} Slots</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(filledCount / TOTAL_SLOTS) * 100}%` }}
                />
              </div>
            </div>

            {filledCount >= 3 && !isCompleted && (
              <button
                className="btn-primary btn-quick-fill"
                onClick={handleQuickFill}
                disabled={isQuickFilling}
              >
                <span>⚡ Fill Remaining Tray</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Pink 24-Slot Rectangular Silicone Mold */}
        <div className="station-center-card">
          <div className="silicone-mold-container">
            <div className="mold-header-bar">
              <h4>🌸 24-Cavity Rectangular Silicone Mold</h4>
              <span className="mold-badge">{filledCount}/24 Filled</span>
            </div>

            <div className="silicone-grid-24">
              {filledSlots.map((isFilled, idx) => (
                <div
                  key={idx}
                  className={`mold-slot ${isFilled ? 'filled' : 'empty'} ${!isFilled && holdingItem?.id === 'dough_portion' ? 'slot-target' : ''}`}
                  onClick={() => handleSlotClick(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleSlotClick(idx);
                  }}
                  role="button"
                  tabIndex={0}
                  title={`Slot ${idx + 1} (${isFilled ? 'Filled' : 'Empty - Click to place 3 tsp'})`}
                >
                  {isFilled ? (
                    <div className="molded-dough-rect">
                      <span className="rect-texture" />
                    </div>
                  ) : (
                    <span className="empty-slot-plus">+</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mold-footer-bar">
              <span>{filledCount < 3 ? '👉 Place dough in 3 slots to master the portion rule' : '✨ All portions uniform and ready for steam gelatinization'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Standards & Inspection */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>📏 Quality Specs</span>
          </div>
          <div className="specs-card-content">
            <div className="spec-point">
              <strong>Uniformity:</strong>
              <p>Uniform thickness ensures every cracker dries at the exact same rate during the 12-hour dehydration.</p>
            </div>
            <div className="spec-point">
              <strong>Standard Portion:</strong>
              <p>3 Teaspoons produces approximately 50mm x 25mm rectangular wafers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
