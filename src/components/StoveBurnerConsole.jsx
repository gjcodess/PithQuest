import React, { useState } from 'react';
import { soundManager } from '../audio/soundManager';

/**
 * StoveBurnerConsole: Interactive rotary knob & stove control console
 * Features authentic brushed stainless baseplate and rotatable rotor knob (0deg OFF -> 90deg HIGH).
 */
export const StoveBurnerConsole = ({
  isReady = false,
  isIgnited = false,
  isComplete = false,
  progress = 0,
  onIgnite,
  onLockedClick,
  disabled = false,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    if (disabled || isComplete) return;

    if (isIgnited) {
      // Already actively boiling
      return;
    }

    if (!isReady) {
      soundManager.playError();
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 450);
      if (onLockedClick) {
        onLockedClick();
      }
      return;
    }

    // Trigger gas ignition spark and flame whoosh
    soundManager.playIgnite();
    if (onIgnite) {
      onIgnite();
    }
  };

  return (
    <div
      className={`stove-burner-console ${
        isReady && !isIgnited ? 'ready-to-ignite' : ''
      } ${isIgnited ? 'flame-active' : ''} ${isWiggling ? 'knob-shake' : ''} ${
        disabled ? 'disabled' : ''
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={
        isIgnited
          ? 'Burner Active at HIGH (100°C Rolling Boil)'
          : isReady
          ? 'Click knob to turn to HIGH and ignite burner'
          : isComplete
          ? 'Burner Extinguished'
          : 'Stove Burner Control (Add Ubod, Water, & Salt first)'
      }
    >
      <div className="knob-assembly">
        {/* Stationary baseplate with OFF red tick at 12 o'clock and -HIGH at 3 o'clock */}
        <img
          src="/assets/stove_knob_base.png"
          alt="Knob Baseplate"
          className="knob-base-img"
        />
        {/* Rotary dial turning from 0deg (OFF) to 90deg (HIGH) */}
        <img
          src="/assets/stove_knob_rotor.png"
          alt="Knob Rotor"
          className={`knob-rotor-img ${
            isIgnited ? 'turned-high' : 'turned-off'
          }`}
        />
        {/* Glowing invite beacon rings when ready to turn */}
        {isReady && !isIgnited && (
          <>
            <span className="knob-beacon-ring r1" />
            <span className="knob-beacon-ring r2" />
          </>
        )}
      </div>

      <div className="burner-panel-text">
        <div className="burner-badge-row">
          <span
            className={`burner-led ${
              isIgnited ? 'burning' : isReady ? 'blinking' : 'cold'
            }`}
          />
          <span className="burner-mode-title">
            {isIgnited
              ? 'FLAME ON • 100°C HIGH'
              : isReady
              ? 'CLICK TO IGNITE'
              : isComplete
              ? 'BURNER: OFF'
              : 'BURNER: STANDBY'}
          </span>
        </div>

        <div className="burner-sub-row">
          {isIgnited ? (
            <div className="burner-progress-container">
              <span className="burner-action-hint flame-text">
                🔥 Rolling boil... {progress}%
              </span>
              <div className="burner-progress-track">
                <div
                  className="burner-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : isReady ? (
            <span className="burner-action-hint ready-text">
              👉 Click dial to turn to HIGH
            </span>
          ) : isComplete ? (
            <span className="burner-action-hint">✓ Thermal softening complete</span>
          ) : (
            <span className="burner-action-hint">Add ubod, water & salt first</span>
          )}
        </div>
      </div>
    </div>
  );
};
