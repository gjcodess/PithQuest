import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { SidebarPortal } from './SidebarPortal';

export const SequencingSidebar = ({ isCompleted = false }) => {
  const { isInventoryCollapsed, setIsInventoryCollapsed } = useGame();

  const stagesList = [
    { num: 1, name: 'Preparation & Washing', icon: '🥥', desc: 'Wash, trim, and pre-cook fresh ubod' },
    { num: 2, name: 'Food Processing', icon: '⚡', desc: 'Grind boiled ubod into smooth puree' },
    { num: 3, name: 'Formulation & Dough', icon: '🥣', desc: 'Mix cassava starch, salt & seasonings' },
    { num: 4, name: 'Molding & Shaping', icon: '🥖', desc: 'Form cohesive cylindrical logs' },
    { num: 5, name: 'Steam Gelatinization', icon: '♨️', desc: 'Cook starch until fully translucent' },
    { num: 6, name: 'Dehydration', icon: '☀️', desc: 'Slice thin & dry to 10% moisture' },
    { num: 7, name: 'High-Heat Frying', icon: '🍳', desc: 'Flash fry at 180°C–200°C to puff' },
    { num: 8, name: 'Packaging & Labeling', icon: '📦', desc: 'Seal 50g in airtight kraft pouches' },
  ];

  if (isInventoryCollapsed) {
    return (
      <SidebarPortal>
        <div
          className="right-inventory-rack collapsed"
          onClick={() => {
            soundManager.playClick();
            setIsInventoryCollapsed(false);
          }}
          title="Click to open Post-Test Protocol Reference (◀)"
          role="button"
          tabIndex={0}
        >
          <div className="inventory-tab-icon-wrapper">
            <span style={{ fontSize: '1.4rem' }}>📝</span>
            <span className="inventory-tab-count-pill">8</span>
          </div>
          <div className="inventory-tab-label-stack">
            <span className="inventory-tab-name">POST-TEST</span>
            <span className="inventory-tab-sub">STEPS</span>
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
              <span className="rack-title-text">Post-Test Sequence</span>
              <span className="rack-count-pill">{isCompleted ? '✓ Assessed' : '8 Stages'}</span>
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
          <span>Arrange all 8 stages chronologically from left to right</span>
        </div>

        {/* Vertical Stage Stack */}
        <div className="inventory-vertical-stack">
          {stagesList.map((st) => (
            <div
              key={st.num}
              className={`drag-card horizontal-item-card ${isCompleted ? 'used' : ''}`}
            >
              <div className="card-icon-col">
                <span style={{ fontSize: '1.5rem' }}>{st.icon}</span>
              </div>
              <div className="card-info-col">
                <div className="card-title-row">
                  <span className="card-title">Stage {st.num}: {st.name}</span>
                  <span className="card-measure">{isCompleted ? 'VERIFIED' : `STEP ${st.num}`}</span>
                </div>
                <p className="card-desc-text">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarPortal>
  );
};
