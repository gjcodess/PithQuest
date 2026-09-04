import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const Mission3Mixing = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, recordMistake } = useGame();

  const [ingredientsInBowl, setIngredientsInBowl] = useState({
    pulp: false,
    starch: false,
    seasonings: false,
  });

  const [isMixed, setIsMixed] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    speak(
      'Stage 3: Formulation & Mixing! Ubod needs a starch matrix (tapioca starch) to puff, plus savory seasonings. Add Pureed Ubod, Starch, and Seasonings into the mixing bowl.',
      'neutral',
      {
        badge: 'Stage 3: Formulation',
        hint: 'Click an ingredient from the tray, then click the central mixing bowl.',
        hideButton: true,
      }
    );
  }, []);

  const handleItemClick = (item) => {
    if (isMixed) return;
    soundManager.playClick();
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleBowlClick = () => {
    // If dough is already mixed, re-trigger the proceed dialogue safely
    if (isMixed) {
      soundManager.playSuccess();
      speak(
        'Superb mixing! The coconut pith cracker dough is ready. Click below to proceed to Stage 4: Dehydration!',
        'happy',
        {
          badge: 'Stage 3 Cleared',
          btnText: 'Proceed to Stage 4: Dehydration ➔',
          onNext: () => setScene('mission4'),
        }
      );
      return;
    }

    if (!selectedItem) {
      soundManager.playError();
      showToast('Select an Ingredient', 'Pick an ingredient from the bottom shelf.', 'warning');
      return;
    }

    // Check for distractor items
    if (selectedItem.id === 'distractor_vinegar') {
      soundManager.playError();
      recordMistake();
      showToast('Wrong Ingredient!', 'Acid inhibits starch gelatinization!', 'danger');
      speak(
        'Careful! Adding acid (like vinegar) breaks down starch molecules and prevents the crackers from puffing during frying. Stick to our recipe ingredients!',
        'thinking',
        {
          badge: 'Food Chemistry Hint',
          hint: 'Select Pureed Ubod, Starch, or Seasonings.',
          hideButton: true,
        }
      );
      setSelectedItem(null);
      return;
    }

    // Valid ingredients
    if (selectedItem.id === 'pureed_ubod' && !ingredientsInBowl.pulp) {
      soundManager.playPour();
      addScore(15);
      setIngredientsInBowl(prev => ({ ...prev, pulp: true }));
      showToast('Ubod Puree Added!', '+15 Points.', 'success');
    } else if (selectedItem.id === 'tapioca_starch' && !ingredientsInBowl.starch) {
      soundManager.playPour();
      addScore(15);
      setIngredientsInBowl(prev => ({ ...prev, starch: true }));
      showToast('Tapioca Starch Added!', '+15 Points (Puffing Agent).', 'success');
    } else if (selectedItem.id === 'seasonings' && !ingredientsInBowl.seasonings) {
      soundManager.playPour();
      addScore(15);
      setIngredientsInBowl(prev => ({ ...prev, seasonings: true }));
      showToast('Seasonings Added!', '+15 Points (Salt, Garlic, Sugar).', 'success');
    } else {
      showToast('Already Added!', 'This item is already in the bowl.', 'warning');
    }

    setSelectedItem(null);
  };

  const allIngredientsIn = ingredientsInBowl.pulp && ingredientsInBowl.starch && ingredientsInBowl.seasonings;

  useEffect(() => {
    if (allIngredientsIn && !isMixed) {
      speak(
        'All recipe components are inside the bowl! Now click the Spatula to mix and knead everything into a smooth, non-sticky dough.',
        'happy',
        {
          badge: 'Ready to Mix',
          hint: 'Click the Spatula in the mixing bowl.',
          hideButton: true,
        }
      );
    }
  }, [allIngredientsIn]);

  const handleMixAction = () => {
    if (!allIngredientsIn || isMixed) return;

    soundManager.playPour();
    soundManager.playSuccess();
    addScore(30);
    unlockBadge('precision_formulator', 'Formulation Specialist', '⚖️');
    setIsMixed(true);
    setSelectedItem(null);
    completeMission('mission3');
    showToast('Dough Ready!', '+30 Points! Pliable cracker dough formed.', 'success');
    speak(
      'Superb mixing! The starch granules are uniformly hydrated and bonded with the coconut pith fiber. We are ready for Stage 4: Dehydration!',
      'happy',
      {
        badge: 'Stage 3 Cleared',
        btnText: 'Proceed to Stage 4: Dehydration ➔',
        onNext: () => setScene('mission4'),
      }
    );
  };

  return (
    <div className="workstation-scene stage-3-bg">
      <div className="workstation-overlay" />
      <div className="stage-center-zone">
        <div className="active-vessel-card mixing-workstation">
          <div className="vessel-header">
            <span className="vessel-title">
              <img src="/images/icon_prep_bowl.png" alt="" className="vessel-header-icon" />
              Formulation Bench: Mixing Bowl
            </span>
            <span className="vessel-badge">{Object.values(ingredientsInBowl).filter(Boolean).length}/3 Ingredients</span>
          </div>

          <div
            className={`dropzone mixing-bowl-zone ${selectedItem ? 'highlight-ready' : ''} ${isMixed ? 'dough-ready-zone' : ''}`}
            onClick={handleBowlClick}
          >
            <div className="bowl-stage-visual">
              <img
                src="/images/icon_prep_bowl.png"
                alt="Mixing Bowl"
                className="mixing-bowl-img"
              />
              <div className="bowl-contents-summary">
                {ingredientsInBowl.pulp && <span className="ingredient-tag-pill">✓ 200g Boiled Ubod Pulp</span>}
                {ingredientsInBowl.starch && <span className="ingredient-tag-pill">✓ 100g Tapioca Starch</span>}
                {ingredientsInBowl.seasonings && <span className="ingredient-tag-pill">✓ Salt, Garlic & Sugar</span>}
              </div>

              {allIngredientsIn && !isMixed && (
                <div className="mix-prompt-overlay" onClick={(e) => { e.stopPropagation(); handleMixAction(); }}>
                  <button className="btn-gold btn-stir">
                    <img src="/images/icon_spatula.png" alt="" className="stir-icon-img" />
                    <span>Stir & Knead Dough!</span>
                  </button>
                </div>
              )}

              {isMixed && (
                <div className="dough-finished-badge pop-in" onClick={(e) => e.stopPropagation()}>
                  <img src="/images/icon_dough.png" alt="Coconut Pith Cracker Dough" className="dough-img" />
                  <h4>✓ Uniform Coconut Pith Cracker Dough</h4>
                  <p>Ready to roll, steam, and dehydrate</p>
                  <button
                    className="btn-gold btn-next-stage pulse"
                    onClick={() => {
                      soundManager.playClick();
                      setScene('mission4');
                    }}
                  >
                    Proceed to Stage 4: Dehydration ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Tray */}
      <div className="inventory-tray">
        <div className="tray-title-bar">
          <span className="tray-label">🧰 Formulation Ingredients:</span>
          <span className="tray-hint">{isMixed ? 'Dough is complete! Proceed to Stage 4' : 'Click ingredient, then click mixing bowl'}</span>
        </div>
        <div className="items-carousel">
          <div
            className={`drag-card ${selectedItem?.id === 'pureed_ubod' ? 'selected-tap' : ''} ${ingredientsInBowl.pulp || isMixed ? 'used' : ''}`}
            onClick={() => !ingredientsInBowl.pulp && !isMixed && handleItemClick({ id: 'pureed_ubod' })}
          >
            <img src="/images/icon_ubod_puree.png" alt="Pureed Ubod" className="card-icon-img" />
            <span className="card-title">Pureed Ubod</span>
            <span className="card-measure">200g</span>
          </div>

          <div
            className={`drag-card ${selectedItem?.id === 'tapioca_starch' ? 'selected-tap' : ''} ${ingredientsInBowl.starch || isMixed ? 'used' : ''}`}
            onClick={() => !ingredientsInBowl.starch && !isMixed && handleItemClick({ id: 'tapioca_starch' })}
          >
            <img src="/images/icon_tapioca_starch.png" alt="Starch" className="card-icon-img" />
            <span className="card-title">Tapioca Starch</span>
            <span className="card-measure">100g</span>
          </div>

          <div
            className={`drag-card ${selectedItem?.id === 'seasonings' ? 'selected-tap' : ''} ${ingredientsInBowl.seasonings || isMixed ? 'used' : ''}`}
            onClick={() => !ingredientsInBowl.seasonings && !isMixed && handleItemClick({ id: 'seasonings' })}
          >
            <img src="/images/icon_seasonings.png" alt="Seasonings" className="card-icon-img" />
            <span className="card-title">Seasonings</span>
            <span className="card-measure">1 tsp blend</span>
          </div>

          <div
            className={`drag-card distractor ${selectedItem?.id === 'distractor_vinegar' ? 'selected-tap' : ''} ${isMixed ? 'used' : ''}`}
            onClick={() => !isMixed && handleItemClick({ id: 'distractor_vinegar' })}
          >
            <img src="/images/icon_vinegar.png" alt="Cane Vinegar" className="card-icon-img" />
            <span className="card-title">Cane Vinegar</span>
            <span className="card-measure">Distractor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
