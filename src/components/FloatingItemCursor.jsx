import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

let lastPointerPos = { x: -200, y: -200 };
if (typeof window !== 'undefined') {
  const recordPointer = (e) => {
    if (e.clientX || e.clientY) {
      lastPointerPos = { x: e.clientX, y: e.clientY };
    }
  };
  window.addEventListener('pointermove', recordPointer, { passive: true });
  window.addEventListener('pointerdown', recordPointer, { passive: true });
}

export const FloatingItemCursor = () => {
  const { holdingItem, setHoldingItem } = useGame();
  const followerRef = useRef(null);

  // Hide system cursor while holding an item
  useEffect(() => {
    if (holdingItem) {
      document.body.classList.add('holding-item-cursor');
    } else {
      document.body.classList.remove('holding-item-cursor');
    }

    return () => {
      document.body.classList.remove('holding-item-cursor');
    };
  }, [holdingItem]);

  useEffect(() => {
    // Immediately sync to current pointer position
    if (followerRef.current && lastPointerPos.x > -100) {
      followerRef.current.style.transform = `translate3d(${lastPointerPos.x}px, ${lastPointerPos.y}px, 0)`;
    }

    const handlePointerMove = (e) => {
      lastPointerPos = { x: e.clientX, y: e.clientY };
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && holdingItem) {
        soundManager.playClick();
        setHoldingItem(null);
      }
    };

    const handleContextMenu = (e) => {
      if (holdingItem) {
        e.preventDefault();
        soundManager.playClick();
        setHoldingItem(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [holdingItem, setHoldingItem]);

  if (!holdingItem) return null;

  return (
    <div
      ref={followerRef}
      className="floating-item-follower"
      style={{
        transform: `translate3d(${lastPointerPos.x}px, ${lastPointerPos.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div className="floating-item-aura" />
      <div className="floating-item-graphic-wrap">
        {holdingItem.img ? (
          <img src={holdingItem.img} alt={holdingItem.name || 'Held Item'} className="floating-item-img" />
        ) : (
          <span className="floating-item-emoji">{holdingItem.icon || '✨'}</span>
        )}
      </div>
      <div className="floating-item-tooltip">
        <span className="tooltip-name">{holdingItem.name}</span>
        <span className="tooltip-hint">{holdingItem.actionHint || 'Click target station • Esc to cancel'}</span>
      </div>
    </div>
  );
};
