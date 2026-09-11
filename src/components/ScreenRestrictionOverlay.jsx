import React, { useState, useEffect } from 'react';

export const ScreenRestrictionOverlay = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <aside
      className="screen-restriction-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="screen-restriction-title"
      aria-describedby="screen-restriction-desc"
    >
      <div className="restriction-modal-card">
        {/* Decorative Top Badge */}
        <div className="restriction-badge">
          <span className="restriction-badge-icon">🖥️</span>
          <span>Wide Screen Display Required</span>
        </div>

        {/* Mascot Avatar Frame */}
        <div className="restriction-mascot-wrapper">
          <div className="restriction-mascot-frame">
            <img
              src="/assets/teacher_mia_thinking.png"
              alt="Teacher Mia"
              className="restriction-mascot-img"
              onError={(e) => {
                // Graceful fallback if image fails
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="restriction-mascot-tag">Teacher Mia</span>
        </div>

        {/* Headline & Notice */}
        <h2 id="screen-restriction-title" className="restriction-title">
          Please Use a Desktop or Tablet
        </h2>

        <p id="screen-restriction-desc" className="restriction-desc">
          <strong>PITHQuest Virtual Food Laboratory</strong> features interactive 3D
          workstations, tactile tool inspections, and multi-step sanitation sequences
          designed exclusively for <strong>wide displays</strong>.
        </p>

        {/* Device Compatibility Matrix */}
        <div className="restriction-device-list">
          <div className="device-item device-supported">
            <div className="device-icon">💻</div>
            <div className="device-info">
              <span className="device-name">Desktop & Laptop</span>
              <span className="device-status">Recommended • Full Experience</span>
            </div>
            <span className="device-pill pill-ok">✓ Ready</span>
          </div>

          <div className="device-item device-supported">
            <div className="device-icon">📱</div>
            <div className="device-info">
              <span className="device-name">Tablet (iPad / Android)</span>
              <span className="device-status">Supported (768px+ or Landscape)</span>
            </div>
            <span className="device-pill pill-ok">✓ Ready</span>
          </div>

          <div className="device-item device-restricted">
            <div className="device-icon">📵</div>
            <div className="device-info">
              <span className="device-name">Mobile Smartphones</span>
              <span className="device-status">Screen size is too compact for lab tools</span>
            </div>
            <span className="device-pill pill-no">✕ Restricted</span>
          </div>
        </div>

        {/* Helpful Advice */}
        <div className="restriction-tip-box">
          <span className="tip-icon">💡</span>
          <span className="tip-text">
            If you are on a tablet, please rotate to <strong>landscape mode</strong>. Otherwise,
            please open this learning activity on your laptop or PC!
          </span>
        </div>

        {/* Live Resolution Tracker */}
        <div className="restriction-footer-specs">
          <span className="specs-pill">
            Current: {dimensions.width}px × {dimensions.height}px
          </span>
          <span className="specs-divider">•</span>
          <span className="specs-pill req-pill">
            Minimum Width: 768px
          </span>
        </div>
      </div>
    </aside>
  );
};
