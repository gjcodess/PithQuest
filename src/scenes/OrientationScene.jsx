import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { PPE_ITEMS } from '../data/orientationData';
import { TOOL_INSPECTION_ITEMS, INGREDIENT_INSPECTION_ITEMS } from '../data/inspectionData';
import { MinigameInspection } from '../components/MinigameInspection';
import { HandwashingSequenceActivity } from '../components/HandwashingSequenceActivity';
import { OrientationSidebar } from '../components/OrientationSidebar';

export const OrientationScene = () => {
  const {
    studentName,
    setScene,
    speak,
    completeMission,
    showToast,
    missionsCompleted,
    assessmentResults,
    recordPreTestPpe,
    recordPreTestHandwash,
    recordPreTestTool,
    recordPreTestIngredient,
    setIsDialogueCollapsed,
  } = useGame();

  const isAlreadyCompleted = Boolean(missionsCompleted?.orientation);
  const lockedClicksRef = React.useRef(0);

  // PRE-TEST Sub-phases: 'ppe' | 'sanitation' | 'tool_inspection' | 'ingredient_inspection'
  const [phase, setPhase] = useState('ppe');

  // PPE states (selection tracking for all 8 items in bank)
  const [ppeEquipped, setPpeEquipped] = useState(() => {
    const savedPpe = assessmentResults?.preTest?.ppe?.selectedIds;
    if (savedPpe && Array.isArray(savedPpe)) {
      const map = {};
      PPE_ITEMS.forEach((item) => {
        map[item.id] = savedPpe.includes(item.id);
      });
      return map;
    }
    return {
      hairnet: isAlreadyCompleted,
      apron: isAlreadyCompleted,
      mask: isAlreadyCompleted,
      gloves: isAlreadyCompleted,
      heat_gloves: isAlreadyCompleted,
      shoes: isAlreadyCompleted,
      distractor_scarf: false,
      distractor_goggles: false,
    };
  });

  // Handwashing state persistence
  const [handwashData, setHandwashData] = useState(() => {
    return assessmentResults?.preTest?.handwashing || null;
  });

  // Tool inspection state persistence
  const [toolAnswers, setToolAnswers] = useState(() => {
    return assessmentResults?.preTest?.toolSafety || [];
  });

  // Ingredient inspection state persistence
  const [ingredientAnswers, setIngredientAnswers] = useState(() => {
    return assessmentResults?.preTest?.qualityInspection || [];
  });

  // Sub-phase completion states for subnav checkmarks
  const [ppeDone, setPpeDone] = useState(() => isAlreadyCompleted || Boolean(assessmentResults?.preTest?.ppe));
  const [isPpeVerified, setIsPpeVerified] = useState(() => isAlreadyCompleted || Boolean(assessmentResults?.preTest?.ppe));
  const [handwashingDone, setHandwashingDone] = useState(() => isAlreadyCompleted || Boolean(assessmentResults?.preTest?.handwashing));
  const [toolSafetyDone, setToolSafetyDone] = useState(() => isAlreadyCompleted || (assessmentResults?.preTest?.toolSafety?.length || 0) > 0);
  const [qualityInspectionDone, setQualityInspectionDone] = useState(() => isAlreadyCompleted || (assessmentResults?.preTest?.qualityInspection?.length || 0) > 0);

  useEffect(() => {
    if (phase === 'ppe') {
      speak(
        isAlreadyCompleted
          ? 'Orientation Pre-Test Completed: You have successfully finalized your personal protective equipment selection! Review your equipped items below. Each piece of protective gear establishes a physical barrier that prevents hair, oral aerosols, and outdoor dust from compromising sanitized food contact surfaces.'
          : 'Welcome to the Food Technology & Science Laboratory! Before we can handle any ingredients or operate culinary equipment, establishing personal sanitary defense is our mandatory first rule. In laboratory food preparation, humans are the primary source of physical shedding and microbial cross-contamination. Review the equipment cards on your workstation and select all approved food-grade gear required for personal protection and aseptic food preparation—such as sanitary hairnets, clean lab coats, spit guards, and vinyl gloves. Be vigilant against hazardous items or loose knit garments that shed fibers or pose severe burn risks around open flames!',
        isAlreadyCompleted ? 'happy' : 'thinking',
        {
          badge: 'Pre-Test: PPE Attire',
          note: isAlreadyCompleted
            ? 'Pre-Test is finished. You can review your equipped protective gear.'
            : 'Select all standard food-grade protective gear. Beware of non-approved or hazardous items!',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Click any gear card to select or deselect it, then click Confirm PPE Attire when ready.',
          hideButton: true,
        }
      );
    } else if (phase === 'sanitation') {
      speak(
        isAlreadyCompleted
          ? 'Orientation Pre-Test Completed: Review your 7-step sanitary handwashing sequence below. Friction scrubbing for at least 20 seconds mechanically dislodges transient microbes from the skin surface and prevents cross-contamination.'
          : 'Excellent attention to protective attire! Now let\'s master our most crucial sanitation protocol: aseptic hand hygiene. Hand contact is the single most frequent vector for pathogen transmission in food processing. Drag or tap the handwashing cards to arrange the 7 sanitary steps in their strict chronological order—beginning with wetting under clean running water, applying soap, and scrubbing palms, digits, and nails with 20 seconds of friction, through to clean rinsing and sanitary disposable paper drying. Be on the lookout for distractor actions that would re-contaminate clean hands!',
        isAlreadyCompleted ? 'happy' : 'happy',
        {
          badge: 'Pre-Test: Sanitation Protocol',
          note: isAlreadyCompleted
            ? 'Pre-Test is finished. Your submitted sequence is logged in the Results audit.'
            : 'Drag or tap cards into Step slots 1 through 7. You can return to adjust your sequence anytime before completing the pre-test.',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Arrange the sequence in order from first potable water wetting to final drying.',
          hideButton: true,
        }
      );
    } else if (phase === 'tool_inspection') {
      speak(
        isAlreadyCompleted
          ? 'Orientation Pre-Test Completed: Review your tool safety inspection audit below. Remember that food-grade stainless steel resists pitting corrosion and prevents toxic leaching during high-temperature cooking.'
          : 'Well done on sanitation! Now let\'s audit our culinary processing equipment. In commercial cracker manufacturing, defective or corroded tools present severe hazards: microscopic fissures in plastic or metal harbor bacterial biofilms that resist surface sanitizers, while worn mechanical components can shed physical steel shards into food batches. Inspect each equipment pair on your table—from food processor blades and cooking pots to knives and stoves—and select the certified food-grade, sanitized option with smooth stainless surfaces and intact wiring.',
        'neutral',
        {
          badge: 'Pre-Test: Tool Safety',
          note: 'Safety Check: Examine blades, cords, and surfaces for cracks, rust, or electrical hazards.',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Select Option A or Option B for each tool. Click an item again or press Deselect to change.',
          hideButton: true,
        }
      );
    } else if (phase === 'ingredient_inspection') {
      speak(
        isAlreadyCompleted
          ? 'Orientation Pre-Test Completed: Review your ingredient quality inspection choices below. Fresh, firm coconut pith ensures the ideal starch-to-fiber ratio for crisp, uniform cracker puffing.'
          : 'Our final diagnostic checkpoint focuses on raw material quality audit. The delicate texture, crisp puffing expansion, and safety of our coconut pith crackers depend entirely on the freshness of our harvested ubod. High-quality coconut pith must exhibit a pristine ivory-white hue, a crisp and firm cellular structure, and a clean, mild aroma without any sour odors, brown oxidation, or signs of slime. Inspect each raw material specimen carefully and approve only the fresh, uncontaminated ingredients fit for production!',
        'neutral',
        {
          badge: 'Pre-Test: Ingredient Quality',
          note: 'Check color, texture, expiration, and packaging integrity for all ingredients.',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Select the fresh, sanitary option for each ingredient.',
          hideButton: true,
        }
      );
    }
  }, [phase, studentName, isAlreadyCompleted]);

  // PPE toggle handler (disabled if isAlreadyCompleted or verified)
  const handleTogglePpe = (item) => {
    if (isAlreadyCompleted || isPpeVerified) {
      soundManager.playError();
      lockedClicksRef.current += 1;
      if (lockedClicksRef.current >= 2) {
        speak(
          "Your PPE selection has already been verified! Click Proceed to Handwashing Sequence to continue.",
          'thinking',
          {
            badge: 'PPE Verified',
            note: 'Attire validation complete.',
            hint: 'Click "Proceed to Handwashing Sequence" below to continue.',
          }
        );
        setIsDialogueCollapsed(false);
        lockedClicksRef.current = 0;
      }
      return;
    }
    soundManager.playClick();
    const updated = { ...ppeEquipped, [item.id]: !ppeEquipped[item.id] };
    setPpeEquipped(updated);
  };

  const handleConfirmPpe = () => {
    const selectedIds = Object.keys(ppeEquipped).filter((k) => ppeEquipped[k]);

    if (!isAlreadyCompleted && selectedIds.length === 0) {
      soundManager.playError();
      showToast('No PPE Selected', 'Please select at least one PPE item before confirming!', 'warning');
      return;
    }

    if (!isPpeVerified) {
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
      });

      setIsPpeVerified(true);

      if (distractorsPicked.length > 0) {
        soundManager.playError();
        speak(
          'Personal Protective Equipment Check: Attention food technologist! You equipped non-food grade or hazardous items. Knitted scarves shed fibers and pose fire hazards near burners, while dark lenses impede visual inspection. Review the safety badges below before proceeding to handwashing.',
          'thinking',
          {
            badge: 'PPE Safety Feedback',
            note: 'Contamination Risk: Loose items and synthetic fibers violate commercial HACCP standards.',
            hint: 'Review your equipped items below, then click "Proceed to Handwashing Sequence".',
          }
        );
      } else {
        soundManager.playSuccess();
        speak(
          'Excellent Sanitary Attire Selection! All approved food-grade barriers are equipped. Your clean gear creates a complete defense preventing physical shedding and microbial transfer.',
          'happy',
          {
            badge: 'Sanitary Attire Verified',
            note: 'Aseptic Barrier Established: Hairnet, lab coat, mask, vinyl gloves, heat gloves, and non-slip shoes ready.',
            hint: 'Click "Proceed to Handwashing Sequence" below to continue.',
          }
        );
      }
      return;
    }

    // Already verified -> proceed to handwashing
    soundManager.playClick();
    setPpeDone(true);
    setPhase('sanitation');
  };

  // Handwashing handlers
  const handleHandwashChange = (data) => {
    setHandwashData(data);
    if (!isAlreadyCompleted) {
      recordPreTestHandwash(data);
    }
  };

  const handleHandwashComplete = (data) => {
    setHandwashingDone(true);
    setHandwashData(data);

    if (!isAlreadyCompleted) {
      recordPreTestHandwash(data);
      showToast('Task 2 Recorded!', 'Handwashing sequence saved. Proceeding to Tool Safety Inspection.', 'info');
    }

    setPhase('tool_inspection');
  };

  // Tool Safety handlers
  const handleToolAnswersChange = (answersList) => {
    setToolAnswers(answersList);
    if (!isAlreadyCompleted) {
      recordPreTestTool(answersList);
    }
  };

  const handleToolComplete = (answersList) => {
    setToolSafetyDone(true);
    setToolAnswers(answersList);
    if (!isAlreadyCompleted) {
      recordPreTestTool(answersList);
      showToast('Task 3 Recorded!', 'Tool & Equipment safety inspection saved. Proceeding to Ingredient Inspection.', 'info');
    }
    setPhase('ingredient_inspection');
  };

  // Ingredient Quality handlers
  const handleIngredientAnswersChange = (answersList) => {
    setIngredientAnswers(answersList);
    if (!isAlreadyCompleted) {
      recordPreTestIngredient(answersList);
    }
  };

  const handleNavigatePhase = (targetPhase) => {
    soundManager.playClick();
    if (isAlreadyCompleted) {
      setPhase(targetPhase);
      return;
    }

    if (targetPhase === 'sanitation' && !ppeDone) {
      soundManager.playError();
      showToast('Task Locked', 'Please complete Task 1: PPE Attire Selection first!', 'warning');
      return;
    }
    if (targetPhase === 'tool_inspection' && !handwashingDone) {
      soundManager.playError();
      showToast('Task Locked', 'Please complete Task 2: Handwashing Sequence first!', 'warning');
      return;
    }
    if (targetPhase === 'ingredient_inspection' && !toolSafetyDone) {
      soundManager.playError();
      showToast('Task Locked', 'Please complete Task 3: Tool & Equipment Safety Inspection first!', 'warning');
      return;
    }

    setPhase(targetPhase);
  };

  const handleIngredientComplete = (answersList) => {
    setQualityInspectionDone(true);
    setIngredientAnswers(answersList);

    if (!isAlreadyCompleted) {
      // Validate all 4 pre-test tasks before completing orientation
      if (!ppeDone || selectedPpeCount === 0) {
        soundManager.playError();
        showToast('Incomplete Pre-Test', 'Please complete Task 1: PPE Attire Selection first!', 'warning');
        setPhase('ppe');
        return;
      }
      if (!handwashingDone || (handwashData?.slots?.filter(Boolean).length < 7)) {
        soundManager.playError();
        showToast('Incomplete Pre-Test', 'Please complete Task 2: Handwashing Sequence first!', 'warning');
        setPhase('sanitation');
        return;
      }
      if (!toolSafetyDone || toolAnswers.length < TOOL_INSPECTION_ITEMS.length) {
        soundManager.playError();
        showToast('Incomplete Pre-Test', 'Please complete Task 3: Tool & Equipment Safety Inspection first!', 'warning');
        setPhase('tool_inspection');
        return;
      }
      if (answersList.length < INGREDIENT_INSPECTION_ITEMS.length) {
        soundManager.playError();
        showToast('Incomplete Inspection', `Please inspect all ${INGREDIENT_INSPECTION_ITEMS.length} ingredients!`, 'warning');
        return;
      }

      // All 4 tasks successfully completed
      recordPreTestIngredient(answersList);

      soundManager.playFanfare();
      completeMission('orientation');
      showToast('Pre-Test Complete!', 'Diagnostic baseline recorded. Entering Stage 1: Washing & Boiling', 'success');

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
    } else {
      // Just reviewing; return to Stage 1 or current stage
      soundManager.playClick();
      setScene('mission1');
    }
  };

  const selectedPpeCount = Object.values(ppeEquipped).filter(Boolean).length;

  return (
    <div className="workstation-scene orientation-scene">
      <div className="workstation-overlay" />

      {/* Sub-phase navigation indicator with sequential lock states */}
      <div className="orientation-subnav-container">
        <nav className="orientation-subnav" aria-label="Laboratory Pre-Test Stages">
          {/* 1. PPE Attire */}
          <button
            className={`subnav-pill ${phase === 'ppe' ? 'active' : ''} ${ppeDone ? 'completed' : ''}`}
            onClick={() => handleNavigatePhase('ppe')}
          >
            <span className="subnav-pill-icon">🥼</span>
            <span className="subnav-pill-label">1. PPE Attire</span>
            {ppeDone && <span className="subnav-pill-check">✓</span>}
          </button>

          {/* 2. Handwashing */}
          <button
            className={`subnav-pill ${phase === 'sanitation' ? 'active' : ''} ${handwashingDone ? 'completed' : ''} ${!isAlreadyCompleted && !ppeDone ? 'locked' : ''}`}
            onClick={() => handleNavigatePhase('sanitation')}
            title={!isAlreadyCompleted && !ppeDone ? 'Complete Task 1: PPE Attire first' : undefined}
          >
            <span className="subnav-pill-icon">{!isAlreadyCompleted && !ppeDone ? '🔒' : '🧼'}</span>
            <span className="subnav-pill-label">2. Handwashing</span>
            {handwashingDone && <span className="subnav-pill-check">✓</span>}
          </button>

          {/* 3. Tool Safety */}
          <button
            className={`subnav-pill ${phase === 'tool_inspection' ? 'active' : ''} ${toolSafetyDone ? 'completed' : ''} ${!isAlreadyCompleted && !handwashingDone ? 'locked' : ''}`}
            onClick={() => handleNavigatePhase('tool_inspection')}
            title={!isAlreadyCompleted && !handwashingDone ? 'Complete Task 2: Handwashing first' : undefined}
          >
            <span className="subnav-pill-icon">{!isAlreadyCompleted && !handwashingDone ? '🔒' : '🔍'}</span>
            <span className="subnav-pill-label">3. Tool Safety</span>
            {toolSafetyDone && <span className="subnav-pill-check">✓</span>}
          </button>

          {/* 4. Quality Inspection */}
          <button
            className={`subnav-pill ${phase === 'ingredient_inspection' ? 'active' : ''} ${qualityInspectionDone ? 'completed' : ''} ${!isAlreadyCompleted && !toolSafetyDone ? 'locked' : ''}`}
            onClick={() => handleNavigatePhase('ingredient_inspection')}
            title={!isAlreadyCompleted && !toolSafetyDone ? 'Complete Task 3: Tool Safety first' : undefined}
          >
            <span className="subnav-pill-icon">{!isAlreadyCompleted && !toolSafetyDone ? '🔒' : '🥥'}</span>
            <span className="subnav-pill-label">4. Quality Inspection</span>
            {qualityInspectionDone && <span className="subnav-pill-check">✓</span>}
          </button>
        </nav>
      </div>

      <div className="stage-center-zone">
        {/* TASK 1: PPE ATTIRE SELECTION (Diagnostic Selection) */}
        {phase === 'ppe' && (
          <div className="active-vessel-card orientation-card ppe-card">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Attire & Safety Standards</div>
            <div className="vessel-header">
              <span className="vessel-title">Personal Protective Equipment (PPE) Selection</span>
              <span className="vessel-badge">
                {isAlreadyCompleted ? '🔒 Submitted' : 'Task 1 of 4'}
              </span>
            </div>
            <div className="vessel-header-divider" />

            <div className="inspection-header-row">
              <div className="inspection-title-box">
                <h3 className="item-target-title">Target: Standard Food Laboratory Attire</h3>
              </div>
              <div className="inspection-counter">
                Selected: {selectedPpeCount} / {PPE_ITEMS.length}
              </div>
            </div>

            <p className="inspection-prompt">
              {isPpeVerified
                ? 'Review the personal sanitary defense evaluation for your equipped protective gear below:'
                : 'Select the protective items required for clean, sterile food preparation before entering the laboratory. Beware of non-approved or hazardous gear!'}
            </p>

            <div className="ppe-items-grid">
              {PPE_ITEMS.map((item) => {
                const isSelected = ppeEquipped[item.id] || false;
                const isCorrect = item.isCorrect;

                let statusBadgeText = '';
                let statusBadgeClass = '';
                let boxBorderClass = '';

                if (isPpeVerified) {
                  if (isCorrect && isSelected) {
                    statusBadgeText = '✓ Approved Food-Grade Gear';
                    statusBadgeClass = 'badge-approved';
                    boxBorderClass = ' ppe-verified-good';
                  } else if (!isCorrect && isSelected) {
                    statusBadgeText = '🚫 Hazard Flagged';
                    statusBadgeClass = 'badge-hazard';
                    boxBorderClass = ' ppe-verified-hazard';
                  } else if (isCorrect && !isSelected) {
                    statusBadgeText = '⚠️ Required Standard Gear';
                    statusBadgeClass = 'badge-missing';
                    boxBorderClass = ' ppe-verified-missing';
                  } else {
                    statusBadgeText = '✓ Non-PPE (Safe)';
                    statusBadgeClass = 'badge-avoided';
                    boxBorderClass = ' ppe-verified-avoided';
                  }
                } else {
                  statusBadgeText = isSelected ? '✓ Selected' : 'Not Selected';
                  statusBadgeClass = isSelected ? 'worn' : 'pending';
                }

                return (
                  <div
                    key={item.id}
                    className={`ppe-box ${isSelected ? 'selected' : ''} ${isAlreadyCompleted || isPpeVerified ? 'locked' : ''}${boxBorderClass}`}
                    onClick={() => handleTogglePpe(item)}
                    role="button"
                    tabIndex={0}
                    style={{
                      cursor: isAlreadyCompleted || isPpeVerified ? 'default' : 'pointer',
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="ppe-icon-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="gear-details">
                      <span className="ppe-name">{item.name}</span>
                      <span className="ppe-desc">{item.role}</span>

                      {/* Dedicated Alert Box for Hazards */}
                      {isPpeVerified && !isCorrect && isSelected && (
                        <div className="ppe-hazard-alert-box">
                          <div className="ppe-hazard-alert-header">
                            <span className="ppe-hazard-icon">⚠️</span>
                            <span>Contamination Hazard</span>
                          </div>
                          <p className="ppe-hazard-text">{item.reason}</p>
                        </div>
                      )}

                      {/* Dedicated Alert Box for Missed Required Gear */}
                      {isPpeVerified && isCorrect && !isSelected && (
                        <div className="ppe-missed-alert-box">
                          <span className="ppe-missed-icon">ℹ️</span>
                          <span className="ppe-missed-text">Mandatory food-grade barrier required by GMP standards</span>
                        </div>
                      )}
                    </div>

                    <div className={`gear-status-badge ${statusBadgeClass}`}>
                      {statusBadgeText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instant PPE Sanitary Lesson Card */}
            {isPpeVerified && (
              <div
                className="ppe-verified-lesson-box"
                style={{
                  background: '#ffffff',
                  border: '2px solid #86efac',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  margin: '12px 0',
                  boxShadow: '0 2px 0 #bbf7d0',
                  animation: 'fadeInSlideUp 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🥼</span>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#15803d', fontWeight: 800 }}>
                    Personal Sanitary Defense (PPE) Standard Lesson
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
                  In commercial food processing, humans are the primary source of microbiological and physical contamination. Clean hairnets trap shedding hair, fluid-resistant masks block oral aerosol droplets, vinyl gloves prevent microbial cross-contamination, heat-resistant silicone gloves protect against thermal burns, and closed-toe non-slip shoes prevent slip accidents and hot oil scalds. Loose knitted scarves and dark sunglasses are hazardous distractors that violate GMP guidelines.
                </p>
              </div>
            )}

            <div className="orientation-btn-row">
              <button
                className={`btn-primary ${!isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0 ? 'btn-disabled' : ''}`}
                onClick={handleConfirmPpe}
                disabled={!isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0}
                title={!isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0 ? 'Please select at least one PPE item to proceed' : undefined}
                style={{
                  marginLeft: 'auto',
                  padding: '12px 28px',
                  opacity: !isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0 ? 0.45 : 1,
                  cursor: !isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0 ? 'not-allowed' : 'pointer',
                  filter: !isAlreadyCompleted && !isPpeVerified && selectedPpeCount === 0 ? 'grayscale(0.6)' : 'none',
                }}
              >
                {isPpeVerified
                  ? 'Proceed to Handwashing Sequence ➔'
                  : selectedPpeCount === 0
                    ? 'Select PPE Items to Proceed'
                    : `Confirm PPE Attire (${selectedPpeCount} Selected) ➔`}
              </button>
            </div>
          </div>
        )}

        {/* TASK 2: HANDWASHING SEQUENCE PUZZLE (Dynamic Reordering) */}
        {phase === 'sanitation' && (
          <div className="active-vessel-card orientation-card handwash-card-wrapper">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Sanitation Protocol</div>
            <HandwashingSequenceActivity
              initialSlots={handwashData?.slots || null}
              initialPool={handwashData?.pool || null}
              onSequenceChange={handleHandwashChange}
              onComplete={handleHandwashComplete}
              isLocked={isAlreadyCompleted}
            />
          </div>
        )}

        {/* TASK 3: TOOL & EQUIPMENT SAFETY INSPECTION */}
        {phase === 'tool_inspection' && (
          <div className="active-vessel-card orientation-card inspection-card-wrapper">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Tool & Equipment Safety</div>
            <MinigameInspection
              title="Tool & Equipment Safety Inspection"
              subtitle="Inspect each equipment pair. Select the clean, food-grade, hazard-free tool for commercial cracker production."
              items={TOOL_INSPECTION_ITEMS}
              initialAnswers={toolAnswers}
              onAnswersChange={handleToolAnswersChange}
              onComplete={handleToolComplete}
              isLocked={isAlreadyCompleted}
              mode="tools"
            />
          </div>
        )}

        {/* TASK 4: RAW INGREDIENT QUALITY INSPECTION */}
        {phase === 'ingredient_inspection' && (
          <div className="active-vessel-card orientation-card inspection-card-wrapper">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Raw Material Quality</div>
            <MinigameInspection
              title="Raw Ingredient Quality Inspection"
              subtitle="Audit incoming coconut pith, rice flour, oil, and salt. Select the fresh, sanitary, uncontaminated items."
              items={INGREDIENT_INSPECTION_ITEMS}
              initialAnswers={ingredientAnswers}
              onAnswersChange={handleIngredientAnswersChange}
              onComplete={handleIngredientComplete}
              isLocked={isAlreadyCompleted}
              mode="ingredients"
            />
          </div>
        )}
      </div>

      {/* Right Sidebar Checklist */}
      <OrientationSidebar
        phase={phase}
        ppeEquipped={ppeEquipped}
        completedHandwashSteps={handwashData?.submittedSteps || []}
        ppeDone={ppeDone}
        handwashingDone={handwashingDone}
        toolSafetyDone={toolSafetyDone}
        qualityInspectionDone={qualityInspectionDone}
      />
    </div>
  );
};
