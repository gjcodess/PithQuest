import React from 'react';
import { soundManager } from '../audio/soundManager';

export const StageGuideConsole = ({
  stageNumber,
  stageTitle,
  stepBadge,
  statusDotClass = '',
  statusText = '',
  recipeItems = [],
  safetyChecklist = [],
  quiz = null,
  culinaryTip = '',
  specBadge = null,
  activeToolPrompt = '',
}) => {
  return (
    <div className="multi-state-workstation stage-guide-workstation">
      {/* Workstation Header */}
      <div className="workstation-header">
        <div className="workstation-titles">
          <h4 className="workstation-name">{stageTitle}</h4>
          <span className="workstation-sub">Home Economics & Food Technology Guide</span>
        </div>
        {stepBadge && (
          <div className="workstation-step-badge badge-flow-glow">
            {stepBadge}
          </div>
        )}
      </div>

      {/* Main 3D Card Viewport (Fixed 380px height, matching Left Apparatus) */}
      <div className="workstation-viewport stage-guide-viewport">
        {/* Top Section: Active Recipe & Formulation Tracker */}
        {recipeItems && recipeItems.length > 0 && (
          <div className="guide-top-recipe-bar">
            <div className="guide-bar-header">
              <span className="guide-bar-title">🥥 Recipe Standard:</span>
              <span className="guide-bar-badge">Mise en Place</span>
            </div>
            <div className="guide-recipe-pills-row">
              {recipeItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`guide-recipe-pill ${
                    item.isCompleted ? 'pill-done' : item.isCurrent ? 'pill-active' : ''
                  }`}
                >
                  <span className="pill-icon">{item.icon || '🥣'}</span>
                  <div className="pill-text">
                    <span className="pill-name">{item.name}</span>
                    <strong className="pill-measure">{item.measure}</strong>
                  </div>
                  {item.isCompleted && <span className="pill-check">✓</span>}
                  {item.isCurrent && <span className="pill-dot">●</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Middle Section: Interactive Quiz OR Safety & Sanitation Alert */}
        {quiz ? (
          <div className="guide-main-quiz-box">
            <div className="quiz-box-header">
              <span className="quiz-header-badge">❓ Checkpoint Question</span>
            </div>
            <h5 className="quiz-question-text">{quiz.question}</h5>
            <div className="quiz-options-grid">
              {quiz.choices.map((choice) => {
                const isSelected = quiz.selectedId === choice.id;
                const isAnswered = Boolean(quiz.selectedId);
                let btnClass = 'quiz-option-btn';
                if (isSelected) {
                  btnClass += choice.isCorrect ? ' opt-correct' : ' opt-wrong';
                }

                return (
                  <button
                    key={choice.id}
                    className={btnClass}
                    disabled={isAnswered && choice.isCorrect}
                    onClick={() => {
                      if (!isAnswered || !choice.isCorrect) {
                        if (choice.isCorrect) {
                          soundManager.playSuccess();
                        } else {
                          soundManager.playError();
                        }
                        quiz.onSelect(choice);
                      }
                    }}
                  >
                    <span className="option-letter">{choice.id.toUpperCase()}</span>
                    <span className="option-text">{choice.text}</span>
                  </button>
                );
              })}
            </div>
            {quiz.selectedId && (
              <div
                className={`quiz-feedback-banner ${
                  quiz.choices.find((c) => c.id === quiz.selectedId)?.isCorrect
                    ? 'feedback-success'
                    : 'feedback-alert'
                }`}
              >
                <strong>
                  {quiz.choices.find((c) => c.id === quiz.selectedId)?.isCorrect
                    ? '✓ Correct! '
                    : '⚠️ Food Safety Note: '}
                </strong>
                <span>{quiz.choices.find((c) => c.id === quiz.selectedId)?.reason}</span>
              </div>
            )}
          </div>
        ) : (
          safetyChecklist && safetyChecklist.length > 0 && (
            <div className="guide-safety-panel">
              <div className="safety-panel-header">
                <span className="safety-header-icon">🛡️</span>
                <span className="safety-header-title">Laboratory Safety & Quality Protocol</span>
              </div>
              <div className="safety-items-stack">
                {safetyChecklist.slice(0, 2).map((safe, idx) => (
                  <div
                    key={idx}
                    className={`safety-card-row ${
                      safe.isWarning ? 'safety-row-warning' : 'safety-row-standard'
                    }`}
                  >
                    <span className="safety-row-icon">{safe.icon || '🛡️'}</span>
                    <div className="safety-row-body">
                      <strong>{safe.title}: </strong>
                      <span>{safe.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Bottom Section: Teacher Mia's Culinary Science Note */}
        {culinaryTip && (
          <div className="guide-bottom-tip-card">
            <span className="tip-bulb-icon">💡</span>
            <div className="tip-body-content">
              <strong>Food Technology Principle:</strong>
              <p>{culinaryTip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Workstation Footer */}
      <div className="workstation-footer">
        <div className="workstation-status">
          <span className={`status-dot ${statusDotClass}`} />
          <span className="status-text">{statusText || 'Follow the laboratory instructions'}</span>
        </div>
        {specBadge}
      </div>
    </div>
  );
};
