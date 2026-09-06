import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MultiStateContainer } from '../components/MultiStateContainer';
import { InventoryTray } from '../components/InventoryTray';

export const Mission8Packaging = () => {
  const { setScene, addScore, unlockBadge, speak, showToast, completeMission, holdingItem, setHoldingItem } = useGame();

  // Streamlined 3-step packaging flow:
  // 0: Empty stand-up kraft pouch -> accept crispy_crackers (50g)
  // 1: Pouch filled with crackers -> accept brand_label OR click "Seal & Apply Label" (combined 150°C weld + label)
  // 2: Branded commercial pouch -> accept retail_box OR click "Pack into Retail Carton" (8 pouches)
  // 3: Retail countertop display box packed (8 pouches) -> complete
  const [packStep, setPackStep] = useState(0);
  const [isSealing, setIsSealing] = useState(false);
  const [sealProgress, setSealProgress] = useState(0);

  useEffect(() => {
    speak(
      'Stage 8: Packaging Process! Step 23: Wear the required PPE, including hairnet, spit guard/mask, apron, and clean food-grade gloves. Pack the cooled ubod crackers using clean packaging materials.',
      'neutral',
      {
        badge: 'Step 23: Packaging',
        note: 'Follow the appropriate packaging procedure based on the type of material used. Ensure crackers are completely cooled before sealing to maintain crispness and quality.',
        hint: 'Select Crispy Ubod Crackers from bottom shelf and drop into the open pouch.',
        hideButton: true,
      }
    );
  }, []);

  const pouchSteps = [
    {
      stepIndex: 0,
      acceptedItems: ['crispy_crackers', 'crackers', 'platter_crackers_cooled'],
      prompt: 'Fill 50g of crispy golden crackers into the open kraft pouch',
      img: '/assets/pouch_empty.png',
      fallbackIcon: '📦',
      label: 'Open Kraft Pouch with Window',
    },
    {
      stepIndex: 1,
      acceptedItems: ['brand_label', 'label', 'pouch_sealed_labeled'],
      prompt: 'Crackers portioned! Apply official brand label & impulse heat seal rim (150°C)',
      img: '/assets/pouch_with_crackers.png',
      fallbackIcon: '🏷️',
      label: 'Portioned Pouch (Ready to Seal & Label)',
    },
    {
      stepIndex: 2,
      acceptedItems: ['retail_box', 'carton_box', 'box_of_packaged_crackers'],
      prompt: 'Commercial pouch finished! Pack into 8-pouch retail display carton',
      img: '/assets/pouch_sealed_labeled.png',
      fallbackIcon: '✨',
      label: 'Commercial Single Pouch (Ubod CRUNCH)',
    },
    {
      stepIndex: 3,
      acceptedItems: [],
      prompt: 'Retail display box complete! 8 pouches ready for distribution',
      img: '/assets/box_of_packaged_crackers.png',
      fallbackIcon: '📦',
      label: 'Retail Countertop Display Box (8 Pouches)',
    },
  ];

  const handleItemAccepted = (item, stepIndex) => {
    if (stepIndex === 0 && (item.id === 'crispy_crackers' || item.id === 'crackers' || item.id === 'platter_crackers_cooled')) {
      soundManager.playPour();
      setPackStep(1);
      addScore(25);
      setHoldingItem(null);
      showToast('Crackers Portioned!', 'Pouch filled with 50g crackers. Now seal & apply brand label (+25 pts)', 'success');
      speak(
        'Great portioning! Now select the Brand Label or click "Impulse Seal & Apply Label" to hermetically weld the rim at 150°C.',
        'neutral',
        {
          badge: 'Seal & Brand',
          note: 'Hermetic heat-sealing creates a moisture and oxygen barrier to prolong shelf life and prevent oxidation.',
          hint: 'Drop Official Brand Label or click "Impulse Seal & Apply Label".',
          hideButton: true,
        }
      );
    } else if (stepIndex === 1 && (item.id === 'brand_label' || item.id === 'label' || item.id === 'pouch_sealed_labeled')) {
      handleCombinedSealAndLabel();
    } else if (stepIndex === 2 && (item.id === 'retail_box' || item.id === 'carton_box' || item.id === 'box_of_packaged_crackers')) {
      handlePackIntoBox();
    }
  };

  const handleCombinedSealAndLabel = () => {
    if (isSealing) return;
    soundManager.playClick();
    setIsSealing(true);
    setSealProgress(0);
    setHoldingItem(null);
    showToast('Sealing & Labeling...', 'Applying 150°C thermal impulse clamp & product label...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setSealProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsSealing(false);
        setPackStep(2);
        soundManager.playSuccess();
        addScore(40);
        showToast('Hermetically Sealed & Labeled!', 'Commercial Ubod CRUNCH pouch complete (+40 pts)', 'success');
        speak(
          'Airtight thermal weld complete with authentic product seal! Now select the Retail Display Box or click "Pack into Retail Carton" to pack 8 pouches for distribution.',
          'happy',
          {
            badge: 'Retail Packing',
            note: 'Proper outer master cartons protect the individual pouches from mechanical crushing during transit.',
            hint: 'Select Retail Display Box from bottom shelf or click button to pack.',
            hideButton: true,
          }
        );
      }
    }, 250);
  };

  const handlePackIntoBox = () => {
    soundManager.playSuccess();
    setPackStep(3);
    setHoldingItem(null);
    addScore(35);
    unlockBadge('packaging_specialist', 'Packaging & Quality Assurance Specialist', '🏷️');
    completeMission('mission8');
    showToast('Retail Display Ready!', '8 pouches packed in master display box (+35 pts)', 'success');
    speak(
      'Perfection! We are now done with our Laboratory Activity! All 8 food processing stages are complete. Let us test your complete knowledge in our Bonus Sequencing Activity!',
      'happy',
      {
        badge: 'Production Complete',
        note: 'Laboratory Completed: You have applied proper food safety, sanitary PPE, calibrated ratios, and processing methods!',
        btnText: 'Proceed to Final Step: Sequence Exam ➔',
        onNext: () => setScene('sequencing'),
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
      tooltip: 'Golden, crispy, room-temperature crackers ready for calibrated 50g pouch filling.',
    },
    {
      id: 'brand_label',
      name: 'Official Brand Label',
      measure: 'Seal & Label',
      img: '/assets/pouch_sealed_labeled.png',
      fallbackIcon: '🏷️',
      isUsed: packStep >= 2,
      isNext: packStep === 1,
      tooltip: 'NUDAZAR HONORE - Ubod CRUNCH brand label & 150°C impulse moisture-barrier heat seal.',
    },
    {
      id: 'retail_box',
      name: 'Retail Display Box',
      measure: '8-Pouch Carton',
      img: '/assets/box_of_packaged_crackers.png',
      fallbackIcon: '📦',
      isUsed: packStep >= 3,
      isNext: packStep === 2,
      tooltip: 'Corrugated master retail display box packed with 8 sealed pouches for commercial distribution.',
    },
  ];

  return (
    <div className="workstation-scene packaging-scene">
      <div className="workstation-overlay" />

      {/* Main Center Cooking Countertop */}
      <div className="stage-center-zone">
        <div className="stage-content-row" style={{ maxWidth: '1060px' }}>
          {/* Left: Multi-State Pouch Container Workstation */}
          <div className="station-center-card">
            <MultiStateContainer
              containerId="pouch"
              title="Stand-Up Barrier Pouch"
              subtitle="50g Portioning • 150°C Impulse Heat Sealing"
              currentStepIndex={packStep}
              steps={pouchSteps}
              onItemAccepted={handleItemAccepted}
              containerWidth="520px"
              containerHeight="330px"
              interactiveAction={
                packStep === 1
                  ? {
                      label: isSealing ? `Sealing & Labeling ${sealProgress}%...` : '♨️ Seal & Apply Brand Label (150°C)',
                      onClick: handleCombinedSealAndLabel,
                      disabled: isSealing,
                    }
                  : packStep === 2
                  ? {
                      label: '📦 Pack into Retail Carton (8 Pouches)',
                      onClick: handlePackIntoBox,
                      icon: '📦',
                    }
                  : null
              }
              specBadge={
                <span
                  className={`spec-badge ${
                    packStep >= 3
                      ? 'spec-success'
                      : packStep >= 2
                      ? 'spec-success'
                      : packStep >= 1
                      ? 'spec-amber'
                      : ''
                  }`}
                >
                  {packStep >= 3
                    ? 'CARTON: 8 PACK'
                    : packStep >= 2
                    ? 'BRAND: SEALED'
                    : packStep >= 1
                    ? 'PORTION: 50G'
                    : 'TARGET: 50G'}
                </span>
              }
            />
          </div>

          {/* Right: Commercial Packaging & Seal Integrity QC Station */}
          <div
            className={`multi-state-workstation qc-workstation ${
              (packStep === 1 && (holdingItem?.id === 'brand_label' || holdingItem?.id === 'label' || holdingItem?.id === 'pouch_sealed_labeled')) ||
              (packStep === 2 && (holdingItem?.id === 'retail_box' || holdingItem?.id === 'carton_box' || holdingItem?.id === 'box_of_packaged_crackers'))
                ? 'compatible-target'
                : ''
            }`}
            style={{
              width: '440px',
              cursor:
                packStep === 1 || packStep === 2
                  ? 'url("/assets/cursor_hover_32.png") 2 2, pointer'
                  : 'inherit',
            }}
            onClick={() => {
              if (packStep === 1 && (holdingItem?.id === 'brand_label' || holdingItem?.id === 'label' || holdingItem?.id === 'pouch_sealed_labeled')) {
                handleCombinedSealAndLabel();
              } else if (packStep === 2 && (holdingItem?.id === 'retail_box' || holdingItem?.id === 'carton_box' || holdingItem?.id === 'box_of_packaged_crackers')) {
                handlePackIntoBox();
              }
            }}
            onDragOver={(e) => {
              if (packStep === 1 || packStep === 2) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              if (packStep === 1 || packStep === 2) {
                e.preventDefault();
                try {
                  const data = e.dataTransfer.getData('text/plain');
                  if (!data) return;
                  const item = JSON.parse(data);
                  handleItemAccepted(item, packStep);
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            title="Commercial Packaging & Seal Integrity QC"
          >
            {/* Workstation Header */}
            <div className="workstation-header">
              <div className="workstation-titles">
                <h4 className="workstation-name">Packaging & Seal QC</h4>
                <span className="workstation-sub">Step 17–18: Barrier Seal & Retail Packing</span>
              </div>
              <div
                className={`workstation-step-badge ${
                  packStep >= 3
                    ? 'badge-success-glow'
                    : packStep >= 2
                    ? 'badge-success-glow'
                    : packStep >= 1
                    ? 'badge-amber-glow'
                    : ''
                }`}
              >
                {packStep >= 3
                  ? '✨ Master Box Complete'
                  : packStep === 2
                  ? '🏷️ Branded & Sealed'
                  : packStep === 1
                  ? '⚖️ 50g Portioned'
                  : 'Standby'}
              </div>
            </div>

            {/* Workstation Viewport */}
            <div
              className="workstation-viewport packaging-qc-viewport"
              style={{ height: '330px', minHeight: '330px', maxHeight: '330px', flex: '0 0 auto' }}
            >
              {/* Packaging Standards & Barrier Spec Card */}
              <div className="packaging-spec-card">
                <div className="packaging-spec-header">
                  <span>📦 Barrier & Portion Standards</span>
                  <span
                    className={`station-badge-mini ${
                      packStep >= 2 ? 'badge-success' : 'badge-pending'
                    }`}
                  >
                    {packStep >= 2 ? '✨ Hermetic Seal' : '50g Target'}
                  </span>
                </div>

                <div className="packaging-spec-grid">
                  <div className="packaging-spec-item">
                    <span className="spec-title">Net Weight</span>
                    <span
                      className="spec-val"
                      style={{ color: packStep >= 1 ? '#10b981' : '#f59e0b' }}
                    >
                      50g (±1g)
                    </span>
                  </div>
                  <div className="packaging-spec-item">
                    <span className="spec-title">Barrier Film</span>
                    <span className="spec-val" style={{ color: '#0284c7' }}>
                      Kraft + PE
                    </span>
                  </div>
                  <div className="packaging-spec-item">
                    <span className="spec-title">Seal Temperature</span>
                    <span
                      className="spec-val"
                      style={{ color: packStep >= 2 ? '#10b981' : '#f59e0b' }}
                    >
                      150°C Weld
                    </span>
                  </div>
                  <div className="packaging-spec-item">
                    <span className="spec-title">Vapor Infiltration</span>
                    <span
                      className="spec-val"
                      style={{ color: packStep >= 2 ? '#10b981' : '#64748b' }}
                    >
                      &lt;0.1% Barrier
                    </span>
                  </div>
                </div>

                {/* Impulse Sealing Progress Row */}
                <div className="packaging-cycle-row">
                  <div className="packaging-cycle-header">
                    <span>Impulse Thermal Weld:</span>
                    <strong>{packStep >= 2 ? '100% (Airtight)' : isSealing ? `${sealProgress}%` : '0%'}</strong>
                  </div>
                  <div className="packaging-cycle-bar-bg">
                    <div
                      className="packaging-cycle-bar-fill"
                      style={{
                        width: packStep >= 2 ? '100%' : isSealing ? `${sealProgress}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand & Compliance Box */}
              <div className="packaging-brand-box">
                <span className="packaging-brand-title">NUDAZAR HONORE • Ubod CRUNCH</span>
                <div className="packaging-meta-tags">
                  <span className="packaging-tag">🌾 Rice Starch Matrix</span>
                  <span className="packaging-tag">🥥 Pure Ubod Pith</span>
                  <span className="packaging-tag">🛡️ Tamper-Evident</span>
                  <span className="packaging-tag">⚖️ 50g Pack</span>
                </div>
              </div>

              {/* Food Science Note */}
              <div className="packaging-science-note">
                <strong>🔬 Packaging Science: </strong>
                Multi-layer Kraft-PE film prevents moisture infiltration and retrogradation, guaranteeing crisp texture.
              </div>
            </div>

            {/* Workstation Footer */}
            <div className="workstation-footer">
              <div className="workstation-status">
                <div
                  className={`status-dot ${
                    packStep >= 3
                      ? 'dot-success'
                      : packStep >= 2
                      ? 'dot-success'
                      : packStep >= 1
                      ? 'dot-amber'
                      : ''
                  }`}
                />
                <span className="status-text">
                  {packStep >= 3
                    ? '8 pouches packed in retail display carton. Complete!'
                    : packStep === 2
                    ? 'Hermetic seal & brand label verified. Pack into retail box.'
                    : packStep === 1
                    ? '50g portioned. Apply brand label & impulse seal rim.'
                    : 'Portion 50g crispy crackers into kraft pouch.'}
                </span>
              </div>
              <span className="spec-badge">
                {packStep >= 3
                  ? 'CARTON: 8 PACK'
                  : packStep >= 2
                  ? 'BRAND: PASS'
                  : packStep >= 1
                  ? 'SEAL: 150°C'
                  : 'QC: GRADE A'}
              </span>
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
