import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

/**
 * MinigameInspection: Interactive laboratory safety inspection minigame
 * Students compare a pair of items (Safe vs. Damaged/Defective) and identify the food-grade option.
 */
export const MinigameInspection = ({
  title = "Tool Safety Inspection",
  items = [],
  onComplete,
  mode = "tools", // "tools" | "ingredients"
}) => {
  const { addScore, recordMistake, speak, showToast } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inspectedCount, setInspectedCount] = useState(0);
  const [shuffledPair, setShuffledPair] = useState([]);
  const [selectedSide, setSelectedSide] = useState(null); // 'left' or 'right'
  const [revealedResult, setRevealedResult] = useState(null); // { isSafe: bool, reason: string }
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = items[currentIndex] || items[0];

  // Shuffle the safe and damaged item randomly to left and right positions
  useEffect(() => {
    if (!currentItem) return;
    const isSafeLeft = Math.random() > 0.5;
    setShuffledPair([
      { ...currentItem.safe, isSafe: true, side: 'left', original: isSafeLeft ? currentItem.safe : currentItem.damaged },
      { ...currentItem.damaged, isSafe: false, side: 'right', original: isSafeLeft ? currentItem.damaged : currentItem.safe },
    ]);
    setSelectedSide(null);
    setRevealedResult(null);

    speak(
      `Inspect the ${currentItem.name}. Click the safe, food-grade option to proceed!`,
      'neutral',
      { hint: 'Look closely for chips, rust, cracks, contamination, or discolored defects.' }
    );
  }, [currentIndex]);

  const handleCardClick = (card) => {
    if (revealedResult && revealedResult.isSafe) return; // already advanced

    setSelectedSide(card.side);

    if (card.isSafe) {
      soundManager.playSuccess();
      addScore(25);
      setRevealedResult({ isSafe: true, reason: card.reason });
      speak(card.reason, 'happy', { badge: 'Quality Inspector' });
      showToast('Approved!', 'Sanitary & Safe choice verified (+25 pts)', 'success');

      setTimeout(() => {
        if (currentIndex + 1 < items.length) {
          setCurrentIndex(prev => prev + 1);
          setInspectedCount(prev => prev + 1);
        } else {
          setIsFinished(true);
          soundManager.playFanfare();
          if (onComplete) onComplete();
        }
      }, 1600);
    } else {
      soundManager.playError();
      recordMistake();
      setRevealedResult({ isSafe: false, reason: card.reason });
      speak(`"It's not safe to use!" ${card.reason}`, 'thinking', { badge: 'Safety Alert' });
      showToast("Hazard Detected!", "It's not safe to use! Choose the food-grade option.", "danger");
    }
  };

  if (isFinished) {
    return (
      <div className="inspection-complete-card">
        <div className="complete-icon">🎖️</div>
        <h3>Inspection Clearance Complete!</h3>
        <p>All items have been verified according to Home Economics hygiene & safety standards.</p>
        <div className="inspection-badge-pill">
          <span>✨ Safety Verified (5/5 Cleared)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inspection-minigame-container">
      <div className="inspection-header-row">
        <div className="inspection-title-box">
          <span className="mode-badge">{mode === 'tools' ? '🛠️ Tools & Equipment' : '🥗 Ingredient Freshness'}</span>
          <h3 className="item-target-title">Target: {currentItem?.name}</h3>
        </div>
        <div className="inspection-counter">
          Item {currentIndex + 1} of {items.length}
        </div>
      </div>

      <p className="inspection-prompt">
        Click on the <strong>safe, uncontaminated</strong> item ready for laboratory use:
      </p>

      {/* Comparison Grid */}
      <div className="inspection-cards-grid">
        {shuffledPair.map((card, idx) => {
          const isSelected = selectedSide === card.side;
          const isCardRevealed = revealedResult && isSelected;
          const cardClass = `inspection-card ${isSelected ? 'selected' : ''} ${
            isCardRevealed ? (card.isSafe ? 'card-safe' : 'card-hazard') : ''
          }`;

          return (
            <div
              key={idx}
              className={cardClass}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
            >
              <div className="card-badge-tag">Option {idx === 0 ? 'A' : 'B'}</div>
              <div className="card-img-wrapper">
                <img
                  src={card.img}
                  alt={card.name}
                  className="inspection-card-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
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

              {isCardRevealed && (
                <div className={`card-verdict-banner ${card.isSafe ? 'safe' : 'hazard'}`}>
                  <span>{card.isSafe ? '✅ APPROVED (SAFE)' : "❌ IT'S NOT SAFE TO USE"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealedResult && (
        <div className={`inspection-feedback-box ${revealedResult.isSafe ? 'safe' : 'hazard'}`}>
          <div className="feedback-icon">{revealedResult.isSafe ? '💡' : '⚠️'}</div>
          <div className="feedback-text">
            <strong>{revealedResult.isSafe ? 'Approved Technique:' : 'Safety Hazard:'}</strong> {revealedResult.reason}
          </div>
        </div>
      )}
    </div>
  );
};
