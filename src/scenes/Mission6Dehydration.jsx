import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission6Dehydration = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Dehydration states:
  // 0: Empty counter -> accept mesh_tray (place stainless wire mesh tray)
  // 1: Wire mesh tray on counter -> accept steamed_pieces (arrange with 1-inch spacing)
  // 2: Populated tray with 1-inch spaced pieces -> action: slide into cabinet / accept dehydrator_cabinet
  // 3: Loaded in cabinet dehydrator -> action: calibrate 90°C / 12h
  // 4: Dehydrating (12-hour time-lapse, moisture gauge: 70% -> 8%)
  // 5: Translucent brittle cracker pellets ready on tray -> accept storage_container
  // 6: Sealed in airtight storage container -> complete & proceed to frying
  const [dehydrateStep, setDehydrateStep] = useState(0);
  const [dehydrateProgress, setDehydrateProgress] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(70);
  const [isDehydrating, setIsDehydrating] = useState(false);

  useEffect(() => {
    speak(
      'Stage 6: Cooling & Cabinet Dehydration! Step 16: Arrange the pieces on the dehydrator tray with enough space between each piece to prevent them from sticking together.',
      'neutral',
      {
        badge: 'Step 16: Tray Spacing',
        note: 'Arrange the pieces on the dehydrator tray with enough space between each piece to prevent them from sticking together.',
        hint: 'Select the Wire Mesh Tray from the bottom inventory and place it on the workstation counter.',
        hideButton: true,
      }
    );
  }, []);

  const dehydratorSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['mesh_tray', 'icon_drying_tray', 'dehydrator_tray_empty'],
      prompt: 'Place the stainless steel wire mesh tray onto the workstation prep counter',
      img: '/assets/icon_drying_tray.png',
      fallbackIcon: '🔲',
      label: 'Workstation Prep Counter',
    },
    {
      stepIndex: 1,
      acceptedItems: ['steamed_pieces', 'steamed_ubod', 'cracker_piece_unmolded'],
      prompt: 'Arrange steamed ubod wafers onto the wire mesh tray with 1-inch spacing',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      label: 'Stainless Wire Mesh Tray (Empty)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['dehydrator_cabinet', 'equip_dehydrator_safe'],
      prompt: 'Slide populated tray into the commercial cabinet dehydrator',
      img: '/assets/dehydrator_tray_arranged.png',
      fallbackIcon: '🧈',
      label: 'Spaced Tray Layout (1-Inch Gap)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Tray loaded in cabinet dehydrator! Calibrate to 90°C for 12 hours',
      img: '/assets/equip_dehydrator_safe.png',
      fallbackIcon: '💨',
      label: 'Electric Cabinet Dehydrator',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'Convection airflow evaporating moisture at 90°C (12-Hour Cycle)...',
      img: '/assets/dehydrator_assembled_running.png',
      fallbackIcon: '⏳',
      label: '12-Hour Moisture Removal',
    },
    {
      stepIndex: 5,
      acceptedItems: ['storage_container', 'storage_tray', 'container_dehydrated_chips'],
      prompt: 'Hard, translucent, brittle cracker pellets ready (<8% H2O)! Transfer to airtight container',
      img: '/assets/dehydrator_tray_dried.png',
      fallbackIcon: '✨',
      label: 'Vitrified Pellets (<8% Moisture)',
    },
    {
      stepIndex: 6,
      acceptedItems: [],
      prompt: 'Sealed in airtight clip container! Protected from ambient humidity and ready to fry',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      label: 'Airtight Storage Container (Ready)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'mesh_tray' || item.id === 'icon_drying_tray' || item.id === 'dehydrator_tray_empty')) {
      soundManager.playClick();
      setDehydrateStep(1);
      addScore(20);
      setHoldingItem(null);
      showToast('Tray Prepared!', 'Stainless wire mesh placed on counter', 'success');
      speak(
        'Great! The wire mesh grid provides 360° airflow. Now select the Steamed Ubod Wafers from inventory and arrange them with space between each piece.',
        'neutral',
        {
          badge: 'Wafer Spacing',
          note: 'Proper spacing ensures unrestricted airflow so all pieces dry evenly without damp spots.',
          hint: 'Select Steamed Ubod Wafers from inventory and place them on the wire mesh tray.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'steamed_pieces' || item.id === 'steamed_ubod' || item.id === 'cracker_piece_unmolded')) {
      soundManager.playClick();
      setDehydrateStep(2);
      addScore(25);
      setHoldingItem(null);
      showToast('Pieces Loaded!', 'Spaced evenly with 1-inch gaps', 'success');
      speak(
        'Step 17: Dehydrate the molded ubod pieces for approximately 12 hours at 90°C. Select the Cabinet Dehydrator to insert the tray.',
        'neutral',
        {
          badge: 'Step 17: Dehydration Setup',
          note: 'Safety Note: Check the wirings, outlets, and the dehydrator itself before turning on the power.',
          hint: 'Select Cabinet Dehydrator from inventory and place it onto the tray.',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && (item.id === 'dehydrator_cabinet' || item.id === 'equip_dehydrator_safe')) {
      handleSlideIntoCabinet();
    } else if (stepIndex === 5 && (item.id === 'storage_container' || item.id === 'storage_tray' || item.id === 'container_dehydrated_chips')) {
      handleTransferToStorage();
    }
  };

  const handleSlideIntoCabinet = () => {
    soundManager.playClick();
    setDehydrateStep(3);
    addScore(20);
    setHoldingItem(null);
    showToast('Tray Inserted!', 'Tray secured inside cabinet dehydrator', 'success');
    speak(
      'The tray is secure inside the cabinet. Set the thermostat to 90°C and press "Start 12-Hour Dehydration Cycle"!',
      'thinking',
      {
        badge: 'Thermostat Setting',
        note: 'Since dehydration requires approximately 12 hours, the dehydrator may be operated under teacher/laboratory supervision. Check product before and after.',
        hint: 'Tap "Start 12-Hour Dehydration (90°C)" button.',
        hideButton: true,
      }
    );
  };

  const handleStartDehydration = () => {
    soundManager.playBoil();
    setIsDehydrating(true);
    setDehydrateStep(4);
    setHoldingItem(null);
    showToast('Dehydrating Active...', 'Convection fan circulating 90°C dry air...', 'info');
    speak(
      'Convection fans are actively circulating 90°C dry air! Moisture is evaporating to create shelf-stable translucent chips.',
      'happy',
      {
        badge: 'Dehydration in Progress',
        note: 'Drying removes free water to inhibit microbial growth and create glassy starch matrix suitable for frying.',
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
        setDehydrateStep(5);
        soundManager.playSuccess();
        addScore(40);
        showToast('Dehydration Complete!', 'Moisture reduced to 8%! Translucent glassy pellets formed', 'success');
        speak(
          'Step 18: Once completely dehydrated, transfer the dried ubod pieces to a clean, dry container. Select the Airtight Chip Box to store them!',
          'happy',
          {
            badge: 'Step 18: Airtight Transfer',
            note: 'Store dehydrated pieces in a clean, dry, airtight container to prevent re-absorbing ambient moisture before frying.',
            hint: 'Select the Airtight Chip Box on the bottom shelf and tap the tray to seal.',
            hideButton: true,
          }
        );
      }
    }, 650);
  };

  const handleTransferToStorage = () => {
    soundManager.playClick();
    setDehydrateStep(6);
    setHoldingItem(null);
    addScore(30);
    unlockBadge('vitrification_master', 'Moisture Reduction Expert', '💨');
    completeMission('mission6');
    showToast('Airtight Storage!', 'Protected from ambient humidity', 'success');
    speak(
      'Superb work! The dehydrated chips are sealed in the clean, dry container. They are now ready for rapid frying in Stage 7!',
      'happy',
      {
        badge: 'Stage 6 Complete',
        note: 'Completely dried pellets can now be stored safely or fried immediately into crispy, puffed crackers.',
        btnText: 'Proceed to Stage 7: Deep Frying ➔',
        onNext: () => setScene('mission7'),
      }
    );
  };

  const stage6Inventory = [
    {
      id: 'mesh_tray',
      name: 'Wire Mesh Tray',
      measure: '360° Airflow Grid',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      isUsed: dehydrateStep >= 1,
      isNext: dehydrateStep === 0,
      tooltip: 'Stainless wire mesh tray enabling 360° horizontal convection air distribution.',
    },
    {
      id: 'steamed_pieces',
      name: 'Steamed Ubod Wafers',
      measure: '24 Translucent Pieces',
      img: '/assets/cracker_piece_unmolded.png',
      fallbackIcon: '🧈',
      isUsed: dehydrateStep >= 2,
      isNext: dehydrateStep === 1,
      tooltip: 'Firm, gelatinized translucent wafers arranged with 1cm spacing for dehydration.',
    },
    {
      id: 'dehydrator_cabinet',
      name: 'Cabinet Dehydrator',
      measure: '90°C Convection',
      img: '/assets/equip_dehydrator_safe.png',
      fallbackIcon: '💨',
      isUsed: dehydrateStep >= 4,
      isNext: dehydrateStep === 2,
      tooltip: 'Forced-air cabinet dehydrator drying pellets at 90°C to achieve <8% residual moisture.',
    },
    {
      id: 'storage_container',
      name: 'Airtight Chip Box',
      measure: 'Hermetic Seal (<10%)',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      isUsed: dehydrateStep >= 6,
      isNext: dehydrateStep === 5,
      tooltip: 'Hermetically sealed container preventing vitrified glassy pellets from moisture uptake.',
    },
  ];

  return (
    <div className="workstation-scene dehydration-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
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
              containerWidth="520px"
              containerHeight="330px"
              statusDotClass={dehydrateStep >= 6 ? 'dot-success' : isDehydrating ? 'dot-amber' : ''}
              statusText={
                dehydrateStep >= 6
                  ? 'Hermetically sealed glassy pellets ready for frying'
                  : dehydrateStep === 5
                  ? 'Vitrification complete (<8% H2O). Transfer to airtight container.'
                  : dehydrateStep === 4
                  ? `Dehydrating... ${dehydrateProgress}% (90°C Convection Time-Lapse)`
                  : dehydrateStep === 3
                  ? 'Tray loaded in cabinet. Ready for 90°C dehydration.'
                  : dehydrateStep === 2
                  ? 'Pieces spaced evenly with 1-inch gaps. Slide into cabinet.'
                  : dehydrateStep === 1
                  ? 'Wire mesh tray placed on counter. Place steamed wafers.'
                  : 'Place stainless wire mesh tray onto workstation prep counter'
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    dehydrateStep >= 6
                      ? 'spec-success'
                      : dehydrateStep >= 4
                      ? 'spec-amber'
                      : ''
                  }`}
                >
                  {dehydrateStep >= 6
                    ? 'AW: <0.60'
                    : dehydrateStep >= 4
                    ? 'MOISTURE: 8%'
                    : dehydrateStep === 3
                    ? 'TEMP: 90°C'
                    : dehydrateStep === 2
                    ? 'GAP: 1-INCH'
                    : dehydrateStep === 1
                    ? 'GRID: MESH'
                    : 'PREP: COUNTER'}
                </span>
              }
              customFooter={
                (dehydrateStep === 3 || dehydrateStep === 4) ? (
                  <div
                    className={`dehydrator-appliance-console ${
                      dehydrateStep === 3 ? 'ready-to-start' : 'is-running'
                    }`}
                    onClick={dehydrateStep === 3 ? handleStartDehydration : undefined}
                    role="button"
                    tabIndex={0}
                    title={
                      dehydrateStep === 3
                        ? 'Click dial to start 12-Hour 90°C Dehydration Cycle'
                        : '12-Hour Dehydration in progress'
                    }
                  >
                    <div className="dehydrator-dial-assembly">
                      <span className={`dehydrator-dial-icon ${dehydrateStep === 4 ? 'spinning' : ''}`}>
                        {dehydrateStep === 4 ? '🌀' : '⏻'}
                      </span>
                      {dehydrateStep === 3 && (
                        <>
                          <span className="knob-beacon-ring r1" />
                          <span className="knob-beacon-ring r2" />
                        </>
                      )}
                    </div>

                    <div className="dehydrator-panel-text">
                      <div className="dehydrator-badge-row">
                        <span
                          className={`dehydrator-led ${
                            dehydrateStep === 4 ? 'active-running' : 'blinking'
                          }`}
                        />
                        <span className="dehydrator-mode-title">
                          {dehydrateStep === 4
                            ? '90°C CONVECTION ACTIVE'
                            : 'CLICK TO START (90°C)'}
                        </span>
                      </div>

                      <div className="dehydrator-sub-row">
                        {dehydrateStep === 4 ? (
                          <div className="dehydrator-progress-container">
                            <div className="dehydrator-progress-bar-bg">
                              <div
                                className="dehydrator-progress-bar-fill"
                                style={{ width: `${dehydrateProgress}%` }}
                              />
                            </div>
                            <span className="dehydrator-progress-label">
                              {dehydrateProgress}% Complete • {Math.max(1, Math.round(12 * (1 - dehydrateProgress / 100)))}h Remaining
                            </span>
                          </div>
                        ) : (
                          <span className="dehydrator-action-hint">
                            👉 Click dial to start 12-hour thermal vitrification
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
              }
            />
          </div>

          {/* Right Side: Dehydration QC & Moisture Monitor Workstation */}
          <div
            className={`multi-state-workstation qc-workstation ${
              dehydrateStep === 5 && (holdingItem?.id === 'storage_container' || holdingItem?.id === 'storage_tray')
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '440px',
              cursor: dehydrateStep === 5 ? 'url("/assets/cursor_hover_32.png") 2 2, pointer' : 'inherit',
            }}
            onClick={() => {
              if (dehydrateStep === 5) {
                handleTransferToStorage();
              }
            }}
            onDragOver={(e) => {
              if (dehydrateStep === 5) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (dehydrateStep === 5) {
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
                  dehydrateStep >= 6
                    ? 'badge-success-glow'
                    : dehydrateStep === 5
                    ? 'badge-flow-glow'
                    : dehydrateStep === 4
                    ? 'badge-amber-glow'
                    : dehydrateStep >= 2
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {dehydrateStep >= 6
                  ? '✅ Vitrified & Sealed'
                  : dehydrateStep === 5
                  ? '✨ Ready to Store'
                  : dehydrateStep === 4
                  ? '💨 90°C Convection'
                  : dehydrateStep >= 2
                  ? '📐 1-Inch Spaced'
                  : dehydrateStep === 1
                  ? '🔲 Tray Prepared'
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className="workstation-viewport dehydration-qc-viewport"
              style={{ height: '330px', minHeight: '330px', maxHeight: '330px', flex: '0 0 auto' }}
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
                      style={{ color: dehydrateStep === 4 ? '#0284c7' : '#0f172a' }}
                    >
                      90°C Convection
                    </span>
                  </div>
                </div>

                {/* Live 12-Hour Cycle Progress Row */}
                <div className="dehydration-cycle-row">
                  <div className="dehydration-cycle-header">
                    <span>12-Hour Dehydration Cycle:</span>
                    <strong>{dehydrateStep >= 5 ? '100% (Completed)' : `${dehydrateProgress}%`}</strong>
                  </div>
                  <div className="dehydration-cycle-bar-bg">
                    <div
                      className="dehydration-cycle-bar-fill"
                      style={{
                        width: dehydrateStep >= 5 ? '100%' : `${dehydrateProgress}%`,
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
                <div className={`texture-compare-box ${dehydrateStep < 5 ? 'active-state' : ''}`}>
                  <span className="texture-box-tag">Steamed Wafers</span>
                  <span className="texture-box-desc">70% H2O • Soft & Flexible</span>
                </div>
                <div className={`texture-compare-box ${dehydrateStep >= 5 ? 'active-state' : ''}`}>
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
                    dehydrateStep >= 6
                      ? 'dot-success'
                      : dehydrateStep >= 4
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {dehydrateStep >= 6
                    ? 'Glassy kropek pellets hermetically sealed and shelf-stable.'
                    : dehydrateStep === 5
                    ? 'Vitrification complete (<8% H2O). Transfer to airtight container.'
                    : dehydrateStep === 4
                    ? 'Active convection airflow reducing moisture from 70% to 8%...'
                    : dehydrateStep >= 2
                    ? 'Pieces arranged with 1-inch spacing. Ready for dehydrator cabinet.'
                    : dehydrateStep === 1
                    ? 'Wire mesh tray placed. Awaiting steamed ubod wafer arrangement.'
                    : 'Place stainless steel wire mesh tray on workstation counter.'}
                </span>
              </div>
              <span className="spec-badge">
                {dehydrateStep >= 6
                  ? 'AW: <0.60'
                  : dehydrateStep >= 4
                  ? 'MOISTURE: 8%'
                  : dehydrateStep === 3
                  ? 'TEMP: 90°C'
                  : dehydrateStep >= 1
                  ? 'MOISTURE: 70%'
                  : 'PREP: TRAY'}
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
