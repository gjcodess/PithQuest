import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission6Dehydration = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Dehydration states:
  // 0: Empty wire mesh tray -> accept steamed_pieces
  // 1: Wire mesh tray loaded with 1-inch spaced pieces -> action: slide into cabinet
  // 2: Loaded in cabinet dehydrator -> action: calibrate 90°C / 12h
  // 3: Dehydrating (12-hour time-lapse, moisture gauge: 70% -> 8%)
  // 4: Translucent brittle cracker pellets ready on tray -> action: transfer to airtight container
  // 5: Sealed in airtight storage container -> complete & proceed to frying
  const [dehydrateStep, setDehydrateStep] = useState(0);
  const [dehydrateProgress, setDehydrateProgress] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(70);
  const [isDehydrating, setIsDehydrating] = useState(false);

  useEffect(() => {
    speak(
      'Stage 6: Cooling & Cabinet Dehydration! Select the steamed ubod wafers from your bottom inventory and arrange them on the wire mesh tray with 1-inch spacing.',
      'neutral',
      {
        badge: 'Stage 6: Dehydration',
        hint: 'Select Steamed Ubod Wafers from the bottom inventory shelf and place them on the wire mesh tray.',
        hideButton: true,
      }
    );
  }, []);

  const dehydratorSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['steamed_pieces', 'steamed_ubod', 'cracker_piece_unmolded'],
      prompt: 'Place cooled steamed rectangular pieces onto the wire mesh tray',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      label: 'Stainless Wire Mesh Tray',
    },
    {
      stepIndex: 1,
      acceptedItems: ['dehydrator_cabinet', 'equip_dehydrator_safe'],
      prompt: 'Arrange pieces with 1-inch spacing to prevent overlapping',
      img: '/assets/dehydrator_tray_arranged.png',
      fallbackIcon: '🧈',
      label: 'Spaced Tray Layout (Ready)',
    },
    {
      stepIndex: 2,
      acceptedItems: [],
      prompt: 'Tray loaded in cabinet dehydrator! Calibrate to 90°C for 12 hours',
      img: '/assets/equip_dehydrator_safe.png',
      fallbackIcon: '💨',
      label: 'Electric Cabinet Dehydrator',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Convection airflow evaporating moisture at 90°C (12-Hour Cycle)...',
      img: '/assets/dehydrator_assembled_running.png',
      fallbackIcon: '⏳',
      label: '12-Hour Moisture Removal',
    },
    {
      stepIndex: 4,
      acceptedItems: ['storage_container', 'storage_tray', 'container_dehydrated_chips'],
      prompt: 'Hard, translucent, brittle cracker pellets ready! Transfer to airtight container',
      img: '/assets/dehydrator_tray_dried.png',
      fallbackIcon: '✨',
      label: 'Dehydrated Pellets (<10% Moisture)',
    },
    {
      stepIndex: 5,
      acceptedItems: [],
      prompt: 'Sealed in airtight clip container! Protected from ambient humidity and ready to fry',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      label: 'Airtight Storage Container (Ready)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'steamed_pieces' || item.id === 'steamed_ubod' || item.id === 'cracker_piece_unmolded')) {
      soundManager.playClick();
      setDehydrateStep(1);
      addScore(25);
      setHoldingItem(null);
      showToast('Pieces Loaded!', 'Spaced evenly on wire mesh tray (+25 pts)', 'success');
      speak(
        'Great spacing! Now click "Slide Tray into Dehydrator" to place the tray into the electric cabinet dehydrator.',
        'neutral',
        {
          badge: 'Cabinet Loading',
          hint: 'Click "Slide Tray into Dehydrator".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'dehydrator_cabinet' || item.id === 'equip_dehydrator_safe')) {
      handleSlideIntoCabinet();
    } else if (stepIndex === 4 && (item.id === 'storage_container' || item.id === 'storage_tray' || item.id === 'container_dehydrated_chips')) {
      handleTransferToStorage();
    }
  };

  const handleSlideIntoCabinet = () => {
    soundManager.playClick();
    setDehydrateStep(2);
    addScore(20);
    setHoldingItem(null);
    showToast('Tray Inserted!', 'Calibrate thermostat to 90°C and timer to 12 Hours (+20 pts)', 'success');
    speak(
      'The tray is secure inside the cabinet. Set the thermostat to 90°C and press "Start 12-Hour Dehydration Cycle"!',
      'thinking',
      {
        badge: 'Thermostat Setting',
        hint: 'Tap "Start 12-Hour Dehydration (90°C)" button.',
        hideButton: true,
      }
    );
  };

  const handleStartDehydration = () => {
    soundManager.playBoil();
    setIsDehydrating(true);
    setDehydrateStep(3);
    setHoldingItem(null);
    showToast('Dehydrating Active...', 'Convection fan circulating 90°C dry air...', 'info');
    speak(
      'Convection fans are actively circulating 90°C dry air! Watch the moisture monitor drop from 70% to under 10%.',
      'happy',
      {
        badge: '12-Hour Vitrification',
        hint: 'Wait for the 12-hour dehydration time-lapse to complete.',
        hideButton: true,
      }
    );

    let currentMoisture = 70;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;
      currentMoisture = Math.max(8, currentMoisture - 12);
      setDehydrateProgress(progress);
      setMoistureLevel(currentMoisture);

      if (progress >= 100) {
        clearInterval(interval);
        setIsDehydrating(false);
        setDehydrateStep(4);
        soundManager.playSuccess();
        addScore(40);
        showToast('Dehydration Complete!', 'Moisture reduced to 8%! Translucent glassy pellets formed (+40 pts)', 'success');
        speak(
          '12 hours complete! The moisture content has safely dropped from 70% to under 8%. Select the Airtight Chip Box from inventory to seal the pellets and prevent rehydration!',
          'happy',
          {
            badge: 'Vitrification Complete',
            hint: 'Select the Airtight Chip Box on the bottom shelf and tap the tray to seal.',
            hideButton: true,
          }
        );
      }
    }, 650);
  };

  const handleTransferToStorage = () => {
    soundManager.playClick();
    setDehydrateStep(5);
    setHoldingItem(null);
    addScore(30);
    unlockBadge('vitrification_master', 'Moisture Reduction Expert', '💨');
    completeMission('mission6');
    showToast('Airtight Storage!', 'Protected from ambient humidity (+30 pts)', 'success');
    speak(
      'Superb work! The dehydrated chips are sealed in the airtight container. They are now shelf-stable raw kropek pellets, ready for rapid 10-second flash frying in Stage 7!',
      'happy',
      {
        badge: 'Stage 6 Complete',
        btnText: 'Proceed to Stage 7: Deep Frying ➔',
        onNext: () => setScene('mission7'),
      }
    );
  };

  const stage6Inventory = [
    {
      id: 'steamed_pieces',
      name: 'Steamed Ubod Wafers',
      measure: '24 Translucent Pieces',
      img: '/assets/cracker_piece_unmolded.png',
      fallbackIcon: '🧈',
      isUsed: dehydrateStep >= 1,
      isNext: dehydrateStep === 0,
      tooltip: 'Firm, gelatinized rectangular pieces ready for arrangement on mesh tray',
    },
    {
      id: 'mesh_tray',
      name: 'Wire Mesh Tray',
      measure: '1-Inch Spacing',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      isUsed: dehydrateStep >= 2,
      isNext: dehydrateStep === 1,
      tooltip: 'Fine wire grid mesh allowing 360° horizontal cross-flow airflow',
    },
    {
      id: 'dehydrator_cabinet',
      name: 'Cabinet Dehydrator',
      measure: '90°C Convection',
      img: '/assets/equip_dehydrator_safe.png',
      fallbackIcon: '💨',
      isUsed: dehydrateStep >= 4,
      isNext: dehydrateStep === 2,
      tooltip: 'Commercial cabinet food dehydrator with thermal fan circulation',
    },
    {
      id: 'storage_container',
      name: 'Airtight Chip Box',
      measure: 'Hermetic Seal (<10%)',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      isUsed: dehydrateStep >= 5,
      isNext: dehydrateStep === 4,
      tooltip: 'Hermetic clip container to protect glassy pellets from rehydration',
    },
  ];

  return (
    <div className="workstation-scene dehydration-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '920px' }}>
          {/* Left: Convection Cabinet Dehydrator Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="dehydrator"
              title="Convection Cabinet Dehydrator"
              subtitle="90°C Temperature • 12-Hour Starch Vitrification"
              currentStepIndex={dehydrateStep}
              steps={dehydratorSteps}
              onItemAccepted={handleItemAccepted}
              activeAnimation={isDehydrating ? 'convection' : null}
              containerWidth="450px"
              containerHeight="280px"
              statusDotClass={dehydrateStep >= 5 ? 'dot-success' : isDehydrating ? 'dot-amber' : ''}
              statusText={
                dehydrateStep >= 5
                  ? 'Hermetically sealed glassy pellets ready for frying'
                  : dehydrateStep === 4
                  ? 'Vitrification complete (<8% H2O). Transfer to airtight container.'
                  : dehydrateStep === 3
                  ? `Dehydrating... ${dehydrateProgress}% (90°C Convection Time-Lapse)`
                  : dehydrateStep === 2
                  ? 'Tray loaded in cabinet. Ready for 90°C dehydration.'
                  : dehydrateStep === 1
                  ? 'Pieces spaced evenly with 1-inch gaps. Slide into cabinet.'
                  : 'Place cooled steamed wafers on wire mesh tray'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    dehydrateStep >= 5
                      ? 'spec-success'
                      : dehydrateStep === 3
                      ? 'spec-amber'
                      : ''
                  }`}
                >
                  {dehydrateStep >= 5
                    ? 'AW: <0.60'
                    : dehydrateStep === 3
                    ? 'TEMP: 90°C'
                    : dehydrateStep >= 1
                    ? 'GAP: 1-INCH'
                    : 'MOISTURE: 70%'}
                </span>
              }
              interactiveAction={
                dehydrateStep === 1
                  ? {
                      label: '📥 Slide Tray into Cabinet Dehydrator',
                      onClick: handleSlideIntoCabinet,
                      icon: '📥',
                    }
                  : dehydrateStep === 2
                  ? {
                      label: '💨 Start 12-Hour Dehydration (90°C)',
                      onClick: handleStartDehydration,
                      icon: '💨',
                    }
                  : dehydrateStep === 3
                  ? {
                      label: `Dehydrating... ${dehydrateProgress}% (12h Time-Lapse)`,
                      disabled: true,
                    }
                  : null
              }
            >
              {/* Floating guidance pill at Step 4 */}
              {dehydrateStep === 4 && (
                <div
                  className="dropzone-guide-pill"
                  onClick={handleTransferToStorage}
                  title="Click to transfer to airtight container"
                  style={{
                    bottom: '14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)',
                  }}
                >
                  <span>
                    📦 {holdingItem?.id === 'storage_container' ? 'Tap Tray to Seal Pellets' : 'Select Airtight Chip Box Below'}
                  </span>
                </div>
              )}
            </MultiStateContainer>
          </div>

          {/* Right Side: Dehydration QC & Moisture Monitor Workstation */}
          <div
            className={`multi-state-workstation qc-workstation ${
              dehydrateStep === 4 && (holdingItem?.id === 'storage_container' || holdingItem?.id === 'storage_tray')
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '430px',
              cursor: dehydrateStep === 4 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (dehydrateStep === 4) {
                handleTransferToStorage();
              }
            }}
            onDragOver={(e) => {
              if (dehydrateStep === 4) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (dehydrateStep === 4) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  if (item.id === 'storage_container' || item.id === 'storage_tray' || item.id === 'container_dehydrated_chips') {
                    handleTransferToStorage();
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Dehydration QC & Moisture Monitor"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Dehydration QC & Moisture Monitor</h4>
                <span className="workstation-sub">Step 15: 12-Hour Starch Vitrification</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  dehydrateStep >= 5
                    ? 'badge-success-glow'
                    : dehydrateStep === 4
                    ? 'badge-flow-glow'
                    : dehydrateStep === 3
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {dehydrateStep >= 5
                  ? '✅ Vitrified & Sealed'
                  : dehydrateStep === 4
                  ? '✨ Ready to Store'
                  : dehydrateStep === 3
                  ? '💨 90°C Convection'
                  : dehydrateStep >= 1
                  ? '📐 1-Inch Spaced'
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className="workstation-viewport dehydration-qc-viewport"
              style={{ height: '280px', minHeight: '280px', maxHeight: '280px', flex: '0 0 auto' }}
            >
              {/* Moisture & Thermal Parameters Card */}
              <div className="dehydration-spec-card">
                <div className="dehydration-spec-header">
                  <span>💧 Moisture & Water Activity (Aw)</span>
                  <span
                    className={`station-badge-mini ${
                      moistureLevel <= 10 ? 'badge-success' : 'badge-pending'
                    }`}
                  >
                    {moistureLevel <= 10 ? '✨ Shelf-Stable (<10%)' : `${moistureLevel}% H2O`}
                  </span>
                </div>

                <div className="dehydration-spec-grid">
                  <div className="dehydration-spec-item">
                    <span className="spec-title">Moisture Content</span>
                    <span
                      className="spec-val"
                      style={{ color: moistureLevel <= 10 ? '#10b981' : '#0284c7' }}
                    >
                      {moistureLevel}% H2O
                    </span>
                  </div>
                  <div className="dehydration-spec-item">
                    <span className="spec-title">Thermostat Temp</span>
                    <span
                      className="spec-val"
                      style={{ color: dehydrateStep === 3 ? '#0284c7' : '#0f172a' }}
                    >
                      90°C Convection
                    </span>
                  </div>
                </div>

                {/* Live 12-Hour Cycle Progress Row */}
                <div className="dehydration-cycle-row">
                  <div className="dehydration-cycle-header">
                    <span>12-Hour Dehydration Cycle:</span>
                    <strong>{dehydrateStep >= 4 ? '100% (Completed)' : `${dehydrateProgress}%`}</strong>
                  </div>
                  <div className="dehydration-cycle-bar-bg">
                    <div
                      className="dehydration-cycle-bar-fill"
                      style={{
                        width: dehydrateStep >= 4 ? '100%' : `${dehydrateProgress}%`,
                        background:
                          moistureLevel <= 10
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Texture Vitrification Comparison */}
              <div className="dehydration-texture-compare">
                <div className={`texture-compare-box ${dehydrateStep < 4 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Steamed Wafers</span>
                  <span className="texture-box-desc">70% H2O • Soft & Flexible</span>
                </div>
                <div className={`texture-compare-box ${dehydrateStep >= 4 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Vitrified Pellets</span>
                  <span className="texture-box-desc">&lt;8% H2O • Glassy & Brittle</span>
                </div>
              </div>

              {/* Food Science Note */}
              <div className="dehydration-science-note">
                <strong>🔬 Science Principle: </strong>
                Gradual 90°C dehydration vitrifies the starch matrix into shelf-stable glassy pellets (&lt;8% H2O, Aw &lt; 0.60). 1-inch spacing ensures uniform 360° airflow!
              </div>
            </div>

            {/* Workstation Footer */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <div
                  className={`status-dot ${
                    dehydrateStep >= 5
                      ? 'dot-success'
                      : dehydrateStep >= 3
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {dehydrateStep >= 5
                    ? 'Glassy kropek pellets hermetically sealed and shelf-stable.'
                    : dehydrateStep === 4
                    ? 'Vitrification complete (<8% H2O). Transfer to airtight container.'
                    : dehydrateStep === 3
                    ? 'Active convection airflow reducing moisture from 70% to 8%...'
                    : dehydrateStep >= 1
                    ? 'Pieces arranged with 1-inch spacing. Ready for dehydrator cabinet.'
                    : 'Awaiting steamed ubod wafer arrangement on wire mesh tray.'}
                </span>
              </div>
              <span className="spec-badge">
                {dehydrateStep >= 5
                  ? 'AW: <0.60'
                  : dehydrateStep === 3
                  ? 'TEMP: 90°C'
                  : 'MOISTURE: 70%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 6 Dehydration Racks & Trays"
        items={stage6Inventory}
      />
    </div>
  );
};
