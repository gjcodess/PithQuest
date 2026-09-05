import React, { useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';
import { useGame } from '../context/GameContext';

const CORRECT_ORDER = [
  { id: 'boiling', stepNum: 1, title: 'Washing & Boiling Ubod', img: '/assets/card_step_boiling.png', desc: 'Wash raw ubod and boil in salted water until fork-tender.' },
  { id: 'grinding', stepNum: 2, title: 'Grinding into Paste', img: '/assets/card_step_grinding.png', desc: 'Puree boiled ubod with 1 tsp salt in food processor until smooth.' },
  { id: 'mixing', stepNum: 3, title: 'Dough Formulation', img: '/assets/card_step_mixing.png', desc: 'Mix 1:1 ubod paste with rice flour, salt, and gradual water into dough.' },
  { id: 'molding', stepNum: 4, title: 'Rectangular Molding', img: '/assets/card_step_molding.png', desc: 'Portion 3 teaspoons into silicone mold cavities to form uniform rectangles.' },
  { id: 'steaming', stepNum: 5, title: 'Starch Steaming (10 min)', img: '/assets/card_step_steaming.png', desc: 'Steam molded pieces to gelatinize starches and lock rectangular shape.' },
  { id: 'dehydration', stepNum: 6, title: 'Cabinet Dehydration (90°C)', img: '/assets/card_step_dehydration.png', desc: 'Dehydrate for 12 hours on wire mesh trays until moisture is under 10%.' },
  { id: 'frying', stepNum: 7, title: 'Deep Frying (10 sec)', img: '/assets/card_step_frying.png', desc: 'Fry dried chips in 180°C hot oil for 10 seconds until puffed and golden.' },
];

/**
 * SequencingActivity: Drag-and-drop / click-to-reorder chronological step puzzle
 * from the client curriculum.
 */
export const SequencingActivity = ({ onComplete }) => {
  const { addScore, unlockBadge, showToast } = useGame();
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Initialize with a randomized order (ensuring it's not already solved)
  useEffect(() => {
    let shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    // Ensure not accidentally already solved
    while (shuffled.every((item, idx) => item.id === CORRECT_ORDER[idx].id)) {
      shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    }
    setItems(shuffled);
  }, []);

  const handleCardClick = (index) => {
    soundManager.playClick();
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      // Swap items
      const newItems = [...items];
      const temp = newItems[selectedIndex];
      newItems[selectedIndex] = newItems[index];
      newItems[index] = temp;
      setItems(newItems);
      setSelectedIndex(null);
      setFeedback(null);
    }
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, idx) => item.id === CORRECT_ORDER[idx].id);
    if (isCorrect) {
      soundManager.playFanfare();
      addScore(100);
      unlockBadge('master_sequencer', 'Master Food Technologist');
      setIsSolved(true);
      showToast('Mastery Achieved!', 'Perfect chronological order! (+100 PTS)', 'success');
      if (onComplete) onComplete();
    } else {
      soundManager.playError();
      const correctCount = items.filter((item, idx) => item.id === CORRECT_ORDER[idx].id).length;
      setFeedback(`You have ${correctCount} of 7 steps in the right order. Tap any two cards to swap them!`);
      showToast('Keep Trying', `${correctCount}/7 steps correctly ordered.`, 'warning');
    }
  };

  return (
    <div className="sequencing-activity-card">
      <div className="sequencing-header">
        <div className="sec-tag">🧠 Food Processing Science Challenge</div>
        <h3>Chronological Step Sequencing Puzzle</h3>
        <p>
          Arrange the 7 manufacturing steps in their authentic chronological order. Tap any card, then tap another to swap positions!
        </p>
      </div>

      <div className="sequencing-slots-grid">
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isPositionCorrect = isSolved || (feedback && item.id === CORRECT_ORDER[index].id);

          return (
            <div
              key={item.id}
              className={`sequencing-card ${isSelected ? 'selected' : ''} ${isPositionCorrect ? 'correct-glow' : ''}`}
              onClick={() => !isSolved && handleCardClick(index)}
              role="button"
              tabIndex={0}
            >
              <div className="seq-slot-number">Slot {index + 1}</div>
              <div className="seq-card-illustration">
                <img src={item.img} alt={item.title} className="seq-card-img" />
              </div>
              <div className="seq-info">
                <h4 className="seq-title">{item.title}</h4>
                <p className="seq-desc">{item.desc}</p>
              </div>
              {isSolved && <span className="check-badge">✅</span>}
            </div>
          );
        })}
      </div>

      {feedback && !isSolved && (
        <div className="sequencing-hint-bar">
          <span>💡 {feedback}</span>
        </div>
      )}

      <div className="sequencing-actions">
        {!isSolved ? (
          <button className="btn-primary btn-check-sequence" onClick={checkOrder}>
            <span>Verify Chronological Order ➔</span>
          </button>
        ) : (
          <div className="solved-banner">
            <span>🎉 Perfect Food Technology Sequencing! 7/7 Steps Verified.</span>
          </div>
        )}
      </div>
    </div>
  );
};
