import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const Mission1Prep = () => {
  const { setScene, addScore, speak, showToast, completeMission } = useGame();

  const [prepStep, setPrepStep] = useState(0); // 0: Put ubod on board, 1: Slice with knife, 2: Transfer to bowl, 3: Completed
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    speak(
      'Stage 1: Raw Material Preparation! First, we need to place our clean, raw Coconut Pith (Ubod) onto the cutting board.',
      'neutral',
      {
        badge: 'Stage 1: Prep & Slicing',
        hint: 'Drag the Raw Coconut Pith onto the wooden cutting board (or tap it, then tap the board).',
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

  const handleBoardClick = () => {
    if (!selectedItem) {
      soundManager.playError();
      showToast('Need an Item!', 'Select an item from the tray first.', 'warning');
      return;
    }

    if (prepStep === 0) {
      if (selectedItem.id === 'raw_ubod') {
        soundManager.playPour();
        setPrepStep(1);
        setSelectedItem(null);
        showToast('Placed on Board!', 'Now select the Chef Knife to slice.', 'success');
        speak(
          'Good! Now use the Chef Knife to slice the tough fibers of the ubod into uniform cubes so they cook evenly during boiling.',
          'thinking',
          {
            badge: 'Slicing Step',
            hint: 'Drag the Chef Knife onto the cutting board.',
            hideButton: true,
          }
        );
      } else {
        soundManager.playError();
        showToast('Wrong Item!', 'Place the Coconut Pith on the board first.', 'danger');
      }
    } else if (prepStep === 1) {
      if (selectedItem.id === 'chef_knife') {
        soundManager.playChop();
        addScore(25);
        setPrepStep(2);
        setSelectedItem(null);
        showToast('Uniformly Sliced!', '+25 Points earned.', 'success');
        speak(
          'Excellent knife work! The coconut pith is now cut into uniform pieces. Now transfer the sliced pieces into the stainless steel Prep Bowl!',
          'happy',
          {
            badge: 'Transfer Step',
            hint: 'Tap the Sliced Ubod on the board, then tap the Prep Bowl.',
            hideButton: true,
          }
        );
      } else {
        soundManager.playError();
        showToast('Wrong Tool!', 'Use the Chef Knife to cut the pith.', 'danger');
      }
    }
  };

  const handleBowlClick = () => {
    if (prepStep === 3) {
      soundManager.playSuccess();
      speak(
        'Fantastic! All 200g of sliced ubod are prepped in the bowl. Ready to soften them with heat in Stage 2: Boiling!',
        'happy',
        {
          badge: 'Stage 1 Cleared',
          btnText: 'Proceed to Stage 2: Boiling ➔',
          onNext: () => setScene('mission2'),
        }
      );
      return;
    }

    if (prepStep === 2) {
      soundManager.playPour();
      soundManager.playSuccess();
      addScore(25);
      setPrepStep(3);
      completeMission('mission1');
      showToast('Stage 1 Complete!', '+25 Points! Ready for boiling.', 'success');
      speak(
        'Fantastic! All 200g of sliced ubod are prepped in the bowl. Ready to soften them with heat in Stage 2: Boiling!',
        'happy',
        {
          badge: 'Stage 1 Cleared',
          btnText: 'Proceed to Stage 2: Boiling ➔',
          onNext: () => setScene('mission2'),
        }
      );
    }
  };

  return (
    <div className="workstation-scene stage-1-bg">
      <div className="workstation-overlay" />
      <div className="stage-center-zone">
        <div className="active-vessel-card prep-workstation">
          <div className="vessel-header">
            <span className="vessel-title">🪵 Prep Counter: Slicing Station</span>
            <span className="vessel-badge">Step {Math.min(prepStep + 1, 3)} of 3</span>
          </div>

          <div className="prep-workspace-layout">
            {/* The Cutting Board Dropzone */}
            <div
              className={`dropzone cutting-board-zone ${selectedItem ? 'highlight-ready' : ''}`}
              onClick={handleBoardClick}
              title="Cutting Board"
            >
              <img src="/images/cutting_board.png" alt="Cutting Board" className="board-backdrop-img" />
              <div className="board-overlay-content">
                {prepStep === 0 && (
                  <div className="zone-placeholder">
                    <span className="zone-hint-text">Tap or Drag Raw Ubod here</span>
                  </div>
                )}
                {prepStep === 1 && (
                  <div className="on-board-item pop-in">
                    <img src="/images/icon_coconut_pith.png" alt="Raw Pith" className="board-ingredient-img" />
                    <span className="board-item-label">Raw Coconut Pith (200g)</span>
                    <span className="action-hint-glow">Needs Slicing 🔪</span>
                  </div>
                )}
                {prepStep === 2 && (
                  <div className="on-board-item pop-in" onClick={handleBowlClick}>
                    <img src="/images/icon_sliced_ubod.png" alt="Sliced Pith" className="board-ingredient-img sliced" />
                    <span className="board-item-label">✓ Sliced Ubod Cubes</span>
                    <span className="action-hint-glow">Tap to Move to Bowl ➔</span>
                  </div>
                )}
                {prepStep === 3 && (
                  <div className="zone-placeholder">
                    <span className="zone-hint-text board-cleared">✓ Board Cleared</span>
                  </div>
                )}
              </div>
            </div>

            {/* The Prep Bowl Receiving Vessel */}
            <div
              className={`prep-bowl-zone ${prepStep === 2 ? 'glow-target' : ''} ${prepStep === 3 ? 'filled' : ''}`}
              onClick={handleBowlClick}
              title="Stainless Steel Prep Bowl"
            >
              <div className="bowl-graphic">
                <img
                  src={prepStep === 3 ? '/images/icon_prep_bowl_filled.png' : '/images/icon_prep_bowl.png'}
                  alt={prepStep === 3 ? 'Filled Prep Bowl' : 'Stainless Steel Prep Bowl'}
                  className={`prep-bowl-img ${prepStep === 3 ? 'bowl-filled-anim' : ''}`}
                />
                {prepStep === 3 ? (
                  <div className="bowl-filled-badge pop-in" onClick={(e) => e.stopPropagation()}>
                    <span>✓ Filled: 200g Sliced Ubod</span>
                    <button
                      className="btn-gold btn-next-stage pulse"
                      onClick={() => {
                        soundManager.playClick();
                        setScene('mission2');
                      }}
                    >
                      Proceed to Stage 2: Boiling ➔
                    </button>
                  </div>
                ) : (
                  <span className="bowl-subtext">Stainless Prep Bowl</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Shelf */}
      <div className="inventory-tray">
        <div className="tray-title-bar">
          <span className="tray-label">🧰 Station Inventory:</span>
          <span className="tray-hint">Click an item, then click the target workstation</span>
        </div>
        <div className="items-carousel">
          <div
            className={`drag-card ${selectedItem?.id === 'raw_ubod' ? 'selected-tap' : ''} ${prepStep > 0 ? 'used' : ''}`}
            onClick={() => prepStep === 0 && handleItemClick({ id: 'raw_ubod', name: 'Raw Ubod' })}
          >
            <img src="/images/icon_coconut_pith.png" alt="Raw Ubod" className="card-icon-img" />
            <span className="card-title">Raw Ubod</span>
            <span className="card-measure">200g</span>
          </div>

          <div
            className={`drag-card ${selectedItem?.id === 'chef_knife' ? 'selected-tap' : ''} ${prepStep !== 1 ? 'used' : ''}`}
            onClick={() => prepStep === 1 && handleItemClick({ id: 'chef_knife', name: 'Chef Knife' })}
          >
            <img src="/images/icon_chef_knife.png" alt="Chef Knife" className="card-icon-img" />
            <span className="card-title">Chef Knife</span>
            <span className="card-measure">Sanitized</span>
          </div>

          <div className="drag-card used">
            <img src="/images/icon_tapioca_starch.png" alt="Starch" className="card-icon-img" />
            <span className="card-title">Starch</span>
            <span className="card-measure">Stage 3</span>
          </div>
        </div>
      </div>

    </div>
  );
};
