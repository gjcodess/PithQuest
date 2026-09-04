import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const OrientationScene = () => {
  const { studentName, setScene, addScore, unlockBadge, speak, completeMission } = useGame();

  const [ppeStatus, setPpeStatus] = useState({
    hairnet: false,
    apron: false,
    hands: false,
  });

  const [phase, setPhase] = useState('intro'); // 'intro', 'benefits', 'ppe', 'ready'

  useEffect(() => {
    if (phase === 'intro') {
      speak(
        `Welcome to our Food Processing Laboratory, ${studentName}! Today, we will explore the science of converting nutritious Coconut Pith (Ubod ng Niyog) into crispy crackers.`,
        'neutral',
        {
          badge: 'Day 1: Orientation',
          btnText: 'Learn the Benefits ➔',
          onNext: () => setPhase('benefits'),
        }
      );
    } else if (phase === 'benefits') {
      speak(
        'Coconut Pith (Ubod ng Niyog) is a nutrient-dense agricultural treasure! Review its nutritional profile above, then let\'s proceed to our sanitation check.',
        'neutral',
        {
          badge: 'Nutritional Science',
          btnText: 'Proceed to Hygiene Check ➔',
          onNext: () => setPhase('ppe'),
        }
      );
    } else if (phase === 'ppe') {
      speak(
        'Before touching any food items, we must observe strict Home Economics hygiene standards. Equip all 3 PPE items below to enter the workstation!',
        'thinking',
        {
          badge: 'Sanitation Check',
          hint: 'Click each hygiene item to put it on and sanitize your hands.',
          hideButton: true,
        }
      );
    }
  }, [phase, studentName]);

  const handleBenefitsNext = () => {
    soundManager.playClick();
    setPhase('ppe');
  };


  const togglePpe = (key, label) => {
    if (ppeStatus[key]) return;

    soundManager.playSuccess();
    const updated = { ...ppeStatus, [key]: true };
    setPpeStatus(updated);

    const allEquipped = updated.hairnet && updated.apron && updated.hands;
    if (allEquipped) {
      addScore(50);
      unlockBadge('sanitation_star', 'Sanitation Guardian', '🧼');
      setPhase('ready');
      completeMission('orientation');
      speak(
        'Outstanding! Your hairnet is secure, apron is clean, and hands are sanitized. +50 Points! We are ready to begin Stage 1!',
        'happy',
        {
          badge: 'Sanitation Approved',
          btnText: 'Start Stage 1: Raw Prep ➔',
          onNext: () => setScene('mission1'),
        }
      );
    }
  };

  const equippedCount = Object.values(ppeStatus).filter(Boolean).length;

  return (
    <div className="workstation-scene orientation-scene">
      <div className="workstation-overlay" />
      <div className="stage-center-zone">
        {phase === 'intro' && (
          <div className="active-vessel-card orientation-card">
            <div className="vessel-header">
              <span className="vessel-title">👋 Welcome, {studentName}!</span>
              <span className="vessel-badge">Orientation</span>
            </div>
            <div className="orientation-body">
              <img src="/images/teacher_mia_neutral.png" alt="Teacher Mia" className="orientation-hero-img" />
              <div className="orientation-text">
                <h3>Home Economics Food Technology Class</h3>
                <p>
                  Today, you will experience the complete food processing lifecycle of <strong>Coconut Pith Crackers</strong>.
                  You will actively perform the 3 core food-processing methods:
                </p>
                <div className="method-pills">
                  <span className="m-pill">1. Boiling 🫕</span>
                  <span className="m-pill">2. Dehydration ☀️</span>
                  <span className="m-pill">3. Deep Frying 🍳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'benefits' && (
          <div className="active-vessel-card orientation-card">
            <div className="vessel-header">
              <span className="vessel-title">🥥 Nutritional & Economic Significance</span>
              <span className="vessel-badge">Agricultural Science</span>
            </div>
            <div className="benefits-hero-banner">
              <img src="/images/icon_fresh_ubod.png" alt="Fresh Ubod" className="benefits-ubod-img" />
            </div>
            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="b-icon">🌾</span>
                <h4>Rich in Dietary Fiber</h4>
                <p>Coconut pith contains insoluble dietary fiber that aids digestion and provides a satisfying, healthy crunch.</p>
              </div>
              <div className="benefit-item">
                <span className="b-icon">⚡</span>
                <h4>Potassium & Minerals</h4>
                <p>Natural electrolyte source supporting balanced blood pressure and metabolic functions.</p>
              </div>
              <div className="benefit-item">
                <span className="b-icon">♻️</span>
                <h4>Waste Valorization</h4>
                <p>Utilizes the tender heart of felled coconut palms, turning agricultural surplus into commercial food products.</p>
              </div>
            </div>
            <div className="card-actions-center">
              <button className="btn-primary" onClick={handleBenefitsNext}>
                Proceed to Laboratory Hygiene Check ➔
              </button>
            </div>
          </div>
        )}

        {(phase === 'ppe' || phase === 'ready') && (
          <div className="active-vessel-card ppe-card">
            <div className="vessel-header">
              <span className="vessel-title">🧼 Laboratory PPE & Sanitation Protocol</span>
              <span className="vessel-badge">{equippedCount}/3 Completed</span>
            </div>
            <p className="ppe-prompt">Equip all mandatory protective items before entering the preparation bench:</p>

            <div className="ppe-items-grid">
              <div
                className={`ppe-box ${ppeStatus.hairnet ? 'equipped' : ''}`}
                onClick={() => togglePpe('hairnet', 'Hairnet')}
              >
                <img src="/images/icon_hairnet.png" alt="Sanitary Hairnet" className="ppe-icon-img" />
                <span className="ppe-name">Sanitary Hairnet</span>
                <span className="ppe-desc">Prevents hair strand contamination</span>
                <span className="ppe-status-pill">{ppeStatus.hairnet ? '✓ Equipped' : 'Click to Wear'}</span>
              </div>

              <div
                className={`ppe-box ${ppeStatus.apron ? 'equipped' : ''}`}
                onClick={() => togglePpe('apron', 'Clean Apron')}
              >
                <img src="/images/icon_apron.png" alt="Clean Apron" className="ppe-icon-img" />
                <span className="ppe-name">Clean Laboratory Apron</span>
                <span className="ppe-desc">Protects food from clothing dust</span>
                <span className="ppe-status-pill">{ppeStatus.apron ? '✓ Equipped' : 'Click to Wear'}</span>
              </div>

              <div
                className={`ppe-box ${ppeStatus.hands ? 'equipped' : ''}`}
                onClick={() => togglePpe('hands', 'Sanitize Hands')}
              >
                <img src="/images/icon_sanitizer.png" alt="Hand Sanitizer" className="ppe-icon-img" />
                <span className="ppe-name">Handwashing & Sanitizer</span>
                <span className="ppe-desc">20-second antibacterial scrub</span>
                <span className="ppe-status-pill">{ppeStatus.hands ? '✓ Sanitized' : 'Click to Wash'}</span>
              </div>
            </div>

            {phase === 'ready' && (
              <div className="card-actions-center">
                <button className="btn-gold" onClick={() => setScene('mission1')}>
                  ✨ Enter Stage 1: Raw Prep & Slicing ➔
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
