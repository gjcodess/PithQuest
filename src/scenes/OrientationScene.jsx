import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { LECTURE_CONCEPTS, PPE_ITEMS } from '../data/orientationData';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';
import { MinigameInspection } from '../components/MinigameInspection';
import { HandwashingSequenceActivity } from '../components/HandwashingSequenceActivity';
import { OrientationSidebar } from '../components/OrientationSidebar';

export const OrientationScene = () => {
  const {
    studentName,
    setScene,
    addScore,
    speak,
    completeMission,
    showToast,
    missionsCompleted,
    recordPreTestPpe,
    recordPreTestHandwash,
    recordPreTestTool,
    recordPreTestIngredient,
  } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.orientation);

  // PRE-TEST Sub-phases: 'lecture' | 'ppe' | 'sanitation' | 'tool_inspection' | 'ingredient_inspection'
  const [phase, setPhase] = useState('lecture');
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);

  // PPE states (selection tracking for all 8 items in bank)
  const [ppeEquipped, setPpeEquipped] = useState(() => ({
    hairnet: isAlreadyCompleted,
    apron: isAlreadyCompleted,
    mask: isAlreadyCompleted,
    gloves: isAlreadyCompleted,
    heat_gloves: isAlreadyCompleted,
    shoes: isAlreadyCompleted,
    distractor_scarf: false,
    distractor_goggles: false,
  }));

  // Sub-phase completion states for subnav checkmarks
  const [scienceDone, setScienceDone] = useState(() => isAlreadyCompleted);
  const [ppeDone, setPpeDone] = useState(() => isAlreadyCompleted);
  const [handwashingDone, setHandwashingDone] = useState(() => isAlreadyCompleted);
  const [toolSafetyDone, setToolSafetyDone] = useState(() => isAlreadyCompleted);
  const [qualityInspectionDone, setQualityInspectionDone] = useState(() => isAlreadyCompleted);

  useEffect(() => {
    if (phase !== 'lecture') {
      setScienceDone(true);
    }

    if (phase === 'lecture') {
      speak(
        `Welcome to the Pre-Test Assessment, ${studentName || 'Food Technologist'}! Review these essential science concepts before we begin your diagnostic orientation evaluation.`,
        'neutral',
        {
          badge: 'Pre-Test: Science Foundation',
          note: 'Coconut pith cracker snack utilizes an agricultural by-product (ubod) to create a nutritious, crispy snack while exploring food innovation.',
          btnText: 'Proceed to PPE Attire ➔',
          onNext: () => {
            setScienceDone(true);
            setPhase('ppe');
          },
        }
      );
    } else if (phase === 'ppe') {
      speak(
        'Diagnostic Pre-Test (Task 1: PPE Attire): Select the personal protective equipment you consider required for sanitary food processing.',
        'thinking',
        {
          badge: 'Pre-Test: PPE Attire',
          note: 'Select all standard food-grade protective gear. Beware of non-approved or hazardous items!',
          hint: 'Click to select all required gear, then click Confirm PPE Attire.',
          hideButton: true,
        }
      );
    } else if (phase === 'sanitation') {
      speak(
        'Diagnostic Pre-Test (Task 2: Handwashing Sequence): Arrange the 7 handwashing steps in their strict chronological order. Avoid 3 distractor hazards!',
        'happy',
        {
          badge: 'Pre-Test: Sanitation Protocol',
          note: 'Drag or tap cards into Step slots 1 through 7. Your sequence will be recorded for the final Results diagnostic audit.',
          hint: 'Arrange the sequence from first water contact to drying.',
          hideButton: true,
        }
      );
    } else if (phase === 'tool_inspection') {
      speak(
        'Diagnostic Pre-Test (Task 3: Tool & Equipment Safety): Inspect each equipment pair and select the safe, food-grade option.',
        'neutral',
        {
          badge: 'Pre-Test: Tool Safety',
          note: 'Safety Check: Examine blades, cords, and surfaces for cracks, rust, or electrical hazards.',
          hint: 'Select Option A or Option B for each tool.',
          hideButton: true,
        }
      );
    } else if (phase === 'ingredient_inspection') {
      speak(
        'Diagnostic Pre-Test (Task 4: Ingredient Quality Inspection): Inspect raw materials and choose the fresh, uncontaminated food items.',
        'neutral',
        {
          badge: 'Pre-Test: Ingredient Quality',
          note: 'Check color, texture, expiration, and packaging integrity for all ingredients.',
          hint: 'Select the fresh, sanitary option for each ingredient.',
          hideButton: true,
        }
      );
    }
  }, [phase, studentName]);

  // PPE toggle handler (non-blocking selection)
  const handleTogglePpe = (item) => {
    soundManager.playClick();
    const updated = { ...ppeEquipped, [item.id]: !ppeEquipped[item.id] };
    setPpeEquipped(updated);
  };

  const handleConfirmPpe = () => {
    soundManager.playSuccess();
    setPpeDone(true);

    const selectedIds = Object.keys(ppeEquipped).filter((k) => ppeEquipped[k]);
    const correctItems = PPE_ITEMS.filter((i) => i.isCorrect);
    const correctSelected = correctItems.filter((i) => ppeEquipped[i.id]).map((i) => i.id);
    const distractorsPicked = PPE_ITEMS.filter((i) => !i.isCorrect && ppeEquipped[i.id]).map((i) => ({
      id: i.id,
      name: i.name,
      reason: i.reason,
    }));

    recordPreTestPpe({
      selectedIds,
      correctIds: correctItems.map((i) => i.id),
      correctSelected,
      distractorsPicked,
      totalCorrect: correctItems.length,
      score: correctSelected.length * 10,
    });

    addScore(correctSelected.length * 10);
    showToast('PPE Recorded', `${selectedIds.length} item(s) selected for diagnostic assessment`, 'info');
    setPhase('sanitation');
  };

  // Handwashing completion handler
  const handleHandwashComplete = (handwashData) => {
    setHandwashingDone(true);
    recordPreTestHandwash(handwashData);

    const correctCount = (handwashData.submittedSteps || []).filter(
      (step, idx) => step.isCorrect && step.step === idx + 1
    ).length;
    addScore(correctCount * 10);

    showToast('Handwashing Recorded', 'Sequence logged for diagnostic evaluation', 'info');
    setPhase('tool_inspection');
  };

  // Tool Safety recording handler
  const handleToolItemRecorded = (toolChoice) => {
    recordPreTestTool(toolChoice);
    if (toolChoice.isSafe) {
      addScore(15);
    }
  };

  // Ingredient Quality recording handler & direct transition to Stage 1
  const handleIngredientItemRecorded = (ingredientChoice) => {
    recordPreTestIngredient(ingredientChoice);
    if (ingredientChoice.isSafe) {
      addScore(15);
    }
  };

  const handleFinishPreTest = () => {
    soundManager.playFanfare();
    setQualityInspectionDone(true);
    completeMission('orientation');
    showToast('Pre-Test Complete!', 'Entering Stage 1: Washing & Boiling Laboratory', 'success');

    speak(
      `Pre-Test Completed, ${studentName || 'Food Technologist'}! All your baseline diagnostic answers have been recorded. You are now entering Stage 1: Washing & Boiling!`,
      'happy',
      {
        badge: 'Entering Laboratory',
        note: 'Apply safe handling and sanitary technique as you begin processing fresh coconut pith.',
        btnText: 'Start Stage 1: Washing & Boiling ➔',
        onNext: () => setScene('mission1'),
      }
    );

    setTimeout(() => {
      setScene('mission1');
    }, 1200);
  };

  const selectedPpeCount = Object.values(ppeEquipped).filter(Boolean).length;

  return (
    <div className="workstation-scene orientation-scene">
      <div className="workstation-overlay" />

      {/* Sub-phase navigation indicator */}
      <div className="orientation-subnav-container">
        <nav className="orientation-subnav" aria-label="Laboratory Pre-Test Stages">
          <button
            className={`subnav-pill ${phase === 'lecture' ? 'active' : ''} ${scienceDone ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('lecture');
            }}
          >
            <span className="subnav-pill-icon">📚</span>
            <span className="subnav-pill-label">1. Science Concepts</span>
            {scienceDone && <span className="subnav-pill-check">✓</span>}
          </button>
          <button
            className={`subnav-pill ${phase === 'ppe' ? 'active' : ''} ${ppeDone ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('ppe');
            }}
          >
            <span className="subnav-pill-icon">🥼</span>
            <span className="subnav-pill-label">2. PPE Attire</span>
            {ppeDone && <span className="subnav-pill-check">✓</span>}
          </button>
          <button
            className={`subnav-pill ${phase === 'sanitation' ? 'active' : ''} ${handwashingDone ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('sanitation');
            }}
          >
            <span className="subnav-pill-icon">🧼</span>
            <span className="subnav-pill-label">3. Handwashing</span>
            {handwashingDone && <span className="subnav-pill-check">✓</span>}
          </button>
          <button
            className={`subnav-pill ${phase === 'tool_inspection' ? 'active' : ''} ${toolSafetyDone ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('tool_inspection');
            }}
          >
            <span className="subnav-pill-icon">🔍</span>
            <span className="subnav-pill-label">4. Tool Safety</span>
            {toolSafetyDone && <span className="subnav-pill-check">✓</span>}
          </button>
          <button
            className={`subnav-pill ${phase === 'ingredient_inspection' ? 'active' : ''} ${qualityInspectionDone ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('ingredient_inspection');
            }}
          >
            <span className="subnav-pill-icon">🥥</span>
            <span className="subnav-pill-label">5. Quality Inspection</span>
            {qualityInspectionDone && <span className="subnav-pill-check">✓</span>}
          </button>
        </nav>
      </div>

      <div className="stage-center-zone">
        {/* PHASE 1: LECTURE & SCIENCE CONCEPTS */}
        {phase === 'lecture' && (
          <div className="active-vessel-card orientation-card">
            <div className="vessel-top-badge">Core Food Technology Foundations</div>
            <div className="vessel-header">
              <span className="vessel-title">Laboratory Science & Definitions</span>
              <span className="vessel-badge">Concept {activeConceptIndex + 1} of {LECTURE_CONCEPTS.length}</span>
            </div>
            <div className="vessel-header-divider" />

            <div className="lecture-display-area">
              <div className="concept-card-expanded">
                <div className="concept-icon-big">{LECTURE_CONCEPTS[activeConceptIndex].icon}</div>
                <div className="concept-content">
                  <span className="concept-tag">{LECTURE_CONCEPTS[activeConceptIndex].tag}</span>
                  <h3 className="concept-heading">{LECTURE_CONCEPTS[activeConceptIndex].title}</h3>
                  <p className="concept-summary">{LECTURE_CONCEPTS[activeConceptIndex].summary}</p>
                  <div className="concept-deepdive">
                    <strong>Laboratory Significance:</strong> {LECTURE_CONCEPTS[activeConceptIndex].details}
                  </div>
                </div>
              </div>

              {/* Concept Selector Buttons */}
              <div className="concept-pagination-row">
                {LECTURE_CONCEPTS.map((concept, idx) => (
                  <button
                    key={concept.id}
                    className={`concept-bullet ${idx === activeConceptIndex ? 'active' : ''}`}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveConceptIndex(idx);
                    }}
                  >
                    <span>{concept.icon} {concept.title}</span>
                  </button>
                ))}
              </div>

              <div className="orientation-btn-row">
                <button
                  className="btn-secondary"
                  disabled={activeConceptIndex === 0}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveConceptIndex((prev) => Math.max(0, prev - 1));
                  }}
                  style={{
                    opacity: activeConceptIndex === 0 ? 0.35 : 1,
                    cursor: activeConceptIndex === 0 ? 'not-allowed' : 'pointer',
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                  }}
                >
                  ◀ Previous
                </button>

                <div className="concept-dots-indicator">
                  {LECTURE_CONCEPTS.map((_, idx) => (
                    <span
                      key={idx}
                      className={`concept-dot ${idx === activeConceptIndex ? 'active' : ''}`}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveConceptIndex(idx);
                      }}
                      title={`Jump to Concept ${idx + 1}`}
                    />
                  ))}
                </div>

                {activeConceptIndex < LECTURE_CONCEPTS.length - 1 ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      soundManager.playClick();
                      const nextIdx = activeConceptIndex + 1;
                      setActiveConceptIndex(nextIdx);
                      if (nextIdx === LECTURE_CONCEPTS.length - 1) {
                        setScienceDone(true);
                      }
                    }}
                    style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                  >
                    Next Concept ▶
                  </button>
                ) : (
                  <button
                    className="btn-primary btn-gold"
                    onClick={() => {
                      soundManager.playClick();
                      setScienceDone(true);
                      setPhase('ppe');
                    }}
                    style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                  >
                    Proceed to PPE Attire Pre-Test ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: PPE ATTIRE SELECTION (Diagnostic Selection) */}
        {phase === 'ppe' && (
          <div className="active-vessel-card orientation-card ppe-card">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Attire & Safety Standards</div>
            <div className="vessel-header">
              <span className="vessel-title">Personal Protective Equipment (PPE) Selection</span>
              <span className="vessel-badge">
                {selectedPpeCount} Selected
              </span>
            </div>
            <div className="vessel-header-divider" />

            <p className="section-instruction">
              Click to select all protective attire required for food preparation. Avoid unapproved or hazardous gear:
            </p>

            <div className="ppe-items-grid">
              {PPE_ITEMS.map((item) => {
                const isSelected = ppeEquipped[item.id];
                return (
                  <div
                    key={item.id}
                    className={`ppe-box ${isSelected ? 'equipped' : ''}`}
                    onClick={() => handleTogglePpe(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={item.img} alt={item.name} className="ppe-icon-img" />
                    <div className="gear-details">
                      <h4 className="ppe-name">{item.name}</h4>
                      <p className="ppe-desc">{item.role}</p>
                    </div>
                    <div className={`gear-status-badge ${isSelected ? 'worn' : 'pending'}`}>
                      {isSelected ? '✓ Selected' : '👆 Click to Select'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <button
                className="btn-primary btn-gold"
                onClick={handleConfirmPpe}
                disabled={selectedPpeCount === 0}
                style={{ opacity: selectedPpeCount === 0 ? 0.5 : 1, padding: '12px 32px', fontSize: '1rem' }}
              >
                Confirm PPE Attire & Proceed to Handwashing ➔
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: HANDWASHING SEQUENCE PUZZLE */}
        {phase === 'sanitation' && (
          <div className="active-vessel-card orientation-card">
            <HandwashingSequenceActivity onComplete={handleHandwashComplete} />
          </div>
        )}

        {/* PHASE 4: TOOL SAFETY INSPECTION MINIGAME */}
        {phase === 'tool_inspection' && (
          <div className="active-vessel-card orientation-card inspection-card-wrapper">
            <MinigameInspection
              title="Tool & Equipment Safety Inspection"
              mode="tools"
              items={TOOL_INSPECTION_ITEMS}
              onItemRecorded={handleToolItemRecorded}
              onComplete={() => {
                setToolSafetyDone(true);
                showToast('Tool Safety Recorded!', 'Proceeding to Ingredient Inspection', 'success');
                setPhase('ingredient_inspection');
              }}
            />
          </div>
        )}

        {/* PHASE 5: INGREDIENT QUALITY INSPECTION MINIGAME */}
        {phase === 'ingredient_inspection' && (
          <div className="active-vessel-card orientation-card inspection-card-wrapper">
            <MinigameInspection
              title="Ingredient Quality Inspection"
              mode="ingredients"
              items={INGREDIENT_INSPECTION_ITEMS}
              onItemRecorded={handleIngredientItemRecorded}
              onComplete={handleFinishPreTest}
            />
          </div>
        )}
      </div>

      {/* 20% Right Column Orientation Guide Sidebar */}
      <OrientationSidebar
        phase={phase}
        ppeEquipped={ppeEquipped}
        scienceDone={scienceDone}
        ppeDone={ppeDone}
        handwashingDone={handwashingDone}
        toolSafetyDone={toolSafetyDone}
        qualityInspectionDone={qualityInspectionDone}
      />
    </div>
  );
};
