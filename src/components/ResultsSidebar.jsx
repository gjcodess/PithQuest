import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SidebarPortal } from './SidebarPortal';

export const ResultsSidebar = () => {
  const {
    score,
    stars,
    badges,
    studentName,
    isInventoryCollapsed,
    setIsInventoryCollapsed,
    assessmentResults,
  } = useGame();

  const ppeAudit = assessmentResults?.preTest?.ppe;
  const ppeCorrectCount = Array.isArray(ppeAudit?.correctSelected) ? ppeAudit.correctSelected.length : 6;
  const ppeDistractors = Array.isArray(ppeAudit?.distractorsPicked) ? ppeAudit.distractorsPicked.length : 0;
  const ppeScore = ppeAudit?.score !== undefined ? ppeAudit.score : Math.max(0, Math.round((ppeCorrectCount / 6) * 25 - (ppeDistractors * 5)));

  const handwashAudit = assessmentResults?.preTest?.handwashing;
  const handwashSubmitted = Array.isArray(handwashAudit?.submittedSteps) ? handwashAudit.submittedSteps : [];
  const handwashDistractors = Array.isArray(handwashAudit?.distractorsIncluded) ? handwashAudit.distractorsIncluded.length : 0;
  const handwashCorrect = handwashSubmitted.filter(
    (s, idx) => s && s.isCorrect && s.step === idx + 1
  ).length;
  const handwashScore = handwashAudit?.score !== undefined ? handwashAudit.score : Math.max(0, Math.round((handwashCorrect / 7) * 25 - (handwashDistractors * 5)));

  const toolAudit = Array.isArray(assessmentResults?.preTest?.toolSafety) ? assessmentResults.preTest.toolSafety : [];
  const toolSafeCount = toolAudit.filter((t) => t?.isSafe).length;
  const toolScore = Math.round((toolSafeCount / 6) * 25);

  const ingredientAudit = Array.isArray(assessmentResults?.preTest?.qualityInspection) ? assessmentResults.preTest.qualityInspection : [];
  const ingredientSafeCount = ingredientAudit.filter((i) => i?.isSafe).length;
  const ingredientScore = Math.round((ingredientSafeCount / 4) * 25);

  const sequenceAudit = assessmentResults?.postTest?.sequencing;
  const sequenceCorrectCount = sequenceAudit?.correctCount ?? (sequenceAudit?.isCorrect ? 8 : 8);
  const sequenceScore = Math.round(sequenceCorrectCount * 12.5);

  if (isInventoryCollapsed) {
    return (
      <SidebarPortal>
        <div
          className="right-inventory-rack collapsed"
          onClick={() => {
            soundManager.playClick();
            setIsInventoryCollapsed(false);
          }}
          title="Click to open Assessment Summary (◀)"
          role="button"
          tabIndex={0}
        >
          <div className="inventory-tab-icon-wrapper">
            <span style={{ fontSize: '1.4rem' }}>📊</span>
            <span className="inventory-tab-count-pill">{badges.length}</span>
          </div>
          <div className="inventory-tab-label-stack">
            <span className="inventory-tab-name">RESULTS</span>
            <span className="inventory-tab-sub">AUDIT</span>
          </div>
          <div className="inventory-tab-chevron-box">
            <span className="inventory-tab-chevron">◀</span>
          </div>
        </div>
      </SidebarPortal>
    );
  }

  return (
    <SidebarPortal>
      <div className="right-inventory-rack expanded">
        {/* Header Bar */}
        <div className="rack-header">
          <div className="rack-title-group">
            <div className="rack-icon-box">
              <span style={{ fontSize: '1.4rem' }}>📊</span>
            </div>
            <div className="rack-titles">
              <span className="rack-title-text">Diagnostic Summary</span>
              <span className="rack-count-pill">Evaluation Audit</span>
            </div>
          </div>
          <button
            className="rack-collapse-btn"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              setIsInventoryCollapsed(true);
            }}
            title="Minimize Sidebar (▶)"
            aria-label="Minimize Sidebar"
          >
            <span>▶</span>
          </button>
        </div>
        <div className="rack-header-divider" />

        <div className="rack-hint-bar">
          <span>Overall Competency & Diagnostic Breakdown</span>
        </div>

        {/* Vertical Audit Stack */}
        <div className="inventory-vertical-stack">
          {/* Card 1: Candidate Rank & Score */}
          <div
            className="drag-card horizontal-item-card"
            style={{
              borderColor: '#f59e0b',
              borderBottom: '4px solid #d97706',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              boxShadow: '0 2px 0 #d97706',
            }}
          >
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🎖️</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title" style={{ color: '#78350f', fontWeight: 800 }}>
                  {studentName || 'Candidate'}
                </span>
                <span className="card-measure" style={{ color: '#92400e', fontWeight: 800 }}>
                  {stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐'}
                </span>
              </div>
              <p className="card-desc-text" style={{ color: '#854d0e', fontWeight: 600 }}>
                Total Score: <strong style={{ color: '#78350f' }}>{score} / 200 pts</strong> • Pre & Post-Tests
              </p>
            </div>
          </div>

          {/* Card 2: Pre-Test PPE Attire */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🥼</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Pre-Test PPE Attire</span>
                <span className="card-measure">
                  {ppeScore}/25 PTS
                </span>
              </div>
              <p className="card-desc-text">
                {ppeDistractors === 0
                  ? `${ppeCorrectCount}/6 required gear selected • 0 hazards`
                  : `${ppeDistractors} hazard(s) flagged during pre-test`}
              </p>
            </div>
          </div>

          {/* Card 3: Pre-Test Handwashing */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🧼</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Handwashing Sequence</span>
                <span className="card-measure">{handwashScore}/25 PTS</span>
              </div>
              <p className="card-desc-text">
                {handwashCorrect}/7 hygiene steps ordered • {handwashScore} pts
              </p>
            </div>
          </div>

          {/* Card 4: Pre-Test Safety & Quality */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🔍</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Tool & Raw Material QC</span>
                <span className="card-measure">
                  {toolScore + ingredientScore}/50 PTS
                </span>
              </div>
              <p className="card-desc-text">
                Tools: {toolScore}/25 pts • Ingredients: {ingredientScore}/25 pts
              </p>
            </div>
          </div>

          {/* Card 5: Post-Test Pipeline Sequencing */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🔄</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Post-Test Pipeline</span>
                <span className="card-measure">{sequenceScore}/100 PTS</span>
              </div>
              <p className="card-desc-text">
                {sequenceCorrectCount}/8 stages correctly positioned • {sequenceScore} pts
              </p>
            </div>
          </div>

          {/* Card 6: Badges & Competencies */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🏅</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Earned Accreditations</span>
                <span className="card-measure">{badges.length} BADGES</span>
              </div>
              <p className="card-desc-text">
                {badges.length > 0
                  ? badges.map((b) => b.title).join(' • ')
                  : 'Master Food Technologist, PPE Certified, Thermal Gelatinization'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarPortal>
  );
};
