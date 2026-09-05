import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission6Dehydration = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Dehydration states:
  // 0: Empty wire mesh tray -> accept steamed_ubod_pieces
  // 1: Wire mesh tray loaded with 1-inch spaced pieces -> accept dehydrator_slot (or slide into cabinet)
  // 2: Loaded in cabinet dehydrator -> action: calibrate 90°C / 12h
  // 3: Dehydrating (12-hour time-lapse, moisture gauge: 70% -> 8%)
  // 4: Translucent brittle cracker pellets ready
  const [dehydrateStep, setDehydrateStep] = useState(0);
  const [dehydrateProgress, setDehydrateProgress] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(70);
  const [isDehydrating, setIsDehydrating] = useState(false);

  useEffect(() => {
    speak(
      'Stage 6: Cooling & Cabinet Dehydration! Arrange the cooled steamed pieces on our wire mesh tray with 1-inch spacing to allow even hot airflow, then dehydrate for 12 hours at 90°C.',
      'neutral',
      {
        badge: 'Stage 6: Dehydration',
        hint: 'First, drop the Steamed Pieces onto the wire mesh tray.',
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
      acceptedItems: ['storage_tray'],
      prompt: 'Hard, translucent, brittle cracker pellets ready for flash frying!',
      img: '/assets/dehydrator_tray_dried.png',
      fallbackIcon: '✨',
      label: 'Dehydrated Pellets (<10% Moisture)',
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
        unlockBadge('vitrification_master', 'Moisture Reduction Expert', '💨');
        completeMission('mission6');
        showToast('Dehydration Complete!', 'Moisture reduced to 8%! Translucent pellets formed (+40 pts)', 'success');
        speak(
          '12 hours complete! The moisture content has safely dropped from 70% to under 8%. The pieces have turned hard, brittle, and glass-like—perfect for flash expansion in hot oil!',
          'happy',
          {
            badge: 'Stage 6 Complete',
            btnText: 'Proceed to Stage 7: Deep Frying ➔',
            onNext: () => setScene('mission7'),
          }
        );
      }
    }, 650);
  };

  return (
    <div className="workstation-scene dehydration-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Steamed Pieces */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🧈 Cooled Pieces</span>
          </div>
          <div className="inventory-vertical-list">
            <div
              className={`dispenser-card ${holdingItem?.id === 'steamed_pieces' ? 'active-held' : ''} ${dehydrateStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'steamed_pieces' ? null : { id: 'steamed_pieces', name: 'Steamed Pieces', img: '/assets/steamed_mold_on_cooling_rack.png', icon: '🧈' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'steamed_pieces', name: 'Steamed Pieces' }));
              }}
            >
              <img src="/assets/steamed_mold_on_cooling_rack.png" alt="Steamed Pieces" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Steamed Pieces</strong>
                <span>Cooled & Semi-Firm</span>
              </div>
            </div>

            {/* Moisture Gauge */}
            <div className="moisture-card-box">
              <div className="gauge-label">Water Activity / Moisture:</div>
              <div className="gauge-value">{moistureLevel}%</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill moisture-fill"
                  style={{ width: `${moistureLevel}%` }}
                />
              </div>
              <span className="gauge-sub">
                {moistureLevel > 10 ? 'High Moisture (Perishable)' : '✨ Shelf-Stable Pellet (<10%)'}
              </span>
            </div>
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
                : null
            }
          />
        </div>

        {/* Right Side: Dehydration Specs */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🌬️ Airflow Parameters</span>
          </div>
          <div className="specs-card-content">
            <div className="spec-point">
              <strong>1-Inch Spacing Rule:</strong>
              <p>Spacing prevents the edges from sticking together and ensures horizontal cross-flow air dehydrates every square millimeter evenly.</p>
            </div>
            <div className="spec-point">
              <strong>90°C / 12 Hours:</strong>
              <p>Gradual thermal dehydration vitrifies the starch matrix, locking in flavor while preventing thermal scorching.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
