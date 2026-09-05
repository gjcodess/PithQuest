import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';

export const Mission8Packaging = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Packaging states:
  // 0: Empty stand-up kraft pouch -> accept crispy_crackers
  // 1: Pouch filled with crackers -> action: impulse heat seal
  // 2: Heat sealed -> action: apply branded label
  // 3: Branded label applied -> finished market-ready product
  const [packStep, setPackStep] = useState(0);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    speak(
      'Stage 8: Packaging & Quality Sealing! Pack 50g of golden Ubod Crunch crackers into our stand-up brown kraft pouch with clear window, heat-seal the rim, and apply the official brand label.',
      'neutral',
      {
        badge: 'Stage 8: Packaging',
        hint: 'First, drop the Crispy Ubod Crackers into the open kraft pouch.',
        hideButton: true,
      }
    );
  }, []);

  const pouchSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['crispy_crackers', 'crackers'],
      prompt: 'Fill 50g of crispy golden crackers into the stand-up kraft pouch',
      img: '/assets/pouch_empty.png',
      fallbackIcon: '📦',
      label: 'Open Kraft Pouch with Window',
    },
    {
      stepIndex: 1,
      acceptedItems: [],
      prompt: 'Crackers portioned inside! Press impulse sealer to hermetically seal',
      img: '/assets/pouch_with_crackers.png',
      fallbackIcon: '♨️',
      label: 'Filled Pouch (Ready to Seal)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['brand_label'],
      prompt: 'Heat seal verified airtight! Apply "NUDAZAR HONORE - Ubod CRUNCH" label',
      img: '/assets/pouch_with_crackers.png',
      fallbackIcon: '🏷️',
      label: 'Heat-Sealed Pouch',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Commercial market-ready Coconut Pith Crackers by Nudazar Honore!',
      img: '/assets/pouch_sealed_labeled.png',
      fallbackIcon: '✨',
      label: 'Finished Branded Product',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'crispy_crackers' || item.id === 'crackers')) {
      soundManager.playPour();
      setPackStep(1);
      addScore(25);
      showToast('Crackers Portioned!', 'Pouch filled with 50g crackers. Now heat-seal the rim.', 'success');
      speak(
        'Great portioning! Now click "Impulse Heat Seal Rim" to create an airtight moisture barrier.',
        'neutral',
        {
          badge: 'Hermetic Sealing',
          hint: 'Click "Impulse Heat Seal Rim".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 2 && item.id === 'brand_label') {
      soundManager.playSuccess();
      setPackStep(3);
      addScore(35);
      unlockBadge('packaging_specialist', 'Packaging & Quality Assurance Specialist', '🏷️');
      completeMission('mission8');
      showToast('Label Applied!', 'Commercial Ubod Crunch package complete (+35 pts)', 'success');
      speak(
        'Perfection! The packaging is airtight and beautifully labeled under NUDAZAR HONORE - Ubod CRUNCH. All manufacturing stages are complete! Click below to enter the Final Evaluation & Certification Hall!',
        'happy',
        {
          badge: 'Production Complete',
          btnText: 'Proceed to Final Evaluation & Mastery ➔',
          onNext: () => setScene('evaluation'),
        }
      );
    }
  };

  const handleHeatSeal = () => {
    soundManager.playClick();
    setIsSealing(true);
    showToast('Heat Sealing...', 'Applying 150°C thermal impulse clamp...', 'info');

    setTimeout(() => {
      setIsSealing(false);
      setPackStep(2);
      soundManager.playSuccess();
      addScore(30);
      showToast('Hermetically Sealed!', 'Airtight bond formed above tear notch (+30 pts)', 'success');
      speak(
        'The pouch is hermetically sealed to prevent humidity infiltration. Now select the official Brand Label and apply it to the front of the pouch!',
        'happy',
        {
          badge: 'Labeling Step',
          hint: 'Select Brand Label in inventory and drop it onto the sealed pouch.',
          hideButton: true,
        }
      );
    }, 1200);
  };

  return (
    <div className="workstation-scene packaging-scene">
      <div className="workstation-overlay" />

      <div className="stage-content-row">
        {/* Left Side: Crackers & Label Dispenser */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>📦 Packaging Materials</span>
          </div>
          <div className="inventory-vertical-list">
            {/* Crispy Crackers */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'crispy_crackers' ? 'active-held' : ''} ${packStep === 0 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'crispy_crackers' ? null : { id: 'crispy_crackers', name: 'Crispy Ubod Crackers', img: '/assets/platter_crackers_cooled.png', icon: '✨' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'crispy_crackers', name: 'Crispy Ubod Crackers' }));
              }}
            >
              <img src="/assets/platter_crackers_cooled.png" alt="Crispy Crackers" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Crispy Crackers</strong>
                <span>Drained & Golden (50g)</span>
              </div>
            </div>

            {/* Brand Label */}
            <div
              className={`dispenser-card ${holdingItem?.id === 'brand_label' ? 'active-held' : ''} ${packStep === 2 ? 'guide-pulse' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setHoldingItem(holdingItem?.id === 'brand_label' ? null : { id: 'brand_label', name: 'Ubod Crunch Label', img: '/assets/pouch_sealed_labeled.png', icon: '🏷️' });
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: 'brand_label', name: 'Ubod Crunch Label' }));
              }}
            >
              <img src="/assets/pouch_sealed_labeled.png" alt="Brand Label" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
              <div className="disp-info">
                <strong>Branded Label</strong>
                <span>NUDAZAR HONORE - Ubod CRUNCH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Multi-State Pouch Container */}
        <div className="station-center-card">
          <MultiStateContainer
            containerId="pouch"
            title="Stand-Up Kraft Window Pouch"
            subtitle="Commercial Barrier Packaging with Zipper & Heat Seal"
            currentStepIndex={packStep}
            steps={pouchSteps}
            onItemAccepted={handleItemAccepted}
            containerWidth="380px"
            containerHeight="260px"
            interactiveAction={
              packStep === 1
                ? {
                    label: isSealing ? 'Sealing Rim...' : '♨️ Impulse Heat Seal Rim',
                    onClick: handleHeatSeal,
                    disabled: isSealing,
                  }
                : null
            }
          />
        </div>

        {/* Right Side: Commercial Product Profile */}
        <div className="station-side-card">
          <div className="card-header-mini">
            <span>🏷️ Commercial Product</span>
          </div>
          <div className="commercial-product-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px' }}>
            <div className="brand-header-stamp" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', letterSpacing: '0.05em' }}>NUDAZAR HONORE</div>
            <h4 className="product-title-bold" style={{ margin: '0', fontSize: '1rem', color: '#78350f' }}>Ubod CRUNCH</h4>
            <div className="window-pouch-preview" style={{ margin: '4px 0' }}>
              <img
                src={packStep >= 3 ? '/assets/pouch_sealed_labeled.png' : packStep >= 1 ? '/assets/pouch_with_crackers.png' : '/assets/pouch_empty.png'}
                alt="Product Preview"
                style={{ width: '110px', height: '110px', objectFit: 'contain' }}
              />
            </div>
            <div className="product-meta-tags">
              <span>🌾 Rice Flour Starch</span>
              <span>🥥 Pure Coconut Pith</span>
              <span>⚖️ Net Wt: 50g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
