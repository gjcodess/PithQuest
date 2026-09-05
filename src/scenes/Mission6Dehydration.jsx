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
      acceptedItems: ['steamed_pieces', 'steamed_ubod'],
      prompt: 'Place cooled steamed rectangular pieces onto the wire mesh tray',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      label: 'Stainless Wire Mesh Tray',
    },
    {
      stepIndex: 1,
      acceptedItems: [],
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
      acceptedItems: ['storage_container', 'storage_tray'],
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
    if (stepIndex === 0 && (item.id === 'steamed_pieces' || item.id === 'steamed_ubod')) {
      soundManager.playClick();
      setDehydrateStep(1);
      addScore(25);
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
    }
  };

  const handleSlideIntoCabinet = () => {
    soundManager.playClick();
    setDehydrateStep(2);
    addScore(20);
    showToast('Tray Inserted!', 'Calibrate thermostat to 90°C and timer to 12 Hours.', 'success');
    speak(
      'The tray is secure inside the cabinet. Set the thermostat to 90°C and press "Start 12-Hour Dehydration Cycle"!',
      'thinking',
      {
        badge: 'Thermostat Setting',
        hint: 'Tap the "Start 12-Hour Dehydration (90°C)" button.',
        hideButton: true,
      }
    );
  };

  const handleStartDehydration = () => {
    soundManager.playBoil();
    setIsDehydrating(true);
    setDehydrateStep(3);
    showToast('Dehydrating Active...', 'Convection fan circulating 90°C dry air...', 'info');

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
        showToast('Dehydration Complete!', 'Moisture reduced to 8%! Translucent pellets formed (+40 pts)', 'success');
        speak(
          '12 hours complete! The moisture content has safely dropped from 70% to under 8%. Transfer the brittle pellets into our airtight container to prevent rehydration!',
          'happy',
          {
            badge: 'Vitrification Complete',
            hint: 'Click "Transfer to Airtight Storage Container".',
            hideButton: true,
          }
        );
      }
    }, 650);
  };

  const handleTransferToStorage = () => {
    soundManager.playClick();
    setDehydrateStep(5);
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
      measure: '24 Translucent Rectangles',
      img: '/assets/cracker_piece_unmolded.png',
      fallbackIcon: '🧈',
      isUsed: dehydrateStep >= 1,
      isNext: dehydrateStep === 0,
      tooltip: 'Firm, gelatinized rectangular pieces ready for arrangement',
    },
    {
      id: 'mesh_tray',
      name: 'Wire Mesh Tray',
      measure: '1-Inch Spaced Surface',
      img: '/assets/dehydrator_tray_empty.png',
      fallbackIcon: '🔲',
      isUsed: dehydrateStep >= 2,
      isNext: dehydrateStep === 1,
      tooltip: 'Fine grid mesh tray allowing 360° convection hot airflow',
    },
    {
      id: 'dehydrator_cabinet',
      name: 'Convection Cabinet',
      measure: '90°C / 12 Hours',
      img: '/assets/equip_dehydrator_safe.png',
      fallbackIcon: '💨',
      isUsed: dehydrateStep >= 4,
      isNext: dehydrateStep === 2,
      tooltip: 'Cabinet food dehydrator with circulating heated air',
    },
    {
      id: 'storage_container',
      name: 'Airtight Chip Container',
      measure: 'Moisture Barrier (<10%)',
      img: '/assets/container_dehydrated_chips.png',
      fallbackIcon: '📦',
      isUsed: dehydrateStep >= 5,
      isNext: dehydrateStep === 4,
      tooltip: 'Hermetic clip container holding dry glassy pellets',
    },
  ];

  return (
    <div className="workstation-scene dehydration-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '980px' }}>
          {/* Left Side: Moisture & Water Activity Monitor */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>💧 Moisture Monitor</span>
              <span className={`station-badge-mini ${moistureLevel <= 10 ? 'badge-success' : 'badge-pending'}`}>
                {moistureLevel <= 10 ? '✨ Shelf-Stable' : `${moistureLevel}% H2O`}
              </span>
            </div>

            <div className="moisture-card-box" style={{ marginTop: '12px' }}>
              <div className="gauge-label">Water Activity / Moisture:</div>
              <div className="gauge-value" style={{ fontSize: '2rem', fontWeight: 800, color: moistureLevel <= 10 ? '#10b981' : '#0284c7' }}>
                {moistureLevel}%
              </div>
              <div className="progress-bar-bg" style={{ margin: '8px 0' }}>
                <div
                  className="progress-bar-fill moisture-fill"
                  style={{ width: `${moistureLevel}%`, background: moistureLevel <= 10 ? '#10b981' : 'linear-gradient(90deg, #38bdf8, #0284c7)' }}
                />
              </div>
              <span className="gauge-sub" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {moistureLevel > 10 ? 'High Moisture (Must reach <10% for frying)' : '✨ Brittle Glassy State Achieved!'}
              </span>
            </div>

            <div className="spec-point" style={{ marginTop: '16px' }}>
              <strong>Airflow Velocity:</strong>
              <p>Convection fan circulating 90°C dry air continuously.</p>
            </div>
          </div>

          {/* Center: Multi-State Dehydrator Container */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="dehydrator"
              title="Convection Food Dehydrator"
              subtitle="90°C Temperature / 12 Hours Duration"
              currentStepIndex={dehydrateStep}
              steps={dehydratorSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="380px"
              containerHeight="260px"
              interactiveAction={
                dehydrateStep === 1
                  ? {
                      label: '📥 Slide Tray into Dehydrator',
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
                  : dehydrateStep === 4
                  ? {
                      label: '📦 Transfer to Airtight Storage Container',
                      onClick: handleTransferToStorage,
                      icon: '📦',
                    }
                  : null
              }
            />
          </div>

          {/* Right Side: Dehydration Specs */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🌬️ Airflow Parameters</span>
            </div>
            <div className="specs-card-content">
              <div className="spec-point">
                <strong>1-Inch Spacing Rule:</strong>
                <p>Spacing prevents the edges from sticking together and ensures horizontal cross-flow air dehydrates every square millimeter evenly.</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px' }}>
                <strong>90°C / 12 Hours:</strong>
                <p>Gradual thermal dehydration vitrifies the starch matrix, locking in flavor while preventing thermal scorching.</p>
              </div>
              <div className="spec-point" style={{ marginTop: '12px' }}>
                <strong>Airtight Storage:</strong>
                <p>Because the dried pellets are hygroscopic, they must be stored in airtight clip containers until ready for deep frying.</p>
              </div>
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
