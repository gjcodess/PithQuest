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
    addScore,
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
  const [handwashingDone, setHandwashingDone] = useState(() => isAlreadyCompleted || Boolean(assessmentResults?.preTest?.handwashing));
  const [toolSafetyDone, setToolSafetyDone] = useState(() => isAlreadyCompleted || (assessmentResults?.preTest?.toolSafety?.length || 0) > 0);
  const [qualityInspectionDone, setQualityInspectionDone] = useState(() => isAlreadyCompleted || (assessmentResults?.preTest?.qualityInspection?.length || 0) > 0);

  useEffect(() => {
    if (phase === 'ppe') {
      speak(
        isAlreadyCompleted
          ? 'Pre-Test Completed: Review your submitted PPE attire choices below (Read-Only).'
          : 'Diagnostic Pre-Test (Task 1: PPE Attire): Select the personal protective equipment you consider required for sanitary food processing.',
        isAlreadyCompleted ? 'happy' : 'thinking',
        {
          badge: 'Pre-Test: PPE Attire',
          note: isAlreadyCompleted
            ? 'Pre-Test is finished. You can review your equipped protective gear.'
            : 'Select all standard food-grade protective gear. Beware of non-approved or hazardous items!',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Click to select or deselect gear, then click Confirm PPE Attire.',
          hideButton: true,
        }
      );
    } else if (phase === 'sanitation') {
      speak(
        isAlreadyCompleted
          ? 'Pre-Test Completed: Review your submitted 7-step handwashing sequence below (Read-Only).'
          : 'Diagnostic Pre-Test (Task 2: Handwashing Sequence): Arrange the 7 handwashing steps in their strict chronological order. Avoid 3 distractor hazards!',
        isAlreadyCompleted ? 'happy' : 'happy',
        {
          badge: 'Pre-Test: Sanitation Protocol',
          note: isAlreadyCompleted
            ? 'Pre-Test is finished. Your submitted sequence is logged in the Results audit.'
            : 'Drag or tap cards into Step slots 1 through 7. You can return to adjust your sequence anytime before completing the pre-test.',
          hint: isAlreadyCompleted
            ? 'Pre-Test is submitted and locked.'
            : 'Arrange the sequence from first water contact to drying.',
          hideButton: true,
        }
      );
    } else if (phase === 'tool_inspection') {
      speak(
        isAlreadyCompleted
          ? 'Pre-Test Completed: Review your tool safety inspection choices below (Read-Only).'
          : 'Diagnostic Pre-Test (Task 3: Tool & Equipment Safety): Inspect each equipment pair and select the safe, food-grade option. You can navigate between items and change answers anytime.',
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
          ? 'Pre-Test Completed: Review your ingredient quality inspection choices below (Read-Only).'
          : 'Diagnostic Pre-Test (Task 4: Ingredient Quality Inspection): Inspect raw materials and choose the fresh, uncontaminated food items.',
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

  // PPE toggle handler (disabled if isAlreadyCompleted)
  const handleTogglePpe = (item) => {
    if (isAlreadyCompleted) {
      soundManager.playError();
      lockedClicksRef.current += 1;
      if (lockedClicksRef.current >= 2) {
        speak(
          "You've already finalized your Pre-Test assessment! Your selected PPE attire is recorded in your performance audit and cannot be modified.",
          'thinking',
          {
            badge: 'Pre-Test Completed',
            note: 'Diagnostic assessment answers are locked to maintain evaluation integrity.',
            hint: 'Click "Proceed to Handwashing Sequence" or choose a stage from the top navigation to continue.',
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

    soundManager.playSuccess();
    setPpeDone(true);

    if (!isAlreadyCompleted) {
      const correctItems = PPE_ITEMS.filter((i) => i.isCorrect);
      const correctSelected = correctItems.filter((i) => ppeEquipped[i.id]).map((i) => i.id);
      const distractorsPicked = PPE_ITEMS.filter((i) => !i.isCorrect && ppeEquipped[i.id]).map((i) => ({
        id: i.id,
        name: i.name,
        reason: i.reason,
      }));

      const ppeScore = Math.max(0, Math.round((correctSelected.length / (correctItems.length || 6)) * 25 - (distractorsPicked.length * 5)));

      recordPreTestPpe({
        selectedIds,
        correctIds: correctItems.map((i) => i.id),
        correctSelected,
        distractorsPicked,
        totalCorrect: correctItems.length,
        score: ppeScore,
        maxPts: 25,
      });

      showToast('Task 1 Recorded!', 'PPE Attire selection saved. Proceeding to Handwashing Sequence.', 'info');
    }

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
      const hwSlots = Array.isArray(data?.slots) ? data.slots : [];
      const hwCorrectCount = hwSlots.filter((s, idx) => s && s.isCorrect && s.step === idx + 1).length;
      const hwDistractorsCount = hwSlots.filter((s) => s && !s.isCorrect).length;
      const hwScore = Math.max(0, Math.round((hwCorrectCount / 7) * 25 - (hwDistractorsCount * 5)));

      const enhancedData = {
        ...data,
        score: hwScore,
        maxPts: 25,
      };

      recordPreTestHandwash(enhancedData);
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
      const toolSafeCount = answersList.filter((t) => t && t.isSafe).length;
      const toolScore = Math.round((toolSafeCount / (TOOL_INSPECTION_ITEMS.length || 6)) * 25);

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

      // Calculate Pre-Test Score (100 pts total / 25 pts per task)
      const ppeSelectedIds = Object.entries(ppeEquipped).filter(([, v]) => Boolean(v)).map(([k]) => k);
      const ppeCorrectCount = ppeSelectedIds.filter((id) => PPE_ITEMS.find((item) => item.id === id)?.isCorrect).length;
      const ppeDistractorsCount = ppeSelectedIds.filter((id) => !PPE_ITEMS.find((item) => item.id === id)?.isCorrect).length;
      const ppeScore = Math.max(0, Math.round((ppeCorrectCount / 6) * 25 - (ppeDistractorsCount * 5)));

      const hwSlots = Array.isArray(handwashData?.slots) ? handwashData.slots : [];
      const hwCorrectCount = hwSlots.filter((s, idx) => s && s.isCorrect && s.step === idx + 1).length;
      const hwDistractorsCount = hwSlots.filter((s) => s && !s.isCorrect).length;
      const hwScore = Math.max(0, Math.round((hwCorrectCount / 7) * 25 - (hwDistractorsCount * 5)));

      const toolSafeCount = toolAnswers.filter((t) => t && t.isSafe).length;
      const toolScore = Math.round((toolSafeCount / (TOOL_INSPECTION_ITEMS.length || 6)) * 25);

      const ingredientSafeCount = answersList.filter((i) => i && i.isSafe).length;
      const ingredientScore = Math.round((ingredientSafeCount / (INGREDIENT_INSPECTION_ITEMS.length || 4)) * 25);

      const totalPreTestScore = ppeScore + hwScore + toolScore + ingredientScore;
      addScore(totalPreTestScore);

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
              {isAlreadyCompleted
                ? 'Review the personal protective equipment you submitted for the diagnostic orientation pre-test below:'
                : 'Select the protective items required for clean, sterile food preparation before entering the laboratory. Beware of non-approved or hazardous gear!'}
            </p>

            <div className="ppe-items-grid">
              {PPE_ITEMS.map((item) => {
                const isSelected = ppeEquipped[item.id] || false;
                return (
                  <div
                    key={item.id}
                    className={`ppe-box ${isSelected ? 'selected' : ''} ${isAlreadyCompleted ? 'locked' : ''}`}
                    onClick={() => handleTogglePpe(item)}
                    role="button"
                    tabIndex={0}
                    style={{
                      cursor: isAlreadyCompleted ? 'default' : 'pointer',
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
                    </div>

                    <div className={`gear-status-badge ${isSelected ? 'worn' : 'pending'}`}>
                      {isSelected ? '✓ Selected' : 'Not Selected'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="orientation-btn-row">
              <button
                className={`btn-primary ${!isAlreadyCompleted && selectedPpeCount === 0 ? 'btn-disabled' : ''}`}
                onClick={handleConfirmPpe}
                disabled={!isAlreadyCompleted && selectedPpeCount === 0}
                title={!isAlreadyCompleted && selectedPpeCount === 0 ? 'Please select at least one PPE item to proceed' : undefined}
                style={{
                  marginLeft: 'auto',
                  padding: '12px 28px',
                  opacity: !isAlreadyCompleted && selectedPpeCount === 0 ? 0.45 : 1,
                  cursor: !isAlreadyCompleted && selectedPpeCount === 0 ? 'not-allowed' : 'pointer',
                  filter: !isAlreadyCompleted && selectedPpeCount === 0 ? 'grayscale(0.6)' : 'none',
                }}
              >
                {isAlreadyCompleted
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
          <div className="active-vessel-card orientation-card">
            <div className="vessel-top-badge">Pre-Test Diagnostic Assessment: Sanitation Protocol</div>
            <div className="vessel-header">
              <span className="vessel-title">7-Step Sanitary Handwashing Sequence</span>
              <span className="vessel-badge">
                {isAlreadyCompleted ? '🔒 Submitted' : 'Task 2 of 4'}
              </span>
            </div>
            <div className="vessel-header-divider" />

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
