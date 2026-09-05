import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission8Packaging = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Packaging states:
  // 0: Empty stand-up kraft pouch -> accept crispy_crackers
  // 1: Pouch filled with crackers -> action: impulse heat seal
  // 2: Heat sealed -> accept brand_label
  // 3: Branded label applied -> action: pack into retail display box
  // 4: Retail countertop display box packed (8 pouches) -> complete
  const [packStep, setPackStep] = useState(0);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    speak(
      'Stage 8: Packaging & Quality Sealing! Select the 50g portion of Crispy Ubod Crackers from the bottom inventory and fill our stand-up kraft pouch.',
      'neutral',
      {
        badge: 'Stage 8: Packaging',
        hint: 'Select Crispy Ubod Crackers from the bottom shelf and drop into the open pouch.',
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
      prompt: 'Heat seal verified airtight! Select Brand Label from inventory and apply',
      img: '/assets/pouch_with_crackers.png',
      fallbackIcon: '🏷️',
      label: 'Heat-Sealed Pouch',
    },
    {
      stepIndex: 3,
      acceptedItems: ['carton_box'],
      prompt: 'Individual commercial pouch finished! Pack into 8-pouch retail display carton',
      img: '/assets/pouch_sealed_labeled.png',
      fallbackIcon: '✨',
      label: 'Finished Branded Product (Single Pouch)',
    },
    {
      stepIndex: 4,
      acceptedItems: [],
      prompt: 'Retail Countertop Display Box complete! 8 pouches ready for distribution',
      img: '/assets/box_of_packaged_crackers.png',
      fallbackIcon: '📦',
      label: 'Retail Countertop Display Box (8 Pouches)',
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
    } else if (stepIndex === 2 && (item.id === 'brand_label' || item.id === 'label')) {
      soundManager.playSuccess();
      setPackStep(3);
      addScore(30);
      showToast('Label Applied!', 'Commercial Ubod Crunch package complete (+30 pts)', 'success');
      speak(
        'Beautifully labeled! Now click "Pack into Retail Display Carton" to pack 8 pouches into our countertop retail distribution box.',
        'happy',
        {
          badge: 'Retail Packing',
          hint: 'Click "Pack into Retail Display Carton".',
          hideButton: true,
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
        'The pouch is hermetically sealed to prevent humidity infiltration. Now select the official Brand Label from your bottom shelf and apply it!',
        'happy',
        {
          badge: 'Labeling Step',
          hint: 'Select Brand Label from bottom inventory and drop it onto the sealed pouch.',
          hideButton: true,
        }
      );
    }, 1000);
  };

  const handlePackIntoBox = () => {
    soundManager.playSuccess();
    setPackStep(4);
    addScore(35);
    unlockBadge('packaging_specialist', 'Packaging & Quality Assurance Specialist', '🏷️');
    completeMission('mission8');
    showToast('Retail Display Ready!', '8 pouches packed in master display box (+35 pts)', 'success');
    speak(
      'Perfection! The packaging is airtight, beautifully labeled under NUDAZAR HONORE - Ubod CRUNCH, and packed in the retail display carton. All 8 manufacturing stages are complete! Click below to enter the Final Evaluation & Certification Hall!',
      'happy',
      {
        badge: 'Production Complete',
        btnText: 'Proceed to Final Evaluation & Mastery ➔',
        onNext: () => setScene('evaluation'),
      }
    );
  };

  const stage8Inventory = [
    {
      id: 'crispy_crackers',
      name: 'Crispy Ubod Crackers',
      measure: '50g Portions',
      img: '/assets/platter_crackers_cooled.png',
      fallbackIcon: '✨',
      isUsed: packStep >= 1,
      isNext: packStep === 0,
      tooltip: 'Golden, crispy, cooled crackers ready for bagging',
    },
    {
      id: 'pouch_empty',
      name: 'Stand-Up Kraft Pouch',
      measure: 'Barrier Window Pouch',
      img: '/assets/pouch_empty.png',
      fallbackIcon: '📦',
      isUsed: packStep >= 1,
      isNext: packStep === 0,
      tooltip: 'Food-grade multi-layer barrier pouch with viewing window',
    },
    {
      id: 'brand_label',
      name: 'Official Brand Label',
      measure: 'Ubod CRUNCH Seal',
      img: '/assets/pouch_sealed_labeled.png',
      fallbackIcon: '🏷️',
      isUsed: packStep >= 3,
      isNext: packStep === 2,
      tooltip: 'NUDAZAR HONORE - Ubod CRUNCH authentic product label',
    },
    {
      id: 'retail_box',
      name: 'Retail Display Box',
      measure: '8 Pouches Master Carton',
      img: '/assets/box_of_packaged_crackers.png',
      fallbackIcon: '📦',
      isUsed: packStep >= 4,
      isNext: packStep === 3,
      tooltip: 'Countertop display box for retail distribution',
    },
  ];

  return (
    <div className="workstation-scene packaging-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '980px' }}>
          {/* Left Side: Packaging Standards Card */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>📦 Barrier Specifications</span>
            </div>
            <div className="specs-card-content" style={{ marginTop: '8px' }}>
              <div className="spec-point">
                <strong>Net Weight Specification:</strong>
                <p style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.95rem', margin: '2px 0' }}>
                  50 Grams / Pouch
                </p>
              </div>

              <div className="spec-point" style={{ marginTop: '10px' }}>
                <strong>Moisture Barrier:</strong>
                <p>Kraft paper with internal food-grade polyethylene coating blocks 99.9% of moisture vapor.</p>
              </div>

              <div className="spec-point" style={{ marginTop: '10px' }}>
                <strong>Impulse Heat Seal:</strong>
                <p>150°C thermal weld above the zip lock creates a tamper-evident hermetic seal.</p>
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
                  : packStep === 3
                  ? {
                      label: '📦 Pack into Retail Display Carton (8 Pouches)',
                      onClick: handlePackIntoBox,
                      icon: '📦',
                    }
                  : null
              }
            />
          </div>

          {/* Right Side: Commercial Product Profile */}
          <div className="station-side-card" style={{ width: '280px' }}>
            <div className="card-header-mini">
              <span>🏷️ Commercial Product</span>
            </div>
            <div className="commercial-product-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px' }}>
              <div className="brand-header-stamp" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', letterSpacing: '0.05em' }}>NUDAZAR HONORE</div>
              <h4 className="product-title-bold" style={{ margin: '0', fontSize: '1rem', color: '#78350f' }}>Ubod CRUNCH</h4>
              <div className="window-pouch-preview" style={{ margin: '4px 0' }}>
                <img
                  src={packStep >= 4 ? '/assets/box_of_packaged_crackers.png' : packStep >= 3 ? '/assets/pouch_sealed_labeled.png' : packStep >= 1 ? '/assets/pouch_with_crackers.png' : '/assets/pouch_empty.png'}
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

      {/* DOCKED BOTTOM INVENTORY SHELF */}
      <InventoryTray
        title="Station 8 Packaging Materials & Display Carton"
        items={stage8Inventory}
      />
    </div>
  );
};
