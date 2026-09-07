import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { ResultsSidebar } from '../components/ResultsSidebar';
import { PPE_ITEMS, HANDWASHING_STEPS } from '../data/orientationData';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';

const STAGE_SCIENCE_FACTS = [
  {
    step: 1,
    name: 'Washing & Boiling Ubod',
    icon: '🥥',
    foodScience: 'Hydrothermal softening breaks down stubborn cellulosic fibers in coconut pith, solubilizing cellular walls for optimal pureeing while inactivating polyphenol oxidase to prevent discoloration.',
  },
  {
    step: 2,
    name: 'Pureeing & Grinding',
    icon: '⚡',
    foodScience: 'High-shear mechanical processing homogenizes boiled pith fibers into a uniform microscopic matrix, preventing grittiness and ensuring consistent hydration with starch polymers.',
  },
  {
    step: 3,
    name: 'Paste Formulation (1:1 Ratio)',
    icon: '🥣',
    foodScience: 'The 1:1 ratio of ubod puree to Erawan rice flour provides balanced amylose/amylopectin starch chains, creating the ideal cohesive dough viscoelasticity needed for structural puffing.',
  },
  {
    step: 4,
    name: 'Rectangular Molding (50mm x 25mm)',
    icon: '🥖',
    foodScience: 'Standardized dimensions ensure uniform thermal conductivity and moisture diffusion during steaming and dehydration, preventing uneven core drying or blistering.',
  },
  {
    step: 5,
    name: 'Starch Steaming (10 min Gelatinization)',
    icon: '♨️',
    foodScience: 'Moist heat at 100°C ruptures starch granules, causing irreversible gelatinization that locks the wafer shape into an extensible viscoelastic gel matrix capable of holding steam bubbles.',
  },
  {
    step: 6,
    name: 'Cabinet Dehydration (90°C to <10% Moisture)',
    icon: '☀️',
    foodScience: 'Controlled convective drying evaporates free water below 10% critical moisture, setting the glassy amorphous starch state essential for rapid steam expansion upon frying.',
  },
  {
    step: 7,
    name: 'Flash Deep Frying (180°C, 10 sec, 3x Puffing)',
    icon: '🍳',
    foodScience: 'Submerged in 180°C oil, residual bound water instantaneously flashes into superheated steam. The rapid vapor pressure inflates the gelatinized matrix 3x before setting into an airy, brittle crunch.',
  },
  {
    step: 8,
    name: 'Hermetic Packaging & Labeling (50g)',
    icon: '📦',
    foodScience: 'High-barrier sealed foil pouches prevent water vapor ingress (preventing starch retrogradation and staleness) and shield against lipid photo-oxidation, securing a 6-month shelf life.',
  },
];

export const ResultsScene = () => {
  const {
    studentName,
    score,
    stars,
    badges,
    resetGame,
    speak,
    setScene,
    completeMission,
    assessmentResults,
  } = useGame();

  const reportRef = useRef(null);

  useEffect(() => {
    completeMission('sequencing');
    completeMission('evaluation');
    soundManager.playFanfare();
    speak(
      `Assessment Complete, ${studentName || 'Food Technologist'}! Here is your comprehensive diagnostic performance report. Review your Pre-Test choices, Handwashing sequence, Equipment safety audits, and Post-Test manufacturing pipeline validation.`,
      'happy',
      {
        badge: 'Diagnostic Report Ready',
        note: 'Inspect itemized feedback, food science principles, and print your complete diagnostic audit report.',
        hint: 'Scroll down to review each section of your assessment and save/print your report.',
        hideButton: true,
      }
    );
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  // Pre-Test PPE Audit Data
  const ppeAudit = assessmentResults?.preTest?.ppe;
  const ppeDistractors = ppeAudit?.distractorsPicked || [];
  const ppeCorrectSelected = ppeAudit?.correctSelected || [];
  const ppeTotalCorrect = ppeAudit?.totalCorrect || 6;

  // Pre-Test Handwashing Audit Data
  const handwashAudit = assessmentResults?.preTest?.handwashing;
  const handwashSubmitted = handwashAudit?.submittedSteps || [];
  const handwashDistractors = handwashAudit?.distractorsIncluded || [];

  // Pre-Test Tools Audit Data
  const toolAudit = assessmentResults?.preTest?.toolSafety || [];

  // Pre-Test Ingredients Audit Data
  const ingredientAudit = assessmentResults?.preTest?.qualityInspection || [];

  // Post-Test Sequencing Audit Data
  const sequenceAudit = assessmentResults?.postTest?.sequencing;
  const sequenceSubmitted = sequenceAudit?.submittedItems || [];
  const sequenceCorrectCount = sequenceAudit?.correctCount ?? (sequenceAudit?.isCorrect ? 8 : 0);

  // Overall Performance Level
  const totalCorrectAssessments =
    (ppeCorrectSelected.length >= 5 ? 1 : 0) +
    (handwashDistractors.length === 0 && handwashSubmitted.length === 7 ? 1 : 0) +
    (toolAudit.filter((t) => t.isSafe).length >= 5 ? 1 : 0) +
    (ingredientAudit.filter((i) => i.isSafe).length >= 3 ? 1 : 0) +
    (sequenceCorrectCount >= 7 ? 1 : 0);

  const competencyLevel =
    totalCorrectAssessments >= 4
      ? 'Master Food Technologist (Advanced Competency)'
      : totalCorrectAssessments >= 2
      ? 'Proficient Food Technologist (Meets Laboratory Standard)'
      : 'Apprentice Technologist (Requires Supervised Review)';

  return (
    <div className="results-scene">
      <div className="results-container" ref={reportRef}>
        {/* Header Hero Card */}
        <div className="results-header-card">
          <div className="results-ribbon">
            <img
              src="/assets/icon_gold_medal_front.png"
              alt="Medal"
              className="results-ribbon-medal-img"
            />
            <span>COMPREHENSIVE DIAGNOSTIC AUDIT & PERFORMANCE REPORT</span>
          </div>

          <div className="results-hero-showcase">
            <div className="results-showcase-item">
              <img
                src="/assets/platter_crackers_cooled.png"
                alt="Freshly Fried Ubod Crackers"
                className="results-showcase-img"
              />
              <span className="results-showcase-label">Golden Crisp Ubod Crunch</span>
            </div>
            <div className="results-showcase-item">
              <img
                src="/assets/pouch_sealed_labeled.png"
                alt="Branded Kraft Pouch"
                className="results-showcase-img"
              />
              <span className="results-showcase-label">Airtight Stand-Up Pouch (50g)</span>
            </div>
            <div className="results-showcase-item">
              <img
                src="/assets/box_of_packaged_crackers.png"
                alt="Retail Master Carton"
                className="results-showcase-img"
              />
              <span className="results-showcase-label">Retail Display Box (8 Pouches)</span>
            </div>
          </div>

          <h2 className="results-main-title">Coconut Pith Crackers Laboratory Performance Audit</h2>
          <p className="results-sub-title">
            Instructional Assessment & Science Competency Report • Candidate:{' '}
            <strong>{studentName || 'Food Technology Student'}</strong> • Date: {currentDate}
          </p>

          <div className="results-competency-pill">
            <span className="competency-badge-icon">🎖️</span>
            <span className="competency-label">Evaluated Rank:</span>
            <span className="competency-value">{competencyLevel}</span>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="results-metrics-grid">
          <div className="res-metric-box">
            <span className="res-metric-icon">⭐</span>
            <h4>Total Assessment Score</h4>
            <div className="res-score-highlight">{score} pts</div>
            <p>Calculated across Pre-Test diagnostics, 8 lab stages, and Post-Test sequencing.</p>
          </div>

          <div className="res-metric-box">
            <span className="res-metric-icon">🥼</span>
            <h4>Pre-Test PPE Attire</h4>
            <div className="res-score-highlight">
              {ppeCorrectSelected.length}/{ppeTotalCorrect} Standard Items
            </div>
            <p>
              {ppeDistractors.length === 0
                ? 'Zero hazardous distractors selected. 100% sanitary compliance.'
                : `${ppeDistractors.length} non-approved attire item(s) detected.`}
            </p>
          </div>

          <div className="res-metric-box">
            <span className="res-metric-icon">🧼</span>
            <h4>Handwashing Sanitation</h4>
            <div className="res-score-highlight">
              {handwashSubmitted.filter((s, idx) => s.isCorrect && s.step === idx + 1).length}/7 Steps Ordered
            </div>
            <p>
              {handwashDistractors.length === 0
                ? 'Standard WHO 7-step sequence maintained without cross-contamination.'
                : `${handwashDistractors.length} cross-contamination hazard(s) flagged.`}
            </p>
          </div>

          <div className="res-metric-box">
            <span className="res-metric-icon">🔄</span>
            <h4>Post-Test Sequencing</h4>
            <div className="res-score-highlight">{sequenceCorrectCount}/8 Stages Correct</div>
            <p>Manufacturing lifecycle from raw ubod boiling to hermetic carton packaging.</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PRE-TEST PPE ATTIRE DIAGNOSTIC AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 1</span>
              <h3>Personal Protective Equipment (PPE) Diagnostic Audit</h3>
            </div>
            <span className="section-status-tag">
              {ppeDistractors.length === 0 ? '✓ COMPLIANT' : '⚠️ HAZARDS FLAGGED'}
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Standard food processing laboratory protocol mandates 6 critical protective barriers to prevent physical and microbiological contamination:
            </p>

            <div className="ppe-audit-grid">
              {PPE_ITEMS.map((item) => {
                const wasSelected = ppeAudit?.selectedIds?.includes(item.id);
                const isCorrect = item.isCorrect;
                const isDistractor = !isCorrect;

                return (
                  <div
                    key={item.id}
                    className={`ppe-audit-item ${
                      isCorrect && wasSelected
                        ? 'item-correct'
                        : isCorrect && !wasSelected
                        ? 'item-missed'
                        : isDistractor && wasSelected
                        ? 'item-distractor-picked'
                        : 'item-distractor-avoided'
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="ppe-audit-img" />
                    <div className="ppe-audit-details">
                      <h5>{item.name}</h5>
                      <p className="ppe-audit-role">{item.role}</p>

                      <div className="ppe-audit-verdict">
                        {isCorrect && wasSelected && (
                          <span className="verdict-good">✓ Correctly Equipped (+10 pts)</span>
                        )}
                        {isCorrect && !wasSelected && (
                          <span className="verdict-warn">⚠️ Missed Required Gear (0 pts)</span>
                        )}
                        {isDistractor && wasSelected && (
                          <span className="verdict-bad">🚫 Hazard: {item.reason}</span>
                        )}
                        {isDistractor && !wasSelected && (
                          <span className="verdict-good">✓ Correctly Rejected Non-PPE</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PRE-TEST HANDWASHING PROTOCOL AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 2</span>
              <h3>Sanitary Handwashing 7-Step Sequence Audit</h3>
            </div>
            <span className="section-status-tag">
              {handwashDistractors.length === 0 ? '✓ ZERO CONTAMINATION' : '⚠️ CROSS-CONTAMINATION DETECTED'}
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Comparison of student submitted sequence against the standard 7-step sanitary protocol:
            </p>

            {/* Timeline Comparison */}
            <div className="sequence-comparison-container">
              <h4 className="table-sub-header">Your Submitted Handwashing Sequence:</h4>
              <div className="submitted-sequence-row">
                {handwashSubmitted.length > 0 ? (
                  handwashSubmitted.map((step, idx) => {
                    const isStepCorrect = step.isCorrect && step.step === idx + 1;
                    const isDistractor = !step.isCorrect;

                    return (
                      <div
                        key={idx}
                        className={`submitted-step-card ${
                          isStepCorrect
                            ? 'step-correct'
                            : isDistractor
                            ? 'step-distractor'
                            : 'step-misplaced'
                        }`}
                      >
                        <div className="step-badge">Step {idx + 1}</div>
                        <div className="step-icon-box">{step.icon}</div>
                        <h6>{step.action}</h6>
                        <p className="step-status-text">
                          {isStepCorrect
                            ? '✓ Correct'
                            : isDistractor
                            ? '🚫 Hazard'
                            : `Expected Step ${step.step}`}
                        </p>
                        {isDistractor && <small className="distractor-note">{step.reason}</small>}
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No steps submitted in pre-test assessment.
                  </p>
                )}
              </div>

              {/* Standard Handwashing Sequence Reference */}
              <h4 className="table-sub-header" style={{ marginTop: '24px' }}>
                Official Standard Protocol Reference:
              </h4>
              <div className="standard-handwashing-list">
                {HANDWASHING_STEPS.filter((s) => s.isCorrect).map((step) => (
                  <div key={step.id} className="std-handwash-row">
                    <span className="std-step-num">Step {step.step}</span>
                    <span className="std-step-icon">{step.icon}</span>
                    <div className="std-step-info">
                      <strong>{step.action}</strong> — <span>{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: PRE-TEST TOOL & EQUIPMENT SAFETY AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 3</span>
              <h3>Laboratory Tool & Equipment Safety Inspection Audit</h3>
            </div>
            <span className="section-status-tag">
              {toolAudit.filter((t) => t.isSafe).length}/{TOOL_INSPECTION_ITEMS.length || 6} Safe Choices
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Inspection records for laboratory utensils and electrical appliances:
            </p>

            <div className="inspection-audit-table-wrap">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Equipment Item</th>
                    <th>Your Selection</th>
                    <th>Safety Verdict</th>
                    <th>Food Safety Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOL_INSPECTION_ITEMS.map((item) => {
                    const recorded = toolAudit.find((t) => t.id === item.id);
                    const chosenOption = recorded?.selectedOption || (recorded?.isSafe ? 'A' : 'B');
                    const isSafe = recorded ? recorded.isSafe : true;

                    return (
                      <tr key={item.id} className={isSafe ? 'row-pass' : 'row-fail'}>
                        <td>
                          <strong>{item.title}</strong>
                        </td>
                        <td>
                          {recorded
                            ? chosenOption === 'A'
                              ? item.optionA.label
                              : item.optionB.label
                            : 'Option A (Sanitary Standard)'}
                        </td>
                        <td>
                          {isSafe ? (
                            <span className="badge-safe">✓ PASSED SAFE</span>
                          ) : (
                            <span className="badge-hazard">⚠️ HAZARD DETECTED</span>
                          )}
                        </td>
                        <td>
                          {isSafe
                            ? item.optionA.isSafe
                              ? item.optionA.feedback
                              : item.optionB.feedback
                            : item.optionA.isSafe
                            ? item.optionB.feedback
                            : item.optionA.feedback}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: PRE-TEST INGREDIENT QUALITY INSPECTION AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 4</span>
              <h3>Raw Ingredient Quality & Spoilage Inspection Audit</h3>
            </div>
            <span className="section-status-tag">
              {ingredientAudit.filter((i) => i.isSafe).length}/{INGREDIENT_INSPECTION_ITEMS.length || 4} Fresh Choices
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Quality control assessment of raw coconut pith, starch, seasonings, and frying oil:
            </p>

            <div className="inspection-audit-table-wrap">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Ingredient Material</th>
                    <th>Inspected Selection</th>
                    <th>Quality Verdict</th>
                    <th>Food Chemistry / Spoilage Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {INGREDIENT_INSPECTION_ITEMS.map((item) => {
                    const recorded = ingredientAudit.find((i) => i.id === item.id);
                    const chosenOption = recorded?.selectedOption || (recorded?.isSafe ? 'A' : 'B');
                    const isSafe = recorded ? recorded.isSafe : true;

                    return (
                      <tr key={item.id} className={isSafe ? 'row-pass' : 'row-fail'}>
                        <td>
                          <strong>{item.title}</strong>
                        </td>
                        <td>
                          {recorded
                            ? chosenOption === 'A'
                              ? item.optionA.label
                              : item.optionB.label
                            : 'Option A (Grade A Fresh)'}
                        </td>
                        <td>
                          {isSafe ? (
                            <span className="badge-safe">✓ GRADE A FRESH</span>
                          ) : (
                            <span className="badge-hazard">⚠️ CONTAMINATED</span>
                          )}
                        </td>
                        <td>
                          {isSafe
                            ? item.optionA.isSafe
                              ? item.optionA.feedback
                              : item.optionB.feedback
                            : item.optionA.isSafe
                            ? item.optionB.feedback
                            : item.optionA.feedback}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: POST-TEST MANUFACTURING SEQUENCE & FOOD SCIENCE AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Post-Test Task 5</span>
              <h3>Manufacturing Lifecycle Sequence & Food Science Principles</h3>
            </div>
            <span className="section-status-tag">
              {sequenceCorrectCount}/8 Stages Correctly Positioned
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Comprehensive food technology breakdown of the 8 production stages from raw coconut pith to finished packaged snacks:
            </p>

            <div className="stage-science-cards-stack">
              {STAGE_SCIENCE_FACTS.map((stage) => {
                const userStageAtPos = sequenceSubmitted[stage.step - 1];
                const wasCorrectAtPos = userStageAtPos?.stepNum === stage.step;

                return (
                  <div key={stage.step} className="stage-science-card">
                    <div className="stage-science-left">
                      <div className="stage-science-num">Stage {stage.step}</div>
                      <div className="stage-science-icon">{stage.icon}</div>
                    </div>
                    <div className="stage-science-body">
                      <div className="stage-science-title-row">
                        <h4>{stage.name}</h4>
                        {sequenceSubmitted.length > 0 && (
                          <span
                            className={`stage-order-verdict ${
                              wasCorrectAtPos ? 'order-pass' : 'order-misplaced'
                            }`}
                          >
                            {wasCorrectAtPos
                              ? '✓ Ordered Correctly in Post-Test'
                              : `⚠️ Submitted: ${userStageAtPos?.title || 'Misplaced'}`}
                          </span>
                        )}
                      </div>
                      <p className="stage-science-explanation">
                        <strong>Food Science Principle:</strong> {stage.foodScience}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <div className="results-actions-bar">
          <button className="btn-gold btn-print-report" onClick={handlePrint}>
            <span>🖨️ Print / Save Comprehensive Audit Report (PDF)</span>
          </button>
          <button className="btn-primary" onClick={() => setScene('sequencing')}>
            <span>🔄 Retake Post-Test Sequence</span>
          </button>
          <button className="btn-secondary" onClick={resetGame}>
            <span>🥥 Process New Laboratory Batch</span>
          </button>
        </div>

        {/* Scroll bottom clearance spacer */}
        <div style={{ height: '40px', flexShrink: 0 }} />
      </div>

      {/* 20% Right Column Results & Credentials Sidebar */}
      <ResultsSidebar />
    </div>
  );
};
