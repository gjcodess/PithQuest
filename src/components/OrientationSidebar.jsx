import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SidebarPortal } from './SidebarPortal';

export const OrientationSidebar = ({
  phase = 'lecture',
  ppeEquipped = {},
  completedHandwashSteps = [],
  scienceDone = false,
  ppeDone = false,
  handwashingDone = false,
  toolSafetyDone = false,
  qualityInspectionDone = false,
}) => {
  const { isInventoryCollapsed, setIsInventoryCollapsed } = useGame();

  const ppeCount = Object.values(ppeEquipped).filter(Boolean).length;
  const washCount = completedHandwashSteps.length;

  if (isInventoryCollapsed) {
    return (
      <SidebarPortal>
        <div
          className="right-inventory-rack collapsed"
          onClick={() => {
            soundManager.playClick();
            setIsInventoryCollapsed(false);
          }}
          title="Click to open Orientation Guide (◀)"
          role="button"
          tabIndex={0}
        >
          <div className="inventory-tab-icon-wrapper">
            <span style={{ fontSize: '1.4rem' }}>📋</span>
            <span className="inventory-tab-count-pill">5</span>
          </div>
          <div className="inventory-tab-label-stack">
            <span className="inventory-tab-name">PREP</span>
            <span className="inventory-tab-sub">GUIDE</span>
          </div>
          <div className="inventory-tab-chevron-box">
            <span className="inventory-tab-chevron">◀</span>
          </div>
        </div>
      </SidebarPortal>
    );
  }

  return (
    <SidebarPortal>
      <div className="right-inventory-rack expanded">
        {/* Header Bar */}
        <div className="rack-header">
          <div className="rack-title-group">
            <div className="rack-icon-box">
              <span style={{ fontSize: '1.4rem' }}>📋</span>
            </div>
            <div className="rack-titles">
              <span className="rack-title-text">Orientation Checklist</span>
              <span className="rack-count-pill">Lab Protocol</span>
            </div>
          </div>
          <button
            className="rack-collapse-btn"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              setIsInventoryCollapsed(true);
            }}
            title="Minimize Sidebar (▶)"
            aria-label="Minimize Sidebar"
          >
            <span>▶</span>
          </button>
        </div>
        <div className="rack-header-divider" />

        <div className="rack-hint-bar">
          <span>Complete all 5 orientation requirements to unlock Stage 1</span>
        </div>

        {/* Scrollable Checklist Stack */}
        <div className="inventory-vertical-stack">
          {/* Module 1: Science */}
          <div className={`drag-card horizontal-item-card ${scienceDone ? 'used' : ''}`}>
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🔬</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">1. Food Science Concepts</span>
                <span className="card-measure">{scienceDone ? '✓ VERIFIED' : 'ACTIVE'}</span>
              </div>
              <p className="card-desc-text">Ubod utilization, nutrient retention, and crisping science.</p>
            </div>
          </div>

          {/* Module 2: PPE */}
          <div className={`drag-card horizontal-item-card ${ppeDone ? 'used' : ''}`}>
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🥼</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">2. PPE Equipment</span>
                <span className="card-measure">{ppeDone ? '6/6 EQUIPPED' : `${ppeCount}/6 ITEMS`}</span>
              </div>
              <p className="card-desc-text">Hairnet, apron, mask, gloves, heat mitts & safety shoes.</p>
            </div>
          </div>

          {/* Module 3: Handwashing */}
          <div className={`drag-card horizontal-item-card ${handwashingDone ? 'used' : ''}`}>
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🧼</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">3. Handwashing Sanitation</span>
                <span className="card-measure">{handwashingDone ? '5/5 DONE' : `${washCount}/5 STEPS`}</span>
              </div>
              <p className="card-desc-text">Wet, soap 20s, palm scrub, interlace fingers, rinse & dry.</p>
            </div>
          </div>

          {/* Module 4: Tools */}
          <div className={`drag-card horizontal-item-card ${toolSafetyDone ? 'used' : ''}`}>
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🛠️</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">4. Tool Inspection</span>
                <span className="card-measure">{toolSafetyDone ? '✓ PASSED' : 'INSPECT'}</span>
              </div>
              <p className="card-desc-text">Food-grade steel blades, sanitized bowls, inspected appliances.</p>
            </div>
          </div>

          {/* Module 5: Raw Ingredients */}
          <div className={`drag-card horizontal-item-card ${qualityInspectionDone ? 'used' : ''}`}>
            <div className="card-icon-col">
              <span style={{ fontSize: '1.6rem' }}>🥥</span>
            </div>
            <div className="card-info-col">
              <div className="card-title-row">
                <span className="card-title">5. Ubod Quality Audit</span>
                <span className="card-measure">{qualityInspectionDone ? '✓ GRADE A' : 'INSPECT'}</span>
              </div>
              <p className="card-desc-text">Fresh ivory coconut pith, crisp texture, zero discoloration.</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarPortal>
  );
};
