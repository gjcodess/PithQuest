import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { InventoryTray } from '../components/InventoryTray';

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
        hint: 'Pick up the Dough Portion (3 tsp) from your bottom shelf and drop or click on an empty rectangular mold cavity.',
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

  const moldPreviewImg = isCompleted
    ? '/assets/molder_completely_filled.png'
    : filledCount > 0
    ? '/assets/molder_partially_filled.png'
    : '/assets/molder_empty.png';

  const stage4Inventory = [
    {
      id: 'dough_portion',
      name: '3 tsp Dough Portion',
      measure: 'Exact 3 tsp (Level)',
      img: '/assets/tool_measuring_spoons.png',
      fallbackIcon: '🧈',
      isUsed: isCompleted,
      isNext: !isCompleted && filledCount < 3,
      tooltip: 'Standardized 3 teaspoon measuring spoon portion',
    },
    {
      id: 'dough_bowl',
      name: 'Cracker Dough',
      measure: 'Formulated Matrix',
      img: '/assets/mixing_bowl_dough_uniform.png',
      fallbackIcon: '🥯',
      isUsed: isCompleted,
      isNext: false,
      tooltip: 'Elastic pliable coconut pith dough',
    },
    {
      id: 'silicone_mold_tool',
      name: 'Silicone Mold',
      measure: '24 Cavities Grid',
      img: '/assets/tool_silicone_molder_pink.png',
      fallbackIcon: '🌸',
      isUsed: false,
      isNext: false,
      tooltip: 'Food-grade pink silicone baking mold with 24 bar cavities',
    },
    {
      id: 'target_wafer',
      name: 'Wafer Spec',
      measure: '50mm x 25mm Target',
      img: '/assets/cracker_piece_unmolded.png',
      fallbackIcon: '📐',
      isUsed: false,
      isNext: false,
      tooltip: 'Uniform 50x25mm rectangular wafer target specification',
    },
    {
      id: 'mold_state',
      name: 'Mold Fill Level',
      measure: filledCount === 0 ? 'Empty (0/24)' : filledCount === 1 ? '1 Cavity Filled' : filledCount < 24 ? `${filledCount}/24 Filled` : 'Complete (24/24)',
      img: filledCount === 0 ? '/assets/molder_empty.png' : filledCount === 1 ? '/assets/molder_single_piece.png' : filledCount < 24 ? '/assets/molder_partially_filled.png' : '/assets/molder_completely_filled.png',
      fallbackIcon: '🧈',
      isUsed: filledCount >= 24,
      isNext: filledCount >= 3 && filledCount < 24,
      tooltip: 'Real-time silicone molder cavity state',
    },
  ];

  return (
    <div className="workstation-scene molding-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '940px' }}>
          {/* Center: Pink 24-Slot Rectangular Silicone Mold */}
          <div className="station-center-card" style={{ flex: '1 1 560px' }}>
            <div className="silicone-mold-container">
              <div className="mold-header-bar">
                <h4>🌸 24-Cavity Rectangular Silicone Mold</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {filledCount >= 3 && !isCompleted && (
                    <button
                      className="btn-primary btn-quick-fill"
                      onClick={handleQuickFill}
                      disabled={isQuickFilling}
                      style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                    >
                      <span>⚡ Fill Remaining Tray</span>
                    </button>
                  )}
                  <span className="mold-badge">{filledCount}/24 Filled</span>
                </div>
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

          {/* Right Side: Standards & Inspection Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>📏 Quality Specs</span>
            </div>
            <div className="specs-card-content">
              <div className="spec-point">
                <strong>Uniformity:</strong>
                <p>Uniform thickness ensures every cracker dries at the exact same rate during the 12-hour dehydration.</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px' }}>
                <strong>Standard Portion:</strong>
                <p>3 Teaspoons produces approximately 50mm x 25mm rectangular wafers.</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px', textAlign: 'center' }}>
                <img src="/assets/cracker_piece_unmolded.png" alt="Target Wafer" style={{ width: '70px', height: '40px', objectFit: 'contain', margin: '6px auto' }} />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Target Wafer Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 4 Portioning Tools & Mold State"
        items={stage4Inventory}
      />
    </div>
  );
};

