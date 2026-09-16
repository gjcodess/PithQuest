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
        `Post-Test Sequence Verified, ${studentName || 'Food Technologist'}!\n\nYour reconstructed 8-stage food manufacturing sequence is ready for full debrief.\n\nYou have systematically tracked the entire lifecycle of Ubod ng Niyog—from hydrothermal fiber softening and high-shear mechanical pureeing, to balanced starch formulation, standardized geometric molding, moist-heat gelatinization, convective moisture vitrification, flash expansion deep frying, and multi-barrier hermetic packaging.\n\nClick the button below to inspect your comprehensive Laboratory Review & Complete Answer Key!`,
        'happy',
        {
          badge: 'Post-Test Assessment Verified',
          note: 'Pipeline Sequence Complete: Review each unit operation and its food science rationale in the final debrief.',
          btnText: 'View Laboratory Review & Answer Key ➔',
          onNext: () => setScene('results'),
        }
      );
    } else {
      speak(
        `Welcome to the Post-Test Assessment, ${studentName || 'Food Technologist'}!\n\nNow that you have successfully completed all laboratory hands-on operations, this final assessment evaluates your comprehensive understanding of the complete industrial manufacturing lifecycle.\n\nUnit operations in food processing follow strict thermodynamic and biochemical prerequisites: each stage creates the exact chemical or physical state required by the next stage.\n\nYour Objective: Arrange the 8 processing stage cards in their authentic chronological sequence from left to right, then click "Verify Chronological Sequence"!`,
        'thinking',
        {
          badge: 'Post-Test: Chronological Sequencing',
          note: 'Industrial Flow Logic: Trace the transformation from raw coconut pith (ubod) harvesting, washing, and softening, through to commercial retail distribution.',
          hint: 'Drag cards into target slots or tap cards to swap their positions, then click Verify below.',
          hideButton: true,
        }
      );
    }
  }, []);

  const handleSequenceCompleted = () => {
    setIsCompleted(true);
    completeMission('sequencing');
    soundManager.playFanfare();
    setScene('results');
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
