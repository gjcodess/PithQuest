import React, { useState } from 'react';
import { soundManager } from '../audio/soundManager';

/**
 * FaucetKnobConsole: Interactive water tap rotary knob for the Washing Station
 * Features authentic 4-arm chrome cross valve handle with rotatable indicator dial (0deg OFF -> 90deg FLOW).
 */
export const FaucetKnobConsole = ({
  isReady = true,
  isFlowing = false,
  isComplete = false,
  potStep = 0,
  onTurnOn,
  disabled = false,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    if (disabled || isFlowing) return;

    if (isComplete) {
      soundManager.playClick();
      return;
    }

    if (!isReady) {
      soundManager.playError();
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 450);
      return;
    }

    // Trigger faucet wash sequence!
    if (onTurnOn) {
      onTurnOn();
    }
  };

  const isSanitizedWaitingPick = isComplete && potStep === 0;

  return (
    <div
      className={`faucet-knob-console ${
        isReady && !isFlowing && !isComplete ? 'ready-to-wash' : ''
      } ${isFlowing ? 'flow-active' : ''} ${
        isSanitizedWaitingPick ? 'sanitized-active' : ''
      } ${isWiggling ? 'knob-shake' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={
        isFlowing
          ? 'Faucet Running (Potable Tap Water)'
          : !isComplete
          ? 'Click cross handle to turn 90° to -FLOW and rinse ubod'
          : isSanitizedWaitingPick
          ? 'Ubod is Sanitized! Pick up Washed Ubod from bottom shelf'
          : 'Faucet Closed (Standby)'
      }
    >
      <div className="knob-assembly faucet-knob-assembly">
        {/* Stationary baseplate with OFF tick at 12 o'clock and -FLOW at 3 o'clock */}
        <img
          src="/assets/faucet_knob_base.png"
          alt="Faucet Escutcheon Baseplate"
          className="knob-base-img"
        />
        {/* 4-Arm Chrome Cross Valve Dial turning from 0deg (OFF) to 90deg (FLOW) */}
        <img
          src="/assets/faucet_knob_rotor.png"
          alt="Chrome Cross Valve Handle"
          className={`knob-rotor-img ${
            isFlowing ? 'turned-high' : 'turned-off'
          }`}
        />
        {/* Glowing water beacon rings when ready to turn */}
        {isReady && !isFlowing && !isComplete && (
          <>
            <span className="faucet-beacon-ring r1" />
            <span className="faucet-beacon-ring r2" />
          </>
        )}
      </div>

      <div className="burner-panel-text faucet-panel-text">
        <div className="burner-badge-row">
          <span
            className={`burner-led ${
              isFlowing
                ? 'flowing'
                : isSanitizedWaitingPick
                ? 'sanitized-led'
                : !isComplete
                ? 'blinking-water'
                : 'cold'
            }`}
          />
          <span className="burner-mode-title faucet-title">
            {isFlowing
              ? '💧 FAUCET: RUNNING'
              : isSanitizedWaitingPick
              ? '✅ SANITIZED & CLEAN'
              : !isComplete
              ? 'CLICK CROSS TO RINSE'
              : 'FAUCET: STANDBY'}
          </span>
        </div>

        <div className="burner-sub-row">
          {isFlowing ? (
            <span className="faucet-action-hint flowing-text">
              🌊 Rinsing ubod under running faucet...
            </span>
          ) : isSanitizedWaitingPick ? (
            <span className="faucet-action-hint sanitized-text">
              👉 Pick up Washed Ubod from bottom shelf
            </span>
          ) : !isComplete ? (
            <span className="faucet-action-hint ready-water-text">
              👉 Turn cross handle 90° to -FLOW
            </span>
          ) : (
            <span className="faucet-action-hint complete-water-text">
              ✓ Ready for cooling boiled ubod
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
