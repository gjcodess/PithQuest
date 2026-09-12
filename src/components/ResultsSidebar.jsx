import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SidebarPortal } from './SidebarPortal';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';

export const ResultsSidebar = () => {
  const {
    studentName,
    isInventoryCollapsed,
    setIsInventoryCollapsed,
    assessmentResults,
    stageAnswers,
  } = useGame();

  const ppeAudit = assessmentResults?.preTest?.ppe;
  const ppeCorrectCount = Array.isArray(ppeAudit?.correctSelected) ? ppeAudit.correctSelected.length : 6;
  const ppeDistractors = Array.isArray(ppeAudit?.distractorsPicked) ? ppeAudit.distractorsPicked.length : 0;

  const handwashAudit = assessmentResults?.preTest?.handwashing;
  const handwashSubmitted = Array.isArray(handwashAudit?.submittedSteps) ? handwashAudit.submittedSteps : [];
  const handwashDistractors = Array.isArray(handwashAudit?.distractorsIncluded) ? handwashAudit.distractorsIncluded.length : 0;
  const handwashCorrect = handwashSubmitted.filter(
    (s, idx) => s && s.isCorrect && s.step === idx + 1
  ).length;

  const toolAudit = Array.isArray(assessmentResults?.preTest?.toolSafety) ? assessmentResults.preTest.toolSafety : [];
  const toolSafeCount = toolAudit.filter((t) => t?.isSafe).length;

  const ingredientAudit = Array.isArray(assessmentResults?.preTest?.qualityInspection) ? assessmentResults.preTest.qualityInspection : [];
  const ingredientSafeCount = ingredientAudit.filter((i) => i?.isSafe).length;

  const sequenceAudit = assessmentResults?.postTest?.sequencing;
  const sequenceCorrectCount = sequenceAudit?.correctCount ?? (sequenceAudit?.isCorrect ? 8 : 8);

  const stageAnswersList = Object.values(stageAnswers || {}).filter(Boolean);
  const stageCorrectCount = stageAnswersList.filter((a) => a?.isCorrect).length;

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
            <span className="inventory-tab-count-pill">✓</span>
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
      <div className="right-inventory-rack expanded results-inventory-rack">
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
          {/* Card 1: Candidate Profile */}
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
                  AUDIT COMPLETE
                </span>
              </div>
              <p className="card-desc-text" style={{ color: '#854d0e', fontWeight: 600 }}>
                Food Technologist • Comprehensive Diagnostic Review
              </p>
            </div>
          </div>

          {/* Card 2: Pre-Test PPE & Hygiene */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🥼</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Pre-Test PPE & Hygiene</span>
                <span className="card-measure">
                  {ppeDistractors === 0 && handwashDistractors === 0 ? 'COMPLIANT' : 'FLAGGED'}
                </span>
              </div>
              <p className="card-desc-text">
                {ppeCorrectCount}/6 PPE Gear • {handwashCorrect}/7 Steps Ordered
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
                  INSPECTED
                </span>
              </div>
              <p className="card-desc-text">
                Tools: {toolSafeCount}/{TOOL_INSPECTION_ITEMS.length} Safe • Ingredients: {ingredientSafeCount}/{INGREDIENT_INSPECTION_ITEMS.length} Fresh
              </p>
            </div>
          </div>

          {/* Card 5: Stage Pre-Check Questions */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>📝</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Stage Pre-Checks</span>
                <span className="card-measure">{stageCorrectCount}/8 MASTERED</span>
              </div>
              <p className="card-desc-text">
                {stageCorrectCount}/8 food technology checkpoints answered correctly
              </p>
            </div>
          </div>

          {/* Card 6: Post-Test Pipeline Sequencing */}
          <div className="drag-card horizontal-item-card">
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🔄</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">Post-Test Pipeline</span>
                <span className="card-measure">{sequenceCorrectCount}/8 STAGES</span>
              </div>
              <p className="card-desc-text">
                {sequenceCorrectCount}/8 stages correctly positioned in sequence
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarPortal>
  );
};

