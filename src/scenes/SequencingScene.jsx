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
        'Teacher Mia: Welcome to our final test! Answer these Chronological step sequencing assessments.\n\nArrange all 8 stages, from stage 1 to stage 8. Drag or tap the cards to put in position.',
        'thinking',
        {
          badge: 'POST TEST',
          note: 'Arrange all 8 stages, from stage 1 to stage 8. Drag or tap the cards to put in position.',
          hint: 'Select “Verify Chronological Sequence” if you are sure with your answer',
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
