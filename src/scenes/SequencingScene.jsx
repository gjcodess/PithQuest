import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SequencingActivity } from '../components/SequencingActivity';
import { SequencingSidebar } from '../components/SequencingSidebar';

export const SequencingScene = () => {
  const { studentName, setScene, speak, hideDialogue, missionsCompleted, completeMission, maxUnlockedStage } = useGame();
  const isAlreadyCompleted = Boolean(missionsCompleted?.sequencing);
  const [isCompleted, setIsCompleted] = useState(() => isAlreadyCompleted);

  useEffect(() => {
    if (isAlreadyCompleted) {
      completeMission('sequencing');
      speak(
        `Post-Test Assessment Completed, ${studentName || 'Food Technologist'}!\n\nYour reconstructed 8-stage food manufacturing sequence has been verified and permanently recorded in your laboratory profile.\n\nYou have systematically tracked the entire lifecycle of Ubod ng Niyog—from hydrothermal fiber softening and high-shear mechanical pureeing, to balanced starch formulation, standardized geometric molding, moist-heat gelatinization, convective moisture vitrification, flash expansion deep frying, and multi-barrier hermetic packaging.\n\nClick the button below to inspect your comprehensive Diagnostic Performance Report!`,
        'happy',
        {
          badge: 'Post-Test Assessment Complete',
          note: 'Holistic Pipeline Mastery: Your chronological manufacturing sequence is archived alongside your Pre-Test diagnostics and Stage Pre-Check Questions.',
          btnText: 'View Diagnostic Assessment Results ➔',
          onNext: () => setScene('results'),
        }
      );
    } else {
      speak(
        `Welcome to the Post-Test Assessment, ${studentName || 'Food Technologist'}!\n\nNow that you have successfully completed all laboratory hands-on operations, this final diagnostic exam evaluates your comprehensive understanding of the complete industrial manufacturing lifecycle.\n\nUnit operations in food processing follow strict thermodynamic and biochemical prerequisites: each stage creates the exact chemical or physical state required by the next stage. Rearranging or skipping a step would cause catastrophic production failure—such as frying un-dehydrated wafers or attempting to mold un-gelatinized flour.\n\nYour Objective: Arrange the 8 processing stage cards in their authentic chronological sequence from left to right, then click "Submit Chronological Sequence & View Results"!`,
        'thinking',
        {
          badge: 'Post-Test: Chronological Sequencing',
          note: 'Industrial Flow Logic: Trace the transformation from raw coconut pith (ubod) harvesting, washing, and softening, through to commercial retail distribution.',
          hint: 'Drag cards into target slots or tap cards to swap their positions, then click Submit below.',
          hideButton: true,
        }
      );
    }
  }, []);

  const handleSequenceCompleted = () => {
    setIsCompleted(true);
    completeMission('sequencing');
    soundManager.playFanfare();
    speak(
      `Post-Test Assessment Successfully Submitted, ${studentName || 'Food Technologist'}!\n\nYour chronological sequence for the 8-stage Ubod CRUNCH processing pipeline has been submitted for automated diagnostic scoring.\n\nOur evaluation engine is cross-referencing your sequence with industry-standard HACCP unit operations, alongside your Pre-Test PPE selections, 7-step Handwashing technique, Tool safety audits, Raw Ingredient inspections, and Stage Pre-Check Questions.\n\nClick the green button below to open your comprehensive Diagnostic Audit Report and review your food science rationale breakdown!`,
      'happy',
      {
        badge: 'Post-Test Assessment Submitted',
        note: 'Complete Diagnostic Ready: Review your competency scores, itemized feedback, food science principles, and official laboratory certificate.',
        btnText: 'View Diagnostic Assessment Results ➔',
        onNext: () => setScene('results'),
      }
    );
  };

  const handleProceedToEvaluation = () => {
    soundManager.playClick();
    hideDialogue();
    completeMission('sequencing');
    setScene('results');
  };

  return (
    <div className="sequencing-scene">
      <div className="sequencing-page-container">
        {/* Header Hero Banner */}
        <div className="sequencing-hero-header">
          <div className="hero-exam-badge">
            <span>POST-TEST • MANUFACTURING SEQUENCE ASSESSMENT</span>
          </div>
          <h2 className="hero-exam-title">Coconut Pith Crackers Pipeline Assessment</h2>
          <p className="hero-exam-desc">
            Reconstruct the exact sequential lifecycle of <strong>Ubod ng Niyog - Ubod CRUNCH</strong> before accessing your comprehensive diagnostic audit report and food science rationale breakdown.
          </p>
        </div>

        {/* Interactive Sequencing Puzzle Card */}
        <div className="sequencing-puzzle-wrapper">
          <SequencingActivity onComplete={handleSequenceCompleted} />
        </div>

        {/* Bottom clearance spacer */}
        <div style={{ height: '40px', flexShrink: 0 }} />
      </div>

      {/* 20% Right Column Exam Protocol Sidebar */}
      <SequencingSidebar isCompleted={isCompleted} />
    </div>
  );
};
