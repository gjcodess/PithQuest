import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { ResultsSidebar } from '../components/ResultsSidebar';
import { PPE_ITEMS, HANDWASHING_STEPS } from '../data/orientationData';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';
import { STAGE_QUESTIONS } from '../data/stageQuestionsData';

const STAGE_SCIENCE_FACTS = [
  {
    step: 1,
    name: 'Washing & Boiling Ubod',
    img: '/assets/card_step_boiling.png',
    fallbackIcon: '🥥',
    foodScience: 'Hydrothermal softening breaks down stubborn cellulosic fibers in coconut pith, solubilizing cellular walls for optimal pureeing while inactivating polyphenol oxidase to prevent discoloration.',
  },
  {
    step: 2,
    name: 'Pureeing & Grinding',
    img: '/assets/card_step_grinding.png',
    fallbackIcon: '⚡',
    foodScience: 'High-shear mechanical processing homogenizes boiled pith fibers into a uniform microscopic matrix, preventing grittiness and ensuring consistent hydration with starch polymers.',
  },
  {
    step: 3,
    name: 'Paste Formulation (1:1 Ratio)',
    img: '/assets/card_step_mixing.png',
    fallbackIcon: '🥣',
    foodScience: 'The 1:1 ratio of ubod puree to Erawan rice flour provides balanced amylose/amylopectin starch chains, creating the ideal cohesive dough viscoelasticity needed for structural puffing.',
  },
  {
    step: 4,
    name: 'Rectangular Molding (50mm x 25mm)',
    img: '/assets/card_step_molding.png',
    fallbackIcon: '🥖',
    foodScience: 'Standardized dimensions ensure uniform thermal conductivity and moisture diffusion during steaming and dehydration, preventing uneven core drying or blistering.',
  },
  {
    step: 5,
    name: 'Starch Steaming (10 min Gelatinization)',
    img: '/assets/card_step_steaming.png',
    fallbackIcon: '♨️',
    foodScience: 'Moist heat at 100°C ruptures starch granules, causing irreversible gelatinization that locks the wafer shape into an extensible viscoelastic gel matrix capable of holding steam bubbles.',
  },
  {
    step: 6,
    name: 'Cabinet Dehydration (90°C to <10% Moisture)',
    img: '/assets/card_step_dehydration.png',
    fallbackIcon: '☀️',
    foodScience: 'Controlled convective drying evaporates free water below 10% critical moisture, setting the glassy amorphous starch state essential for rapid steam expansion upon frying.',
  },
  {
    step: 7,
    name: 'Flash Deep Frying (180°C, 10 sec, 3x Puffing)',
    img: '/assets/card_step_frying.png',
    fallbackIcon: '🍳',
    foodScience: 'Submerged in 180°C oil, residual bound water instantaneously flashes into superheated steam. The rapid vapor pressure inflates the gelatinized matrix 3x before setting into an airy, brittle crunch.',
  },
  {
    step: 8,
    name: 'Hermetic Packaging & Labeling (50g)',
    img: '/assets/card_step_packaging.png',
    fallbackIcon: '📦',
    foodScience: 'High-barrier sealed foil pouches prevent water vapor ingress (preventing starch retrogradation and staleness) and shield against lipid photo-oxidation, securing a 6-month shelf life.',
  },
];

export const ResultsScene = () => {
  const {
    studentName,
    badges,
    resetGame,
    speak,
    setScene,
    completeMission,
    assessmentResults,
    stageAnswers,
  } = useGame();

  const reportRef = useRef(null);

  useEffect(() => {
    try {
      completeMission('sequencing');
      completeMission('evaluation');
      soundManager.playFanfare();
      speak(
        `Assessment Complete, ${studentName || 'Food Technologist'}! Here is your comprehensive diagnostic performance report. Review your Pre-Test choices, Handwashing sequence, Equipment safety audits, Stage Pre-Check Questions, and Post-Test manufacturing pipeline validation.`,
        'happy',
        {
          badge: 'Diagnostic Report Ready',
          note: 'Inspect itemized feedback, food science principles, and print your complete diagnostic audit report.',
          hint: 'Scroll down to review each section of your assessment and save/print your report.',
          hideButton: true,
        }
      );
    } catch (err) {
      console.warn('ResultsScene mount error:', err);
    }
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
  const ppeDistractors = Array.isArray(ppeAudit?.distractorsPicked) ? ppeAudit.distractorsPicked : [];
  const ppeCorrectSelected = Array.isArray(ppeAudit?.correctSelected) ? ppeAudit.correctSelected : [];
  const ppeTotalCorrect = ppeAudit?.totalCorrect || 6;

  // Pre-Test Handwashing Audit Data
  const handwashAudit = assessmentResults?.preTest?.handwashing;
  const handwashSubmitted = Array.isArray(handwashAudit?.submittedSteps) ? handwashAudit.submittedSteps : [];
  const handwashDistractors = Array.isArray(handwashAudit?.distractorsIncluded) ? handwashAudit.distractorsIncluded : [];
  const hwCorrectCount = handwashSubmitted.filter((s, idx) => s && s.isCorrect && s.step === idx + 1).length;

  // Pre-Test Tools Audit Data
  const toolAudit = Array.isArray(assessmentResults?.preTest?.toolSafety) ? assessmentResults.preTest.toolSafety : [];
  const toolSafeCount = toolAudit.filter((t) => t?.isSafe).length;

  // Pre-Test Ingredients Audit Data
  const ingredientAudit = Array.isArray(assessmentResults?.preTest?.qualityInspection) ? assessmentResults.preTest.qualityInspection : [];
  const ingredientSafeCount = ingredientAudit.filter((i) => i?.isSafe).length;

  // Stage Pre-Checks Audit Data
  const stageKeys = ['mission1', 'mission2', 'mission3', 'mission4', 'mission5', 'mission6', 'mission7', 'mission8'];
  const stageAnswersList = stageKeys.map((key) => stageAnswers?.[key] || null);
  const stageCorrectCount = stageAnswersList.filter((a) => a?.isCorrect).length;

  // Post-Test Sequencing Audit Data
  const sequenceAudit = assessmentResults?.postTest?.sequencing;
  const sequenceSubmitted = Array.isArray(sequenceAudit?.submittedItems) ? sequenceAudit.submittedItems : [];
  const sequenceCorrectCount = sequenceAudit?.correctCount ?? (sequenceAudit?.isCorrect ? 8 : 0);

  // Module Completion Breakdown (No scores/points)
  const modulesSummary = [
    {
      task: 'Pre-Test Task 1: PPE Attire Selection',
      icon: '🥼',
      criteria: '6 food-grade protective barriers identified & hazardous attire avoided',
      status: ppeDistractors.length === 0 && ppeCorrectSelected.length >= 5 ? 'COMPLIANT' : 'HAZARDS FLAGGED',
      isPass: ppeDistractors.length === 0,
      detail: `${ppeCorrectSelected.length}/${ppeTotalCorrect} items verified (${ppeDistractors.length} hazards)`,
    },
    {
      task: 'Pre-Test Task 2: Sanitary Handwashing Sequence',
      icon: '🧼',
      criteria: 'WHO 7-step chronological hygiene order without cross-contamination',
      status: handwashDistractors.length === 0 && hwCorrectCount === 7 ? 'ZERO CONTAMINATION' : 'REVIEW PROTOCOL',
      isPass: handwashDistractors.length === 0 && hwCorrectCount >= 6,
      detail: `${hwCorrectCount}/7 steps in order (${handwashDistractors.length} hazards)`,
    },
    {
      task: 'Pre-Test Task 3: Tool & Equipment Safety Inspection',
      icon: '🔍',
      criteria: 'Sanitary blades, intact cords, food-grade materials & undamaged appliances',
      status: toolSafeCount >= 5 ? 'PASSED SAFE' : 'HAZARDS FLAGGED',
      isPass: toolSafeCount >= 5,
      detail: `${toolSafeCount}/${TOOL_INSPECTION_ITEMS.length || 6} safe equipment verified`,
    },
    {
      task: 'Pre-Test Task 4: Raw Material Quality Inspection',
      icon: '🥥',
      criteria: 'Fresh coconut pith, unexpired rice flour, pure sea salt & fresh oil',
      status: ingredientSafeCount >= 3 ? 'GRADE A FRESH' : 'SPOILED FLAGGED',
      isPass: ingredientSafeCount >= 3,
      detail: `${ingredientSafeCount}/${INGREDIENT_INSPECTION_ITEMS.length || 4} fresh ingredients verified`,
    },
    {
      task: 'Stage Pre-Check Questions (Stages 1–8)',
      icon: '📝',
      criteria: 'Key food technology principles assessed prior to interactive cooking',
      status: `${stageCorrectCount}/8 MASTERED`,
      isPass: stageCorrectCount >= 6,
      detail: `${stageCorrectCount}/8 food science pre-check questions answered correctly`,
    },
    {
      task: 'Interactive Workstation Lessons (Stages 1–8)',
      icon: '🎓',
      criteria: 'Hands-on practical manufacturing simulations & SOP training',
      status: 'ALL 8 STAGES COMPLETED',
      isPass: true,
      detail: '8 practical workstation simulations completed',
    },
    {
      task: 'Post-Test Task 7: Manufacturing Stage Sequencing',
      icon: '🔄',
      criteria: 'Chronological reconstruction of the authentic 8-stage manufacturing lifecycle',
      status: sequenceCorrectCount === 8 ? 'PERFECT SEQUENCE' : `${sequenceCorrectCount}/8 CORRECT`,
      isPass: sequenceCorrectCount >= 7,
      detail: `${sequenceCorrectCount}/8 stages correctly positioned in sequence`,
    },
  ];

  // Overall Performance Level
  const totalCorrectAssessments =
    (ppeCorrectSelected.length >= 5 ? 1 : 0) +
    (handwashDistractors.length === 0 && handwashSubmitted.length === 7 ? 1 : 0) +
    (toolSafeCount >= 5 ? 1 : 0) +
    (ingredientSafeCount >= 3 ? 1 : 0) +
    (stageCorrectCount >= 6 ? 1 : 0) +
    (sequenceCorrectCount >= 7 ? 1 : 0);

  const competencyLevel =
    totalCorrectAssessments >= 5
      ? 'Master Food Technologist (Advanced Competency)'
      : totalCorrectAssessments >= 3
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
            <span>Instructional Assessment & Science Competency Report</span>
            <br />
            <span>
              Candidate: <strong>{studentName || 'Food Technology Student'}</strong> • Date: {currentDate}
            </span>
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
            <div className="res-metric-icon-box">
              <span>🎯</span>
            </div>
            <h4>Audit Status</h4>
            <div className="res-score-highlight" style={{ fontSize: '1.25rem', color: '#16a34a' }}>
              100% Completed
            </div>
            <p>Pre-Test, 8 Interactive Stages, Pre-Checks & Post-Test</p>
          </div>

          <div className="res-metric-box">
            <div className="res-metric-icon-box">
              <span>🥼</span>
            </div>
            <h4>Pre-Test PPE & Hygiene</h4>
            <div className="res-score-highlight" style={{ fontSize: '1.25rem' }}>
              {ppeDistractors.length === 0 && handwashDistractors.length === 0 && hwCorrectCount === 7
                ? '✓ Compliant'
                : `${ppeCorrectSelected.length}/${ppeTotalCorrect} PPE • ${hwCorrectCount}/7 Steps`}
            </div>
            <p>
              {ppeDistractors.length === 0 && handwashDistractors.length === 0
                ? `${ppeCorrectSelected.length}/${ppeTotalCorrect} PPE verified • ${hwCorrectCount}/7 hygiene steps`
                : `${ppeDistractors.length + handwashDistractors.length} hazard(s) flagged during pre-test`}
            </p>
          </div>

          <div className="res-metric-box">
            <div className="res-metric-icon-box">
              <span>📝</span>
            </div>
            <h4>Stage Pre-Checks</h4>
            <div className="res-score-highlight" style={{ fontSize: '1.25rem' }}>
              {stageCorrectCount}/8 Mastered
            </div>
            <p>Key food technology questions across Stages 1–8</p>
          </div>

          <div className="res-metric-box">
            <div className="res-metric-icon-box">
              <span>🔄</span>
            </div>
            <h4>Post-Test Sequence</h4>
            <div className="res-score-highlight" style={{ fontSize: '1.25rem' }}>
              {sequenceCorrectCount}/8 Stages
            </div>
            <p>{sequenceCorrectCount}/8 stages correctly positioned in sequence</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODULE COMPLETION & COMPETENCY SUMMARY TABLE */}
        {/* ========================================================================= */}
        <section className="results-section-card results-score-rubric-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Overview</span>
              <h3>Laboratory Evaluation & Competency Completion Summary</h3>
            </div>
            <span className="section-status-tag">
              All Modules Completed
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Comprehensive diagnostic breakdown across all pre-test baseline assessments, stage entry food technology checks, interactive laboratory simulations, and post-test process sequencing:
            </p>

            <div className="scoring-rubric-wrap">
              <table className="rubric-table">
                <thead>
                  <tr>
                    <th>Evaluation Module / Task</th>
                    <th>Operating Criteria & Audit Details</th>
                    <th style={{ textAlign: 'center', width: '220px' }}>Diagnostic Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modulesSummary.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="rubric-stage-cell">
                          <span className="rubric-stage-icon">{item.icon}</span>
                          <div>
                            <div>{item.task}</div>
                            <small style={{ color: '#854d0e', fontWeight: 600 }}>{item.detail}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.criteria}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className="rubric-pts-pill"
                          style={{
                            background: item.isPass ? '#dcfce7' : '#fee2e2',
                            color: item.isPass ? '#15803d' : '#b91c1c',
                            borderColor: item.isPass ? '#86efac' : '#fca5a5',
                            boxShadow: item.isPass ? '0 2px 0 #bbf7d0' : '0 2px 0 #fecaca',
                            fontWeight: 800,
                            padding: '6px 14px',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: PRE-TEST PPE ATTIRE DIAGNOSTIC AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card results-diagnostic-audit-card">
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
                          <span className="verdict-good">✓ Correctly Equipped (Required PPE)</span>
                        )}
                        {isCorrect && !wasSelected && (
                          <span className="verdict-warn">⚠️ Missed Required Gear</span>
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
        <section className="results-section-card results-diagnostic-audit-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 2</span>
              <h3>Sanitary Handwashing 7-Step Sequence Audit</h3>
            </div>
            <span className="section-status-tag">
              {handwashDistractors.length === 0 && hwCorrectCount === 7 ? '✓ ZERO CONTAMINATION' : '⚠️ HAZARDS DETECTED'}
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
        <section className="results-section-card results-diagnostic-audit-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 3</span>
              <h3>Laboratory Tool & Equipment Safety Inspection Audit</h3>
            </div>
            <span className="section-status-tag">
              {toolSafeCount}/{TOOL_INSPECTION_ITEMS.length || 6} Safe Choices
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
                    const isSafe = recorded !== undefined ? Boolean(recorded.isSafe) : true;

                    return (
                      <tr key={item.id} className={isSafe ? 'row-pass' : 'row-fail'}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          {isSafe ? item.safe?.name : (recorded?.selectedName || item.damaged?.name)}
                        </td>
                        <td>
                          {isSafe ? (
                            <span className="badge-safe">✓ PASSED SAFE</span>
                          ) : (
                            <span className="badge-hazard">⚠️ HAZARD DETECTED</span>
                          )}
                        </td>
                        <td>
                          {isSafe ? item.safe?.reason : item.damaged?.reason}
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
        <section className="results-section-card results-diagnostic-audit-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Pre-Test Task 4</span>
              <h3>Raw Ingredient Quality & Spoilage Inspection Audit</h3>
            </div>
            <span className="section-status-tag">
              {ingredientSafeCount}/{INGREDIENT_INSPECTION_ITEMS.length || 4} Fresh Choices
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
                    const isSafe = recorded !== undefined ? Boolean(recorded.isSafe) : true;

                    return (
                      <tr key={item.id} className={isSafe ? 'row-pass' : 'row-fail'}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          {isSafe ? item.safe?.name : (recorded?.selectedName || item.damaged?.name)}
                        </td>
                        <td>
                          {isSafe ? (
                            <span className="badge-safe">✓ GRADE A FRESH</span>
                          ) : (
                            <span className="badge-hazard">⚠️ CONTAMINATED</span>
                          )}
                        </td>
                        <td>
                          {isSafe ? item.safe?.reason : item.damaged?.reason}
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
        {/* SECTION 5: STAGE PRE-CHECK QUESTIONS DIAGNOSTIC AUDIT (STAGES 1–8) */}
        {/* ========================================================================= */}
        <section className="results-section-card results-diagnostic-audit-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Section 5</span>
              <h3>Stage Pre-Check Questions Diagnostic Audit (Stages 1–8)</h3>
            </div>
            <span className="section-status-tag">
              {stageCorrectCount}/8 Questions Mastered
            </span>
          </div>

          <div className="audit-content-block">
            <p className="audit-lead-text">
              Detailed evaluation of student answers chosen prior to each production stage, showing accuracy status, rationale, and underlying food technology principles:
            </p>

            <div className="stage-questions-review-stack">
              {stageKeys.map((stageKey, idx) => {
                const qData = STAGE_QUESTIONS[stageKey];
                const stageFact = STAGE_SCIENCE_FACTS[idx];
                const studentAnswer = stageAnswers?.[stageKey];
                const isAnswered = Boolean(studentAnswer);
                const isCorrect = Boolean(studentAnswer?.isCorrect);
                const correctChoice = qData.choices.find((c) => c.isCorrect);

                return (
                  <div key={stageKey} className="stage-question-review-card">
                    {/* Main Body Content */}
                    <div className="stage-question-review-body">
                      <div className="stage-question-review-header">
                        <div className="stage-question-title-group">
                          <span className="stage-question-stage-tag">{qData.stageTitle}</span>
                          <h4 className="stage-question-title">
                            {idx + 1}. {qData.question}
                          </h4>
                        </div>
                        {isAnswered ? (
                          <span
                            className={`stage-question-verdict ${
                              isCorrect ? 'verdict-correct' : 'verdict-wrong'
                            }`}
                          >
                            {isCorrect ? '✓ CORRECT CHOICE' : '⚠️ INCORRECT CHOICE'}
                          </span>
                        ) : (
                          <span className="stage-question-verdict verdict-correct">
                            ✓ STANDARD PROCEDURE
                          </span>
                        )}
                      </div>

                      {/* Student's Selected Answer */}
                      <div
                        className={`stage-answer-box ${
                          !isAnswered || isCorrect ? 'answer-correct-highlight' : 'answer-wrong-highlight'
                        }`}
                      >
                        <div className="stage-answer-badge">
                          {!isAnswered || isCorrect ? '✓ Your Submitted Answer:' : '⚠️ Your Submitted Answer:'}
                        </div>
                        <div className="stage-answer-content">
                          {studentAnswer
                            ? `${studentAnswer.selectedOptionId?.toUpperCase()}. ${studentAnswer.selectedText}`
                            : `${correctChoice?.id?.toUpperCase()}. ${correctChoice?.text}`}
                        </div>
                      </div>

                      {/* If Incorrect, show Correct Reference Choice */}
                      {isAnswered && !isCorrect && correctChoice && (
                        <div className="stage-correct-reference">
                          <div className="stage-correct-badge">✓ Recommended Standard Procedure:</div>
                          <div className="stage-correct-content">
                            {correctChoice.id.toUpperCase()}. {correctChoice.text}
                          </div>
                        </div>
                      )}

                      {/* Food Science Explanation */}
                      <div className="stage-science-rationale">
                        <div className="stage-rationale-title">
                          <span>🔬</span>
                          <strong>Food Science Principle & Quality Control Rationale:</strong>
                        </div>
                        <p className="stage-rationale-text">{qData.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: POST-TEST MANUFACTURING SEQUENCE & FOOD SCIENCE AUDIT */}
        {/* ========================================================================= */}
        <section className="results-section-card results-diagnostic-audit-card">
          <div className="section-card-header">
            <div className="section-title-wrap">
              <span className="section-num-badge">Post-Test Task 6</span>
              <h3>Manufacturing Lifecycle Sequence & Food Science Principles</h3>
            </div>
            <span className="section-status-tag">
              {sequenceCorrectCount}/8 Correctly Positioned
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
                      <img
                        src={stage.img}
                        alt={stage.name}
                        className="stage-science-img"
                      />
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
          <button className="btn-primary" onClick={handlePrint}>
            <span>Print / Save Comprehensive Audit Report (PDF)</span>
          </button>
          <button className="btn-secondary" onClick={resetGame}>
            <span>Process New Laboratory Batch</span>
          </button>
        </div>

        {/* Scroll bottom clearance spacer */}
        <div className="results-scroll-spacer" style={{ height: '40px', flexShrink: 0 }} />
      </div>

      {/* 20% Right Column Results & Credentials Sidebar */}
      <ResultsSidebar />
    </div>
  );
};
