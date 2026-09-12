import React, { useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';

/**
 * Fisher-Yates shuffle algorithm for fair, unbiased choice randomization
 */
const shuffleChoices = (items) => {
  if (!Array.isArray(items)) return [];
  const copy = items.map((item) => ({ ...item }));
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  return copy.map((item, idx) => ({
    ...item,
    displayLetter: LETTERS[idx] || String.fromCharCode(65 + idx),
  }));
};

/**
 * CheckpointQuestionModal:
 * Displays curriculum checkpoint pre-check questions for Stages 1 to 8.
 * Students select an answer neutrally without immediate right/wrong disclosure,
 * then proceed to the interactive workstation. Diagnostic results & explanations
 * are comprehensively revealed in the final Results Scene.
 */
export const CheckpointQuestionModal = ({
  isOpen,
  question,
  choices = [],
  onComplete,
  stageTitle = 'Food Technology Checkpoint',
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [randomizedChoices, setRandomizedChoices] = useState(() =>
    isOpen && Array.isArray(choices) && choices.length > 0 ? shuffleChoices(choices) : []
  );

  useEffect(() => {
    if (isOpen && Array.isArray(choices) && choices.length > 0) {
      setSelectedId(null);
      setRandomizedChoices(shuffleChoices(choices));
    }
  }, [isOpen, question]);

  if (!isOpen) return null;

  const currentChoice = randomizedChoices.find((c) => c.id === selectedId);

  const handleSelect = (choice) => {
    soundManager.playClick();
    setSelectedId(choice.id);
  };

  const handleProceed = () => {
    if (!currentChoice) return;
    soundManager.playClick();
    if (onComplete) {
      onComplete(
        {
          ...currentChoice,
          selectedOptionId: currentChoice.displayLetter,
        },
        randomizedChoices
      );
    }
  };

  return (
    <div className="checkpoint-modal-backdrop">
      <div className="checkpoint-modal-card">
        {/* Header Pill */}
        <div className="checkpoint-header">
          <div className="checkpoint-teacher-badge">
            <span className="teacher-avatar-mini">👩‍🍳</span>
            <span className="teacher-badge-text">Teacher Mia's Stage Pre-Check</span>
          </div>
          <span className="checkpoint-stage-tag">{stageTitle}</span>
        </div>

        {/* Question Title */}
        <div className="checkpoint-body">
          <h3 className="checkpoint-question-title">{question}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            Select the best answer before beginning your workstation tasks:
          </p>

          {/* Interactive Choices Grid */}
          <div className="checkpoint-choices-stack">
            {randomizedChoices.map((choice) => {
              const isSelected = selectedId === choice.id;
              const choiceClass = `checkpoint-choice-btn ${isSelected ? 'choice-selected' : ''}`;

              return (
                <button
                  key={choice.id}
                  type="button"
                  className={choiceClass}
                  onClick={() => handleSelect(choice)}
                >
                  <span className="choice-letter-badge">{choice.displayLetter}</span>
                  <span className="choice-text">{choice.text}</span>
                  {isSelected && (
                    <span className="choice-select-indicator">●</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action Button */}
        {selectedId && (
          <div className="checkpoint-footer">
            <button
              type="button"
              className="btn-checkpoint-proceed"
              onClick={handleProceed}
            >
              <span>Proceed to Workstation</span>
              <span className="proceed-arrow">➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

