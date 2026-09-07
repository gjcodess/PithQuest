import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

/**
 * MinigameInspection: Diagnostic safety inspection assessment component
 * Learners select their preferred option (Safe vs. Defective/Hazardous).
 * In assessment mode, learners make their choice without being blocked or forced to correct it,
 * recording all responses for the final RESULTS diagnostic audit.
 */
export const MinigameInspection = ({
  title = "Tool Safety Inspection",
  items = [],
  onComplete,
  onItemRecorded,
  mode = "tools", // "tools" | "ingredients"
}) => {
  const { speak } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledPair, setShuffledPair] = useState([]);
  const [selectedSide, setSelectedSide] = useState(null); // 'left' or 'right'
  const [selectedCard, setSelectedCard] = useState(null);

  const currentItem = items[currentIndex] || items[0];
  const isLastItem = currentIndex + 1 >= items.length;

  // Randomize Option A and Option B positions (50% chance safe is A, 50% chance safe is B)
  useEffect(() => {
    if (!currentItem) return;
    const isSafeFirst = Math.random() < 0.5;
    setShuffledPair([
      isSafeFirst
        ? { ...currentItem.safe, isSafe: true, side: 'left', optionLabel: 'Option A' }
        : { ...currentItem.damaged, isSafe: false, side: 'left', optionLabel: 'Option A' },
      isSafeFirst
        ? { ...currentItem.damaged, isSafe: false, side: 'right', optionLabel: 'Option B' }
        : { ...currentItem.safe, isSafe: true, side: 'right', optionLabel: 'Option B' },
    ]);
    setSelectedSide(null);
    setSelectedCard(null);

    speak(
      `Inspect the ${currentItem.name}. Select the item you consider safe and suitable for food preparation.`,
      'neutral',
      { hint: 'Examine surface condition, cleanliness, structural integrity, and freshness.' }
    );
  }, [currentIndex, currentItem]);

  const handleCardClick = (card) => {
    soundManager.playClick();
    if (selectedSide === card.side) {
      // Toggle off if clicking the already selected card
      setSelectedSide(null);
      setSelectedCard(null);
    } else {
      setSelectedSide(card.side);
      setSelectedCard(card);
    }
  };

  const handleUnselect = () => {
    soundManager.playClick();
    setSelectedSide(null);
    setSelectedCard(null);
  };

  const handleNextItem = () => {
    if (!selectedCard) return;
    soundManager.playClick();

    if (onItemRecorded) {
      onItemRecorded({
        id: currentItem.id,
        name: currentItem.name,
        toolType: currentItem.toolType || currentItem.category,
        chosen: selectedCard,
        isSafe: selectedCard.isSafe,
        safeOption: currentItem.safe,
        damagedOption: currentItem.damaged,
      });
    }

    if (isLastItem) {
      soundManager.playSuccess();
      if (onComplete) onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="inspection-minigame-container">
      <div className="vessel-top-badge">
        {mode === 'tools' ? 'Pre-Test: Tool Safety & Equipment Inspection' : 'Pre-Test: Raw Material & Quality Control'}
      </div>
      <div className="vessel-header">
        <span className="vessel-title">{title}</span>
        <span className="vessel-badge">Item {currentIndex + 1} of {items.length}</span>
      </div>
      <div className="vessel-header-divider" />

      <div className="inspection-header-row">
        <div className="inspection-title-box">
          <span className="mode-badge">{mode === 'tools' ? '🛠️ Equipment Clearance' : '🥥 Ingredient Clearance'}</span>
          <h3 className="item-target-title">Target: {currentItem?.name}</h3>
        </div>
        <div className="inspection-counter">
          Progress: {currentIndex + 1} / {items.length}
        </div>
      </div>

      <p className="inspection-prompt">
        Select the option you would choose for laboratory food processing:
      </p>

      {/* Comparison Grid */}
      <div className="inspection-cards-grid">
        {shuffledPair.map((card, idx) => {
          const isSelected = selectedSide === card.side;
          const cardClass = `inspection-card ${isSelected ? 'selected' : ''}`;

          return (
            <div
              key={idx}
              className={cardClass}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
            >
              <div className="card-badge-tag">{idx === 0 ? 'Option A' : 'Option B'}</div>
              <div className="card-img-wrapper">
                <img
                  src={card.img}
                  alt={card.name}
                  className="inspection-card-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="card-fallback-icon" style={{ display: 'none' }}>
                  <span className="emoji">{card.fallbackIcon || '🔍'}</span>
                </div>
              </div>

              <div className="card-info">
                <h4 className="card-title">{card.name}</h4>
                <p className="card-desc">{card.description}</p>
              </div>

              <div className={`card-verdict-banner ${isSelected ? 'selected-banner' : 'select-prompt'}`}>
                <span>{isSelected ? '✓ Selected Choice (Click to Deselect)' : '👆 Click to Select'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="inspection-actions-row">
        {selectedCard && (
          <button
            className="btn-secondary btn-unselect-inspection"
            onClick={handleUnselect}
            title="Clear current selection"
          >
            <span>✕ Deselect Choice</span>
          </button>
        )}
        <button
          className="btn-primary btn-gold btn-next-inspection"
          onClick={handleNextItem}
          disabled={!selectedCard}
          style={{ opacity: selectedCard ? 1 : 0.5 }}
        >
          <span>
            {isLastItem
              ? (mode === 'tools' ? 'Proceed to Ingredient Inspection ➔' : 'Finish Pre-Test & Enter Laboratory ➔')
              : `Confirm Choice & Next Item (${currentIndex + 2} of ${items.length}) ▶`}
          </span>
        </button>
      </div>
    </div>
  );
};
