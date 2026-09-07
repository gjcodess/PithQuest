import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

/**
 * MinigameInspection: Diagnostic safety inspection assessment component
 * Learners select their preferred option (Safe vs. Defective/Hazardous).
 * In assessment mode:
 * - Learners make choices freely without blocking.
 * - Previous choices are saved and remembered when returning to this screen.
 * - When pre-test is completed (isLocked = true), choices are read-only.
 */
export const MinigameInspection = ({
  title = "Tool Safety Inspection",
  items = [],
  initialAnswers = [], // Array of recorded choice objects from context / state
  onAnswersChange,
  onComplete,
  isLocked = false,
  mode = "tools", // "tools" | "ingredients"
}) => {
  const { speak, setIsDialogueCollapsed } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const lockedClicksRef = React.useRef(0);

  // Map of answers keyed by item id: { [itemId]: { chosen, isSafe, selectedSide, optionLabel } }
  const [answers, setAnswers] = useState(() => {
    const map = {};
    if (Array.isArray(initialAnswers)) {
      initialAnswers.forEach((ans) => {
        if (ans && ans.id) {
          map[ans.id] = ans;
        }
      });
    }
    return map;
  });

  // Keep pairs stable for each item
  const [pairsByItemId, setPairsByItemId] = useState(() => {
    const pairs = {};
    items.forEach((item) => {
      const isSafeFirst = Math.random() < 0.5;
      pairs[item.id] = [
        isSafeFirst
          ? { ...item.safe, isSafe: true, side: 'left', optionLabel: 'Option A' }
          : { ...item.damaged, isSafe: false, side: 'left', optionLabel: 'Option A' },
        isSafeFirst
          ? { ...item.damaged, isSafe: false, side: 'right', optionLabel: 'Option B' }
          : { ...item.safe, isSafe: true, side: 'right', optionLabel: 'Option B' },
      ];
    });
    return pairs;
  });

  const currentItem = items[currentIndex] || items[0];
  const isLastItem = currentIndex + 1 >= items.length;
  const currentPair = pairsByItemId[currentItem?.id] || [];
  const currentAnswer = answers[currentItem?.id] || null;
  const selectedSide = currentAnswer?.selectedSide || null;

  useEffect(() => {
    if (!currentItem) return;
    speak(
      `Inspect the ${currentItem.name}. Select the item you consider safe and suitable for food preparation.`,
      'neutral',
      { hint: isLocked ? 'Pre-Test is completed. You are viewing your submitted diagnostic choices.' : 'Examine surface condition, cleanliness, structural integrity, and freshness.' }
    );
  }, [currentIndex, currentItem, isLocked]);

  const handleCardClick = (card) => {
    if (isLocked) {
      soundManager.playError();
      lockedClicksRef.current += 1;
      if (lockedClicksRef.current >= 2) {
        speak(
          `You've already completed the Pre-Test! Your diagnostic choices for ${mode === 'tools' ? 'equipment' : 'ingredients'} are saved in your audit record and cannot be modified.`,
          'thinking',
          {
            badge: 'Pre-Test Completed',
            note: 'Inspection answers are locked to preserve your pre-test benchmark score.',
            hint: 'Use the buttons at the bottom to navigate between items or proceed to the missions!',
          }
        );
        setIsDialogueCollapsed(false);
        lockedClicksRef.current = 0;
      }
      return;
    }

    soundManager.playClick();

    let updatedAnswers;
    if (selectedSide === card.side) {
      // Toggle off / deselect
      updatedAnswers = { ...answers };
      delete updatedAnswers[currentItem.id];
    } else {
      const answerObj = {
        id: currentItem.id,
        name: currentItem.name,
        toolType: currentItem.toolType || currentItem.category,
        chosen: card,
        isSafe: card.isSafe,
        selectedSide: card.side,
        optionLabel: card.optionLabel,
        safeOption: currentItem.safe,
        damagedOption: currentItem.damaged,
      };
      updatedAnswers = {
        ...answers,
        [currentItem.id]: answerObj,
      };
    }

    setAnswers(updatedAnswers);
    if (onAnswersChange) {
      onAnswersChange(Object.values(updatedAnswers));
    }
  };

  const handleUnselect = () => {
    if (isLocked) return;
    soundManager.playClick();
    const updatedAnswers = { ...answers };
    delete updatedAnswers[currentItem.id];
    setAnswers(updatedAnswers);
    if (onAnswersChange) {
      onAnswersChange(Object.values(updatedAnswers));
    }
  };

  const handleNextItem = () => {
    soundManager.playClick();
    if (isLastItem) {
      if (onComplete) {
        onComplete(Object.values(answers));
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="inspection-minigame-container">
      <div className="vessel-header">
        <span className="vessel-title">{title}</span>
        <span className="vessel-badge">
          {isLocked ? '🔒 Completed (Read-Only)' : `Item ${currentIndex + 1} of ${items.length}`}
        </span>
      </div>
      <div className="vessel-header-divider" />

      {/* Progress & Item Quick-Selector Bar */}
      <div className="inspection-header-row">
        <div className="inspection-title-box">
          <span className="mode-badge">{mode === 'tools' ? '🛠️ Equipment Clearance' : '🥥 Ingredient Clearance'}</span>
          <h3 className="item-target-title">Target: {currentItem?.name}</h3>
        </div>
        <div className="inspection-counter">
          Answered: {answeredCount} / {items.length}
        </div>
      </div>

      <p className="inspection-prompt">
        {isLocked
          ? 'Review your submitted choices for this item below:'
          : 'Select the option you would choose for laboratory food processing (or click again to deselect):'}
      </p>

      {/* Comparison Grid */}
      <div className="inspection-cards-grid">
        {currentPair.map((card, idx) => {
          const isSelected = selectedSide === card.side;
          const cardClass = `inspection-card ${isSelected ? 'selected' : ''} ${isLocked ? 'is-locked-view' : ''}`;

          return (
            <div
              key={idx}
              className={cardClass}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
              style={{ cursor: isLocked ? 'default' : 'pointer' }}
            >
              <div className="card-badge-tag">{card.optionLabel}</div>
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
                <span>
                  {isSelected
                    ? isLocked
                      ? '✓ Your Submitted Choice'
                      : '✓ Selected Choice (Click to Deselect)'
                    : isLocked
                    ? 'Not Selected'
                    : '👆 Click to Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="inspection-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
        <button
          className="btn-secondary"
          onClick={handlePrevItem}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.4 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', padding: '10px 18px' }}
        >
          <span>◀ Previous Item</span>
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isLocked && currentAnswer && (
            <button
              className="btn-secondary btn-unselect-inspection"
              onClick={handleUnselect}
              title="Clear selection for this item"
            >
              <span>✕ Deselect</span>
            </button>
          )}

          <button
            className="btn-primary btn-gold btn-next-inspection"
            onClick={handleNextItem}
            disabled={!isLocked && !currentAnswer && !isLastItem}
            style={{ opacity: !isLocked && !currentAnswer && !isLastItem ? 0.6 : 1 }}
          >
            <span>
              {isLastItem
                ? mode === 'tools'
                  ? 'Proceed to Ingredient Inspection ➔'
                  : 'Finish Pre-Test & Enter Laboratory ➔'
                : `Next Item (${currentIndex + 2} of ${items.length}) ▶`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
