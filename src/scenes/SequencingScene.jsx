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
        `Post-Test Sequence Completed, ${studentName || 'Food Technologist'}! Your sequential ordering has been recorded. Review your complete laboratory performance and diagnostic audit report!`,
        'happy',
        {
          badge: 'Post-Test Assessment Complete',
          note: 'Your sequence order has been logged alongside your Pre-Test diagnostics for comprehensive evaluation.',
          btnText: 'View Diagnostic Assessment Results ➔',
          onNext: () => setScene('results'),
        }
      );
    } else {
      speak(
        `Post-Test Assessment, ${studentName || 'Food Technologist'}! Arrange the 8 processing stages in their authentic chronological sequence from left to right.`,
        'thinking',
        {
          badge: 'Post-Test: Stage Sequencing',
          note: 'Reconstruct the complete food manufacturing pipeline: from raw ingredient preparation to finished packaged crackers.',
          hint: 'Drag or tap cards to set their positions, then click "Submit Chronological Sequence & View Results".',
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
      `Post-Test Submitted, ${studentName || 'Food Technologist'}! Your 8-stage manufacturing sequence is recorded. Let's inspect your diagnostic assessment results and comprehensive audit report!`,
      'happy',
      {
        badge: 'Post-Test Submitted',
        note: 'Comprehensive audit ready: Pre-Test PPE, Handwashing, Tool Safety, Ingredient QC, and Post-Test Sequencing.',
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
