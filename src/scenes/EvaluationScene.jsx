import React, { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const EvaluationScene = () => {
  const { studentName, score, stars, badges, resetGame, speak } = useGame();
  const certRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrintCertificate = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="evaluation-scene">
      <div className="eval-container">
        {/* Header Banner */}
        <div className="eval-header-card">
          <div className="cert-ribbon">🏆 LABORATORY MASTERY ACHIEVED</div>
          <h2>Coconut Pith Crackers Quality Audit</h2>
          <p className="eval-sub">Evaluation Report & Official Laboratory Certificate</p>
        </div>

        {/* Sensory Evaluation Checklist & Score Breakdown */}
        <div className="eval-metrics-grid">
          <div className="metric-box">
            <span className="metric-icon">✨</span>
            <h4>Appearance & Color</h4>
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <p>Golden yellow, uniform surface without dark scorch marks.</p>
          </div>

          <div className="metric-box">
            <span className="metric-icon">🔊</span>
            <h4>Crispiness & Texture</h4>
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <p>Airy, brittle, high acoustic crunch with no gummy core.</p>
          </div>

          <div className="metric-box">
            <span className="metric-icon">🪶</span>
            <h4>Puff & Expansion</h4>
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <p>Starch matrix successfully expanded 3x in hot oil.</p>
          </div>

          <div className="metric-box">
            <span className="metric-icon">🧼</span>
            <h4>Oil Retention</h4>
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <p>Drained effectively on cooling rack, dry to the touch.</p>
          </div>
        </div>

        {/* The Official Certificate (Printable) */}
        <div className="certificate-wrapper" ref={certRef}>
          <div className="cert-border-outer">
            <div className="cert-border-inner">
              <div className="cert-header">
                <span className="cert-dept">DEPARTMENT OF HOME ECONOMICS • FOOD PROCESSING TECHNOLOGY</span>
                <h1 className="cert-title">Certificate of Laboratory Completion</h1>
                <p className="cert-presented">This certifies that</p>
                <h2 className="cert-student-name">{studentName || 'Food Tech Student'}</h2>
                <p className="cert-body">
                  has successfully performed and demonstrated comprehensive mastery in the complete food processing lifecycle of
                  <strong> Coconut Pith Crackers (Ubod ng Niyog)</strong>, including raw preparation, thermal softening (boiling), starch formulation,
                  cabinet dehydration, and deep-frying expansion.
                </p>
              </div>

              {/* Badges Display */}
              <div className="cert-badges-showcase">
                {badges.map((b) => (
                  <div key={b.id} className="cert-badge-item">
                    <span className="cert-badge-icon">{b.icon}</span>
                    <span className="cert-badge-title">{b.title}</span>
                  </div>
                ))}
              </div>

              {/* Score & Signatures */}
              <div className="cert-footer">
                <div className="cert-sig-block">
                  <div className="sig-line">
                    <span className="sig-handwritten">Teacher Mia</span>
                  </div>
                  <span className="sig-title">Teacher Mia</span>
                  <span className="sig-role">HE Laboratory Instructor</span>
                </div>

                <div className="cert-seal-block">
                  <div className="cert-gold-seal">
                    <span>SEAL OF</span>
                    <strong>MASTERY</strong>
                    <span>{score} PTS</span>
                  </div>
                  <span className="cert-date">{currentDate}</span>
                </div>

                <div className="cert-sig-block">
                  <div className="sig-line">
                    <span className="sig-handwritten">PITHQUEST</span>
                  </div>
                  <span className="sig-title">Food Technology Panel</span>
                  <span className="sig-role">Quality Evaluator</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="eval-actions">
          <button className="btn-gold btn-print" onClick={handlePrintCertificate}>
            🖨️ Print / Save Certificate as PDF
          </button>
          <button className="btn-secondary" onClick={resetGame}>
            🔄 Process Another Batch
          </button>
        </div>
      </div>
    </div>
  );
};
