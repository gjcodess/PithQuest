import React, { useState } from 'react';
import { soundManager } from '../audio/soundManager';

/**
 * CheckpointQuestionModal:
 * Displays curriculum checkpoint questions (Stage 3, 4, 7) directly to students
 * before beginning specific cooking procedures, exactly matching the client requirements.
 */
export const CheckpointQuestionModal = ({
  isOpen,
  question,
  choices = [],
  onComplete,
  stageTitle = 'Food Technology Checkpoint',
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isAnsweredCorrect, setIsAnsweredCorrect] = useState(false);

  if (!isOpen) return null;

  const currentChoice = choices.find((c) => c.id === selectedId);

  const handleSelect = (choice) => {
    setSelectedId(choice.id);
    if (choice.isCorrect) {
      soundManager.playSuccess();
      setIsAnsweredCorrect(true);
    } else {
      soundManager.playError();
      setIsAnsweredCorrect(false);
    }
  };

  return (
    <div className="checkpoint-modal-backdrop">
      <div className="checkpoint-modal-card">
        {/* Header Pill */}
        <div className="checkpoint-header">
          <div className="checkpoint-teacher-badge">
            <span className="teacher-avatar-mini">👩‍🍳</span>
            <span className="teacher-badge-text">Teacher Mia's Kitchen Checkpoint</span>
          </div>
          <span className="checkpoint-stage-tag">{stageTitle}</span>
        </div>

        {/* Question Title */}
        <div className="checkpoint-body">
          <h3 className="checkpoint-question-title">{question}</h3>

          {/* Interactive Choices Grid */}
          <div className="checkpoint-choices-stack">
            {choices.map((choice) => {
              const isSelected = selectedId === choice.id;
              let choiceClass = 'checkpoint-choice-btn';
              if (isSelected) {
                choiceClass += choice.isCorrect ? ' choice-correct' : ' choice-wrong';
              }

              return (
                <button
                  key={choice.id}
                  className={choiceClass}
                  onClick={() => handleSelect(choice)}
                  disabled={isAnsweredCorrect && choice.isCorrect}
                >
                  <span className="choice-letter-badge">{choice.id.toUpperCase()}</span>
                  <span className="choice-text">{choice.text}</span>
                  {isSelected && choice.isCorrect && (
                    <span className="choice-check-icon">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation Banner */}
          {currentChoice && (
            <div
              className={`checkpoint-feedback-box ${
                currentChoice.isCorrect ? 'feedback-correct' : 'feedback-alert'
              }`}
            >
              <div className="feedback-icon-col">
                {currentChoice.isCorrect ? '✨' : '⚠️'}
              </div>
              <div className="feedback-text-col">
                <strong>{currentChoice.isCorrect ? 'Correct Procedure!' : 'Important Sanitation / Quality Rule:'}</strong>
                <p>{currentChoice.reason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Button */}
        {isAnsweredCorrect && (
          <div className="checkpoint-footer">
            <button
              className="btn-checkpoint-proceed"
              onClick={() => {
                soundManager.playClick();
                onComplete();
              }}
            >
              <span>Continue to Workstation</span>
              <span className="proceed-arrow">➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
