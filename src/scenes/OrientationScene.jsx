import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { LECTURE_CONCEPTS, PPE_ITEMS, HANDWASHING_STEPS } from '../data/orientationData';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';
import { MinigameInspection } from '../components/MinigameInspection';

export const OrientationScene = () => {
  const { studentName, setScene, addScore, unlockBadge, speak, completeMission, showToast } = useGame();

  // Sub-phases: 'lecture' | 'ppe' | 'sanitation' | 'tool_inspection' | 'ingredient_inspection' | 'ready'
  const [phase, setPhase] = useState('lecture');
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);

  // PPE states (all 6 equipment items)
  const [ppeEquipped, setPpeEquipped] = useState({
    hairnet: false,
    apron: false,
    mask: false,
    gloves: false,
    heat_gloves: false,
    shoes: false,
  });

  // Handwashing states
  const [completedHandwashSteps, setCompletedHandwashSteps] = useState([]);

  // Sub-phase completion states for subnav checkmarks
  const [scienceDone, setScienceDone] = useState(false);
  const [toolSafetyDone, setToolSafetyDone] = useState(false);
  const [qualityInspectionDone, setQualityInspectionDone] = useState(false);

  useEffect(() => {
    if (phase !== 'lecture') {
      setScienceDone(true);
    }

    if (phase === 'lecture') {
      speak(
        `Welcome to our Food Technology Laboratory, ${studentName}! Review these essential science concepts before we begin processing Coconut Pith Crackers.`,
        'neutral',
        {
          badge: 'Orientation: Science Concepts',
          note: 'Coconut pith cracker snack utilizes an agricultural by-product (ubod) to create a nutritious, crispy snack while exploring food innovation.',
          btnText: 'Equip Laboratory PPE ➔',
          onNext: () => {
            setScienceDone(true);
            setPhase('ppe');
          },
        }
      );
    } else if (phase === 'ppe') {
      speak(
        'Before starting the food preparation, we should wear appropriate personal protective equipment.',
        'thinking',
        {
          badge: 'Hygiene & Attire',
          note: "Don't wear disposable gloves while directly handling hot pans or frying. Use heat-resistant gloves/pot holders for heat, and food-grade gloves for hygienic food handling.",
          hint: 'Click each piece of PPE attire to equip it.',
          hideButton: true,
        }
      );
    } else if (phase === 'sanitation') {
      speak(
        'Let’s begin with sanitation! Execute the proper handwashing protocol before handling any food contact surfaces.',
        'happy',
        {
          badge: 'Sanitation Protocol',
          note: 'Clean up your facility space. Wash your hands properly before handling any food to prevent contamination and maintain food safety.',
          hint: 'Tap the handwashing steps in order to thoroughly cleanse your hands.',
          hideButton: true,
        }
      );
    } else if (phase === 'tool_inspection') {
      speak(
        'Help me inspect our Tools and Equipment needed! Inspect each tool and select the safe, food-grade option. Avoid hazardous or damaged items!',
        'neutral',
        {
          badge: 'Tool Safety Clearance',
          note: 'Safety Check: Make sure all materials and tools are clean and safe. Check electrical wires, outlets, and cords for damage before using equipment.',
          hideButton: true,
        }
      );
    } else if (phase === 'ingredient_inspection') {
      speak(
        'Ingredient Quality Check! Inspect each ingredient pair. Choose the fresh, uncontaminated food items for our recipe.',
        'neutral',
        {
          badge: 'Ingredient Quality Clearance',
          note: 'Always choose ingredients that are fresh, clean, and safe to use. Check the expiration date and condition before preparing food.',
          hideButton: true,
        }
      );
    } else if (phase === 'ready') {
      speak(
        'Outstanding work! You have mastered the science concepts, donned your PPE, sanitized your hands, and cleared all safety inspections. You are fully certified to begin Stage 1!',
        'happy',
        {
          badge: 'Laboratory Certified',
          note: 'Accurate measuring and proper sanitation maintain the consistency, texture, and food safety of the finished product.',
          btnText: 'Start Stage 1: Washing & Boiling ➔',
          onNext: () => setScene('mission1'),
        }
      );
    }
  }, [phase, studentName]);

  // PPE handler
  const handleEquipPpe = (itemId) => {
    if (ppeEquipped[itemId]) return;
    soundManager.playSuccess();
    const updated = { ...ppeEquipped, [itemId]: true };
    setPpeEquipped(updated);
    addScore(15);
    showToast('PPE Equipped', `Put on ${itemId} (+15 pts)`, 'success');

    if (Object.values(updated).every(Boolean)) {
      unlockBadge('ppe_certified', 'PPE Certified', '🥼');
      setTimeout(() => {
        setPhase('sanitation');
      }, 800);
    }
  };

  // Handwashing handler
  const handleHandwashStep = (stepNumber) => {
    if (completedHandwashSteps.includes(stepNumber)) return;
    const nextExpected = completedHandwashSteps.length + 1;
    if (stepNumber !== nextExpected) {
      soundManager.playError();
      showToast('Follow Sequence', `Please follow step ${nextExpected} next!`, 'warning');
      return;
    }

    soundManager.playClick();
    const nextSteps = [...completedHandwashSteps, stepNumber];
    setCompletedHandwashSteps(nextSteps);
    addScore(10);

    if (nextSteps.length === HANDWASHING_STEPS.length) {
      soundManager.playFanfare();
      unlockBadge('handwash_master', 'Sanitation Guardian', '🧼');
      showToast('Handwashing Complete', 'Hands thoroughly sanitized! (+70 pts total)', 'success');
      setTimeout(() => {
        setPhase('tool_inspection');
      }, 1000);
    }
  };

  return (
    <div className="workstation-scene orientation-scene">
      <div className="workstation-overlay" />

      {/* Sub-phase navigation indicator */}
      <div className="orientation-subnav-container">
        <nav className="orientation-subnav" aria-label="Laboratory Orientation Stages">
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
            className={`subnav-pill ${phase === 'ppe' ? 'active' : ''} ${Object.values(ppeEquipped).every(Boolean) ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('ppe');
            }}
          >
            <span className="subnav-pill-icon">🥼</span>
            <span className="subnav-pill-label">2. PPE Attire</span>
            {Object.values(ppeEquipped).every(Boolean) && <span className="subnav-pill-check">✓</span>}
          </button>
          <button
            className={`subnav-pill ${phase === 'sanitation' ? 'active' : ''} ${completedHandwashSteps.length === HANDWASHING_STEPS.length ? 'completed' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setPhase('sanitation');
            }}
          >
            <span className="subnav-pill-icon">🧼</span>
            <span className="subnav-pill-label">3. Handwashing</span>
            {completedHandwashSteps.length === HANDWASHING_STEPS.length && <span className="subnav-pill-check">✓</span>}
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
            <div className="vessel-header">
              <span className="vessel-title">📚 Laboratory Science & Definitions</span>
              <span className="vessel-badge">Concept {activeConceptIndex + 1} of {LECTURE_CONCEPTS.length}</span>
            </div>

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
                    fontSize: '0.88rem'
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
                    Equip PPE Attire ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: PPE DRESSING */}
        {phase === 'ppe' && (
          <div className="active-vessel-card orientation-card ppe-card">
            <div className="vessel-header">
              <span className="vessel-title">🥼 Personal Protective Equipment (PPE)</span>
              <span className="vessel-badge">
                {Object.values(ppeEquipped).filter(Boolean).length}/{PPE_ITEMS.length} Equipped
              </span>
            </div>

            <p className="section-instruction">
              Click each piece of protective gear to wear it before entering the cooking lab:
            </p>

            <div className="ppe-items-grid">
              {PPE_ITEMS.map((item) => {
                const isWorn = ppeEquipped[item.id];
                return (
                  <div
                    key={item.id}
                    className={`ppe-box ${isWorn ? 'equipped' : ''}`}
                    onClick={() => handleEquipPpe(item.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={item.img} alt={item.name} className="ppe-icon-img" />
                    <div className="gear-details">
                      <h4 className="ppe-name">{item.name}</h4>
                      <p className="ppe-desc">{item.role}</p>
                    </div>
                    <div className={`gear-status-badge ${isWorn ? 'worn' : 'pending'}`}>
                      {isWorn ? '✅ Equipped' : '👆 Click to Wear'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 3: HANDWASHING PROTOCOL */}
        {phase === 'sanitation' && (
          <div className="active-vessel-card orientation-card">
            <div className="vessel-header">
              <span className="vessel-title">🧼 7-Step Sanitary Handwashing Protocol</span>
              <span className="vessel-badge">
                Step {completedHandwashSteps.length + 1} of {HANDWASHING_STEPS.length}
              </span>
            </div>

            <p className="section-instruction">
              Tap each handwashing step in strict chronological order to properly sanitize:
            </p>

            <div className="handwashing-steps-list">
              {HANDWASHING_STEPS.map((step) => {
                const isDone = completedHandwashSteps.includes(step.step);
                const isCurrent = completedHandwashSteps.length + 1 === step.step;

                return (
                  <div
                    key={step.step}
                    className={`hw-step-item ${isDone ? 'completed' : ''} ${isCurrent ? 'current-target' : ''}`}
                    onClick={() => handleHandwashStep(step.step)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="hw-num">{step.step}</div>
                    <div className="hw-icon">
                      {step.img ? (
                        <img src={step.img} alt={step.action} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="hw-info">
                      <strong>{step.action}</strong>
                      <span>{step.desc}</span>
                    </div>
                    <div className="hw-check">{isDone ? '✅' : isCurrent ? '👉 Tap' : '⏳'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 4: TOOL SAFETY INSPECTION MINIGAME */}
        {phase === 'tool_inspection' && (
          <div className="active-vessel-card orientation-card inspection-card-wrapper">
            <MinigameInspection
              title="Tool & Equipment Safety Inspection"
              mode="tools"
              items={TOOL_INSPECTION_ITEMS}
              onComplete={() => {
                setToolSafetyDone(true);
                showToast('Tool Safety Cleared!', 'All tools verified safe for lab work (+125 pts)', 'success');
                setTimeout(() => setPhase('ingredient_inspection'), 1200);
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
              onComplete={() => {
                setQualityInspectionDone(true);
                showToast('Quality Clearance Complete!', 'All ingredients verified fresh & food-grade!', 'success');
                completeMission('orientation');
                unlockBadge('inspection_pro', 'Certified Quality Inspector', '🔍');
                setTimeout(() => setPhase('ready'), 1200);
              }}
            />
          </div>
        )}

        {/* READY / CERTIFIED SCREEN */}
        {phase === 'ready' && (
          <div className="active-vessel-card orientation-card ready-card">
            <div className="vessel-header">
              <span className="vessel-title">🎉 Laboratory Clearance Approved!</span>
              <span className="vessel-badge">All Inspections Cleared</span>
            </div>
            <div className="orientation-body">
              <img src="/images/teacher_mia_happy.png" alt="Teacher Mia" className="orientation-hero-img" />
              <div className="orientation-text">
                <h3>Welcome to the Production Floor, {studentName}!</h3>
                <p>
                  You have successfully demonstrated complete mastery of food safety regulations, PPE compliance, and quality control inspection.
                </p>
                <div className="clearance-checklist">
                  <div className="clearance-item">✅ <strong>Science Knowledge:</strong> Gelatinization & Puffing concepts understood</div>
                  <div className="clearance-item">✅ <strong>Hygiene:</strong> Hairnet, Apron, Mask, Gloves equipped</div>
                  <div className="clearance-item">✅ <strong>Sanitation:</strong> 7-Step Handwashing protocol executed</div>
                  <div className="clearance-item">✅ <strong>Safety:</strong> Chipped/frayed hazards rejected</div>
                  <div className="clearance-item">✅ <strong>Freshness:</strong> Grade-A ubod, flour, and oil inspected</div>
                </div>
                <div className="orientation-btn-row">
                  <button className="btn-primary" onClick={() => setScene('mission1')}>
                    Start Stage 1: Washing & Boiling Ubod ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
