import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const StageNextButton = () => {
  const { dialogue, scene, setHoldingItem } = useGame();

  if (
    !dialogue.visible ||
    dialogue.hideButton ||
    !dialogue.btnText ||
    typeof dialogue.onNext !== 'function' ||
    scene === 'title' ||
    scene === 'orientation' ||
    scene === 'results' ||
    scene === 'evaluation'
  ) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    soundManager.playSuccess();
    setHoldingItem(null);
    dialogue.onNext();
  };

  return (
    <div className="stage-next-action-wrapper">
      <button
        type="button"
        className="btn-primary companion-action-btn"
        onClick={handleClick}
      >
        <span>{dialogue.btnText}</span>
      </button>
    </div>
  );
};
